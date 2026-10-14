"use client";
// Adornos de Halloween (SVG livianos y decorativos). Este archivo solo se descarga cuando la
// temporada está activa (next/dynamic desde src/seasons/decor.tsx). Estilos: public/seasons/halloween.css.
import { useId } from "react";
import { usePreferences } from "@/context/PreferencesContext";

export type SkyVariant = "hero" | "game" | "band" | "auth";

const BAT_PATH =
  "M12 3L13 1.5L13.6 3.4C15 2.6 16.8 2.2 18.5 2.6C20.5 3 22.5 4.4 24 6.5C22.6 5.9 21.2 6 20.2 6.8C19.2 6.3 17.9 6.6 17.3 7.6C16.2 7.1 14.9 7.6 14.4 8.7C13.6 8.9 12.7 9.6 12 10.8C11.3 9.6 10.4 8.9 9.6 8.7C9.1 7.6 7.8 7.1 6.7 7.6C6.1 6.6 4.8 6.3 3.8 6.8C2.8 6 1.4 5.9 0 6.5C1.5 4.4 3.5 3 5.5 2.6C7.2 2.2 9 2.6 10.4 3.4L11 1.5Z";

const WEB_PATH =
  "M0 0L100 0M0 0L92.4 38.3M0 0L70.7 70.7M0 0L38.3 92.4M0 0L0 100M22 0Q17.3 3.4 20.3 8.4Q14.6 9.8 15.6 15.6Q9.8 14.6 8.4 20.3Q3.4 17.3 0 22M42 0Q33 6.6 38.8 16.1Q27.9 18.7 29.7 29.7Q18.7 27.9 16.1 38.8Q6.6 33 0 42M62 0Q48.6 9.7 57.3 23.7Q41.2 27.6 43.8 43.8Q27.6 41.2 23.7 57.3Q9.7 48.6 0 62M82 0Q64.3 12.8 75.8 31.4Q54.5 36.4 58 58Q36.4 54.5 31.4 75.8Q12.8 64.3 0 82";

function Moon() {
  const id = useId().replace(/:/g, "");
  return (
    <svg className="hw-moon" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`m${id}`} cx="40%" cy="36%" r="68%">
          <stop offset="0" stopColor="#FFFBEB" />
          <stop offset="0.65" stopColor="#FDE68A" />
          <stop offset="1" stopColor="#F5B544" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#m${id})`} />
      <circle cx="35" cy="40" r="7" fill="#EBC764" opacity="0.5" />
      <circle cx="61" cy="60" r="10" fill="#EBC764" opacity="0.42" />
      <circle cx="60" cy="29" r="4.5" fill="#EBC764" opacity="0.48" />
      <circle cx="40" cy="68" r="3.5" fill="#EBC764" opacity="0.45" />
    </svg>
  );
}

function Bat({ n }: { n: number }) {
  return (
    <span className={`hw-bat hw-bat-${n}`}>
      <svg viewBox="0 0 24 12" aria-hidden="true" focusable="false">
        <g className="hw-bat-wings"><path d={BAT_PATH} /></g>
      </svg>
    </span>
  );
}

function Web({ side }: { side: "tl" | "tr" }) {
  return (
    <svg className={`hw-web hw-web-${side}`} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path d={WEB_PATH} />
    </svg>
  );
}

function Spider() {
  return (
    <span className="hw-spider">
      <svg viewBox="0 0 30 150" aria-hidden="true" focusable="false">
        <path className="hw-spider-thread" d="M15 0V122" />
        <g className="hw-spider-body">
          <path d="M15 128L5 120M15 130H3M15 132L5 140M15 134L8 146M15 128L25 120M15 130H27M15 132L25 140M15 134L22 146" />
          <circle cx="15" cy="132" r="6" />
          <circle cx="15" cy="124.5" r="3.6" />
        </g>
      </svg>
    </span>
  );
}

export function Pumpkin({ className }: { className?: string }) {
  return (
    <svg className={`hw-pumpkin ${className ?? ""}`} viewBox="0 0 64 58" aria-hidden="true" focusable="false">
      <path d="M31 10c-1-5 2-9 7-9l1 3c-3 0-5 2-4 6z" fill="#4D7C0F" />
      <ellipse cx="19" cy="34" rx="15" ry="21" fill="#C2410C" />
      <ellipse cx="45" cy="34" rx="15" ry="21" fill="#C2410C" />
      <ellipse cx="32" cy="34" rx="15" ry="23" fill="#F97316" />
      <path className="hw-pumpkin-face" d="M18 28l6-7 6 7zM34 28l6-7 6 7zM16 40q16 12 32 0l-4 7-4-3-4 4-4-4-4 4-4-4-4 3z" />
    </svg>
  );
}

/** Cielo de noche (portada, cabeceras de juego y de páginas, ingreso). */
export function HalloweenSky({ variant }: { variant: SkyVariant }) {
  const full = variant === "hero";
  const bats = variant === "hero" ? [1, 2, 3, 4, 5] : variant === "game" ? [1, 2, 3, 4] : [1, 2, 3];
  return (
    <div className={`hw-sky hw-sky--${variant}`} aria-hidden="true">
      <div className="hw-stars" />
      <Moon />
      {(full || variant === "game") && <div className="hw-witch" />}
      {bats.map((n) => <Bat key={n} n={n} />)}
      {variant !== "auth" && <Web side="tl" />}
      <Web side="tr" />
      {(full || variant === "game") && <Spider />}
      <div className="hw-fog" />
      <div className="hw-graveyard" />
      {(full || variant === "game") && (
        <div className="hw-pumpkins">
          <Pumpkin className="hw-pumpkin-a" />
          <Pumpkin className="hw-pumpkin-b" />
        </div>
      )}
    </div>
  );
}

/** Etiqueta «🎃 Temporada de Halloween». */
export function HalloweenChip() {
  const { lang } = usePreferences();
  return (
    <span className="hw-chip">
      <span aria-hidden="true">🎃</span> {lang === "EN" ? "Halloween season" : "Temporada de Halloween"}
    </span>
  );
}

/** Saludo del pie de página. */
export function HalloweenGreeting() {
  const { lang } = usePreferences();
  return (
    <p className="hw-greeting">
      <Pumpkin className="hw-greeting-pumpkin" />
      <span>{lang === "EN" ? "Happy Halloween! Thanks for shopping at KidStorePeru" : "¡Feliz Halloween! Gracias por comprar en KidStorePeru"}</span>
      <Pumpkin className="hw-greeting-pumpkin" />
    </p>
  );
}
