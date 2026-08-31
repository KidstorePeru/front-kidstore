"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GameCard from "@/components/ui/GameCard";
import { games, categories } from "@/data";
import { usePreferences } from "@/context/PreferencesContext";
import { useT } from "@/i18n";

export default function AllGamesClient() {
  const t = useT();
  const { lang } = usePreferences();
  const [active, setActive] = useState<string>("all");

  const filtered = active === "all" ? games : games.filter((g) => g.category === active);

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: "var(--text)" }}>
              {t.nav.allGames}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {filtered.length} {lang === "EN" ? "games" : "juegos"} {t.home.available}
            </p>
          </div>

          {/* Filtros por categoría */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActive("all")}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: active === "all" ? "var(--brand)" : "var(--card)",
                border: `1px solid ${active === "all" ? "var(--brand)" : "var(--border)"}`,
                color: active === "all" ? "#fff" : "var(--text-muted)",
              }}
            >
              🎮 {t.nav.allGames}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.slug)}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: c.slug === active ? "var(--brand)" : "var(--card)",
                  border: `1px solid ${c.slug === active ? "var(--brand)" : "var(--border)"}`,
                  color: c.slug === active ? "#fff" : "var(--text-muted)",
                }}
              >
                {c.icon} {lang === "EN" ? c.nameEN : c.name}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div
              className="rounded-2xl p-16 text-center"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <p className="font-bold mb-2" style={{ color: "var(--text)" }}>
                {t.category.comingSoon}
              </p>
              <p className="text-sm" style={{ color: "var(--text-subtle)" }}>
                {t.category.comingSoonDesc}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((game, i) => (
                <GameCard key={game.id} game={game} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
