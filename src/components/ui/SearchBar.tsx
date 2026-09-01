"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useTag } from "@/i18n";
import { games, categories } from "@/data";

export default function SearchBar() {
  const [query, setQuery]         = useState("");
  const [open, setOpen]           = useState(false);
  const [catFilter, setCatFilter] = useState("all");
  const { formatPrice, lang }     = usePreferences();
  const t                         = useT();
  const tag                       = useTag();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => games.filter((g) => {
    const matchQuery = g.name.toLowerCase().includes(debouncedQuery.toLowerCase());
    const matchCat   = catFilter === "all" || g.category === catFilter;
    return matchQuery && matchCat;
  }), [debouncedQuery, catFilter]);

  const showDropdown = open && (query.length > 0 || catFilter !== "all");

  return (
    <div className="relative w-full max-w-2xl" ref={ref}>
      <div className="relative flex h-10">
        <input
          type="text"
          placeholder={t.search.placeholder}
          aria-label={t.search.placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          className="w-full pl-4 pr-10 text-sm outline-none rounded-l-lg transition-colors"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRight: "none",
            color: "var(--text)",
          }}
        />

        {/* Clear */}
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            className="absolute right-[88px] top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
            style={{ color: "var(--text-subtle)" }}
          >
            <X size={13} />
          </button>
        )}

        {/* Category filter */}
        <select
          value={catFilter}
          onChange={(e) => { setCatFilter(e.target.value); setOpen(true); }}
          aria-label="Category filter"
          className="px-2 text-xs outline-none cursor-pointer border-t border-b transition-colors"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--text-muted)",
            minWidth: "72px",
          }}
        >
          <option value="all">{t.search.all}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {lang === "EN" ? cat.nameEN : cat.name}
            </option>
          ))}
        </select>

        {/* Search button */}
        <button aria-label="Search" className="w-11 flex items-center justify-center rounded-r-lg btn-primary flex-shrink-0">
          <Search size={16} className="text-white" />
        </button>
      </div>

      {/* Results dropdown */}
      {showDropdown && (
        <div
          className="absolute top-full mt-2 left-0 right-0 z-50 rounded-2xl overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
          }}
        >
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm" style={{ color: "var(--text-subtle)" }}>
                {t.search.noResults}
              </p>
            </div>
          ) : (
            <>
              <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="text-xs font-semibold" style={{ color: "var(--text-subtle)" }}>
                  {results.length} {t.search.results}
                </span>
                <SlidersHorizontal size={13} style={{ color: "var(--text-subtle)" }} />
              </div>

              <ul className="max-h-80 overflow-y-auto py-1">
                {results.slice(0, 8).map((game) => {
                  const minPrice = Math.min(...game.products.map((p) => p.price));
                  return (
                    <li key={game.id}>
                      <Link
                        href={`/games/${game.slug}`}
                        onClick={() => { setOpen(false); setQuery(""); }}
                        className="flex items-center gap-3 px-4 py-2.5 transition-colors group"
                        style={{ color: "var(--text)" }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.background = "var(--card)")
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.background = "transparent")
                        }
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={game.image} alt={game.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>
                            {game.name}
                          </p>
                          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
                            {game.products.length}{" "}
                            {t.search.optionsFrom}{" "}
                            <span style={{ color: "var(--brand-light)" }}>
                              {formatPrice(minPrice)}
                            </span>
                          </p>
                        </div>
                        {game.tags?.[0] && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 badge-popular">
                            {tag(game.tags[0])}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {results.length > 8 && (
                <div style={{ borderTop: "1px solid var(--border)" }}>
                  <Link
                    href={`/games?q=${query}&cat=${catFilter}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center py-3 text-xs font-semibold transition-colors hover:opacity-80"
                    style={{ color: "var(--brand)" }}
                  >
                    {t.search.seeAll} {results.length} {t.search.seeAllSuffix} →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
