// Pruebas del proxy de la tienda de Fortnite (src/app/api/fortnite-shop/route.ts) contra un
// servidor falso que imita fortnite-api.com. Ejecutar: npm test
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { register } from "node:module";

// Fuera de Next, "next/server" (sin extensión) no resuelve como módulo ES: se mapea a next/server.js.
register(
  "data:text/javascript," +
    encodeURIComponent('export async function resolve(s, c, next) { return next(s === "next/server" ? "next/server.js" : s, c); }'),
);

// SHOP_ROUTE permite correr las mismas pruebas contra otra versión de la ruta.
const ROUTE = process.env.SHOP_ROUTE
  ? new URL(process.env.SHOP_ROUTE, `file:///${process.cwd().replace(/\\/g, "/")}/`).href
  : new URL("../src/app/api/fortnite-shop/route.ts", import.meta.url).href;
const ATTEMPT_MS = 400; // plazo por intento en las pruebas (en producción, 12 s)
const BASE_TMP = tmpdir();
const MIN = 60_000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const rotation = (daysAgo = 0) => {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - daysAgo)).toISOString().replace(".000Z", "Z");
};
const shop = (date, tag) => ({ status: 200, data: { date, entries: [{ layout: { id: "L1", name: tag } }] } });
const tagOf = (json) => json?.data?.entries?.[0]?.layout?.name;

// ── Servidor falso: cada petición recibe su número (1, 2, …) y responde según `plan`.
let upstream;
async function fakeUpstream(plan) {
  const calls = [];
  const server = createServer(async (req, res) => {
    calls.push(Date.now());
    const step = plan(calls.length);
    if (step.delay) await sleep(step.delay);
    if (res.destroyed || res.writableEnded) return;
    res.writeHead(step.status ?? 200, { "content-type": "application/json" });
    res.end(JSON.stringify(step.body ?? { status: step.status ?? 200 }));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  return {
    url: `http://127.0.0.1:${server.address().port}/v2/shop`,
    calls,
    close: () => { server.closeAllConnections(); return new Promise((r) => server.close(r)); },
  };
}

// ── Carga una instancia nueva de la ruta (memoria vacía) con su propia carpeta de caché.
let n = 0;
let logs = [];
const origWarn = console.warn;
async function loadRoute({ seed } = {}) {
  const dir = mkdtempSync(join(BASE_TMP, "fnshop-"));
  process.env.TEMP = process.env.TMP = process.env.TMPDIR = dir;
  process.env.FORTNITE_SHOP_UPSTREAM = upstream.url;
  process.env.FORTNITE_SHOP_ATTEMPT_MS = String(ATTEMPT_MS);
  if (seed) writeFileSync(join(dir, "fn-shop-es-419.json"), JSON.stringify(seed));
  const mod = await import(`${ROUTE}?v=${++n}`);
  const get = async (signal, language = "es-419") => {
    const res = await mod.GET(new Request(`http://localhost/api/fortnite-shop?language=${language}`, { signal }));
    const text = await res.text();
    return { status: res.status, json: text ? JSON.parse(text) : null };
  };
  return get;
}

async function waitFor(cond, ms = 5000) {
  const end = Date.now() + ms;
  while (!cond()) {
    if (Date.now() > end) throw new Error("tiempo de espera agotado");
    await sleep(20);
  }
}

beforeEach(() => { logs = []; console.warn = (...a) => { logs.push(a.join(" ")); }; });
afterEach(async () => { console.warn = origWarn; await upstream?.close(); upstream = null; });

test("reintento con plazo propio: el 1.er intento lento no deja vencido al segundo", async () => {
  upstream = await fakeUpstream((i) => (i === 1 ? { delay: ATTEMPT_MS * 3, body: shop(rotation(), "lenta") } : { body: shop(rotation(), "nueva") }));
  const get = await loadRoute();
  const r = await get();
  assert.equal(r.status, 200);
  assert.equal(r.json._stale, undefined, "no debe salir el aviso");
  assert.equal(tagOf(r.json), "nueva");
  assert.equal(upstream.calls.length, 2);
  assert.ok(logs.some((l) => l.includes("1.er intento")), "registra el 1.er intento fallido");
});

test("copia de hoy (<1 h): se entrega al instante sin aviso y con UNA sola actualización en segundo plano", async () => {
  upstream = await fakeUpstream(() => ({ delay: 300, body: shop(rotation(), "nueva") }));
  const get = await loadRoute({ seed: { body: shop(rotation(), "guardada"), ts: Date.now() - 10 * MIN, date: rotation() } });
  const t0 = Date.now();
  const rs = await Promise.all([get(), get(), get(), get(), get()]);
  assert.ok(Date.now() - t0 < 250, `debe responder sin esperar al proveedor (${Date.now() - t0} ms)`);
  for (const r of rs) {
    assert.equal(r.status, 200);
    assert.equal(r.json._stale, undefined);
    assert.equal(tagOf(r.json), "guardada");
  }
  await waitFor(() => upstream.calls.length >= 1);
  await sleep(600); // termina la actualización y no arranca otra
  assert.equal(upstream.calls.length, 1, "una sola actualización en segundo plano");
  const after = await get();
  assert.equal(tagOf(after.json), "nueva", "la siguiente visita ya ve la tienda actualizada");
  assert.equal(upstream.calls.length, 1);
});

test("copia de hoy (<1 h) con el proveedor caído: sin aviso", async () => {
  upstream = await fakeUpstream(() => ({ status: 503 }));
  const get = await loadRoute({ seed: { body: shop(rotation(), "guardada"), ts: Date.now() - 20 * MIN, date: rotation() } });
  const r = await get();
  assert.equal(r.status, 200);
  assert.equal(r.json._stale, undefined);
  assert.equal(tagOf(r.json), "guardada");
  await waitFor(() => logs.some((l) => l.includes("en pausa")), 4000); // termina la actualización fallida
});

test("aviso cuando la copia es de antes de la rotación (y se registra en los logs)", async () => {
  upstream = await fakeUpstream(() => ({ status: 503 }));
  const get = await loadRoute({ seed: { body: shop(rotation(1), "ayer"), ts: Date.now() - 3 * 60 * MIN } });
  const r = await get();
  assert.equal(r.status, 200);
  assert.equal(r.json._stale, true);
  assert.equal(tagOf(r.json), "ayer");
  assert.equal(upstream.calls.length, 2);
  assert.ok(logs.some((l) => l.includes("reintento tambien fallo")), "registra el reintento fallido");
  assert.ok(logs.some((l) => l.includes("copia guardada")), "registra que entrega la copia guardada");
});

test("aviso cuando la copia de hoy lleva más de 1 h sin poder actualizarse", async () => {
  upstream = await fakeUpstream(() => ({ status: 503 }));
  const get = await loadRoute({ seed: { body: shop(rotation(), "hoy"), ts: Date.now() - 90 * MIN, date: rotation() } });
  const r = await get();
  assert.equal(r.json._stale, true);
  assert.equal(tagOf(r.json), "hoy");
});

test("backoff: tras fallar no se vuelve a pedir al proveedor enseguida", async () => {
  upstream = await fakeUpstream(() => ({ status: 503 }));
  const get = await loadRoute({ seed: { body: shop(rotation(1), "ayer"), ts: Date.now() - 3 * 60 * MIN } });
  await get();
  assert.equal(upstream.calls.length, 2);
  const t0 = Date.now();
  const r = await get();
  assert.equal(r.json._stale, true);
  assert.equal(upstream.calls.length, 2, "en pausa no se llama al proveedor");
  assert.ok(Date.now() - t0 < 200, "y responde al instante");
});

test("tienda en inglés: los nombres en español salen de la copia de hoy sin pedirla otra vez", async () => {
  upstream = await fakeUpstream(() => ({ body: shop(rotation(), "Featured") }));
  const get = await loadRoute({ seed: { body: shop(rotation(), "Destacados"), ts: Date.now() - MIN, date: rotation() } });
  const r = await get(undefined, "en");
  assert.equal(r.status, 200);
  assert.equal(tagOf(r.json), "Featured");
  assert.deepEqual(r.json._sectionNamesEs, { L1: "Destacados" });
  assert.equal(upstream.calls.length, 1, "solo se pide la tienda en inglés");
});

test("idioma inventado: 400 sin llamar al proveedor", async () => {
  upstream = await fakeUpstream(() => ({ body: shop(rotation(), "nueva") }));
  const get = await loadRoute();
  const r = await get(undefined, "xx-falso");
  assert.equal(r.status, 400);
  assert.equal(upstream.calls.length, 0);
});

test("cliente que se va: no activa el backoff y la respuesta del proveedor se aprovecha", async () => {
  upstream = await fakeUpstream(() => ({ delay: 250, body: shop(rotation(), "nueva") }));
  const get = await loadRoute({ seed: { body: shop(rotation(1), "ayer"), ts: Date.now() - 3 * 60 * MIN } });
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), 50);
  await get(ctrl.signal);
  await sleep(500);
  const r = await get();
  assert.equal(r.status, 200);
  assert.equal(r.json._stale, undefined);
  assert.equal(tagOf(r.json), "nueva");
  assert.equal(upstream.calls.length, 1, "la petición del que se fue se guardó y se reutiliza");
  assert.ok(!logs.some((l) => l.includes("en pausa")), "irse no cuenta como falla del proveedor");
});
