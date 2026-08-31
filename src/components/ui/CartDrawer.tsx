"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, Zap, ShoppingCart } from "lucide-react";
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

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalItems, totalPrice, removeItem, updateQty, clearCart } = useCart();
  const { formatPrice, lang } = usePreferences();
  const t = useT();

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const itemLabel = totalItems === 1 ? t.cart.items : t.cart.itemsPlural;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Side panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: "min(420px, 100vw)",
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "-8px 0 48px rgba(0,0,0,0.3)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2.5">
            <ShoppingCart size={18} style={{ color: "var(--brand-light)" }} />
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
              {t.cart.title}
            </p>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
                style={{ background: "var(--brand)" }}>
                {totalItems}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={clearCart}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                style={{ color: "var(--text-subtle)", background: "var(--card)", border: "1px solid var(--border)" }}>
                {t.cart.clear}
              </button>
            )}
            <button onClick={onClose}
              aria-label="Close cart"
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 py-16 text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
                <ShoppingCart size={32} style={{ color: "var(--brand-light)", opacity: 0.5 }} />
              </div>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: "var(--text)" }}>
                  {t.cart.empty}
                </p>
                <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
                  {t.cart.goToShop}
                </p>
              </div>
              <button onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)" }}>
                {t.cart.keepShopping}
              </button>
            </div>
          ) : (
            /* Product list */
            <div className="p-4 space-y-3">
              {items.map((item) => (
                <div key={item.slug}
                  className="rounded-2xl p-3 flex gap-3"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}>

                  {/* Image */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(15,10,40,0.5))" }}>
                    <Image src={item.img} alt={item.name} fill className="object-contain p-1.5" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate leading-tight mb-0.5" style={{ color: "var(--text)" }}>
                      {item.name}
                    </p>
                    <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                        style={{ background: "rgba(124,58,237,0.1)", color: "var(--brand-light)" }}>
                        {lang === "EN" ? (TABLABEL_EN[item.tabLabel] ?? item.tabLabel) : item.tabLabel}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--text-subtle)" }}>
                        {lang === "EN" ? (REGION_EN[item.region] ?? item.region) : item.region}
                      </span>
                    </div>

                    {/* Price + controls */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold" style={{ color: "var(--brand-light)" }}>
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[10px]" style={{ color: "var(--text-subtle)" }}>
                            {formatPrice(item.price)} {t.cart.digital}
                          </p>
                        )}
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQty(item.slug, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
                          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                          {item.quantity === 1 ? <Trash2 size={11} /> : <Minus size={11} />}
                        </button>
                        <span className="text-xs font-bold w-5 text-center" style={{ color: "var(--text)" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.slug, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
                          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer with total and buttons ── */}
        {items.length > 0 && (
          <div className="flex-shrink-0 p-4 space-y-3"
            style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>

            {/* Summary */}
            <div className="rounded-xl p-3 space-y-2"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                <span>{t.cart.subtotal} ({totalItems} {itemLabel})</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
                <span>{t.cart.shipping}</span>
                <span className="text-green-400 font-semibold">{t.cart.shippingFree}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1"
                style={{ borderTop: "1px solid var(--border)", color: "var(--text)", paddingTop: "8px" }}>
                <span>{t.cart.total}</span>
                <span style={{ color: "var(--brand-light)" }}>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={onClose}
                className="py-3 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
                style={{ background:"var(--card)", border:"1.5px solid var(--border)", color:"var(--text-muted)" }}>
                {t.cart.keepShopping}
              </button>
              <Link href="/checkout" onClick={onClose}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02]"
                style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow:"0 4px 16px rgba(124,58,237,0.4)" }}>
                <Zap size={13}/> {t.cart.checkout}
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
