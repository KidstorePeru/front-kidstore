"use client";
import { memo, useRef, type CSSProperties } from "react";
import CardMedia from "./CardMedia";
import Price from "./Price";
import { ClockIcon, PlusIcon } from "./Icons";
import { formatClock, useInView, useNow } from "./hooks";
import type { Offer } from "./model";
import type { ShopText } from "./i18n";

// Tiempo que le queda al objeto en la tienda (DD:HH:MM:SS), visible sin abrir el detalle.
// Solo avanza cada segundo mientras la tarjeta está en pantalla.
function LeaveBadge({ outDate, label, live }: { outDate: string; label: string; live: boolean }) {
  const now = useNow(live);
  const ms = new Date(outDate).getTime() - now;
  if (!(ms > 0)) return null;
  const text = formatClock(ms);
  return (
    <div className={`fns-card__leave${ms < 3_600_000 ? " is-urgent" : ""}`} title={`${label} ${text}`}>
      <ClockIcon size={12} />
      <span suppressHydrationWarning>{text}</span>
    </div>
  );
}

function OfferCard({
  offer,
  t,
  onOpen,
  sym,
  perVb,
}: {
  offer: Offer;
  t: ShopText;
  onOpen: (o: Offer) => void;
  sym: string;
  perVb: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const wide = offer.cols > 1;
  const local = `${sym} ${(offer.price.final * perVb).toFixed(2)}`;

  return (
    <div className={`fns-cell fns-cell--${offer.cols}`}>
      <article
        ref={ref}
        className={`fns-card fns-card--${offer.cols} fns-card--${offer.preset}${wide ? " fns-card--wide" : ""}`}
        style={{ "--card-bg": offer.colors.gradient, "--card-text": offer.colors.text } as CSSProperties}
      >
        <div className="fns-card__bg" aria-hidden="true" />
        <CardMedia images={offer.images} preset={offer.preset} alt={offer.title} active={inView} />
        {offer.outDate && <LeaveBadge outDate={offer.outDate} label={t.leavesIn} live={inView} />}

        <div className="fns-card__content">
          <div className="fns-card__info">
            {offer.discountBanner && (
              <div className="fns-card__pill">
                <span>{offer.discountBanner}</span>
              </div>
            )}
            {offer.subtitle && <div className="fns-card__subtitle">{offer.subtitle}</div>}
            <h3 className="fns-card__title">{offer.title}</h3>
            <Price price={offer.price} t={t} local={local} />
          </div>
          {/* Como en la oficial: el "+" solo aparece si hay características que mostrar al pasar el ratón. */}
          {offer.features.length > 0 && (
            <>
              <div className="fns-card__plus" aria-hidden="true">
                <PlusIcon />
              </div>
              <div className="fns-card__features" aria-hidden="true">
                <span>+ {offer.features.join(", ")}</span>
              </div>
            </>
          )}
        </div>

        <button type="button" className="fns-card__hit" onClick={() => onOpen(offer)} aria-label={offer.title} />
      </article>
    </div>
  );
}

export default memo(OfferCard);
