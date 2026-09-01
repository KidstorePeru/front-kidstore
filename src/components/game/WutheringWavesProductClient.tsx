"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight, ShoppingCart, Info,
  Shield, Zap, MessageCircle,
  Check, Heart, Sparkles, Hash, User,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_WW_PRODUCTS, WW_PLATFORMS } from "@/data/wutheringwaves";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

const WW_STYLE = `
  :root, [data-theme="light"] {
    --ww-teal:       #0E7490;
    --ww-teal-dark:  #0C4A5C;
    --ww-teal-bg:    rgba(14,116,144,0.07);
    --ww-teal-bdr:   rgba(14,116,144,0.22);
    --ww-vio:        #5B21B6;
    --ww-vio-bg:     rgba(91,33,182,0.07);
    --ww-vio-bdr:    rgba(91,33,182,0.25);
    --ww-btn:        linear-gradient(135deg,#0C4A5C,#0891B2);
    --ww-glow:       rgba(14,116,144,0.22);
  }
  [data-theme="dark"] {
    --ww-teal:       #67E8F9;
    --ww-teal-dark:  #06B6D4;
    --ww-teal-bg:    rgba(103,232,249,0.07);
    --ww-teal-bdr:   rgba(103,232,249,0.2);
    --ww-vio:        #C4B5FD;
    --ww-vio-bg:     rgba(196,181,253,0.07);
    --ww-vio-bdr:    rgba(196,181,253,0.22);
    --ww-btn:        linear-gradient(135deg,#0C4A5C,#06B6D4);
    --ww-glow:       rgba(6,182,212,0.28);
  }
`;

const TABS = [
  { id:"lunita", label:"🌙 Lunita"       },
  { id:"pases",  label:"📅 Monthly Pass" },
];

const badgeStyle: Record<string, string> = {
  "Popular":"badge-popular", "Sale":"badge-oferta", "Best value":"badge-valor",
};

const WW_SERVERS = ["America", "Europe", "Asia", "SEA"];

// ── Platform icons ─────────────────────────────────────────────
function PlatformIcon({ id, size = 18 }: { id: string; size?: number }) {
  if (id === "kuro") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l7 4.5-7 4.5z"/>
    </svg>
  );
  if (id === "email") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  );
  if (id === "facebook") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.885v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z"/>
    </svg>
  );
  return ( // gmail
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.908 1.528-1.147C21.69 2.28 24 3.434 24 5.457z"/>
    </svg>
  );
}

// ── Side description ───────────────────────────────────────────
function WWDescription({ productType, bonus, method }: {
  productType: string; bonus?: string; method: "cuenta" | "uid";
}) {
  const t = useT();
  const isPase   = productType === "pase";
  const isCuenta = method === "cuenta";
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color:"var(--text)" }}>📋 {t.ww.deliveryInstructions}</h4>
      <div className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
        <span>🎮</span>
        <p><strong style={{ color:"var(--text)" }}>KidStore Team</strong> — {t.ww.pcMobile}</p>
      </div>

      {isCuenta ? (
        <div className="rounded-xl p-4 flex gap-3"
          style={{ background:"var(--ww-vio-bg)", border:"1.5px solid var(--ww-vio-bdr)" }}>
          <User size={15} style={{ color:"var(--ww-vio)", flexShrink:0, marginTop:2 }}/>
          <div className="text-xs space-y-0.5">
            <p className="font-bold" style={{ color:"var(--ww-vio)" }}>{t.ww.viaCuentaDesc2}</p>
            <p style={{ color:"var(--text-muted)" }}>{t.ww.viaCuentaDesc3}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl p-4 flex gap-3"
          style={{ background:"var(--ww-teal-bg)", border:"1.5px solid var(--ww-teal-bdr)" }}>
          <Hash size={15} style={{ color:"var(--ww-teal)", flexShrink:0, marginTop:2 }}/>
          <div className="text-xs space-y-0.5">
            <p className="font-bold" style={{ color:"var(--ww-teal)" }}>{t.ww.viaUIDDesc2}</p>
            <p style={{ color:"var(--text-muted)" }}>{t.ww.viaUIDDesc3}</p>
          </div>
        </div>
      )}

      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>❓ {t.ww.whatWeNeed}</p>
        {(isCuenta
          ? [t.ww.cuenta_need1, t.ww.cuenta_need2]
          : [t.ww.uid_need1,    t.ww.uid_need2]
        ).map((txt, i) => (
          <p key={i} className="text-xs flex gap-2" style={{ color:"var(--text-muted)" }}>
            <span className="flex-shrink-0">•</span><span>{txt}</span>
          </p>
        ))}
      </div>

      {!isCuenta && (
        <div className="rounded-xl p-4 space-y-2.5" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
          <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>🆔 {t.ww.howToFindUID}</p>
          {[t.ww.uid_step1, t.ww.uid_step2, t.ww.uid_step3].map((txt, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs" style={{ color:"var(--text-muted)" }}>
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0 mt-0.5"
                style={{ background:"var(--ww-teal-dark)" }}>{i + 1}</span>
              <p>{txt}</p>
            </div>
          ))}
        </div>
      )}

      {!isPase && bonus && (
        <div className="rounded-xl p-4 flex gap-3"
          style={{ background:"var(--ww-teal-bg)", border:"1px solid var(--ww-teal-bdr)" }}>
          <Sparkles size={15} style={{ color:"var(--ww-teal)", flexShrink:0, marginTop:2 }}/>
          <div className="text-xs space-y-0.5">
            <p className="font-bold" style={{ color:"var(--ww-teal)" }}>{t.ww.firstPurchaseBonus}</p>
            <p style={{ color:"var(--text-muted)" }}>{t.ww.firstPurchaseBonusDesc} ({bonus})</p>
          </div>
        </div>
      )}

      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        {[
          { icon:"⚡", text:t.product.deliveryTime },
          { icon:"✅", text:t.product.guarantee },
          { icon:"🛡️", text: isCuenta ? t.product.dataPrivacy : t.ww.noPasswordNeeded },
          { icon:"🌐", text:t.ww.globalServers },
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
export default function WutheringWavesProductClient({ slug }: { slug: string }) {
  const product = ALL_WW_PRODUCTS.find(p => p.slug === slug);
  if (!product) notFound();
  const p = product;
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();

  const [method,      setMethod]      = useState<"cuenta" | "uid">("cuenta");
  const [whatsapp,    setWhatsapp]    = useState(false);
  const [addedCart,   setAddedCart]   = useState(false);
  const [fieldUser,   setFieldUser]   = useState("");
  const [fieldPlat,   setFieldPlat]   = useState("");
  const [fieldUID,    setFieldUID]    = useState("");
  const [fieldServer, setFieldServer] = useState("");
  const [fieldGame,   setFieldGame]   = useState("");
  const [errors,      setErrors]      = useState<Record<string, boolean>>({});

  const isCuenta       = method === "cuenta";
  const activePrice    = isCuenta ? p.priceCuenta : p.priceUID;
  const activePriceOld = isCuenta ? p.priceOldCuenta : p.priceOldUID;
  const discountPct    = Math.round((1 - activePrice / activePriceOld) * 100);
  const discC          = Math.round((1 - p.priceCuenta / p.priceOldCuenta) * 100);
  const discU          = Math.round((1 - p.priceUID    / p.priceOldUID)    * 100);

  const { addItem, isInCart }            = useCart();
  const { toggle: toggleWish, isWished } = useWishlist();
  const alreadyInCart = isInCart(`${p.slug}-${method}`);
  const wished        = isWished(p.slug);

  function validate() {
    if (whatsapp) return true;
    const e: Record<string, boolean> = {};
    if (!fieldGame.trim()) e.game = true;
    if (isCuenta) {
      if (!fieldUser.trim()) e.user = true;
      if (!fieldPlat.trim()) e.plat = true;
    } else {
      if (!fieldUID.trim())    e.uid    = true;
      if (!fieldServer.trim()) e.server = true;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildOrderData() {
    return isCuenta
      ? { user:fieldUser||undefined, gameName:fieldGame||undefined, platform:fieldPlat||undefined }
      : { user:fieldUID||undefined, gameName:fieldGame||undefined, platform:`UID·${fieldServer}` };
  }

  function getItem() {
    return {
      slug:`${p.slug}-${method}`,
      name:`${p.name} (${isCuenta ? t.ww.viaCuentaLabel : t.ww.viaUIDLabel})`,
      img:p.img, price:activePrice, priceOld:activePriceOld,
      region:p.region, format:p.format, tabLabel:p.tabLabel,
      orderData:buildOrderData(),
    };
  }

  function handleAddToCart() {
    if (!validate()) return;
    addItem(getItem());
    setAddedCart(true); setTimeout(() => setAddedCart(false), 2000);
  }
  function handleBuyNow() {
    if (!validate()) return;
    addItem(getItem());
    window.location.href = "/checkout";
  }
  function handleWishlist() {
    toggleWish({ slug:p.slug, name:p.name, img:p.img, price:activePrice, priceOld:activePriceOld, region:p.region, format:p.format, tabLabel:p.tabLabel, game:"Wuthering Waves", gameSlug:"wuthering-waves" });
  }

  const inputStyle = (err?: boolean) => ({
    background:"var(--card)", color:"var(--text)",
    border:`1px solid ${err ? "#EF4444" : "var(--border)"}`,
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: WW_STYLE }}/>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* Tabs */}
        <div className="sticky top-[66px] md:top-[107px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth:"none" }}>
              <div className="flex">
                {TABS.map(tab => (
                  <Link key={tab.id} href={`/games/wuthering-waves?tab=${tab.id}`}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: p.tab === tab.id ? "var(--ww-teal)" : "var(--text-muted)" }}>
                    {tab.label}
                    {p.tab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:"var(--ww-teal)" }}/>
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
            <ChevronRight size={11}/><Link href="/games" className="hover:opacity-80">{t.gamePage.games}</Link>
            <ChevronRight size={11}/><Link href="/games/wuthering-waves" className="hover:opacity-80">Wuthering Waves</Link>
            <ChevronRight size={11}/><Link href={`/games/wuthering-waves?tab=${p.tab}`} className="hover:opacity-80">{p.tabLabel}</Link>
            <ChevronRight size={11}/><span style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* LEFT — image + description */}
            <div className="space-y-6">
              <div className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,var(--ww-teal-bg),rgba(3,8,20,0.92))", border:"1px solid var(--border)" }}>
                <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill className="object-contain p-8" priority/>
                {/* Method pill */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                  style={{
                    background: isCuenta ? "var(--ww-vio-bg)" : "var(--ww-teal-bg)",
                    border:`1.5px solid ${isCuenta ? "var(--ww-vio-bdr)" : "var(--ww-teal-bdr)"}`,
                    color: isCuenta ? "var(--ww-vio)" : "var(--ww-teal)",
                    backdropFilter:"blur(8px)",
                  }}>
                  {isCuenta ? <User size={11}/> : <Hash size={11}/>}
                  {isCuenta ? t.ww.viaCuentaLabel : t.ww.viaUIDLabel}
                  {isCuenta && (
                    <span className="text-[9px] ml-1 px-1.5 py-0.5 rounded-full font-black"
                      style={{ background:"rgba(16,185,129,0.25)", color:"#22C55E" }}>
                      {t.ww.cheapestShort}
                    </span>
                  )}
                </div>
                {p.bonus && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                    style={{ background:"var(--ww-teal-bg)", border:"1px solid var(--ww-teal-bdr)", color:"var(--ww-teal)", backdropFilter:"blur(8px)" }}>
                    ✨ {lang==="EN" ? p.bonusEN || p.bonus : p.bonus}
                  </div>
                )}
              </div>
              <div className="rounded-2xl p-6" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                <WWDescription productType={p.productType} bonus={p.bonus} method={method}/>
              </div>
            </div>

            {/* RIGHT — selector + form */}
            <div className="space-y-5">

              {p.badge && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badgeStyle[p.badge] ?? "badge-popular"}`}>
                  {badge(p.badge)}
                </span>
              )}

              {/* Name + wishlist */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold" style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</h1>
                  {p.subtitle && <p className="text-sm mt-0.5 font-medium" style={{ color:"var(--ww-teal)" }}>{lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}</p>}
                  {p.bonus && <p className="text-xs mt-0.5 font-semibold" style={{ color:"#4ADE80" }}>✨ {lang==="EN" ? p.bonusEN || p.bonus : p.bonus}</p>}
                  <p className="text-xs mt-0.5" style={{ color:"var(--text-subtle)" }}>{p.format} · {p.region}</p>
                </div>
                <button onClick={handleWishlist}
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: wished ? "rgba(239,68,68,0.1)" : "var(--card)", border:`1.5px solid ${wished ? "rgba(239,68,68,0.4)" : "var(--border)"}` }}>
                  <Heart size={18} style={{ color: wished ? "#EF4444" : "var(--text-muted)" }} fill={wished ? "#EF4444" : "none"}/>
                </button>
              </div>

              {/* ── METHOD SELECTOR ── */}
              <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
                <div className="px-4 py-3 flex items-center justify-between"
                  style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)" }}>
                  <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color:"var(--text-subtle)" }}>
                    {t.ww.deliveryMethod}
                  </p>
                  <p className="text-[10px]" style={{ color:"var(--text-subtle)" }}>{t.ww.selectOne}</p>
                </div>

                {/* Via Account — cheapest, top */}
                <button onClick={() => { setMethod("cuenta"); setErrors({}); }}
                  className="w-full flex items-center gap-4 px-5 py-4 transition-all text-left relative"
                  style={{ background: isCuenta ? "var(--ww-vio-bg)" : "var(--card)", borderBottom:"1px solid var(--border)" }}>
                  <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{ borderColor: isCuenta ? "var(--ww-vio)" : "var(--border)", background: isCuenta ? "var(--ww-vio)" : "transparent" }}>
                    {isCuenta && <div className="w-2 h-2 rounded-full bg-white"/>}
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: isCuenta ? "var(--ww-vio-bg)" : "var(--surface)", border:`1.5px solid ${isCuenta ? "var(--ww-vio-bdr)" : "var(--border)"}` }}>
                    <User size={18} style={{ color: isCuenta ? "var(--ww-vio)" : "var(--text-muted)" }}/>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold" style={{ color: isCuenta ? "var(--ww-vio)" : "var(--text-muted)" }}>
                        {t.ww.viaAccount}
                      </p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black"
                        style={{ background:"rgba(16,185,129,0.2)", color:"#22C55E" }}>
                        {t.ww.cheapest}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color:"var(--text-subtle)" }}>{t.ww.accountAccess}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] line-through" style={{ color:"var(--text-subtle)" }}>{formatPrice(p.priceOldCuenta)}</p>
                    <p className="text-xl font-black" style={{ color: isCuenta ? "var(--ww-vio)" : "var(--text-muted)" }}>{formatPrice(p.priceCuenta)}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background:"rgba(16,185,129,0.15)", color:"#4ADE80" }}>-{discC}%</span>
                  </div>
                </button>

                {/* Via UID — no password, bottom */}
                <button onClick={() => { setMethod("uid"); setErrors({}); }}
                  className="w-full flex items-center gap-4 px-5 py-4 transition-all text-left"
                  style={{ background: !isCuenta ? "var(--ww-teal-bg)" : "var(--card)" }}>
                  <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{ borderColor: !isCuenta ? "var(--ww-teal)" : "var(--border)", background: !isCuenta ? "var(--ww-teal)" : "transparent" }}>
                    {!isCuenta && <div className="w-2 h-2 rounded-full bg-white"/>}
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: !isCuenta ? "var(--ww-teal-bg)" : "var(--surface)", border:`1.5px solid ${!isCuenta ? "var(--ww-teal-bdr)" : "var(--border)"}` }}>
                    <Hash size={18} style={{ color: !isCuenta ? "var(--ww-teal)" : "var(--text-muted)" }}/>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold" style={{ color: !isCuenta ? "var(--ww-teal)" : "var(--text-muted)" }}>
                        {t.ww.viaUID}
                      </p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background:"var(--surface)", color:"var(--text-subtle)", border:"1px solid var(--border)" }}>
                        {t.ww.noPassword}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color:"var(--text-subtle)" }}>{t.ww.uidOnly}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] line-through" style={{ color:"var(--text-subtle)" }}>{formatPrice(p.priceOldUID)}</p>
                    <p className="text-xl font-black" style={{ color: !isCuenta ? "var(--ww-teal)" : "var(--text-muted)" }}>{formatPrice(p.priceUID)}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background:"rgba(16,185,129,0.15)", color:"#4ADE80" }}>-{discU}%</span>
                  </div>
                </button>
              </div>

              {/* Active price */}
              <div className="flex items-end gap-3">
                <p className="text-4xl font-black" style={{ color: isCuenta ? "var(--ww-vio)" : "var(--ww-teal)" }}>
                  {formatPrice(activePrice)}
                </p>
                <div className="mb-1 space-y-0.5">
                  <p className="text-sm line-through" style={{ color:"var(--text-subtle)" }}>{formatPrice(activePriceOld)}</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                    style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#4ADE80" }}>
                    -{discountPct}%
                  </span>
                </div>
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

              {/* Contextual notice */}
              {isCuenta ? (
                <div className="rounded-xl p-4 flex gap-3"
                  style={{ background:"rgba(59,130,246,0.07)", border:"1px solid rgba(59,130,246,0.2)" }}>
                  <Shield size={15} className="text-blue-400 flex-shrink-0 mt-0.5"/>
                  <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                    <strong style={{ color:"#60A5FA" }}>{t.ww.accountNotice}</strong>{" "}
                    {t.ww.accountNoticeDesc}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl p-4 flex gap-3"
                  style={{ background:"var(--ww-teal-bg)", border:"1.5px solid var(--ww-teal-bdr)" }}>
                  <Info size={15} style={{ color:"var(--ww-teal)", flexShrink:0, marginTop:2 }}/>
                  <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                    <strong style={{ color:"var(--ww-teal)" }}>{t.ww.noPasswordNotice}</strong>{" "}
                    {t.ww.noPasswordUID}
                  </p>
                </div>
              )}

              {/* WhatsApp toggle */}
              <button onClick={() => setWhatsapp(!whatsapp)}
                className="w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left"
                style={{ background: whatsapp ? "rgba(37,211,102,0.08)" : "var(--card)", border:`1px solid ${whatsapp ? "rgba(37,211,102,0.35)" : "var(--border)"}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: whatsapp ? "rgba(37,211,102,0.15)" : "var(--surface)" }}>💬</div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                    style={{ color: whatsapp ? "#4ADE80" : "var(--ww-teal)" }}>{t.roblox.recommended}</p>
                  <p className="text-xs font-semibold" style={{ color:"var(--text)" }}>{t.roblox.preferWhatsapp}</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ borderColor: whatsapp ? "#4ADE80" : "var(--border)", background: whatsapp ? "#4ADE80" : "transparent" }}>
                  {whatsapp && <div className="w-2 h-2 rounded-full bg-white"/>}
                </div>
              </button>

              {/* Dynamic form */}
              {!whatsapp && (
                <div className="space-y-3">
                  {/* Resonator name — always visible */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.game ? "#EF4444" : "var(--text-subtle)" }}>
                      {t.ww.resonatorName}
                      {errors.game && <span className="normal-case font-normal text-red-400"> — {t.form.required}</span>}
                    </label>
                    <input type="text" placeholder={t.ww.resonatorPlaceholder} value={fieldGame}
                      onChange={e => { setFieldGame(e.target.value); setErrors(p => ({...p, game:false})); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.game)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.game ? "#EF4444" : "var(--ww-teal-dark)")}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.game ? "#EF4444" : "var(--border)")}/>
                  </div>

                  {isCuenta ? (
                    <>
                      {/* Username */}
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                          style={{ color: errors.user ? "#EF4444" : "var(--text-subtle)" }}>
                          {t.ww.userEmail}{errors.user && <span className="normal-case font-normal text-red-400"> — {t.form.required}</span>}
                        </label>
                        <input type="text" placeholder="your_user / email@example.com" value={fieldUser}
                          onChange={e => { setFieldUser(e.target.value); setErrors(p => ({...p, user:false})); }}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                          style={inputStyle(errors.user)}
                          onFocus={e => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : "var(--ww-vio)")}
                          onBlur={e  => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : "var(--border)")}/>
                      </div>

                      {/* Seguridad: nunca se pide la contraseña en la web */}
                      <p className="text-[11px] flex items-start gap-1.5 -mt-1" style={{ color:"var(--text-subtle)" }}>
                        <span aria-hidden>🔒</span> {t.form.noPasswordNote}
                      </p>

                      {/* Platform */}
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block"
                          style={{ color: errors.plat ? "#EF4444" : "var(--text-subtle)" }}>
                          {t.ww.accessPlatform}{errors.plat && <span className="normal-case font-normal text-red-400"> — {t.form.required}</span>}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {WW_PLATFORMS.map(pl => {
                            const active = fieldPlat === pl.id;
                            return (
                              <button key={pl.id}
                                onClick={() => { setFieldPlat(active ? "" : pl.id); setErrors(p => ({...p, plat:false})); }}
                                className="flex items-center gap-2.5 py-3 px-3.5 rounded-xl transition-all"
                                style={{
                                  background: active ? `${pl.color}14` : "var(--card)",
                                  border:`1.5px solid ${active ? pl.color : "var(--border)"}`,
                                  boxShadow: active ? `0 0 0 3px ${pl.color}0F` : "none",
                                }}>
                                <span style={{ color: active ? pl.color : "var(--text-muted)" }}>
                                  <PlatformIcon id={pl.id} size={18}/>
                                </span>
                                <span className="text-xs font-semibold" style={{ color: active ? pl.color : "var(--text-muted)" }}>
                                  {pl.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        {errors.plat && <p className="text-[11px] mt-1.5 font-semibold text-red-400">{t.ww.selectPlatform}</p>}
                      </div>
                    </>
                  ) : (
                    /* ── UID FORM ── */
                    <>
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                          style={{ color: errors.uid ? "#EF4444" : "var(--text-subtle)" }}>
                          {t.ww.uidLabel}{errors.uid && <span className="normal-case font-normal text-red-400"> — {t.form.required}</span>}
                        </label>
                        <input type="text" placeholder={t.ww.uidPlaceholder} value={fieldUID}
                          onChange={e => { setFieldUID(e.target.value); setErrors(p => ({...p, uid:false})); }}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                          style={inputStyle(errors.uid)}
                          onFocus={e => (e.currentTarget.style.borderColor = errors.uid ? "#EF4444" : "var(--ww-teal-dark)")}
                          onBlur={e  => (e.currentTarget.style.borderColor = errors.uid ? "#EF4444" : "var(--border)")}/>
                        <p className="text-[10px] mt-1" style={{ color:"var(--text-subtle)" }}>{t.ww.uidHint}</p>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block"
                          style={{ color: errors.server ? "#EF4444" : "var(--text-subtle)" }}>
                          {t.ww.serverLabel}{errors.server && <span className="normal-case font-normal text-red-400"> — {t.form.required}</span>}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {WW_SERVERS.map(sv => {
                            const active = fieldServer === sv;
                            return (
                              <button key={sv}
                                onClick={() => { setFieldServer(active ? "" : sv); setErrors(p => ({...p, server:false})); }}
                                className="py-3 px-3 rounded-xl text-xs font-semibold text-center transition-all"
                                style={{
                                  background: active ? "var(--ww-teal-bg)" : "var(--card)",
                                  border:`1.5px solid ${active ? "var(--ww-teal-dark)" : "var(--border)"}`,
                                  color: active ? "var(--ww-teal)" : "var(--text-muted)",
                                  boxShadow: active ? "0 0 0 3px var(--ww-teal-bg)" : "none",
                                }}>
                                {sv}
                              </button>
                            );
                          })}
                        </div>
                        {errors.server && <p className="text-[11px] mt-1.5 font-semibold text-red-400">{t.ww.selectServer}</p>}
                      </div>
                    </>
                  )}
                </div>
              )}

              {whatsapp && (
                <div className="rounded-xl p-4 text-xs space-y-2"
                  style={{ background:"rgba(37,211,102,0.06)", border:"1px solid rgba(37,211,102,0.2)", color:"var(--text-muted)" }}>
                  <p className="font-semibold" style={{ color:"var(--text)" }}>{t.roblox.howItWorks}</p>
                  <p>1. {t.roblox.whatsappStep1}</p>
                  <p>2. {t.ww.whatsappStep2}</p>
                  <p>3. {t.ww.whatsappStep3}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: alreadyInCart ? (isCuenta ? "var(--ww-vio-bg)" : "var(--ww-teal-bg)") : "var(--card)",
                    border:`1.5px solid ${alreadyInCart || addedCart ? (isCuenta ? "var(--ww-vio)" : "var(--ww-teal-dark)") : "var(--border)"}`,
                    color: isCuenta ? "var(--ww-vio)" : "var(--ww-teal)",
                  }}>
                  {addedCart ? <Check size={16}/> : <ShoppingCart size={16}/>}
                  {addedCart ? t.product.added : alreadyInCart ? t.product.inCart : t.product.addToCart}
                </button>
                <button onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background:"var(--ww-btn)", boxShadow:"0 4px 20px var(--ww-glow)" }}>
                  <Zap size={16}/> {t.product.buyNow}
                </button>
              </div>

              {/* Trust */}
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
