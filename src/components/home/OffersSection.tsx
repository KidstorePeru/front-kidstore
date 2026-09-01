"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePreferences } from "@/context/PreferencesContext";
import { useT } from "@/i18n";
import { games } from "@/data";

export default function OffersSection() {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const offerGames = useMemo(() => games.filter((g) => g.offer), []);

  if (offerGames.length === 0) return null;

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title">
          {t.home.featuredDeals}
        </h2>
        <Link
          href="/games"
          className="arrow-link text-xs font-semibold transition-colors hover:opacity-80"
          style={{ color: "var(--brand)" }}
        >
          {t.home.viewAll.replace("→", "")}
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {offerGames.map((game) => {
          const minPrice = Math.min(...game.products.map((p) => p.price));
          const discounted = game.products.find((p) => p.discount);

          return (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="group relative rounded-2xl overflow-hidden flex gap-4 p-4 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
              }}
            >
              {/* Imagen */}
              <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3
                    className="font-bold text-sm truncate"
                    style={{ color: "var(--text)" }}
                  >
                    {game.name}
                  </h3>
                  {game.offer && (
                    <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold badge-oferta">
                      {lang === "EN" ? game.offer.labelEN : game.offer.label}
                    </span>
                  )}
                </div>

                {game.offer && (
                  <p className="text-xs mb-2" style={{ color: "var(--text-subtle)" }}>
                    {lang === "EN" ? game.offer.descriptionEN : game.offer.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs" style={{ color: "var(--text-subtle)" }}>
                      {t.gameCard.from}{" "}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "var(--brand-light)" }}
                    >
                      {formatPrice(minPrice)}
                    </span>
                  </div>
                  {discounted && (
                    <span className="text-xs font-semibold text-emerald-400">
                      -{discounted.discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{ boxShadow: "inset 0 0 0 1px rgba(124,58,237,0.3)" }}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
