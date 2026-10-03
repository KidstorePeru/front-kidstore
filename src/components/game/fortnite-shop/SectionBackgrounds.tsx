/* eslint-disable @next/next/no-img-element */
"use client";
import { memo, useMemo, useState } from "react";
import Image from "next/image";
import type { ShopSection } from "./model";
import { backgroundSrc, type SectionBackground } from "./sectionMeta";

// Las texturas oficiales se pueden pedir redimensionadas al tamaño de la pantalla.
function sized(url: string) {
  if (!url.startsWith("https://cdn2.unrealengine.com/") || typeof window === "undefined") return url;
  const dpr = window.devicePixelRatio || 1;
  const w = Math.min(1920, Math.round(window.innerWidth * dpr));
  const h = Math.min(1200, Math.round(window.innerHeight * dpr));
  return `${url}?resize=1&w=${w}&h=${h}&quality=high`;
}

// Las imágenes propias (src/assets/secciones) pasan por next/image: se sirven en WebP/AVIF al
// tamaño de la pantalla en vez del archivo original (algunos PNG pesan casi 2 MB).
function Background({ bg }: { bg: SectionBackground }) {
  if (typeof bg === "string") return <img src={sized(bg)} alt="" decoding="async" />;
  return <Image src={bg} alt="" fill sizes="100vw" loading="eager" />;
}

// Fondo de pantalla completa: cada sección tiene su imagen y se hace un fundido de 0,2 s al entrar
// en ella, como la oficial. Solo se cargan la activa y sus vecinas.
function SectionBackgrounds({ sections, activeId }: { sections: ShopSection[]; activeId: string | null }) {
  const backgrounds = useMemo(() => {
    const bySrc = new Map<string, SectionBackground>();
    for (const s of sections) bySrc.set(backgroundSrc(s.background), s.background);
    return [...bySrc];
  }, [sections]);
  const active = sections.find((s) => s.domId === activeId)?.background ?? sections[0]?.background;
  const activeSrc = active ? backgroundSrc(active) : null;
  const [mounted, setMounted] = useState<Set<string>>(() => new Set());

  // Una vez cargada, una imagen se queda montada (volver a una sección no la descarga otra vez).
  const i = sections.findIndex((s) => s.domId === activeId);
  const near = [sections[i - 1], sections[i], sections[i + 1]].filter(Boolean).map((s) => backgroundSrc(s.background));
  if (!near.every((u) => mounted.has(u))) setMounted(new Set([...mounted, ...near]));

  return (
    <div className="fns-backgrounds" aria-hidden="true">
      {backgrounds.map(([src, bg]) => (
        <div key={src} className={`fns-backgrounds__layer${src === activeSrc ? " is-active" : ""}`}>
          {(mounted.has(src) || src === activeSrc) && <Background bg={bg} />}
        </div>
      ))}
    </div>
  );
}

export default memo(SectionBackgrounds);
