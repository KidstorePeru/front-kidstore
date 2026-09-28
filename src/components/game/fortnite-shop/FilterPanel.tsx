"use client";
import { useEffect, useMemo, useRef } from "react";
import { CloseIcon } from "./Icons";
import type { ShopModel } from "./model";
import type { OfferKind, ShopText } from "./i18n";

const ORDER: OfferKind[] = [
  "outfit", "bundle", "emote", "pickaxe", "backpack", "glider", "wrap",
  "shoe", "sidekick", "jamtrack", "instrument", "car", "other",
];

export default function FilterPanel({
  shop,
  types,
  onToggle,
  onClear,
  onClose,
  t,
}: {
  shop: ShopModel;
  types: Set<OfferKind>;
  onToggle: (k: OfferKind) => void;
  onClear: () => void;
  onClose: () => void;
  t: ShopText;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const c: Partial<Record<OfferKind, number>> = {};
    for (const s of shop.sections) for (const g of s.groups) for (const o of g.offers) c[o.kind] = (c[o.kind] || 0) + 1;
    return c;
  }, [shop]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (ref.current && !ref.current.contains(target) && !target.closest(".fns-rail__filter, .fns-mnav__filter")) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [onClose]);

  return (
    <div className="fns-filters" ref={ref} role="dialog" aria-label={t.filters}>
      <div className="fns-filters__head">
        <span>{t.filters}</span>
        <button type="button" className="fns-icon-button" onClick={onClose} aria-label={t.close}>
          <CloseIcon size={18} />
        </button>
      </div>
      <div className="fns-filters__list">
        {ORDER.filter((k) => counts[k]).map((kind) => (
          <label key={kind} className={`fns-filters__chip${types.has(kind) ? " is-on" : ""}`}>
            <input type="checkbox" checked={types.has(kind)} onChange={() => onToggle(kind)} />
            <span>{t.types[kind]}</span>
            <small>{counts[kind]}</small>
          </label>
        ))}
      </div>
      {types.size > 0 && (
        <button type="button" className="fns-filters__clear" onClick={onClear}>
          {t.clearFilters}
        </button>
      )}
    </div>
  );
}
