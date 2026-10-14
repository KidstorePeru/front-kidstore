"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GameCard from "@/components/ui/GameCard";
import { games, categories } from "@/data";
import { usePreferences } from "@/context/PreferencesContext";
import { useVisibility } from "@/context/VisibilityContext";
import { gameKey } from "@/config/visibility";
import { useT } from "@/i18n";
import { gameMatches } from "@/lib/search";
import { SeasonSky } from "@/seasons/decor";

export default function AllGamesClient() {
  const t = useT();
  const { lang } = usePreferences();
  const { isVisible } = useVisibility();
  // Filtros en la URL (?cat=rpg&q=robux): el buscador de la barra superior enlaza aquí.
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("cat") || "all";
  const query  = params.get("q") ?? "";
  const setFilters = (cat: string, q: string) => {
    const next = new URLSearchParams();
    if (cat !== "all") next.set("cat", cat);
    if (q) next.set("q", q);
    router.replace(next.size ? `/games?${next}` : "/games", { scroll: false });
  };
  const setActive = (cat: string) => setFilters(cat, query);

  const visibleGames = games.filter((g) => isVisible(gameKey(g.slug)));
  const filtered = visibleGames.filter((g) => (active === "all" || g.category === active) && gameMatches(g, query));

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">

          {/* Header */}
          <div className="mb-8 season-band season-band--pad">
            <SeasonSky variant="band" />
            <h1 className="text-3xl font-bold season-title" style={{ color: "var(--text)" }}>
              {t.nav.allGames}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {filtered.length} {lang === "EN" ? "games" : "juegos"} {t.home.available}
            </p>
            {query && (
              <button onClick={() => setFilters(active, "")}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-80"
                style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
                {lang === "EN" ? "Results for" : "Resultados para"} «{query}» <span aria-hidden>✕</span>
              </button>
            )}
          </div>

          {/* Filtros por categoría */}
          <div className="flex flex-wrap gap-2 mb-8 season-filter">
            <button
              onClick={() => setActive("all")}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: active === "all" ? "var(--primary)" : "var(--card)",
                border: `1px solid ${active === "all" ? "var(--primary)" : "var(--border)"}`,
                color: active === "all" ? "var(--on-primary)" : "var(--text-muted)",
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
                  background: c.slug === active ? "var(--primary)" : "var(--card)",
                  border: `1px solid ${c.slug === active ? "var(--primary)" : "var(--border)"}`,
                  color: c.slug === active ? "var(--on-primary)" : "var(--text-muted)",
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
                {query ? (lang === "EN" ? "No games match your search" : "No hay juegos que coincidan con tu búsqueda") : t.category.comingSoon}
              </p>
              <p className="text-sm" style={{ color: "var(--text-subtle)" }}>
                {query ? (lang === "EN" ? "Try another word, like the game or currency name." : "Prueba con otra palabra, como el nombre del juego o de la moneda.") : t.category.comingSoonDesc}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 season-section season-grid">
              {filtered.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
