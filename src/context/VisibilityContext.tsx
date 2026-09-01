"use client";

import {
  createContext, useContext, useState, useEffect, useCallback, ReactNode,
} from "react";
import {
  isVisible as isVisibleBase,
  VisibilityOverrides,
} from "@/config/visibility";

const LS_KEY = "kidstore_visibility";

interface VisibilityCtx {
  /** Overrides activos (fusionados sobre los defaults dentro de `isVisible`). */
  overrides: VisibilityOverrides;
  /** ¿Se debe mostrar esta clave? Reactivo a los overrides. */
  isVisible: (key: string) => boolean;
  /** true mientras se carga la config del backend por primera vez. */
  loading: boolean;
  /** Vuelve a pedir la config al backend. */
  refresh: () => Promise<void>;
  /** Cambia un override en local (optimista). Lo usa el panel admin. */
  setOverride: (key: string, value: boolean) => void;
}

const Ctx = createContext<VisibilityCtx>({
  overrides: {},
  isVisible: (key) => isVisibleBase(key),
  loading: true,
  refresh: async () => {},
  setOverride: () => {},
});

function readCache(): VisibilityOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeCache(o: VisibilityOverrides) {
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(o));
  } catch {
    /* almacenamiento no disponible: no pasa nada */
  }
}

export function VisibilityProvider({ children }: { children: ReactNode }) {
  // Empezamos vacío (igual en servidor y en cliente → sin error de hidratación).
  // Justo tras montar cargamos la cache de localStorage y luego el backend.
  const [overrides, setOverrides] = useState<VisibilityOverrides>({});
  const [loading, setLoading]     = useState(true);

  // Cache local: se aplica en el primer efecto, antes de la respuesta del backend.
  useEffect(() => {
    const cached = readCache();
    if (Object.keys(cached).length > 0) setOverrides(cached);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/site-config", { cache: "no-store" });
      const json = await res.json();
      if (json && json.success && json.config && typeof json.config === "object") {
        setOverrides(json.config);
        writeCache(json.config);
      }
    } catch {
      /* backend caído: seguimos con lo que haya (cache o defaults) */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const isVisible = useCallback(
    (key: string) => isVisibleBase(key, overrides),
    [overrides],
  );

  const setOverride = useCallback((key: string, value: boolean) => {
    setOverrides(prev => {
      const next = { ...prev, [key]: value };
      writeCache(next);
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ overrides, isVisible, loading, refresh, setOverride }}>
      {children}
    </Ctx.Provider>
  );
}

export const useVisibility = () => useContext(Ctx);
