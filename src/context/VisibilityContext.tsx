"use client";

import {
  createContext, useContext, useEffect, useCallback, useSyncExternalStore, ReactNode,
} from "react";
import {
  isVisible as isVisibleBase,
  VisibilityOverrides,
} from "@/config/visibility";

const LS_KEY = "kidstore_visibility";

/* ────────────────────────────────────────────────────────────────
   Store externo (useSyncExternalStore) — evita el desajuste de
   hidratación y el re-render "sucio" dentro de <Suspense>.
   - Servidor: snapshot vacío `{}` (no hay localStorage).
   - Cliente: parte de la cache de localStorage y se refresca con el
     backend (`/api/site-config`).
──────────────────────────────────────────────────────────────── */
const EMPTY: VisibilityOverrides = {};

let current: VisibilityOverrides = EMPTY;
const listeners = new Set<() => void>();

function readCache(): VisibilityOverrides {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

// Inicializa desde la cache lo antes posible en el cliente.
if (typeof window !== "undefined") current = readCache();

function emit() { listeners.forEach(l => l()); }

function setOverrides(next: VisibilityOverrides) {
  current = next;
  try { window.localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* no-op */ }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === LS_KEY) { current = readCache(); cb(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
}

const getSnapshot       = () => current;
const getServerSnapshot = () => EMPTY;

let inFlight: Promise<void> | null = null;
function refreshStore(): Promise<void> {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const res  = await fetch("/api/site-config", { cache: "no-store" });
      const json = await res.json();
      if (json && json.success && json.config && typeof json.config === "object") {
        setOverrides(json.config);
      }
    } catch {
      /* backend caído: nos quedamos con la cache / defaults */
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}

/* ──────────────────────────────────────────────────────────────── */

interface VisibilityCtx {
  overrides: VisibilityOverrides;
  isVisible: (key: string) => boolean;
  refresh: () => Promise<void>;
  setOverride: (key: string, value: boolean) => void;
}

const Ctx = createContext<VisibilityCtx>({
  overrides: EMPTY,
  isVisible: (key) => isVisibleBase(key),
  refresh: async () => {},
  setOverride: () => {},
});

export function VisibilityProvider({ children }: { children: ReactNode }) {
  const overrides = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => { refreshStore(); }, []);

  const isVisible = useCallback(
    (key: string) => isVisibleBase(key, overrides),
    [overrides],
  );

  const setOverride = useCallback((key: string, value: boolean) => {
    setOverrides({ ...current, [key]: value });
  }, []);

  const refresh = useCallback(() => refreshStore(), []);

  return (
    <Ctx.Provider value={{ overrides, isVisible, refresh, setOverride }}>
      {children}
    </Ctx.Provider>
  );
}

export const useVisibility = () => useContext(Ctx);
