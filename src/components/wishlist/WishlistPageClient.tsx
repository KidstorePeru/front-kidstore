"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Trash2, ArrowLeft, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useT } from "@/i18n";

const REGION_EN: Record<string, string> = {
  "Turquía": "Turkey", "Global": "Global", "LAN / LAS": "LAN / LAS",
};
const TABLABEL_EN: Record<string, string> = {
  "Recarga de Pavos": "V-Bucks Recharge", "Paquetes": "Bundles", "Pases": "Passes",
  "Wild Cores": "Wild Cores", "PokéCoins": "PokéCoins", "Cristales de Génesis": "Genesis Crystals",
  "Fotogramas": "Monochrome", "Esquirlas Oníricas": "Oneiric Shards", "Lunita": "Lunite",
  "Lattice": "Lattice", "Tokens": "Tokens", "TFT Coins": "TFT Coins",
  "Nitro": "Nitro", "Mejoras": "Boosts", "Vía Cuenta": "Via Account", "Vía Grupo": "Via Group",
  "Bendición Welkin": "Welkin Blessing",
  "Créditos": "Credits",
};
import { useState } from "react";

function WishCard({ item, onRemove, onAddCart, inCart }: {
  item: WishlistItem;
  onRemove: () => void;
  onAddCart: () => void;
  inCart: boolean;
}) {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const disc = Math.round((1 - item.price / item.priceOld) * 100);
  const label = lang === "EN" ? (TABLABEL_EN[item.tabLabel] ?? item.tabLabel) : item.tabLabel;
  const region = lang === "EN" ? (REGION_EN[item.region] ?? item.region) : item.region;
  const [added, setAdded] = useState(false);

  function handleCart() {
    onAddCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col group transition-all duration-200 hover:-translate-y-1"
      style={{ background:"var(--card)", border:"1px solid var(--border)" }}>

      {/* Image */}
      <div className="relative w-full overflow-hidden"
        style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(15,10,40,0.6))" }}>
        <Link href={`/games/${item.gameSlug}/${item.slug}`}>
          <Image src={item.img} alt={item.name} fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"/>
        </Link>
        {/* Remove button */}
        <button onClick={onRemove}
          className="absolute top-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
          style={{ background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)" }}>
          <X size={14} style={{ color:"#EF4444" }}/>
        </button>
        {/* Discount badge */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#4ADE80" }}>
          -{disc}%
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div>
          <p className="text-xs font-semibold mb-0.5" style={{ color:"var(--brand-light)" }}>
            {item.game} · {label}
          </p>
          <Link href={`/games/${item.gameSlug}/${item.slug}`}>
            <p className="text-sm font-bold leading-tight hover:opacity-80 transition-opacity"
              style={{ color:"var(--text)" }}>{item.name}</p>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-md font-medium"
              style={{ background:"var(--surface)", color:"var(--text-subtle)", border:"1px solid var(--border)" }}>
              {item.format}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md font-medium"
              style={{ background:"var(--surface)", color:"var(--text-subtle)", border:"1px solid var(--border)" }}>
              {region}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mt-auto">
          <p className="text-lg font-bold" style={{ color:"var(--brand-light)" }}>{formatPrice(item.price)}</p>
          <p className="text-xs line-through mb-0.5" style={{ color:"var(--text-subtle)" }}>{formatPrice(item.priceOld)}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button onClick={handleCart}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
            style={{
              background: inCart ? "rgba(124,58,237,0.1)" : "var(--surface)",
              border:`1.5px solid ${inCart ? "#7C3AED" : "var(--border)"}`,
              color:"var(--brand-light)",
            }}>
            <ShoppingCart size={13}/>
            {added ? t.product.added : inCart ? t.product.inCart : t.wishlist.toCart}
          </button>
          <Link href={`/games/${item.gameSlug}/${item.slug}`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02]"
            style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)" }}>
            {t.wishlist.viewProduct}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const { items, removeItem, clearAll } = useWishlist();
  const { addItem, isInCart } = useCart();
  const t = useT();
  const router = useRouter();

  const savedLabel = items.length === 0
    ? t.wishlist.noSaved
    : `${items.length} ${items.length === 1 ? t.wishlist.savedItem : t.wishlist.savedItems}`;

  function handleAddToCart(item: WishlistItem) {
    addItem({
      slug:     item.slug,
      name:     item.name,
      img:      item.img,
      price:    item.price,
      priceOld: item.priceOld,
      region:   item.region,
      format:   item.format,
      tabLabel: item.tabLabel,
    });
  }

  return (
    <>
      <Navbar />
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background:"rgba(239,68,68,0.1)", border:"1.5px solid rgba(239,68,68,0.25)" }}>
                <Heart size={20} fill="#EF4444" style={{ color:"#EF4444" }}/>
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color:"var(--text)" }}>{t.wishlist.title}</h1>
                <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{savedLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {items.length > 0 && (
                <button onClick={clearAll}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                  style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--text-subtle)" }}>
                  <Trash2 size={13}/> {t.wishlist.clearList}
                </button>
              )}
              <button onClick={() => router.back()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
                <ArrowLeft size={13}/> {t.wishlist.keepShopping}
              </button>
            </div>
          </div>

          {/* Empty state */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{ background:"rgba(239,68,68,0.06)", border:"1.5px solid rgba(239,68,68,0.15)" }}>
                <Heart size={40} style={{ color:"#EF4444", opacity:0.3 }}/>
              </div>
              <div>
                <p className="text-base font-bold mb-1" style={{ color:"var(--text)" }}>
                  {t.wishlist.empty}
                </p>
                <p className="text-sm" style={{ color:"var(--text-subtle)" }}>
                  {t.wishlist.emptyDesc}
                </p>
              </div>
              <button onClick={() => router.back()}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow:"0 4px 20px rgba(124,58,237,0.3)" }}>
                {t.wishlist.explore}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {items.map(item => (
                <WishCard
                  key={item.slug}
                  item={item}
                  onRemove={() => removeItem(item.slug)}
                  onAddCart={() => handleAddToCart(item)}
                  inCart={isInCart(item.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
