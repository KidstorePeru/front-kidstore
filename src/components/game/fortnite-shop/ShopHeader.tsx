"use client";
import { useState } from "react";
import { ClockIcon, CloseIcon, InfoIcon, RefreshIcon, SearchIcon } from "./Icons";
import { formatCountdown, nextShopReset, useNow } from "./hooks";
import { SHOP_LANGS, type ShopLangKey, type ShopText } from "./i18n";
import Slanted from "./Slanted";

// Encabezado centrado sobre el fondo de la tienda (sin recuadro):
// objetos disponibles → "TIENDA DE OBJETOS" → fecha y lotes → contador → buscador, idioma y actualizar.
export default function ShopHeader({
  t,
  shopDate,
  itemCount,
  langKey,
  onLang,
  query,
  onQuery,
  onRefresh,
  loading,
}: {
  t: ShopText;
  shopDate: string | null;
  itemCount: number | null;
  langKey: ShopLangKey;
  onLang: (k: ShopLangKey) => void;
  query: string;
  onQuery: (q: string) => void;
  onRefresh: () => void;
  loading: boolean;
}) {
  const now = useNow();
  const [showInfo, setShowInfo] = useState(false);
  // `date` de la API es la medianoche UTC del día de la tienda: se formatea en UTC.
  const date = new Date(shopDate ?? now).toLocaleDateString(t.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="fns-header">
      {itemCount !== null && (
        <p className="fns-header__eyebrow">
          <Slanted text={t.shopEyebrow(new Intl.NumberFormat(t.locale).format(itemCount))} />
        </p>
      )}
      <h1 className="fns-header__title">
        <Slanted text={t.shopTitle} />
      </h1>

      <div className="fns-header__meta">
        <span suppressHydrationWarning>{date.charAt(0).toUpperCase() + date.slice(1)}</span>
        <button type="button" className="fns-header__info" onClick={() => setShowInfo((v) => !v)} aria-expanded={showInfo}>
          <InfoIcon size={16} />
          {t.giftTitle}
        </button>
      </div>
      {showInfo && <p className="fns-header__note">{t.giftText}</p>}

      <div className="fns-countdown" role="timer" aria-live="off">
        <ClockIcon />
        <span className="fns-countdown__label">{t.changesIn}</span>
        <span className="fns-countdown__time" suppressHydrationWarning>
          {formatCountdown(nextShopReset(now) - now)}
        </span>
      </div>

      <div className="fns-tools">
        <label className="fns-search">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.search}
            autoComplete="off"
          />
          {query && (
            <button type="button" className="fns-icon-button" onClick={() => onQuery("")} aria-label={t.close}>
              <CloseIcon size={16} />
            </button>
          )}
        </label>
        <div className="fns-lang" role="group" aria-label="Idioma / Language">
          {(Object.keys(SHOP_LANGS) as ShopLangKey[]).map((key) => (
            <button
              key={key}
              type="button"
              className={key === langKey ? "is-active" : ""}
              aria-pressed={key === langKey}
              onClick={() => onLang(key)}
            >
              {SHOP_LANGS[key].label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`fns-icon-button fns-refresh${loading ? " is-spinning" : ""}`}
          onClick={onRefresh}
          aria-label={t.refresh}
          title={t.refresh}
        >
          <RefreshIcon />
        </button>
      </div>
    </div>
  );
}
