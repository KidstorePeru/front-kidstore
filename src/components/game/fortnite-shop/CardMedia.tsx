/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { ImagePreset } from "./model";

const ROTATE_MS = 4500;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(fn: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", fn);
  return () => mq.removeEventListener("change", fn);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
const getReducedMotionServer = () => false;

// Imagen de la tarjeta. Si la oferta tiene varios renders, rota entre ellos con la
// transición "wipe" diagonal de la tienda oficial, solo mientras la tarjeta está en pantalla.
// Nunca hay más de 2 capas y en reposo solo 1: al terminar el barrido se desmonta la anterior
// (las imágenes son PNG transparentes: si quedara se vería detrás).
export default function CardMedia({
  images,
  preset,
  alt,
  active,
}: {
  images: string[];
  preset: ImagePreset;
  alt: string;
  active: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getReducedMotionServer);

  const canRotate = images.length > 1 && active && !reducedMotion;

  useEffect(() => {
    // No se programa otro cambio hasta que termine el barrido en curso.
    if (!canRotate || prev !== null) return undefined;
    let cancelled = false;
    // Desfase aleatorio para que no cambien todas las tarjetas a la vez (≈4,5–6 s).
    const id = setTimeout(() => {
      const next = (index + 1) % images.length;
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        setPrev(index);
        setIndex(next);
      };
      img.src = images[next];
    }, ROTATE_MS + Math.random() * 1500);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [canRotate, index, prev, images]);

  return (
    <div className={`fns-media fns-media--${preset}`}>
      <div className="fns-media__mask">
        {prev !== null && (
          <div className="fns-media__layer fns-media__layer--out" key={`p${prev}`}>
            <img className="fns-media__img" src={images[prev]} alt="" draggable={false} />
          </div>
        )}
        <div
          className={`fns-media__layer${prev !== null ? " fns-media__layer--in" : ""}`}
          key={`c${index}`}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget) setPrev(null);
          }}
        >
          <img className="fns-media__img" src={images[index]} alt={alt} loading="lazy" decoding="async" draggable={false} />
        </div>
      </div>
    </div>
  );
}
