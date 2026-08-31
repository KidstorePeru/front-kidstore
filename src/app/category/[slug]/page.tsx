"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { games } from "@/data";
import { categories } from "@/data/categories";
import { usePreferences } from "@/context/PreferencesContext";
import { useT } from "@/i18n";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: Props) {
  const { slug } = use(params);
  const { formatPrice, lang } = usePreferences();
  const t = useT();

  const cat      = categories.find(c => c.slug === slug);
  if (!cat) notFound();

  const filtered = games.filter(g => g.category === slug);

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{cat.icon}</span>
              <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>{lang === "EN" ? cat.nameEN : cat.name}</h1>
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {filtered.length} {filtered.length === 1 ? t.category.gameAvailable : t.category.gamesAvailable}
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/games"
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              🎮 {t.nav.allGames}
            </Link>
            {categories.map(c => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: c.slug === slug ? "var(--brand)" : "var(--card)",
                  border:     `1px solid ${c.slug === slug ? "var(--brand)" : "var(--border)"}`,
                  color:      c.slug === slug ? "#fff" : "var(--text-muted)",
                }}
              >
                {c.icon} {lang === "EN" ? c.nameEN : c.name}
              </Link>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="rounded-2xl p-16 text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <p className="text-4xl mb-4">{cat.icon}</p>
              <p className="font-bold mb-2" style={{ color: "var(--text)" }}>{t.category.comingSoon}</p>
              <p className="text-sm" style={{ color: "var(--text-subtle)" }}>
                {t.category.comingSoonDesc}
              </p>
              <Link href="/games"
                className="inline-block mt-6 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                style={{ background: "var(--brand)" }}>
                {t.home.allGames}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map(game => {
                const minPrice = Math.min(...game.products.map(p => p.price));
                const count    = game.products.length;
                return (
                  <Link
                    key={game.id}
                    href={`/games/${game.slug}`}
                    className="group rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                  >
                    <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
                      <Image
                        src={game.image}
                        alt={game.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {game.offer && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                          style={{ background: "#EF4444" }}>
                          {lang === "EN" ? game.offer.labelEN : game.offer.label}
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold truncate" style={{ color: "var(--text)" }}>{game.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
                        {t.gameCard.from} {formatPrice(minPrice)}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--text-subtle)" }}>
                        {count} {count === 1 ? t.category.option : t.category.options}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
