/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useFortniteExchangeRate } from "@/hooks/useFortniteExchangeRate";
import Price from "./Price";
import Slanted from "./Slanted";
import { BoltIcon, CartIcon, ChatIcon, CheckIcon, ClockIcon, CloseIcon, InfoIcon } from "./Icons";
import { formatCountdown, useNow } from "./hooks";
import type { Offer } from "./model";
import type { ShopText } from "./i18n";

const WA_NUMBER = "51983454837";

// Detalle de la oferta (imágenes, tipo, rareza, precio, tiempo restante, objetos incluidos,
// estilos) + el flujo de compra de KidStore: usuario de Epic → carrito / comprar ahora / WhatsApp.
// En escritorio el detalle se desplaza y la compra queda fija abajo, siempre a la vista.
export default function OfferModal({ offer, t, onClose }: { offer: Offer; t: ShopText; onClose: () => void }) {
  const [imageIndex, setImageIndex] = useState(0);
  // Los estilos de la API son iconos de 128 px: se previsualizan a su tamaño real, sin estirarlos.
  const [variant, setVariant] = useState<{ name: string; image: string } | null>(null);
  const [epicUser, setEpicUser] = useState("");
  const [epicErr, setEpicErr] = useState(false);
  const [added, setAdded] = useState(false);
  const now = useNow();
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const { vbucksToSoles, vbucksToPen, currencySymbol, referentialNote } = useFortniteExchangeRate();

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocus?.focus?.();
    };
  }, [onClose]);

  const outMs = offer.outDate ? new Date(offer.outDate).getTime() - now : null;
  const leftMs = outMs !== null && outMs > 0 ? outMs : 0;
  const leaving = leftMs > 0;
  const mainImage = offer.images[imageIndex];
  const isTrack = offer.kind === "jamtrack";
  const inCart = isInCart(offer.id);
  const meta = [offer.typeLabel, offer.rarityLabel].filter(Boolean).join(" · ");
  const sym = currencySymbol();
  const discounted = offer.price.regular > offer.price.final;
  const localPrice = `${sym} ${vbucksToSoles(offer.price.final)}`;
  const localOld = discounted ? `${sym} ${vbucksToSoles(offer.price.regular)}` : null;

  // Misma forma de ítem que usaba la tienda anterior: el checkout, los pedidos y los correos
  // reconocen tabLabel "Tienda" y orderData.user como usuario de Epic Games.
  function putInCart() {
    addItem({
      slug: offer.id,
      name: offer.title,
      img: offer.images[0],
      price: vbucksToPen(offer.price.final),
      priceOld: vbucksToPen(offer.price.regular),
      region: "Global",
      format: `${offer.price.formattedFinal} V-Bucks`,
      tabLabel: "Tienda",
      orderData: { user: epicUser.trim() },
    });
  }

  function validate() {
    if (!epicUser.trim()) {
      setEpicErr(true);
      return false;
    }
    return true;
  }

  // Un objeto de la tienda solo puede estar una vez en el carrito (se regala de uno en uno).
  function handleAddCart() {
    if (inCart || !validate()) return;
    putInCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  function handleBuyNow() {
    if (inCart) {
      router.push("/checkout");
      return;
    }
    if (!validate()) return;
    putInCart();
    router.push("/checkout");
  }

  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    t.waMsg(offer.title, offer.typeLabel ?? "", offer.price.formattedFinal, localPrice),
  )}`;

  return (
    <div className="fns-modal" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="fns-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fns-modal-title"
        tabIndex={-1}
        ref={dialogRef}
        style={{ "--card-bg": offer.colors.gradient, "--card-text": offer.colors.text } as CSSProperties}
      >
        <button type="button" className="fns-modal__close fns-icon-button" onClick={onClose} aria-label={t.close}>
          <CloseIcon />
        </button>

        {/* ── Imagen ── */}
        <div className={`fns-modal__media${isTrack ? " fns-modal__media--track" : ""}${variant ? " has-style" : ""}`}>
          <div className="fns-modal__glow" aria-hidden="true" />
          <img key={mainImage} className="fns-modal__render" src={mainImage} alt={offer.title} />
          {variant && (
            <div className="fns-modal__style">
              <img src={variant.image} alt={variant.name} width={128} height={128} />
              <span>{t.styleOf(variant.name)}</span>
              <button type="button" className="fns-modal__style-back" onClick={() => setVariant(null)}>
                {t.backToRender}
              </button>
            </div>
          )}
          {offer.images.length > 1 && !variant && (
            <div className="fns-modal__thumbs">
              {offer.images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={i === imageIndex ? "is-active" : ""}
                  onClick={() => setImageIndex(i)}
                  aria-label={`${i + 1} / ${offer.images.length}`}
                  aria-pressed={i === imageIndex}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Detalle (se desplaza) + compra (fija abajo) ── */}
        <div className="fns-modal__info">
          <div className="fns-modal__body">
            <header className="fns-modal__head">
              {meta && <div className="fns-modal__meta">{meta}</div>}
              {offer.subtitle && <div className="fns-modal__subtitle">{offer.subtitle}</div>}
              <h2 id="fns-modal-title" className="fns-modal__title">
                <Slanted text={offer.title} />
              </h2>
              <div className="fns-modal__pricing">
                <Price price={offer.price} t={t} className="fns-modal__price" />
                {offer.pill && (
                  <div
                    className={`fns-card__pill fns-modal__pill${offer.pill.tone === "yellow" ? " fns-card__pill--yellow" : ""}`}
                  >
                    <span>{offer.pill.text}</span>
                  </div>
                )}
              </div>
              {(leaving || offer.setText) && (
                <div className="fns-modal__chips">
                  {leaving && (
                    <span className={`fns-chip${leftMs < 86_400_000 ? " is-urgent" : ""}`}>
                      <ClockIcon size={14} />
                      {t.leavesIn} {formatCountdown(leftMs, t.days)}
                    </span>
                  )}
                  {offer.setText && <span className="fns-chip fns-chip--muted">{offer.setText}</span>}
                </div>
              )}
            </header>

            {offer.description && <p className="fns-modal__desc">{offer.description}</p>}
            {offer.offerTag && <p className="fns-modal__tag">{offer.offerTag}</p>}

            {offer.track && (
              <dl className="fns-modal__track">
                {offer.track.album && (
                  <div>
                    <dt>{t.album}</dt>
                    <dd>{offer.track.album}</dd>
                  </div>
                )}
                {offer.track.year && (
                  <div>
                    <dt>{t.year}</dt>
                    <dd>{offer.track.year}</dd>
                  </div>
                )}
                {offer.track.bpm && (
                  <div>
                    <dt>BPM</dt>
                    <dd>{offer.track.bpm}</dd>
                  </div>
                )}
                {offer.track.duration && (
                  <div>
                    <dt>{t.length}</dt>
                    <dd>
                      {Math.floor(offer.track.duration / 60)}:{String(offer.track.duration % 60).padStart(2, "0")}
                    </dd>
                  </div>
                )}
              </dl>
            )}

            {offer.included.length > 1 && (
              <section className="fns-modal__block">
                <h3>
                  {t.includes} · {t.items(offer.included.length)}
                </h3>
                <ul className="fns-modal__items">
                  {offer.included.map((item, i) => (
                    <li key={`${item.id}-${i}`}>
                      <span className="fns-modal__item-img">
                        {item.image && <img src={item.image} alt="" loading="lazy" />}
                      </span>
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.type}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {offer.variants.length > 0 && (
              <section className="fns-modal__block">
                <h3>{t.selectableStyles}</h3>
                <div className="fns-modal__variants">
                  {offer.variants.map((v, i) => (
                    <button
                      key={`${v.image}-${i}`}
                      type="button"
                      title={v.name}
                      aria-pressed={variant?.image === v.image}
                      className={variant?.image === v.image ? "is-active" : ""}
                      onClick={() => setVariant((cur) => (cur?.image === v.image ? null : v))}
                    >
                      <img src={v.image} alt={v.name} loading="lazy" width={64} height={64} />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {offer.isBundle && (
              <div className="fns-modal__gift">
                <InfoIcon size={16} />
                <p>
                  <strong>{t.giftTitle}</strong> {t.giftText}
                </p>
              </div>
            )}
          </div>

          {/* ── Compra KidStore ── */}
          <div className="fns-buy">
            <div className="fns-buy__head">
              <div className="fns-buy__intro">
                <div className="fns-buy__title">{t.buyTitle}</div>
                <div className="fns-buy__ref">{referentialNote}</div>
              </div>
              <div className="fns-buy__price">
                {localOld && <s>{localOld}</s>}
                <strong>{localPrice}</strong>
              </div>
            </div>

            {inCart ? (
              <p className="fns-buy__note">
                <CheckIcon />
                {t.oneAtATime}
              </p>
            ) : (
              <div className="fns-buy__field">
                <label className="fns-buy__label" htmlFor="fns-epic-user">
                  {t.epicUser} <em>*</em>
                </label>
                <input
                  id="fns-epic-user"
                  className={`fns-buy__input${epicErr ? " is-error" : ""}`}
                  type="text"
                  value={epicUser}
                  placeholder={t.epicPlaceholder}
                  autoComplete="off"
                  aria-invalid={epicErr}
                  aria-describedby="fns-epic-help"
                  onChange={(e) => {
                    setEpicUser(e.target.value);
                    setEpicErr(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleBuyNow()}
                />
                <p id="fns-epic-help" className={`fns-buy__help${epicErr ? " is-error" : ""}`}>
                  {epicErr ? t.epicRequired : t.epicHelp}
                </p>
              </div>
            )}

            <div className="fns-buy__actions">
              <button
                type="button"
                className={`fns-buy__btn fns-buy__btn--cart${added || inCart ? " is-added" : ""}`}
                onClick={handleAddCart}
                disabled={inCart && !added}
              >
                {added || inCart ? <CheckIcon /> : <CartIcon />}
                {added ? t.added : inCart ? t.inCart : t.addToCart}
              </button>
              <div className="fns-buy__row">
                <button type="button" className="fns-buy__btn fns-buy__btn--now" onClick={handleBuyNow}>
                  <BoltIcon />
                  {t.buyNow}
                </button>
                <a className="fns-buy__btn fns-buy__btn--wa" href={waHref} target="_blank" rel="noopener noreferrer">
                  <ChatIcon />
                  {t.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
