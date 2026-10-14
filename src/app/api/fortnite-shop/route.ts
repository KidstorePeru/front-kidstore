import { NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

// La tienda de Fortnite rota cada dia a las 00:00 UTC. No se cachea en el
// servidor con el Data Cache de Next (un cache atascado hacia que se viera la
// tienda de ayer). En su lugar guardamos la ultima respuesta buena:
// - Si es de la rotacion de hoy y tiene menos de 1 h, se entrega al instante
//   (sin aviso) y se actualiza en segundo plano. fortnite-api.com no pasa por la
//   cache de Cloudflare y a veces tarda mas de 10 s o responde 503 "booting up":
//   asi una respuesta lenta del proveedor no hace esperar ni muestra el aviso.
// - Si es de antes de la rotacion o lleva mas de 1 h sin poder actualizarse, se
//   pide al proveedor; si esta caido se sirve marcada como `_stale` en vez de
//   devolver un error, para que la pagina no se quede en blanco.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Las variables de entorno solo existen para las pruebas con un servidor falso
// (tests/fortnite-shop.test.mjs).
const UPSTREAM = process.env.FORTNITE_SHOP_UPSTREAM || "https://fortnite-api.com/v2/shop";
const ATTEMPT_MS = Number(process.env.FORTNITE_SHOP_ATTEMPT_MS) || 12_000; // plazo propio de cada intento
const TOTAL_MS = 30_000; // tope de los 2 intentos juntos
const RETRY_DELAY_MS = 800;
const FRESH_MAX_MS = 60 * 60 * 1000; // copia de hoy con menos de 1 h → sin aviso
const REFRESH_AFTER_MS = 5 * 60 * 1000; // ...y se actualiza en segundo plano si tiene mas de 5 min
const STALE_MAX_MS = 36 * 60 * 60 * 1000; // no servir una tienda de mas de 36 h
const BACKOFF_BASE_MS = 15_000; // pausa tras una falla del proveedor (se duplica hasta 5 min)
const BACKOFF_MAX_MS = 5 * 60 * 1000;
const ES = "es-419";
// Idiomas de fortnite-api.com (la web usa es-419 y en). Cualquier otro se rechaza sin llamar
// al proveedor: si no, cada valor inventado seria una peticion mas a su API.
const LANGUAGES = new Set(["ar", "de", "en", "es", "es-419", "fr", "it", "ja", "ko", "pl", "pt-BR", "ru", "tr", "zh-CN", "zh-Hant"]);

type Body = Record<string, unknown>;
// ts = cuando se obtuvo del proveedor; date = data.date del catalogo (rotacion).
type Cached = { body: Body; ts: number; date: string | null };
type FetchResult = { ok: true; entry: Cached } | { ok: false; reason: string };

const memCache = new Map<string, Cached>();
const inflight = new Map<string, Promise<FetchResult>>(); // una peticion al proveedor a la vez por idioma
const backoff = new Map<string, { failures: number; until: number }>();

const log = (lang: string, msg: string) => console.warn(`[fortnite-shop] ${lang}: ${msg}`);
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const diskPath = (lang: string) =>
  join(tmpdir(), `fn-shop-${lang.replace(/[^a-z0-9-]/gi, "_")}.json`);

function shopDate(body: Body): string | null {
  const date = (body as { data?: { date?: unknown } }).data?.date;
  return typeof date === "string" ? date : null;
}

// 00:00 UTC de hoy: inicio de la rotacion actual.
function rotationStart(now = Date.now()): number {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

const isCurrentRotation = (c: Cached) => c.date !== null && Date.parse(c.date) >= rotationStart();
const isFresh = (c: Cached) => isCurrentRotation(c) && Date.now() - c.ts < FRESH_MAX_MS;
const inBackoff = (lang: string) => (backoff.get(lang)?.until ?? 0) > Date.now();

async function readCached(lang: string): Promise<Cached | null> {
  const mem = memCache.get(lang);
  if (mem) return mem;
  try {
    const parsed = JSON.parse(await readFile(diskPath(lang), "utf8")) as Partial<Cached>;
    if (parsed && typeof parsed.ts === "number" && parsed.body) {
      // Las copias de antes de guardar `date` la toman del propio catalogo.
      const entry: Cached = { body: parsed.body, ts: parsed.ts, date: parsed.date ?? shopDate(parsed.body) };
      memCache.set(lang, entry);
      return entry;
    }
  } catch {
    /* sin copia en disco todavia */
  }
  return null;
}

async function saveGood(lang: string, body: Body): Promise<Cached> {
  const entry: Cached = { body, ts: Date.now(), date: shopDate(body) };
  memCache.set(lang, entry);
  try {
    await writeFile(diskPath(lang), JSON.stringify(entry), "utf8");
  } catch {
    /* disco de solo lectura: nos quedamos solo con la copia en memoria */
  }
  return entry;
}

// 2 intentos (fortnite-api.com a veces responde 503 "booting up" unos segundos o
// tarda mas de la cuenta). Cada intento tiene su propio plazo: si el primero lo
// agota, el reintento no nace vencido.
async function fetchUpstream(lang: string): Promise<FetchResult> {
  const deadline = Date.now() + TOTAL_MS;
  let reason = "";
  for (let attempt = 1; attempt <= 2; attempt++) {
    const budget = Math.min(ATTEMPT_MS, deadline - Date.now());
    if (budget <= 0) break;
    try {
      const res = await fetch(`${UPSTREAM}?language=${encodeURIComponent(lang)}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(budget),
        headers: { "User-Agent": "kidstoreperu.com" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.status === 200 && data?.data) return { ok: true, entry: await saveGood(lang, data) };
        reason = `payload status ${data?.status ?? "?"}`;
      } else {
        reason = `HTTP ${res.status}`;
      }
    } catch (err) {
      reason = err instanceof Error && err.name === "TimeoutError"
        ? `sin respuesta en ${budget} ms`
        : err instanceof Error ? err.message : "error desconocido";
    }
    if (attempt === 1) {
      log(lang, `el 1.er intento fallo (${reason}); se reintenta`);
      await sleep(RETRY_DELAY_MS);
    } else {
      log(lang, `el reintento tambien fallo (${reason})`);
    }
  }
  return { ok: false, reason };
}

// Pide la tienda al proveedor compartiendo la peticion en curso del mismo idioma.
// No depende de ningun cliente: si el visitante se va, la respuesta se guarda
// igual y no cuenta como falla del proveedor.
function refresh(lang: string): Promise<FetchResult> {
  const running = inflight.get(lang);
  if (running) return running;
  const p = fetchUpstream(lang)
    .then((r) => {
      if (r.ok) {
        backoff.delete(lang);
      } else {
        const failures = (backoff.get(lang)?.failures ?? 0) + 1;
        const wait = Math.min(BACKOFF_BASE_MS * 2 ** (failures - 1), BACKOFF_MAX_MS);
        backoff.set(lang, { failures, until: Date.now() + wait });
        log(lang, `proveedor en pausa ${Math.round(wait / 1000)} s (${failures} falla(s) seguidas)`);
      }
      return r;
    })
    .finally(() => inflight.delete(lang));
  inflight.set(lang, p);
  return p;
}

function refreshInBackground(lang: string, c: Cached) {
  if (Date.now() - c.ts < REFRESH_AFTER_MS || inflight.has(lang) || inBackoff(lang)) return;
  void refresh(lang);
}

function untilAborted(signal: AbortSignal): Promise<"aborted"> {
  return new Promise((resolve) => {
    if (signal.aborted) resolve("aborted");
    else signal.addEventListener("abort", () => resolve("aborted"), { once: true });
  });
}

// Las imagenes de fondo propias se llaman como la seccion en espanol. Cuando la tienda se pide
// en otro idioma se adjunta { layoutId: nombre en espanol } (de la copia en espanol de hoy; si
// no la hay, se pide una vez). Si falla, la tienda funciona igual con los fondos por defecto.
const NAMES_WAIT_MS = 8_000;

function sectionNames(body: Body): Record<string, string> {
  const entries = (body as { data?: { entries?: { layout?: { id?: string; name?: string } }[] } }).data?.entries ?? [];
  const names: Record<string, string> = {};
  for (const e of entries) if (e.layout?.id && e.layout.name) names[e.layout.id] = e.layout.name.trim();
  return names;
}

async function spanishNames(): Promise<Record<string, string> | null> {
  const cached = await readCached(ES);
  if (cached && isCurrentRotation(cached)) {
    refreshInBackground(ES, cached);
    return sectionNames(cached.body);
  }
  if (!inBackoff(ES)) {
    const r = await Promise.race([refresh(ES), sleep(NAMES_WAIT_MS).then(() => null)]);
    if (r?.ok) return sectionNames(r.entry.body);
  }
  return cached ? sectionNames(cached.body) : null;
}

async function withSpanishNames(lang: string, body: Body) {
  if (lang.startsWith("es")) return body;
  const names = await spanishNames();
  return names ? { ...body, _sectionNamesEs: names } : body;
}

const live = async (lang: string, body: Body) =>
  NextResponse.json(await withSpanishNames(lang, body), {
    headers: { "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=1800" },
  });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("language") ?? ES;
  if (!LANGUAGES.has(lang)) {
    return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
  }
  const cached = await readCached(lang);

  // Copia de la rotacion de hoy con menos de 1 h: al instante y sin aviso.
  if (cached && isFresh(cached)) {
    refreshInBackground(lang, cached);
    return live(lang, cached.body);
  }

  // Hay que pedirla al proveedor, salvo que este en pausa tras fallar y haya copia.
  let reason = "proveedor en pausa tras fallar";
  if (!(cached && inBackoff(lang))) {
    const r = await Promise.race([refresh(lang), untilAborted(request.signal)]);
    // El visitante se fue: nadie lee la respuesta (la peticion al proveedor sigue y se guarda).
    if (r === "aborted") return new Response(null, { status: 499 });
    if (r.ok) return live(lang, r.entry.body);
    reason = r.reason;
  }

  // Proveedor caido -> servir la ultima tienda buena si no es demasiado vieja.
  if (cached && Date.now() - cached.ts < STALE_MAX_MS) {
    log(lang, `se entrega la copia guardada del ${new Date(cached.ts).toISOString()} con aviso (${reason})`);
    return NextResponse.json(
      {
        ...(await withSpanishNames(lang, cached.body)),
        _stale: true,
        _staleAt: new Date(cached.ts).toISOString(),
        _staleReason: reason,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  log(lang, `sin copia guardada que entregar (${reason})`);
  return NextResponse.json(
    { error: "Fortnite API unavailable", detail: reason },
    { status: 502 },
  );
}
