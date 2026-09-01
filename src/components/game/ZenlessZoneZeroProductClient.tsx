"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight, ShoppingCart, Info,
  Shield, Zap, MessageCircle,
  Check, Heart, Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_ZZZ_PRODUCTS } from "@/data/zenlesszonezero";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

const ZZZ_STYLE = `
  :root, [data-theme="light"] {
    --zzz-text:      #4A7C00;
    --zzz-text-dim:  #5A9400;
    --zzz-dark:      #3A6000;
    --zzz-bg:        rgba(74, 124, 0, 0.08);
    --zzz-border:    rgba(74, 124, 0, 0.28);
    --zzz-btn-bg:    linear-gradient(135deg, #3A6000, #5A9400);
    --zzz-btn-color: #ffffff;
    --zzz-glow:      rgba(74, 124, 0, 0.2);
    --zzz-card-bg:   rgba(74, 124, 0, 0.06);
  }
  [data-theme="dark"] {
    --zzz-text:      #C8FF00;
    --zzz-text-dim:  rgba(200,255,0,0.88);
    --zzz-dark:      #8AB800;
    --zzz-bg:        rgba(200, 255, 0, 0.07);
    --zzz-border:    rgba(200, 255, 0, 0.25);
    --zzz-btn-bg:    linear-gradient(135deg, #3A4A00, #8AB800);
    --zzz-btn-color: #C8FF00;
    --zzz-glow:      rgba(200, 255, 0, 0.18);
    --zzz-card-bg:   rgba(200, 255, 0, 0.05);
  }
`;

const TABS = [
  { id:"fotogramas", label:"📷 Monochrome"       },
  { id:"pases",      label:"🎫 Inter-Knot Pass"  },
];

const badgeStyle: Record<string, string> = {
  "Popular":"badge-popular", "Sale":"badge-oferta", "Best value":"badge-valor",
};

const ZZZ_SERVERS = ["America", "Europe", "Asia", "Sar Hong, Macau, Taiwan"];

// ── Description ────────────────────────────────────────────────
function ZZZDescription({ productType, bonus }: { productType: string; bonus?: string }) {
  const t = useT();
  const isMembership = productType === "pase";
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color:"var(--text)" }}>📋 {t.zzz.deliveryInstructions}</h4>

      <div className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
        <span>🎮</span>
        <p><strong style={{ color:"var(--text)" }}>KidStore Team</strong> — {t.zzz.platforms}</p>
      </div>

      {/* No password — advantage */}
      <div className="rounded-xl p-4 flex gap-3"
        style={{ background:"var(--zzz-bg)", border:"1.5px solid var(--zzz-border)" }}>
        <Check size={15} className="flex-shrink-0 mt-0.5" style={{ color:"var(--zzz-text)" }}/>
        <div className="text-xs">
          <p className="font-bold mb-0.5" style={{ color:"var(--zzz-text)" }}>{t.zzz.noPasswordRequired}</p>
          <p style={{ color:"var(--text-muted)" }}>{t.zzz.noPasswordBody}</p>
        </div>
      </div>

      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>❓ {t.zzz.whatWeNeed}</p>
        {[t.zzz.need_item1, t.zzz.need_item2].map((txt, i) => (
          <p key={i} className="text-xs flex gap-2" style={{ color:"var(--text-muted)" }}>
            <span>•</span><span>{txt}</span>
          </p>
        ))}
      </div>

      {/* How to find UID */}
      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-2" style={{ color:"var(--text)" }}>🆔 {t.zzz.howToFindUID}</p>
        {[t.zzz.uid_step1, t.zzz.uid_step2, t.zzz.uid_step3].map((txt, i) => (
          <div key={i} className="flex items-start gap-2.5 text-xs" style={{ color:"var(--text-muted)" }}>
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5 text-white"
              style={{ background:"var(--zzz-dark)" }}>
              {i + 1}
            </span>
            <p>{txt}</p>
          </div>
        ))}
      </div>

      {isMembership ? (
        <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
          <p className="text-xs font-bold mb-2" style={{ color:"var(--text)" }}>🎫 {t.zzz.membershipIncludes}</p>
          {[t.zzz.membership_item1, t.zzz.membership_item2, t.zzz.membership_item3, t.zzz.membership_item4].map((txt, i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
              <span className="flex-shrink-0">{["💎","📅","💰","🔄"][i]}</span><p>{txt}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          {bonus && (
            <div className="rounded-xl p-4 flex gap-3"
              style={{ background:"var(--zzz-bg)", border:"1px solid var(--zzz-border)" }}>
              <Sparkles size={15} className="flex-shrink-0 mt-0.5" style={{ color:"var(--zzz-text)" }}/>
              <div className="text-xs">
                <p className="font-bold mb-0.5" style={{ color:"var(--zzz-text)" }}>{t.zzz.firstPurchaseBonus}</p>
                <p style={{ color:"var(--text-muted)" }}>
                  {t.zzz.firstPurchaseDesc} ({bonus})
                </p>
              </div>
            </div>
          )}
          <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
            <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>📷 {t.zzz.whatFotogramasFor}</p>
            {[
              { icon:"🎫", text:t.zzz.foto_use1 },
              { icon:"⭐", text:t.zzz.foto_use2 },
              { icon:"🌙", text:t.zzz.foto_use3 },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        {[
          { icon:"⚡", text:t.product.deliveryTime },
          { icon:"✅", text:t.product.guarantee },
          { icon:"🛡️", text:t.zzz.noPasswordFeat },
          { icon:"🌐", text:t.zzz.globalServers },
          { icon:"💬", text:t.product.supportDesc },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
            <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function ZenlessZoneZeroProductClient({ slug }: { slug: string }) {
  const product = ALL_ZZZ_PRODUCTS.find(p => p.slug === slug);
  if (!product) notFound();

  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();
  const p           = product;
  const discountPct = Math.round((1 - p.price / p.priceOld) * 100);

  const [fieldUID,    setFieldUID]    = useState("");
  const [fieldGame,   setFieldGame]   = useState("");
  const [fieldServer, setFieldServer] = useState("");
  const [whatsapp,    setWhatsapp]    = useState(false);
  const [addedCart,   setAddedCart]   = useState(false);
  const [errors,      setErrors]      = useState<Record<string, boolean>>({});

  const { addItem, isInCart }            = useCart();
  const { toggle: toggleWish, isWished } = useWishlist();
  const alreadyInCart = isInCart(p.slug);
  const wished        = isWished(p.slug);

  function validate() {
    if (whatsapp) return true;
    const e: Record<string, boolean> = {};
    if (!fieldUID.trim())    e.uid    = true;
    if (!fieldGame.trim())   e.game   = true;
    if (!fieldServer.trim()) e.server = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildOrderData() {
    return {
      user:     fieldUID    || undefined,
      gameName: fieldGame   || undefined,
      platform: fieldServer || undefined,
    };
  }

  function handleAddToCart() {
    if (!validate()) return;
    addItem({
      slug: p.slug, name: p.name, img: p.img,
      price: p.price, priceOld: p.priceOld,
      region: p.region, format: p.format, tabLabel: p.tabLabel,
      orderData: buildOrderData(),
    });
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 2000);
  }

  function handleBuyNow() {
    if (!validate()) return;
    addItem({
      slug: p.slug, name: p.name, img: p.img,
      price: p.price, priceOld: p.priceOld,
      region: p.region, format: p.format, tabLabel: p.tabLabel,
      orderData: buildOrderData(),
    });
    window.location.href = "/checkout";
  }

  function handleWishlist() {
    toggleWish({
      slug: p.slug, name: p.name, img: p.img,
      price: p.price, priceOld: p.priceOld,
      region: p.region, format: p.format, tabLabel: p.tabLabel,
      game:"Zenless Zone Zero", gameSlug:"zenless-zone-zero",
    });
  }

  const inputStyle = (err?: boolean) => ({
    background:"var(--card)",
    border:`1px solid ${err ? "#EF4444" : "var(--border)"}`,
    color:"var(--text)",
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ZZZ_STYLE }}/>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* Tabs */}
        <div className="sticky top-[66px] md:top-[107px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth:"none" }}>
              <div className="flex">
                {TABS.map(tab => (
                  <Link key={tab.id} href={`/games/zenless-zone-zero?tab=${tab.id}`}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: p.tab === tab.id ? "var(--zzz-text)" : "var(--text-muted)" }}>
                    {tab.label}
                    {p.tab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:"var(--zzz-text)" }}/>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap" style={{ color:"var(--text-subtle)" }}>
            <Link href="/" className="hover:opacity-80">{t.gamePage.home}</Link>
            <ChevronRight size={11}/>
            <Link href="/games" className="hover:opacity-80">{t.gamePage.games}</Link>
            <ChevronRight size={11}/>
            <Link href="/games/zenless-zone-zero" className="hover:opacity-80">Zenless Zone Zero</Link>
            <ChevronRight size={11}/>
            <Link href={`/games/zenless-zone-zero?tab=${p.tab}`} className="hover:opacity-80">{p.tabLabel}</Link>
            <ChevronRight size={11}/>
            <span style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* LEFT */}
            <div className="space-y-6">
              <div className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,var(--zzz-bg),rgba(5,5,15,0.92))", border:"1px solid var(--border)" }}>
                <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill className="object-contain p-8" priority/>
                {p.bonus && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                    style={{ background:"var(--zzz-bg)", border:"1px solid var(--zzz-border)", color:"var(--zzz-text)" }}>
                    ✨ {lang==="EN" ? p.bonusEN || p.bonus : p.bonus}
                  </div>
                )}
              </div>
              <div className="rounded-2xl p-6" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                <ZZZDescription productType={p.productType} bonus={p.bonus}/>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">

              {p.badge && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badgeStyle[p.badge] ?? "badge-popular"}`}>
                  {badge(p.badge)}
                </span>
              )}

              {/* Name + wishlist */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-2xl font-bold" style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</h1>
                  <button onClick={handleWishlist}
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 mt-0.5"
                    style={{ background: wished ? "rgba(239,68,68,0.1)" : "var(--card)", border:`1.5px solid ${wished ? "rgba(239,68,68,0.4)" : "var(--border)"}` }}>
                    <Heart size={18} style={{ color: wished ? "#EF4444" : "var(--text-muted)" }} fill={wished ? "#EF4444" : "none"}/>
                  </button>
                </div>
                {p.subtitle && <p className="text-sm mt-0.5 font-medium" style={{ color:"var(--zzz-text)" }}>{lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}</p>}
                {p.bonus && <p className="text-xs mt-0.5 font-semibold" style={{ color:"#4ADE80" }}>✨ {lang==="EN" ? p.bonusEN || p.bonus : p.bonus}</p>}
                <p className="text-xs mt-0.5" style={{ color:"var(--text-subtle)" }}>{p.format} · {p.region}</p>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold" style={{ color:"var(--zzz-text)" }}>{formatPrice(p.price)}</p>
                <p className="text-base line-through mb-0.5" style={{ color:"var(--text-subtle)" }}>{formatPrice(p.priceOld)}</p>
                <span className="mb-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#4ADE80" }}>
                  -{discountPct}%
                </span>
              </div>

              {/* Format + Region */}
              <div className="grid grid-cols-2 gap-3">
                {[{ label:t.product.format, value:p.format }, { label:t.product.region, value:p.region }].map(item => (
                  <div key={item.label} className="rounded-xl px-4 py-3"
                    style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color:"var(--text-subtle)" }}>{item.label}</p>
                    <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* No password notice */}
              <div className="rounded-xl p-4 flex gap-3"
                style={{ background:"var(--zzz-bg)", border:"1.5px solid var(--zzz-border)" }}>
                <Info size={15} className="flex-shrink-0 mt-0.5" style={{ color:"var(--zzz-text)" }}/>
                <div className="text-xs">
                  <p className="font-semibold mb-0.5" style={{ color:"var(--zzz-text)" }}>{t.zzz.noPasswordNotice}</p>
                  <p style={{ color:"var(--text-muted)" }}>{t.zzz.noPasswordUID}</p>
                </div>
              </div>

              {/* WhatsApp toggle */}
              <button onClick={() => setWhatsapp(!whatsapp)}
                className="w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left"
                style={{ background: whatsapp ? "rgba(37,211,102,0.08)" : "var(--card)", border:`1px solid ${whatsapp ? "rgba(37,211,102,0.35)" : "var(--border)"}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: whatsapp ? "rgba(37,211,102,0.15)" : "var(--surface)" }}>💬</div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                    style={{ color: whatsapp ? "#4ADE80" : "var(--zzz-text)" }}>{t.roblox.recommended}</p>
                  <p className="text-xs font-semibold" style={{ color:"var(--text)" }}>{t.roblox.preferWhatsapp}</p>
                </div>
                <div className="mt-0.5 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: whatsapp ? "#4ADE80" : "var(--border)", background: whatsapp ? "#4ADE80" : "transparent" }}>
                    {whatsapp && <div className="w-2 h-2 rounded-full bg-white"/>}
                  </div>
                </div>
              </button>

              {!whatsapp ? (
                <div className="space-y-3">
                  {/* UID */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.uid ? "#EF4444" : "var(--text-subtle)" }}>
                      {t.zzz.uidLabel}
                      {errors.uid && <span className="normal-case font-normal"> — {t.form.required}</span>}
                    </label>
                    <input type="text" placeholder={t.zzz.uidPlaceholder}
                      value={fieldUID}
                      onChange={e => { setFieldUID(e.target.value); setErrors(prev => ({ ...prev, uid:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.uid)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.uid ? "#EF4444" : "var(--zzz-dark)")}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.uid ? "#EF4444" : "var(--border)")}/>
                    <p className="text-[10px] mt-1" style={{ color:"var(--text-subtle)" }}>{t.zzz.uidHint}</p>
                  </div>

                  {/* Agent name */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.game ? "#EF4444" : "var(--text-subtle)" }}>
                      {t.zzz.agentName}
                      {errors.game && <span className="normal-case font-normal"> — {t.form.required}</span>}
                    </label>
                    <input type="text" placeholder={t.zzz.agentPlaceholder}
                      value={fieldGame}
                      onChange={e => { setFieldGame(e.target.value); setErrors(prev => ({ ...prev, game:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.game)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.game ? "#EF4444" : "var(--zzz-dark)")}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.game ? "#EF4444" : "var(--border)")}/>
                  </div>

                  {/* Server */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block"
                      style={{ color: errors.server ? "#EF4444" : "var(--text-subtle)" }}>
                      {t.zzz.serverLabel}
                      {errors.server && <span className="normal-case font-normal"> — {t.form.required}</span>}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {ZZZ_SERVERS.map(sv => {
                        const active = fieldServer === sv;
                        return (
                          <button key={sv}
                            onClick={() => { setFieldServer(active ? "" : sv); setErrors(prev => ({ ...prev, server:false })); }}
                            className="py-3 px-3 rounded-xl text-xs font-semibold text-center transition-all"
                            style={{
                              background: active ? "var(--zzz-bg)" : "var(--card)",
                              border:`1.5px solid ${active ? "var(--zzz-dark)" : "var(--border)"}`,
                              color: active ? "var(--zzz-text)" : "var(--text-muted)",
                              boxShadow: active ? "0 0 0 3px var(--zzz-bg)" : "none",
                            }}>
                            {sv}
                          </button>
                        );
                      })}
                    </div>
                    {errors.server && (
                      <p className="text-[11px] mt-1.5 font-semibold" style={{ color:"#EF4444" }}>
                        {t.zzz.selectServer}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-4 text-xs space-y-2"
                  style={{ background:"rgba(37,211,102,0.06)", border:"1px solid rgba(37,211,102,0.2)", color:"var(--text-muted)" }}>
                  <p className="font-semibold" style={{ color:"var(--text)" }}>{t.roblox.howItWorks}</p>
                  <p>1. {t.roblox.whatsappStep1}</p>
                  <p>2. {t.zzz.whatsappStep2}</p>
                  <p>3. {t.zzz.whatsappStep3}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: alreadyInCart ? "var(--zzz-bg)" : "var(--card)",
                    border:`1.5px solid ${alreadyInCart || addedCart ? "var(--zzz-dark)" : "var(--border)"}`,
                    color:"var(--zzz-text)",
                  }}>
                  {addedCart ? <Check size={16}/> : <ShoppingCart size={16}/>}
                  {addedCart ? t.product.added : alreadyInCart ? t.product.inCart : t.product.addToCart}
                </button>
                <button onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{ background:"var(--zzz-btn-bg)", color:"var(--zzz-btn-color)", boxShadow:"0 4px 20px var(--zzz-glow)" }}>
                  <Zap size={16}/> {t.product.buyNow}
                </button>
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-6 pt-1">
                {[
                  { icon:<Shield        size={13} className="text-green-400"/>,  text:t.product.securePayment },
                  { icon:<Zap           size={13} className="text-yellow-400"/>, text:t.tft.deliveryStrip     },
                  { icon:<MessageCircle size={13} className="text-blue-400"/>,   text:t.product.support       },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-1.5">
                    {item.icon}
                    <span className="text-[11px]" style={{ color:"var(--text-subtle)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
