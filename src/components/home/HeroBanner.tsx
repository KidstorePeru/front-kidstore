"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePreferences } from "@/context/PreferencesContext";

const slides = [
  {
    id: 1,
    game: "Fortnite",
    label: "Battle Royale",
    labelEN: "Battle Royale",
    description: "Recarga tus V-Bucks al mejor precio. Entrega instantánea garantizada.",
    descriptionEN: "Recharge your V-Bucks at the best price. Instant delivery guaranteed.",
    cta: "Recargar ahora",
    ctaEN: "Recharge now",
    href: "/games/fortnite",
    image: "/games/fortnite.jpg",
    accent: "#3B82F6",
    glow: "59,130,246",
  },
  {
    id: 2,
    game: "Genshin Impact",
    label: "RPG - HoYoverse",
    labelEN: "RPG - HoYoverse",
    description: "Cristales Genesis para invocar tus personajes. Todos los servidores.",
    descriptionEN: "Genesis Crystals to summon your characters. All servers available.",
    cta: "Recargar Genshin",
    ctaEN: "Recharge Genshin",
    href: "/games/genshin-impact",
    image: "/games/genshin-impact.jpg",
    accent: "#A78BFA",
    glow: "124,58,237",
  },
  {
    id: 3,
    game: "Marvel Rivals",
    label: "Shooter - NetEase",
    labelEN: "Shooter - NetEase",
    description: "Consigue Lattice para desbloquear héroes y cosméticos épicos.",
    descriptionEN: "Get Lattice to unlock heroes and epic cosmetics.",
    cta: "Recargar Rivals",
    ctaEN: "Recharge Rivals",
    href: "/games/marvel-rivals",
    image: "/games/marvel-rivals.jpg",
    accent: "#F87171",
    glow: "239,68,68",
  },
  {
    id: 4,
    game: "Roblox",
    label: "Plataforma - Robux",
    labelEN: "Platform - Robux",
    description: "Robux para personalizar tu avatar y acceder a miles de experiencias.",
    descriptionEN: "Robux to customize your avatar and access thousands of experiences.",
    cta: "Comprar Robux",
    ctaEN: "Buy Robux",
    href: "/games/roblox",
    image: "/games/roblox.jpg",
    accent: "#FB923C",
    glow: "251,146,60",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const { lang } = usePreferences();

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setAnimKey((k) => k + 1);
  }, []);

  const prev = useCallback(
    () => goTo((current - 1 + slides.length) % slides.length),
    [current, goTo]
  );
  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, goTo]
  );

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  const s = slides[current];
  const isEN = lang === "EN";

  return (
    <section className="relative overflow-hidden" style={{ minHeight: "460px" }}>

      {/* Game background image */}
      <div className="absolute inset-0 transition-opacity duration-700">
        <Image
          key={s.image}
          src={s.image}
          alt={s.game}
          fill
          className="object-cover object-center kenburns"
          priority
          sizes="100vw"
        />
      </div>

      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.15) 100%)`,
        }}
      />

      {/* Game color overlay */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `linear-gradient(135deg, rgba(${s.glow},0.3) 0%, transparent 60%)`,
        }}
      />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8 flex items-center min-h-[460px]">
        <div
          key={animKey}
          className="max-w-xl py-16"
          style={{ animation: "fadeSlideIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards" }}
        >
          {/* Label */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-[2px] rounded-full" style={{ background: s.accent }} />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: s.accent }}
            >
              {isEN ? s.labelEN : s.label}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-[72px] font-bold text-white leading-[0.95] tracking-tight mb-3">
            {s.game}
          </h1>

          {/* RECHARGE now — brand claim, intentionally in English */}
          <div className="flex items-baseline gap-3 mb-6">
            <span
              className="text-3xl md:text-4xl font-bold tracking-wide uppercase"
              style={{ color: s.accent }}
            >
              RECHARGE
            </span>
            <span className="text-3xl md:text-4xl font-bold text-white/50 italic lowercase tracking-wide">
              now
            </span>
          </div>

          <p className="text-white/70 text-base leading-relaxed mb-8 max-w-md">
            {isEN ? s.descriptionEN : s.description}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={s.href}
              className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
              style={{
                background: `rgba(${s.glow},0.25)`,
                border: `1px solid rgba(${s.glow},0.6)`,
                boxShadow: `0 4px 20px rgba(${s.glow},0.3)`,
                color: s.accent,
              }}
            >
              {isEN ? s.ctaEN : s.cta} →
            </Link>
          </div>
        </div>
      </div>

      {/* Vertical indicators (right side, desktop) */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-2" role="tablist" aria-label="Slides">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-300 overflow-hidden relative"
            style={{
              width: "3px",
              height: i === current ? "32px" : "8px",
              background: "rgba(255,255,255,0.25)",
            }}
          >
            {i === current && (
              <span
                key={animKey}
                className="absolute inset-x-0 top-0 rounded-full"
                style={{
                  background: s.accent,
                  animation: "heroProgress 5.5s linear forwards",
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all hover:scale-110"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 lg:right-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all hover:scale-110"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots (mobile) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2 lg:hidden" role="tablist" aria-label="Slides">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? "20px" : "6px",
              height: "6px",
              background: i === current ? s.accent : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
