/**
 * Visibilidad de juegos, secciones y productos de la tienda.
 *
 * Regla: cuando algo se deja de vender temporalmente, se OCULTA — no se borra
 * el código ni los datos ("se oculta, no se elimina").
 *
 * Dos capas:
 *  1. `DEFAULT_VISIBILITY` — valores por defecto en el código (este archivo).
 *  2. Overrides guardados en la base de datos y editables desde el panel
 *     `/admin` → tab "Visibilidad". Se cargan en runtime vía
 *     `VisibilityContext` (`GET /api/site-config`) y se fusionan sobre los
 *     defaults. Si el backend no responde, se usan solo los defaults.
 *
 * Convención de claves:
 *  - `game:<slug>`                  → oculta el juego entero
 *  - `<slug>:tab:<tabId>`           → oculta una pestaña de ese juego
 *  - `<slug>:product:<productSlug>` → oculta un producto de ese juego
 *  - `rocket-league:bulk-credits`   → sub-sección "Créditos a granel" (RL)
 */

export type VisibilityKey = string;

/** Overrides = { [key]: boolean }. Fuente: base de datos vía panel admin. */
export type VisibilityOverrides = Record<string, boolean>;

export const DEFAULT_VISIBILITY: Record<string, boolean> = {
  "rocket-league:bulk-credits":  false, // oculto desde 2026-08 (no se puede surtir por ahora)
  "rocket-league:tab:paquetes":  true,
  "roblox:tab:gamepass":         false, // oculto desde 2026-08 (código y calculadora intactos)
  "roblox:tab:plus":             true,
};

/**
 * ¿Se debe mostrar esto? Por defecto sí, salvo que un override o el default lo
 * pongan en `false`. `overrides` viene del `VisibilityContext`; si se llama sin
 * él (usos server-side o legacy) se usan solo los defaults.
 */
export function isVisible(key: string, overrides: VisibilityOverrides = {}): boolean {
  if (key in overrides) return overrides[key];
  if (key in DEFAULT_VISIBILITY) return DEFAULT_VISIBILITY[key];
  return true;
}

/** Clave para ocultar un juego entero. */
export const gameKey = (slug: string) => `game:${slug}`;

/** Clave para ocultar una pestaña dentro de un juego. */
export const tabKey = (gameSlug: string, tabId: string) => `${gameSlug}:tab:${tabId}`;

/** Clave para ocultar un producto dentro de un juego (los slugs no son únicos entre juegos). */
export const productKey = (gameSlug: string, productSlug: string) => `${gameSlug}:product:${productSlug}`;
