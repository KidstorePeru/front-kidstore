"use client";
// Temporada visible (Halloween…). La fuente de verdad en el navegador es <html data-season>:
// lo pone el script de arranque (bootScript.ts) antes de pintar y luego este proveedor lo
// confirma con el servidor (GET /season). El CSS de la temporada se añade solo mientras está
// activa; el resto del año no se descarga nada.
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  CACHE_KEY, PREVIEW_KEY, PREVIEW_PARAM, SEASON_IDS, fromServer, initialSeason, parsePreviewParam,
  type CachedSeason, type PreviewValue, type SeasonId,
} from "./calendar";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const RECHECK_MS = 30 * 60 * 1000;

const read = <T,>(store: () => Storage, key: string): T | null => {
  try {
    const raw = store().getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};
const write = (store: () => Storage, key: string, value: unknown) => {
  try {
    if (value === null) store().removeItem(key);
    else store().setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible */
  }
};

/** Aplica la temporada a la página: atributo en <html> y hoja de estilos de la temporada. */
export function applySeason(season: SeasonId | null, cssVersion: string) {
  const html = document.documentElement;
  if (season) html.dataset.season = season;
  else delete html.dataset.season;
  let link = document.getElementById("season-css") as HTMLLinkElement | null;
  if (!season) {
    link?.remove();
    return;
  }
  const href = `/seasons/${season}.css?v=${cssVersion}`;
  if (!link) {
    link = document.createElement("link");
    link.id = "season-css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  if (link.getAttribute("href") !== href) link.setAttribute("href", href);
}

function subscribe(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-season"] });
  return () => obs.disconnect();
}
const snapshot = (): SeasonId | null => {
  const v = document.documentElement.dataset.season;
  return v && (SEASON_IDS as string[]).includes(v) ? (v as SeasonId) : null;
};

/** Temporada activa en la página (null fuera de temporada, en el servidor y en el panel). */
export function useSeason(): SeasonId | null {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}

export function SeasonProvider({ children, cssVersion }: { children: ReactNode; cssVersion: string }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    // Vista previa solo para esta pestaña: ?temporada=halloween | ninguna | auto.
    const url = new URL(window.location.href);
    const param = parsePreviewParam(url.searchParams.get(PREVIEW_PARAM));
    if (param !== undefined) {
      write(() => sessionStorage, PREVIEW_KEY, param);
      url.searchParams.delete(PREVIEW_PARAM);
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    }

    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      const preview = read<PreviewValue>(() => sessionStorage, PREVIEW_KEY);
      const cached = read<CachedSeason>(() => localStorage, CACHE_KEY);
      applySeason(isAdmin ? null : initialSeason(Date.now(), preview, cached), cssVersion);
      return cached;
    };

    const check = async () => {
      let state: CachedSeason | null = null;
      try {
        const res = await fetch(`${API_URL}/season`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
        state = res.ok ? fromServer(await res.json()) : null;
      } catch {
        state = null;
      }
      if (!alive) return;
      // Servidor caído: la web se queda como estaba y vuelve a preguntar más tarde.
      if (state) write(() => localStorage, CACHE_KEY, state);
      const cached = state ? show() : null;
      // Vuelve a preguntar al terminar la temporada (o el modo del panel) y cada 30 min.
      clearTimeout(timer);
      const untilMs = cached?.until ? cached.until - Date.now() + 1000 : RECHECK_MS;
      timer = setTimeout(check, Math.max(5000, Math.min(untilMs, RECHECK_MS)));
    };

    show();
    check();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [isAdmin, cssVersion]);

  return <>{children}</>;
}
