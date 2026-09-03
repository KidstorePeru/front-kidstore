import { NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

// La tienda de Fortnite rota cada dia a las 00:00 UTC. No se cachea en el
// servidor con el Data Cache de Next (un cache atascado hacia que se viera la
// tienda de ayer). En su lugar guardamos la ultima respuesta buena y, si el
// proveedor (fortnite-api.com) esta caido, la servimos marcada como `_stale`
// en vez de devolver un error: asi la pagina no se queda en blanco durante
// una caida del tercero.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const UPSTREAM = "https://fortnite-api.com/v2/shop";
const STALE_MAX_MS = 36 * 60 * 60 * 1000; // no servir una tienda de mas de 36 h

type Cached = { body: Record<string, unknown>; ts: number };
const memCache = new Map<string, Cached>();

const diskPath = (lang: string) =>
  join(tmpdir(), `fn-shop-${lang.replace(/[^a-z0-9-]/gi, "_")}.json`);

async function readStale(lang: string): Promise<Cached | null> {
  const mem = memCache.get(lang);
  if (mem) return mem;
  try {
    const parsed = JSON.parse(await readFile(diskPath(lang), "utf8")) as Cached;
    if (parsed && typeof parsed.ts === "number" && parsed.body) {
      memCache.set(lang, parsed);
      return parsed;
    }
  } catch {
    /* sin copia en disco todavia */
  }
  return null;
}

async function saveGood(lang: string, body: Record<string, unknown>) {
  const entry: Cached = { body, ts: Date.now() };
  memCache.set(lang, entry);
  try {
    await writeFile(diskPath(lang), JSON.stringify(entry), "utf8");
  } catch {
    /* disco de solo lectura: nos quedamos solo con la copia en memoria */
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("language") ?? "es-419";

  let lastErr = "";

  // 2 intentos: fortnite-api.com a veces responde 503 "booting up" unos segundos.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${UPSTREAM}?language=${encodeURIComponent(lang)}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(12_000),
        headers: { "User-Agent": "kidstoreperu.com" },
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.status === 200 && data?.data) {
          await saveGood(lang, data);
          return NextResponse.json(data, {
            headers: {
              "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=1800",
            },
          });
        }
        lastErr = `payload status ${data?.status ?? "?"}`;
      } else {
        lastErr = `HTTP ${res.status}`;
      }
    } catch (err) {
      lastErr = err instanceof Error ? err.message : "unknown error";
    }

    if (attempt === 0) await new Promise((r) => setTimeout(r, 800));
  }

  // Proveedor caido -> servir la ultima tienda buena si no es demasiado vieja.
  const stale = await readStale(lang);
  if (stale && Date.now() - stale.ts < STALE_MAX_MS) {
    return NextResponse.json(
      {
        ...stale.body,
        _stale: true,
        _staleAt: new Date(stale.ts).toISOString(),
        _staleReason: lastErr,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { error: "Fortnite API unavailable", detail: lastErr },
    { status: 502 },
  );
}
