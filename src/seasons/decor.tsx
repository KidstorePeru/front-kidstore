"use client";
// Puntos de la web donde van adornos de temporada. Fuera de temporada no renderizan nada y su
// código (src/seasons/<id>/) no se descarga: se carga bajo demanda con next/dynamic.
import dynamic from "next/dynamic";
import { useSeason } from "./SeasonContext";
import type { SkyVariant } from "./halloween/Decor";

const HalloweenSky = dynamic(() => import("./halloween/Decor").then((m) => m.HalloweenSky), { ssr: false });
const HalloweenChip = dynamic(() => import("./halloween/Decor").then((m) => m.HalloweenChip), { ssr: false });
const HalloweenGreeting = dynamic(() => import("./halloween/Decor").then((m) => m.HalloweenGreeting), { ssr: false });

/** Cielo de temporada dentro de una cabecera (position: relative + overflow: hidden). */
export function SeasonSky({ variant }: { variant: SkyVariant }) {
  return useSeason() === "halloween" ? <HalloweenSky variant={variant} /> : null;
}

/** Etiqueta de la temporada (portada). */
export function SeasonChip() {
  return useSeason() === "halloween" ? <HalloweenChip /> : null;
}

/** Saludo de la temporada en el pie de página. */
export function SeasonGreeting() {
  return useSeason() === "halloween" ? <HalloweenGreeting /> : null;
}
