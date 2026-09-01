"use client";

import { useEffect, useRef, useState, ReactNode, ElementType } from "react";

interface RevealProps {
  children: ReactNode;
  /** Retardo de entrada en ms (para escalonar listas). */
  delay?: number;
  /** Etiqueta a renderizar (por defecto div). */
  as?: ElementType;
  className?: string;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
  style?: React.CSSProperties;
}

/**
 * Envuelve contenido y lo revela con un fade + slide-up cuando entra
 * en el viewport (una sola vez).
 *
 * Con prefers-reduced-motion, globals.css fuerza [data-reveal] a
 * opacity:1 / transform:none, así que el contenido siempre es visible.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  y = 16,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `translateY(${y}px)`,
        transition:
          "opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
