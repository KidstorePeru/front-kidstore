// Pruebas de la temporada en la web (src/seasons): fechas en hora de Lima, vista previa, caché
// del servidor y script de arranque (que los adornos no aparezcan fuera de temporada).
// Ejecutar: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { register } from "node:module";
import vm from "node:vm";

// Importaciones relativas sin extensión (./calendar) → .ts, como hace Next.
register(
  "data:text/javascript," +
    encodeURIComponent(`export async function resolve(s, c, next) {
      if (s.startsWith(".") && !/\\.[a-z]+$/i.test(s)) { try { return await next(s + ".ts", c); } catch {} }
      return next(s, c);
    }`),
);

const cal = await import("../src/seasons/calendar.ts");
const { seasonBootScript } = await import("../src/seasons/bootScript.ts");

// Instante a partir de una hora de Lima (UTC-5).
const lima = (y, mo, d, h = 0, mi = 0, s = 0) => Date.UTC(y, mo - 1, d, h + 5, mi, s);
const DAY = 24 * 60 * 60 * 1000;

// ── Fechas ──────────────────────────────────────────────────────────────────
test("Halloween: del 15 de octubre 00:00 al 1 de noviembre 23:59 (hora de Lima)", () => {
  assert.equal(cal.seasonByDate(lima(2026, 10, 14, 23, 59, 59)), null);
  assert.equal(cal.seasonByDate(lima(2026, 10, 15, 0, 0, 0))?.season, "halloween");
  assert.equal(cal.seasonByDate(lima(2026, 11, 1, 23, 59, 0))?.season, "halloween");
  assert.equal(cal.seasonByDate(lima(2026, 11, 1, 23, 59, 59))?.season, "halloween");
  assert.equal(cal.seasonByDate(lima(2026, 11, 2, 0, 0, 0)), null);
});

test("cuenta la hora de Lima, no la UTC", () => {
  assert.equal(cal.seasonByDate(Date.UTC(2026, 10, 2, 4, 59))?.season, "halloween"); // 1 nov 23:59 Lima
  assert.equal(cal.seasonByDate(Date.UTC(2026, 10, 2, 5, 0)), null); // 2 nov 00:00 Lima
});

test("until es el 2 de noviembre a las 00:00 de Lima y se repite cada año", () => {
  assert.equal(cal.seasonByDate(lima(2026, 10, 20))?.until, lima(2026, 11, 2));
  assert.equal(cal.seasonByDate(lima(2031, 10, 31))?.until, lima(2031, 11, 2));
  for (const t of [lima(2026, 1, 1), lima(2026, 6, 15), lima(2026, 12, 24)]) assert.equal(cal.seasonByDate(t), null);
});

// ── Vista previa ────────────────────────────────────────────────────────────
test("?temporada=halloween | ninguna | auto", () => {
  assert.equal(cal.parsePreviewParam("halloween"), "halloween");
  assert.equal(cal.parsePreviewParam("HALLOWEEN "), "halloween");
  assert.equal(cal.parsePreviewParam("ninguna"), "none");
  assert.equal(cal.parsePreviewParam("auto"), null);
  assert.equal(cal.parsePreviewParam(null), undefined);
  assert.equal(cal.parsePreviewParam("navidad"), undefined); // aún no existe: se ignora
});

test("la vista previa manda sobre todo lo demás (solo en esa pestaña)", () => {
  const off = { season: null, until: lima(2026, 11, 2) };
  assert.equal(cal.initialSeason(lima(2026, 7, 1), "halloween", null), "halloween");
  assert.equal(cal.initialSeason(lima(2026, 10, 20), "none", null), null);
  assert.equal(cal.initialSeason(lima(2026, 10, 20), "halloween", off), "halloween");
});

// ── Servidor y cortes ───────────────────────────────────────────────────────
test("si el servidor apagó Halloween, un corte no lo vuelve a encender", () => {
  const off = { season: null, until: lima(2026, 11, 2) };
  assert.equal(cal.initialSeason(lima(2026, 10, 25), null, off), null);
});

test("sin respuesta del servidor guardada, decide por fechas", () => {
  assert.equal(cal.initialSeason(lima(2026, 10, 25), null, null), "halloween");
  assert.equal(cal.initialSeason(lima(2026, 11, 2), null, null), null);
});

test("una respuesta guardada vencida ya no cuenta", () => {
  const forcedOn = { season: "halloween", until: lima(2026, 11, 2) };
  assert.equal(cal.initialSeason(lima(2026, 10, 10), null, forcedOn), "halloween"); // encendida antes de las fechas
  assert.equal(cal.initialSeason(lima(2026, 11, 2) + DAY, null, forcedOn), null);
});

test("fromServer normaliza GET /season", () => {
  assert.deepEqual(cal.fromServer({ season: "halloween", until: "2026-11-02T05:00:00.000Z" }), { season: "halloween", until: lima(2026, 11, 2) });
  assert.deepEqual(cal.fromServer({ season: null, until: null }), { season: null, until: null });
  assert.deepEqual(cal.fromServer({ season: "otra", until: "x" }), { season: null, until: null });
  assert.equal(cal.fromServer(null), null);
});

// ── Script de arranque (antes de pintar) ────────────────────────────────────
function runBoot({ now, path = "/", search = "", session = {}, local = {} }) {
  const attrs = {};
  const head = [];
  const store = (init) => {
    const m = new Map(Object.entries(init));
    return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), _m: m };
  };
  const sessionStorage = store(session);
  const localStorage = store(local);
  class FixedDate extends Date {
    constructor(...a) { super(...(a.length ? a : [now])); }
    static now() { return now; }
  }
  const document = {
    documentElement: { setAttribute: (k, v) => { attrs[k] = v; } },
    head: { appendChild: (el) => head.push(el) },
    createElement: () => ({}),
  };
  vm.runInNewContext(seasonBootScript("abc123"), {
    Date: FixedDate, JSON, URLSearchParams, document, sessionStorage, localStorage,
    location: { pathname: path, search },
  });
  return { season: attrs["data-season"] ?? null, links: head.map((l) => l.href), sessionStorage };
}

test("arranque en temporada: pone data-season y carga solo el CSS de Halloween", () => {
  const r = runBoot({ now: lima(2026, 10, 15, 0, 0, 0) });
  assert.equal(r.season, "halloween");
  assert.deepEqual(r.links, ["/seasons/halloween.css?v=abc123"]);
});

test("arranque fuera de temporada: sin adornos y sin descargar nada", () => {
  for (const now of [lima(2026, 10, 14, 23, 59, 59), lima(2026, 11, 2, 0, 0, 0), lima(2026, 3, 1)]) {
    const r = runBoot({ now });
    assert.equal(r.season, null);
    assert.deepEqual(r.links, []);
  }
});

test("arranque: nunca en el panel de administración", () => {
  const r = runBoot({ now: lima(2026, 10, 20), path: "/admin/dashboard", search: "?temporada=halloween" });
  assert.equal(r.season, null);
  assert.deepEqual(r.links, []);
});

test("arranque: ?temporada=halloween la muestra fuera de fechas y la recuerda en la pestaña", () => {
  const r = runBoot({ now: lima(2026, 7, 1), search: "?temporada=halloween" });
  assert.equal(r.season, "halloween");
  assert.equal(r.sessionStorage.getItem(cal.PREVIEW_KEY), '"halloween"');
  assert.equal(runBoot({ now: lima(2026, 7, 1), session: { [cal.PREVIEW_KEY]: '"halloween"' } }).season, "halloween");
});

test("arranque: ?temporada=ninguna la quita y ?temporada=auto vuelve a lo normal", () => {
  const none = runBoot({ now: lima(2026, 10, 20), search: "?temporada=ninguna" });
  assert.equal(none.season, null);
  const auto = runBoot({ now: lima(2026, 7, 1), search: "?temporada=auto", session: { [cal.PREVIEW_KEY]: '"halloween"' } });
  assert.equal(auto.season, null);
  assert.equal(auto.sessionStorage.getItem(cal.PREVIEW_KEY), null);
});

test("arranque: respeta el apagado del panel guardado aunque sean las fechas", () => {
  const local = { [cal.CACHE_KEY]: JSON.stringify({ season: null, until: lima(2026, 11, 2) }) };
  assert.equal(runBoot({ now: lima(2026, 10, 20), local }).season, null);
});

test("arranque: el script y initialSeason deciden lo mismo", () => {
  const cases = [
    { now: lima(2026, 10, 14, 23, 59) }, { now: lima(2026, 10, 15) }, { now: lima(2026, 11, 1, 23, 59) }, { now: lima(2026, 11, 2) },
    { now: lima(2026, 10, 20), cache: { season: null, until: lima(2026, 11, 2) } },
    { now: lima(2026, 10, 5), cache: { season: "halloween", until: lima(2026, 11, 2) } },
    { now: lima(2026, 12, 5), cache: { season: "halloween", until: lima(2026, 11, 2) } },
  ];
  for (const c of cases) {
    const local = c.cache ? { [cal.CACHE_KEY]: JSON.stringify(c.cache) } : {};
    assert.equal(runBoot({ now: c.now, local }).season, cal.initialSeason(c.now, null, c.cache ?? null), JSON.stringify(c));
  }
});
