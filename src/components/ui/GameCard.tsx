"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Game } from "@/types";
import { usePreferences } from "@/context/PreferencesContext";
import { useT } from "@/i18n";

interface GameCardProps {
  game: Game;
  index?: number;
}

const tagStyles: Record<string, string> = {
  "Popular":       "badge-popular",
  "Nuevo":         "badge-nuevo",
  "Oferta":        "badge-oferta",
  "Battle Royale": "badge-popular",
  "MOBA":          "badge-popular",
  "RPG":           "badge-valor",
  "Shooter":       "badge-oferta",
  "Suscripcion":   "badge-nuevo",
};

export default function GameCard({ game, index = 0 }: GameCardProps) {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const minPrice = useMemo(() => Math.min(...game.products.map((p) => p.price)), [game.products]);
  const firstTag = game.tags?.[0];

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group block"
    >
      <div className="game-card h-full">

        {/* Imagen */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={game.image}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          />

          {/* Gradiente permanente abajo */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)",
            }}
          />

          {/* Badge oferta sobre imagen */}
          {game.offer && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold badge-oferta">
                {lang === "EN" ? game.offer.labelEN : game.offer.label}
              </span>
            </div>
          )}

          {/* Tag categoria */}
          {firstTag && (
            <span
              className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                tagStyles[firstTag] ?? "badge-popular"
              }`}
            >
              {firstTag}
            </span>
          )}

          {/* Boton ver en hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <div
              className="w-full py-1.5 rounded-lg text-center text-xs font-bold text-white"
              style={{ background: "rgba(124,58,237,0.85)" }}
            >
              {t.gameCard.viewProducts}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3
            className="font-semibold text-sm leading-tight truncate mb-1 transition-colors group-hover:opacity-80"
            style={{ color: "var(--text)" }}
          >
            {game.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
              {t.gameCard.from}{" "}
              <span className="font-bold" style={{ color: "var(--brand-light)" }}>
                {formatPrice(minPrice)}
              </span>
            </p>
            <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>
              {game.products.length} {t.gameCard.options}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
