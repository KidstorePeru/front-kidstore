"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, ChevronRight, ChevronDown, Shield, Zap, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { games } from "@/data";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";
import { Product } from "@/types";

const REGIONS = ["Global", "Latinoamerica", "North America", "Europe", "Asia", "SEA"];

const REVIEWS = [
  { id: 1, user: "Carlos M.", rating: 5, comment: "Entrega instantanea, funciono perfecto. Lo recomiendo 100%.", date: "hace 2 dias" },
  { id: 2, user: "Ana G.",    rating: 5, comment: "Muy facil de usar, los codigos llegaron de inmediato.", date: "hace 5 dias" },
  { id: 3, user: "Luis R.",   rating: 4, comment: "Buen precio y servicio rapido. Volvere a comprar.", date: "hace 1 semana" },
  { id: 4, user: "Sofia P.",  rating: 5, comment: "Excelente plataforma, segura y confiable.", date: "hace 2 semanas" },
];

const badgeStyle: Record<string, string> = {
  "Popular":     "badge-popular",
  "Oferta":      "badge-oferta",
  "Mejor valor": "badge-valor",
  "Nuevo":       "badge-nuevo",
};

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= rating ? "text-yellow-400" : "text-gray-600"}
          fill={i <= rating ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  selected,
  onSelect,
  formatPrice,
  lang,
}: {
  product: Product;
  selected: boolean;
  onSelect: () => void;
  formatPrice: (p: number) => string;
  lang: string;
}) {
  const badge = useBadge();
  const originalPrice = product.priceOld ?? (product.discount
    ? product.price / (1 - product.discount / 100)
    : null);

  return (
    <button
      onClick={onSelect}
      className="w-full text-left rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 relative group"
      style={{
        background: selected ? "rgba(124,58,237,0.12)" : "var(--card)",
        border: selected ? "2px solid #7C3AED" : "2px solid var(--border)",
        boxShadow: selected ? "0 0 0 4px rgba(124,58,237,0.08)" : "none",
      }}
    >
      {/* Badge */}
      {product.badge && (
        <span
          className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            badgeStyle[product.badge] ?? "badge-popular"
          }`}
        >
          {badge(product.badge)}
        </span>
      )}

      {/* Descuento */}
      {product.discount && (
        <div
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mb-3"
          style={{
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.3)",
            color: "#6EE7B7",
          }}
        >
          -{product.discount}% OFF
        </div>
      )}

      {/* Cantidad */}
      <p className="text-xl font-bold mb-1" style={{ color: "var(--text)" }}>
        {lang==="EN" ? product.amountEN || product.amount : product.amount}
      </p>

      {/* Nombre */}
      <p className="text-xs mb-3" style={{ color: "var(--text-subtle)" }}>
        {lang==="EN" ? product.descriptionEN || product.description : product.description}
      </p>

      {/* Precio */}
      <div className="flex items-end gap-2">
        <span className="text-lg font-bold" style={{ color: selected ? "#A78BFA" : "var(--brand-light)" }}>
          {formatPrice(product.price)}
        </span>
        {originalPrice && (
          <span className="text-xs line-through mb-0.5" style={{ color: "var(--text-subtle)" }}>
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>

      {/* Check seleccionado */}
      {selected && (
        <div
          className="absolute bottom-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "#7C3AED" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  );
}

export default function GamePageClient({ slug }: { slug: string }) {
  const game = games.find((g) => g.slug === slug);
  if (!game) notFound();

  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [region, setRegion] = useState(REGIONS[0]);
  const [regionOpen, setRegionOpen] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  const minPrice = Math.min(...game.products.map((p) => p.price));
  const avgRating = 4.8;

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

        {/* ── HERO FULLSCREEN ── */}
        <section className="relative overflow-hidden" style={{ height: "70vh", minHeight: "500px" }}>

          {/* Imagen de fondo */}
          <Image
            src={game.banner ?? game.image}
            alt={game.name}
            fill
            className="object-cover object-center"
            priority
          />

          {/* Overlays */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.15) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)" }} />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 z-10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                <Link href="/" className="hover:text-white transition-colors">
                  {t.gamePage.home}
                </Link>
                <ChevronRight size={12} />
                <Link href="/games" className="hover:text-white transition-colors">
                  {t.gamePage.games}
                </Link>
                <ChevronRight size={12} />
                <span className="text-white">{game.name}</span>
              </nav>
            </div>
          </div>

          {/* Contenido hero */}
          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-16 w-full">
              <div className="max-w-2xl">

                {/* Tags */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {game.tags?.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold badge-popular">
                      {tag}
                    </span>
                  ))}
                  {game.offer && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold badge-oferta">
                      {lang === "EN" ? game.offer.labelEN : game.offer.label}
                    </span>
                  )}
                </div>

                {/* Titulo */}
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-3">
                  {game.name}
                </h1>

                {/* Rating + info */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <StarRating rating={5} />
                    <span className="text-sm font-semibold text-white">{avgRating}</span>
                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                      ({REVIEWS.length} {lang === "ES" ? "resenas" : "reviews"})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <Zap size={13} className="text-yellow-400" />
                    <span className="text-xs">{t.gamePage.instantDelivery}</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <Shield size={13} className="text-green-400" />
                    <span className="text-xs">{lang === "ES" ? "Pago seguro" : "Secure payment"}</span>
                  </div>
                </div>

                {/* Precio desde */}
                <p className="mt-4 text-lg font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {t.gamePage.from}{" "}
                  <span className="text-3xl font-bold text-white">{formatPrice(minPrice)}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTENIDO PRINCIPAL ── */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── COLUMNA IZQUIERDA: Productos ── */}
            <div className="lg:col-span-2">

              {/* Selector de region */}
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--text)" }}>
                  {t.gamePage.step1}
                </h3>
                <div className="relative inline-block">
                  <button
                    onClick={() => setRegionOpen(!regionOpen)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    🌍 {region}
                    <ChevronDown size={14} className={`transition-transform ${regionOpen ? "rotate-180" : ""}`} />
                  </button>
                  {regionOpen && (
                    <div
                      className="absolute top-full mt-1 left-0 z-30 rounded-xl overflow-hidden py-1 min-w-[200px]"
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                      }}
                    >
                      {REGIONS.map((r) => (
                        <button
                          key={r}
                          onClick={() => { setRegion(r); setRegionOpen(false); }}
                          className="w-full px-4 py-2.5 text-sm text-left transition-colors flex items-center justify-between"
                          style={{
                            color: r === region ? "var(--brand-light)" : "var(--text-muted)",
                            background: r === region ? "rgba(124,58,237,0.1)" : "transparent",
                          }}
                        >
                          {r}
                          {r === region && <span style={{ color: "var(--brand-light)" }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Grid de productos */}
              <div className="mb-8">
                <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text)" }}>
                  {t.gamePage.step2}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {game.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      selected={selectedProduct?.id === product.id}
                      onSelect={() => setSelectedProduct(product)}
                      formatPrice={formatPrice}
                      lang={lang}
                    />
                  ))}
                </div>
              </div>

              {/* Boton agregar al carrito */}
              <div
                className="sticky bottom-4 z-20 p-4 rounded-2xl"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    {selectedProduct ? (
                      <div>
                        <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
                          {lang === "ES" ? "Seleccionado:" : "Selected:"}
                        </p>
                        <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
                          {selectedProduct.amount} — {formatPrice(selectedProduct.price)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: "var(--text-subtle)" }}>
                        {lang === "ES" ? "Selecciona un paquete" : "Select a package"}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedProduct}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
                    style={{
                      background: selectedProduct
                        ? "linear-gradient(135deg, #7C3AED, #5B21B6)"
                        : "var(--card)",
                      color: selectedProduct ? "white" : "var(--text-subtle)",
                      cursor: selectedProduct ? "pointer" : "not-allowed",
                      boxShadow: selectedProduct ? "0 4px 20px rgba(124,58,237,0.35)" : "none",
                      transform: cartAdded ? "scale(0.97)" : "scale(1)",
                    }}
                  >
                    <ShoppingCart size={16} />
                    {cartAdded
                      ? t.gamePage.added
                      : t.gamePage.addToCart}
                  </button>
                </div>
              </div>
            </div>

            {/* ── COLUMNA DERECHA: Info + Reviews ── */}
            <div className="space-y-6">

              {/* Info card */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text)" }}>
                  {lang === "ES" ? "Por que elegirnos" : "Why choose us"}
                </h3>
                <ul className="space-y-3">
                  {[
                    { icon: <Zap size={15} className="text-yellow-400" />, title: t.gamePage.instantDelivery, desc: lang === "EN" ? "Receive your code in seconds" : "Recibe tu código en segundos" },
                    { icon: <Shield size={15} className="text-green-400" />, title: t.gamePage.securePayment, desc: lang === "EN" ? "Protected transactions" : "Transacciones protegidas" },
                    { icon: <RefreshCw size={15} className="text-blue-400" />, title: t.gamePage.guarantee, desc: t.gamePage.guarantee },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--surface)" }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{item.title}</p>
                        <p className="text-xs" style={{ color: "var(--text-subtle)" }}>{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reviews */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>
                    {lang === "ES" ? "Resenas" : "Reviews"}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={5} size={12} />
                    <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{avgRating}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {REVIEWS.map((review) => (
                    <div
                      key={review.id}
                      className="pb-4"
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA)" }}
                          >
                            {review.user[0]}
                          </div>
                          <span className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                            {review.user}
                          </span>
                        </div>
                        <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>
                          {review.date}
                        </span>
                      </div>
                      <StarRating rating={review.rating} size={11} />
                      <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── JUEGOS RELACIONADOS ── */}
        <section
          className="py-10"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <h2 className="section-title mb-6">
              {lang === "ES" ? "Otros juegos" : "Other games"}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {games
                .filter((g) => g.slug !== slug && g.category === game.category)
                .slice(0, 6)
                .map((g) => {
                  const mp = Math.min(...g.products.map((p) => p.price));
                  return (
                    <Link
                      key={g.id}
                      href={`/games/${g.slug}`}
                      className="group block rounded-xl overflow-hidden transition-all hover:-translate-y-1"
                      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={g.image}
                          alt={g.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>{g.name}</p>
                        <p className="text-xs" style={{ color: "var(--brand-light)" }}>{formatPrice(mp)}</p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
