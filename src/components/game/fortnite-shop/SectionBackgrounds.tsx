/* eslint-disable @next/next/no-img-element */
"use client";
import { memo, useMemo, useState } from "react";
import type { ShopSection } from "./model";

// Las texturas oficiales se pueden pedir redimensionadas al tamaño de la pantalla.
function sized(url: string) {
  if (!url.startsWith("https://cdn2.unrealengine.com/") || typeof window === "undefined") return url;
  const dpr = window.devicePixelRatio || 1;
  const w = Math.min(1920, Math.round(window.innerWidth * dpr));
  const h = Math.min(1200, Math.round(window.innerHeight * dpr));
  return `${url}?resize=1&w=${w}&h=${h}&quality=high`;
}

// Fondo fijo de pantalla completa: cada sección tiene su textura y se hace un fundido de 0,2 s
// al entrar en ella. Solo se cargan la activa y sus vecinas.
function SectionBackgrounds({ sections, activeId }: { sections: ShopSection[]; activeId: string | null }) {
  const urls = useMemo(() => [...new Set(sections.map((s) => s.background))], [sections]);
  const activeUrl = sections.find((s) => s.domId === activeId)?.background ?? urls[0];
  const [mounted, setMounted] = useState<Set<string>>(() => new Set());

  // Una vez cargada, una textura se queda montada (volver a una sección no la descarga otra vez).
  const i = sections.findIndex((s) => s.domId === activeId);
  const near = [sections[i - 1], sections[i], sections[i + 1]].filter(Boolean).map((s) => s.background);
  if (!near.every((u) => mounted.has(u))) setMounted(new Set([...mounted, ...near]));

  return (
    <div className="fns-backgrounds" aria-hidden="true">
      {urls.map((url) => (
        <div key={url} className={`fns-backgrounds__layer${url === activeUrl ? " is-active" : ""}`}>
          {(mounted.has(url) || url === activeUrl) && <img src={sized(url)} alt="" decoding="async" />}
        </div>
      ))}
    </div>
  );
}

export default memo(SectionBackgrounds);
