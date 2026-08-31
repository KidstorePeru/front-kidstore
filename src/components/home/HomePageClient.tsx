"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrustBar from "@/components/home/TrustBar";
import HeroBanner from "@/components/home/HeroBanner";
import OffersSection from "@/components/home/OffersSection";
import GameCard from "@/components/ui/GameCard";
import { games, categories } from "@/data";
import { usePreferences } from "@/context/PreferencesContext";
import { useT } from "@/i18n";

const GRID =
  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4";

export default function HomePageClient() {
  const t = useT();
  const { lang } = usePreferences();

  const popular = games.filter((g) => g.popular);

  return (
    <>
      <Navbar />
      <TrustBar />
      <HeroBanner />

      <main style={{ background: "var(--bg)", minHeight: "60vh" }}>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 pb-16">

          {/* ── Ofertas destacadas ── */}
          <OffersSection />

          {/* ── Categorías ── */}
          <section className="py-8">
            <h2 className="section-title mb-5">{t.home.categories}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl px-3 py-5 text-center transition-all duration-200 hover:-translate-y-1"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                    {lang === "EN" ? cat.nameEN : cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Más populares ── */}
          <section className="py-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">{t.home.mostPopular}</h2>
              <Link
                href="/games"
                className="text-xs font-semibold transition-colors hover:opacity-80"
                style={{ color: "var(--brand)" }}
              >
                {t.home.viewAll}
              </Link>
            </div>
            <div className={GRID}>
              {popular.map((game, i) => (
                <GameCard key={game.id} game={game} index={i} />
              ))}
            </div>
          </section>

          {/* ── Todos los juegos ── */}
          <section className="py-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">
                {t.home.allGames}
                <span className="text-xs font-normal" style={{ color: "var(--text-subtle)" }}>
                  ({games.length} {t.home.available})
                </span>
              </h2>
            </div>
            <div className={GRID}>
              {games.map((game, i) => (
                <GameCard key={game.id} game={game} index={i} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer showExtras />
    </>
  );
}
