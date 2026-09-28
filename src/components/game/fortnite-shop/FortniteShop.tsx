"use client";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { Anybody } from "next/font/google";
import { usePreferences } from "@/context/PreferencesContext";
import { useFortniteExchangeRate } from "@/hooks/useFortniteExchangeRate";
import ShopHeader from "./ShopHeader";
import ShopSection from "./ShopSection";
import SectionBackgrounds from "./SectionBackgrounds";
import FilterPanel from "./FilterPanel";
import OfferModal from "./OfferModal";
import { MobileSectionNav, SectionNavRail } from "./SectionNav";
import { useActiveSection, useShopData } from "./hooks";
import { buildShop, filterShop, type Offer } from "./model";
import { SHOP_LANGS, type OfferKind, type ShopLangKey } from "./i18n";
import "./fortnite-shop.css";

// Fuente de la tienda: Anybody (Google Fonts, licencia OFL: uso web y comercial libre). Es la
// libre más parecida a Heading Now, la de fortnite.com: grotesca ancha con O/0/G/Q cuadradas y
// eje de anchura. next/font la descarga al compilar y la sirve desde nuestro dominio.
const anybody = Anybody({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--fns-font-anybody",
  display: "swap",
});

// Réplica de la tienda de objetos oficial (orden, tamaños y diseño) con los datos de
// fortnite-api.com. El detalle de cada objeto integra el flujo de compra de KidStore.
export default function FortniteShop() {
  // El idioma de la tienda es el de toda la web (se guarda en localStorage desde PreferencesContext).
  const { lang, setLang } = usePreferences();
  const langKey: ShopLangKey = lang === "EN" ? "en" : "es";
  const t = SHOP_LANGS[langKey];
  const { status, error, entries, date, stale, reload } = useShopData(t.apiLang);

  const shop = useMemo(() => (entries ? buildShop(entries, t) : null), [entries, t]);
  const itemCount = useMemo(
    () => (shop ? shop.sections.reduce((n, s) => n + s.groups.reduce((m, g) => m + g.offers.length, 0), 0) : null),
    [shop],
  );

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [types, setTypes] = useState<Set<OfferKind>>(() => new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [openOffer, setOpenOffer] = useState<Offer | null>(null);

  const visibleShop = useMemo(() => (shop ? filterShop(shop, deferredQuery, types) : null), [shop, deferredQuery, types]);
  const filtering = Boolean(deferredQuery.trim()) || types.size > 0;

  const sectionIds = useMemo(() => visibleShop?.sections.map((s) => s.domId) ?? [], [visibleShop]);
  const activeSectionId = useActiveSection(sectionIds);

  // Precio en la moneda de KidStore para las tarjetas (número estable para no romper el memo).
  const { vbucksToSoles, currencySymbol } = useFortniteExchangeRate();
  const sym = currencySymbol();
  const perVb = Number(vbucksToSoles(100_000)) / 100_000;

  const changeLang = useCallback((key: ShopLangKey) => setLang(key === "en" ? "EN" : "ES"), [setLang]);
  const toggleType = useCallback((kind: OfferKind) => {
    setTypes((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
  }, []);
  const toggleFilters = useCallback(() => setFiltersOpen((v) => !v), []);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);
  const closeOffer = useCallback(() => setOpenOffer(null), []);

  const navProps = {
    categories: visibleShop?.categories ?? [],
    activeSectionId,
    t,
    filterCount: types.size,
    onToggleFilters: toggleFilters,
    filtersOpen,
  };

  return (
    <div className={`fnshop ${anybody.variable}`}>
      {shop && <SectionBackgrounds sections={shop.sections} activeId={activeSectionId} />}

      <div className="fns-shop">
        <div className="fns-frame">
          {visibleShop && <SectionNavRail {...navProps} />}

          <div className="fns-content">
            <ShopHeader
              t={t}
              shopDate={date}
              itemCount={itemCount}
              langKey={langKey}
              onLang={changeLang}
              query={query}
              onQuery={setQuery}
              onRefresh={reload}
              loading={status === "loading"}
            />
            {visibleShop && <MobileSectionNav {...navProps} />}

            {filtersOpen && shop && (
              <FilterPanel
                shop={shop}
                types={types}
                onToggle={toggleType}
                onClear={() => setTypes(new Set())}
                onClose={closeFilters}
                t={t}
              />
            )}

            {shop && stale && (
              <div className="fns-notice" role="status">
                <span>{t.stale}</span>
                <button type="button" className="fns-pill-button" onClick={reload}>
                  {t.retry}
                </button>
              </div>
            )}

            {!shop && status === "loading" && (
              <div className="fns-state">
                <div className="fns-spinner" />
                <p>{t.loading}</p>
              </div>
            )}

            {!shop && status === "error" && (
              <div className="fns-state">
                <h3>{t.error}</h3>
                <p>{error}</p>
                <button type="button" className="fns-pill-button" onClick={reload}>
                  {t.retry}
                </button>
              </div>
            )}

            {visibleShop && visibleShop.sections.length === 0 && (
              <div className="fns-state">
                <p>{t.noResults}</p>
                <button
                  type="button"
                  className="fns-pill-button"
                  onClick={() => {
                    setQuery("");
                    setTypes(new Set());
                  }}
                >
                  {t.clearFilters}
                </button>
              </div>
            )}

            {visibleShop?.sections.map((section) => (
              <ShopSection
                key={section.id}
                section={section}
                t={t}
                onOpen={setOpenOffer}
                filtering={filtering}
                sym={sym}
                perVb={perVb}
              />
            ))}
          </div>
        </div>
      </div>

      {openOffer && <OfferModal offer={openOffer} t={t} onClose={closeOffer} />}
    </div>
  );
}
