// src/pages/fortnite/FortniteProductLayout.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import CategoryShell from "../../components/layout/CategoryShell";
import { useCart } from "../../context/CartContext";
import { useLang } from "../../context/LangContext";
import { usePriceConverter } from "../../hooks/usePriceConverter";

export type FnProduct = {
  id:       string;
  name:     string;
  desc:     string;
  pricePEN: number;
  image:    string;
};

/* ─── Card de producto ─── */
const ShopCard = ({ product, onAdd }: { product: FnProduct; onAdd: () => void }) => {
  const { format } = usePriceConverter();
  const { t }      = useLang();

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-blue-500/50 transition group flex flex-col h-full">
      <div className="relative overflow-hidden rounded-xl mb-4 aspect-square bg-black/30 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transform group-hover:scale-110 transition duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const next = (e.target as HTMLImageElement).nextElementSibling;
              if (next) next.classList.remove("hidden");
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/20 ${product.image ? "hidden" : "flex"}`}>
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span className="text-[9px] uppercase font-bold tracking-widest">{t("product", "imageHere")}</span>
        </div>
      </div>

      <h3 className="font-bold leading-tight min-h-[40px] mb-2">
        {product.name.split('\n')[0] && (
          <span className="block text-white text-sm md:text-base">
            {product.name.split('\n')[0]}
          </span>
        )}

        {product.name.split('\n')[1] && (
          <span className="block text-[#107C10] text-xs md:text-sm">
            {product.name.split('\n')[1]}
          </span>
        )}
      </h3>

      <div className="mt-auto flex items-center justify-between mb-3">
        <p className="text-blue-300 font-black text-xl tracking-tight">
          {format(product.pricePEN)}
        </p>
        <span className="text-[10px] uppercase font-bold opacity-50 bg-black/20 px-2 py-0.5 rounded text-white">
          Fortnite
        </span>
      </div>

      <button
        onClick={onAdd}
        className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs font-bold uppercase transition active:scale-95 text-white cursor-pointer"
      >
        {t("fortnite", "addCartBtn")}
      </button>
    </div>
  );
};

/* ─── Modal de imagen ejemplo ─── */
const ImageModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useLang();
  return (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="relative max-w-2xl w-full mx-4"
      onClick={e => e.stopPropagation()}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute -top-3 -right-3 z-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center transition cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <div className="rounded-2xl overflow-hidden border border-amber-500/30 bg-black">
        <img
          src="/images/ejemplo.jpg"
          alt="Ejemplo región TRY"
          className="w-full object-contain max-h-[80vh]"
        />
      </div>
      <p className="text-center text-amber-300/60 text-xs mt-2">
        {t("fortnite", "tryImgCaption")}
      </p>
    </div>
  </div>
  );
};

/* ─── Aviso Lira Turca (TRY) ─── */
const TryNotice = () => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useLang();

  return (
    <>
      {showModal && <ImageModal onClose={() => setShowModal(false)} />}

      <div className="w-full bg-amber-500/10 border border-amber-500/40 rounded-xl p-5 text-left relative">

        {/* Botón esquina superior derecha */}
        <button
          onClick={() => setShowModal(true)}
          className="absolute top-3 right-3 flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          {t("fortnite", "tryBtn")}
        </button>

        {/* Texto del aviso */}
        <div className="space-y-3 pr-36">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇹🇷</span>
            <p
              className="font-black text-amber-300 uppercase tracking-wide text-sm"
              style={{ fontFamily: "'BurbankBig','Arial Black',sans-serif" }}
            >
              {t("fortnite", "tryTitle")}
            </p>
          </div>
          <ul className="space-y-2 text-sm text-amber-200/80">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5 shrink-0">•</span>
              <span>{t("fortnite", "tryLine1")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5 shrink-0">•</span>
              <span>{t("fortnite", "tryLine2")}</span>
            </li>
          </ul>

        </div>

      </div>
    </>
  );
};

/* ─── Aviso Pase de Batalla (48h) ─── */
const BPNotice = () => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useLang();

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div className="relative max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              className="absolute -top-3 -right-3 z-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center transition cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <div className="rounded-2xl overflow-hidden border border-yellow-500/30 bg-black">
              <img src="/images/ejemplo-pase.jpg" alt="Ejemplo restricción cuenta" className="w-full object-contain max-h-[80vh]" />
            </div>
            <p className="text-center text-yellow-300/60 text-xs mt-2">Ejemplo de error o restricción en cuenta</p>
          </div>
        </div>
      )}

      <div className="w-full bg-yellow-500/10 border border-yellow-500/40 rounded-xl p-5 text-left relative">

        {/* Botón esquina superior derecha */}
        <button
          onClick={() => setShowModal(true)}
          className="absolute top-3 right-3 flex items-center gap-1.5 bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-400/40 text-yellow-300 text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          {t("fortnite", "tryBtn")}
        </button>

        {/* Texto del aviso */}
        <div className="space-y-3 pr-36">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <p
              className="font-black text-yellow-300 uppercase tracking-wide text-sm"
              style={{ fontFamily: "'BurbankBig','Arial Black',sans-serif" }}
            >
              {t("fortnite", "bpNoticeTitle")}
            </p>
          </div>
          <ul className="space-y-2 text-sm text-yellow-200/80">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5 shrink-0">•</span>
              <span>{t("fortnite", "bpNoticeLine1")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5 shrink-0">•</span>
              <span>{t("fortnite", "bpNoticeLine2")}</span>
            </li>
          </ul>
        </div>

      </div>
    </>
  );
};

/* ─── Layout principal ─── */
interface Props {
  title:    string;
  info:     string;
  products: FnProduct[];
  infoBox?: ReactNode;
  variant?: "pavos" | "packs" | "pase";
}

const FortniteProductLayout = ({ title, products, infoBox, variant }: Props) => {
  const navigate      = useNavigate();
  const { addToCart } = useCart();
  const { t }         = useLang();
  const { cartPrice } = usePriceConverter();

  const notice = variant === "pase" ? <BPNotice /> : <TryNotice />;

  return (
    <CategoryShell
      title={title}
      subtitle=""
      notice={notice}
    >
      {/* Breadcrumb */}
      <button
        onClick={() => navigate("/fortnite")}
        className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-bold mb-8 transition cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        {t("fortnite", "backHome")} / <span className="text-white">{title}</span>
      </button>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ShopCard
            key={product.id}
            product={product}
            onAdd={() =>
              addToCart({
                id:       product.id,
                name:     product.name,
                price:    cartPrice(product.pricePEN),
                image:    product.image,
              })
            }
          />
        ))}
      </div>

      {infoBox && <div className="mt-10">{infoBox}</div>}
    </CategoryShell>
  );
};

export default FortniteProductLayout;
