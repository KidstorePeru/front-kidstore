"use client";
import { usePreferences } from "@/context/PreferencesContext";
import { es } from "./es";
import { en } from "./en";

export type { Translations } from "./es";

/** Hook principal — usar en cualquier componente cliente */
export function useT() {
  const { lang } = usePreferences();
  return lang === "EN" ? en : es;
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

/** Traducción de las etiquetas de categoría que se muestran en las tarjetas de juego. */
const TAG_EN: Record<string, string> = {
  "Estrategia":  "Strategy",
  "Suscripción": "Subscription",
  "Nuevo":       "New",
};

export function useTag() {
  const { lang } = usePreferences();
  return (tag: string) => lang === "EN" ? (TAG_EN[tag] ?? tag) : tag;
}