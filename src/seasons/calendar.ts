// Calendario de temporadas (decoraciones de la web). Copia del de back-kidstore
// (src/lib/seasons.js): el servidor manda; aquí solo sirve para no esperar al servidor al abrir.
// Para agregar Navidad u otra fecha: sumar la temporada aquí y en el back, su CSS en
// public/seasons/<id>.css y sus adornos en src/seasons/<id>/.
export type SeasonId = "halloween";

export interface SeasonDef {
  id: SeasonId;
  start: { month: number; day: number };
  /** Último día incluido (termina a las 00:00 del día siguiente, hora de Lima). */
  end: { month: number; day: number };
}

export const SEASONS: SeasonDef[] = [
  { id: "halloween", start: { month: 10, day: 15 }, end: { month: 11, day: 1 } },
];

export const SEASON_IDS: SeasonId[] = SEASONS.map((s) => s.id);

const LIMA_OFFSET_MS = 5 * 60 * 60 * 1000; // Perú: UTC-5 todo el año
const DAY_MS = 24 * 60 * 60 * 1000;

const limaMidnight = (year: number, month: number, day: number) => Date.UTC(year, month - 1, day) + LIMA_OFFSET_MS;
const limaYear = (ms: number) => new Date(ms - LIMA_OFFSET_MS).getUTCFullYear();

export function occurrence(season: SeasonDef, year: number) {
  const start = limaMidnight(year, season.start.month, season.start.day);
  const endYear = season.end.month < season.start.month ? year + 1 : year;
  return { id: season.id, start, end: limaMidnight(endYear, season.end.month, season.end.day) + DAY_MS };
}

/** Temporada activa por fechas (hora de Lima) y hasta cuándo dura, o null. */
export function seasonByDate(now: number): { season: SeasonId; until: number } | null {
  const y = limaYear(now);
  for (const s of SEASONS) {
    for (const year of [y - 1, y]) {
      const o = occurrence(s, year);
      if (now >= o.start && now < o.end) return { season: s.id, until: o.end };
    }
  }
  return null;
}

// ── Vista previa (solo en esta pestaña): ?temporada=halloween | ninguna | auto ──
export const PREVIEW_PARAM = "temporada";
export const PREVIEW_KEY = "kidstore_season_preview"; // sessionStorage: "halloween" | "none"
export const CACHE_KEY = "kidstore_season"; // localStorage: última respuesta del servidor

export type PreviewValue = SeasonId | "none";

/** Lee el parámetro de vista previa. undefined = no hay parámetro; null = volver a lo normal. */
export function parsePreviewParam(value: string | null): PreviewValue | null | undefined {
  if (value === null) return undefined;
  const v = value.trim().toLowerCase();
  if (v === "ninguna" || v === "none" || v === "off") return "none";
  if (v === "auto" || v === "") return null;
  return (SEASON_IDS as string[]).includes(v) ? (v as SeasonId) : undefined;
}

export interface CachedSeason {
  season: SeasonId | null;
  /** Hasta cuándo vale (ms); después se vuelve a decidir por fechas. */
  until: number | null;
}

/**
 * Qué temporada mostrar mientras llega la respuesta del servidor:
 * vista previa de la pestaña > última respuesta del servidor (si sigue vigente) > fechas.
 * Así, un corte del servidor nunca enciende lo que se apagó desde el panel.
 */
export function initialSeason(now: number, preview: PreviewValue | null, cached: CachedSeason | null): SeasonId | null {
  if (preview === "none") return null;
  if (preview) return preview;
  if (cached && (cached.until === null || now < cached.until)) return cached.season;
  return seasonByDate(now)?.season ?? null;
}

/** Normaliza la respuesta de GET /season. */
export function fromServer(json: unknown): CachedSeason | null {
  const j = json as { season?: unknown; until?: unknown } | null;
  if (!j || typeof j !== "object" || !("season" in j)) return null;
  const season = (SEASON_IDS as unknown[]).includes(j.season) ? (j.season as SeasonId) : null;
  const until = typeof j.until === "string" ? Date.parse(j.until) : null;
  return { season, until: Number.isFinite(until) ? until : null };
}
