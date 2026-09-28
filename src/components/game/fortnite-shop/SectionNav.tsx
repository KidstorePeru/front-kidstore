"use client";
import { memo, useEffect, useRef, useState } from "react";
import { ChevronIcon, FilterIcon } from "./Icons";
import type { ShopCategory } from "./model";
import type { ShopText } from "./i18n";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

type NavProps = {
  categories: ShopCategory[];
  activeSectionId: string | null;
  t: ShopText;
  filterCount: number;
  onToggleFilters: () => void;
  filtersOpen: boolean;
};

// Menú lateral (≥1024 px): columna de puntos que al pasar el ratón se despliega
// con el nombre de cada categoría.
function Rail({ categories, activeSectionId, t, filterCount, onToggleFilters, filtersOpen }: NavProps) {
  const activeIndex = Math.max(0, categories.findIndex((c) => activeSectionId && c.sectionIds.includes(activeSectionId)));
  const listRef = useRef<HTMLUListElement>(null);

  // Mantiene visible el elemento activo dentro de la lista desplegada.
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(".is-active");
    if (list && el) list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.clientHeight / 2;
  }, [activeIndex]);

  return (
    <div className="fns-rail">
      <div className="fns-rail__sticky">
        <div className="fns-rail__inner">
          <button
            type="button"
            className={`fns-rail__filter${filtersOpen ? " is-open" : ""}`}
            onClick={onToggleFilters}
            aria-label={t.filters}
            aria-expanded={filtersOpen}
          >
            <FilterIcon />
            {filterCount > 0 && <span className="fns-rail__badge">{filterCount}</span>}
          </button>

          <div className="fns-rail__hover">
            <nav className="fns-rail__dots" aria-hidden="true">
              {categories.map((c, i) => (
                <span key={c.id} className={`fns-rail__dot${i === activeIndex ? " is-active" : ""}`} />
              ))}
            </nav>
            <nav className="fns-rail__panel" aria-label={t.sections}>
              <ul ref={listRef}>
                {categories.map((c, i) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={i === activeIndex ? "is-active" : ""}
                      onClick={() => scrollToSection(c.sectionIds[0])}
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export const SectionNavRail = memo(Rail);

// Móvil (<1024 px): barra fija con la categoría actual y un desplegable.
export const MobileSectionNav = memo(function MobileSectionNav({
  categories,
  activeSectionId,
  t,
  filterCount,
  onToggleFilters,
}: NavProps) {
  const [open, setOpen] = useState(false);
  const active = categories.find((c) => activeSectionId && c.sectionIds.includes(activeSectionId)) ?? categories[0];

  return (
    <div className="fns-mnav">
      <div className="fns-mnav__bar">
        <button type="button" className="fns-mnav__filter" onClick={onToggleFilters} aria-label={t.filters}>
          <FilterIcon />
          {filterCount > 0 && <span className="fns-rail__badge">{filterCount}</span>}
        </button>
        <button type="button" className="fns-mnav__toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          <span>{active?.label}</span>
          <ChevronIcon up={open} />
        </button>
      </div>
      {open && (
        <ul className="fns-mnav__list">
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={c === active ? "is-active" : ""}
                onClick={() => {
                  setOpen(false);
                  scrollToSection(c.sectionIds[0]);
                }}
              >
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
