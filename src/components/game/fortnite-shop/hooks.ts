"use client";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import type { ApiEntry } from "./model";

/* ── Datos de la tienda ──────────────────────────────────────────────
   Se piden a nuestro proxy /api/fortnite-shop (mismos datos que fortnite-api.com
   /v2/shop): si el proveedor cae, el proxy devuelve la última tienda buena
   marcada `_stale` en vez de un error. */

const CACHE_TTL_MS = 10 * 60 * 1000;
type NamesEs = Record<string, string> | null;
const cache = new Map<string, { entries: ApiEntry[]; date: string; namesEs: NamesEs; ts: number }>();

// La tienda rota todos los días a las 00:00 UTC.
export function nextShopReset(now = Date.now()): number {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1);
}

interface ShopState {
  status: "loading" | "ready" | "error";
  entries: ApiEntry[] | null;
  date: string | null;
  // Nombres de sección en español por id (los añade el proxy cuando la tienda va en otro idioma).
  namesEs: NamesEs;
  stale: boolean;
  error: string | null;
}

export function useShopData(apiLang: string) {
  const [state, setState] = useState<ShopState>({
    status: "loading",
    entries: null,
    date: null,
    namesEs: null,
    stale: false,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);
  const forceRef = useRef(false);

  useEffect(() => {
    const force = forceRef.current;
    forceRef.current = false;
    const hit = cache.get(apiLang);
    if (!force && hit && Date.now() - hit.ts < CACHE_TTL_MS) {
      // Sincroniza con la caché del módulo al cambiar de idioma (sistema externo al estado).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ status: "ready", entries: hit.entries, date: hit.date, namesEs: hit.namesEs, stale: false, error: null });
      return undefined;
    }
    const ctrl = new AbortController();
    // La tienda anterior sigue visible mientras llega la nueva (cambio de idioma o recarga).
    setState((s) => ({ ...s, status: "loading", error: null }));
    fetch(`/api/fortnite-shop?language=${encodeURIComponent(apiLang)}`, { signal: ctrl.signal, cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const entries = json?.data?.entries;
        if (json?.status !== 200 || !Array.isArray(entries)) throw new Error("Respuesta inesperada de la tienda");
        const stale = Boolean(json._stale);
        const namesEs: NamesEs = json._sectionNamesEs ?? null;
        if (!stale) cache.set(apiLang, { entries, date: json.data.date, namesEs, ts: Date.now() });
        setState({ status: "ready", entries, date: json.data.date, namesEs, stale, error: null });
      })
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return;
        setState((s) => ({ ...s, status: "error", error: err instanceof Error ? err.message : String(err) }));
      });
    return () => ctrl.abort();
  }, [apiLang, reloadKey]);

  // Recarga automática ~90 s después de la rotación (00:00 UTC).
  useEffect(() => {
    const id = setTimeout(() => {
      forceRef.current = true;
      setReloadKey((k) => k + 1);
    }, nextShopReset() - Date.now() + 90_000);
    return () => clearTimeout(id);
  }, [reloadKey]);

  const reload = useCallback(() => {
    forceRef.current = true;
    setReloadKey((k) => k + 1);
  }, []);

  return { ...state, reload };
}

/* ── Reloj compartido: un solo intervalo para todos los contadores ── */

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;
let clock = Date.now();

function subscribeClock(fn: () => void) {
  listeners.add(fn);
  if (!timer) {
    clock = Date.now();
    timer = setInterval(() => {
      clock = Date.now();
      listeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    listeners.delete(fn);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}
const getClock = () => clock;
const noSubscribe = () => () => {};

// `enabled = false` deja de escuchar el reloj (tarjetas fuera de pantalla): no se vuelve a
// pintar cada segundo, y al activarse de nuevo se pone al día con la hora actual.
export function useNow(enabled = true): number {
  return useSyncExternalStore(enabled ? subscribeClock : noSubscribe, getClock, getClock);
}

// Tiempo que le queda a un objeto en la tienda como DD:HH:MM:SS ("06:13:28:05").
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const parts = [Math.floor(total / 86_400), Math.floor((total % 86_400) / 3600), Math.floor((total % 3600) / 60), total % 60];
  return parts.map((n) => String(n).padStart(2, "0")).join(":");
}

export function formatCountdown(ms: number, daysLabel = "d"): string {
  if (ms <= 0) return "00:00:00";
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const hms = [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
  return d > 0 ? `${d}${daysLabel} ${hms}` : hms;
}

/* ── Visibilidad de tarjetas: un observador compartido ────────────── */

const inViewCallbacks = new WeakMap<Element, (v: boolean) => void>();
let inViewObserver: IntersectionObserver | null = null;

function getInViewObserver() {
  if (!inViewObserver) {
    inViewObserver = new IntersectionObserver(
      (records) => records.forEach((r) => inViewCallbacks.get(r.target)?.(r.isIntersecting)),
      { rootMargin: "200px 0px" },
    );
  }
  return inViewObserver;
}

export function useInView(ref: RefObject<Element | null>): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = getInViewObserver();
    inViewCallbacks.set(el, setInView);
    obs.observe(el);
    return () => {
      obs.unobserve(el);
      inViewCallbacks.delete(el);
    };
  }, [ref]);
  return inView;
}

/* ── Sección activa: la que cruza la franja central de la pantalla ── */

export function useActiveSection(sectionIds: string[]): string | null {
  const [active, setActive] = useState<string | null>(sectionIds[0] ?? null);
  const key = sectionIds.join("|");

  useEffect(() => {
    const ids = key ? key.split("|") : [];
    if (!ids.length) return undefined;
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (records) => {
        for (const r of records) visible.set(r.target.id, r.isIntersecting);
        const first = ids.find((id) => visible.get(id));
        if (first) setActive(first);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [key]);

  // Si cambian las secciones (filtros, idioma) y la activa ya no existe, vale la primera.
  return active && sectionIds.includes(active) ? active : (sectionIds[0] ?? null);
}
