/**
 * Visibilidad de secciones y productos de la tienda.
 *
 * Regla: cuando algo se deja de vender temporalmente, se pone en `false`
 * aquí — NO se borra el código ni los datos ("se oculta, no se elimina").
 *
 * Hoy se controla desde este archivo (editar + desplegar). El siguiente paso
 * es gestionarlo desde el panel de admin: un endpoint `/api/site-config`
 * devolverá overrides que se fusionan sobre estos valores por defecto.
 */

export type VisibilityKey =
  | "rocket-league:bulk-credits" // BulkSelector ("Créditos a granel") en /games/rocket-league
  | "rocket-league:bundles-tab"; // Pestaña "Paquetes" de Rocket League

export const DEFAULT_VISIBILITY: Record<VisibilityKey, boolean> = {
  "rocket-league:bulk-credits": false, // oculto desde 2026-08 (no se puede surtir por ahora)
  "rocket-league:bundles-tab":  true,
};

/** ¿Se debe mostrar esta sección? Por defecto sí, salvo que esté en `false`. */
export function isVisible(key: VisibilityKey): boolean {
  return DEFAULT_VISIBILITY[key] ?? true;
}
