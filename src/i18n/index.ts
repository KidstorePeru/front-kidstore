"use client";
import { usePreferences } from "@/context/PreferencesContext";
import { es } from "./es";
import { en } from "./en";

export { es, en };
export type { Translations } from "./es";

/** Hook principal — usar en cualquier componente cliente */
export function useT() {
  const { lang } = usePreferences();
  return lang === "EN" ? en : es;
}

/** Para componentes de servidor — pasar lang como parámetro */
export function getT(lang: "ES" | "EN") {
  return lang === "EN" ? en : es;
}

/**
 * Helper para leer campos bilingües en los datos del catálogo.
 * Uso: const loc = useLocale(); loc(p.description, p.descriptionEN)
 * Si el campo EN no existe, cae de vuelta al ES.
 */
export function useLocale() {
  const { lang } = usePreferences();
  return function loc<T>(esVal: T, enVal?: T): T {
    return lang === "EN" && enVal !== undefined ? enVal : esVal;
  };
}

/**
 * Versión sin hook — para server components o fuera de React.
 * Uso: localize(lang, p.description, p.descriptionEN)
 */
export function localize<T>(lang: "ES" | "EN", esVal: T, enVal?: T): T {
  return lang === "EN" && enVal !== undefined ? enVal : esVal;
}

/** Badge translation map — translates Spanish badges to English */
const BADGE_EN: Record<string, string> = {
  "Popular":     "Popular",
  "Oferta":      "Sale",
  "Mejor valor": "Best value",
  "Nuevo":       "New",
};

export function useBadge() {
  const { lang } = usePreferences();
  return (badge: string) => lang === "EN" ? (BADGE_EN[badge] ?? badge) : badge;
}