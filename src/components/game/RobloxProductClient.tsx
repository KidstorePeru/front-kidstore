"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight, ShoppingCart, AlertTriangle, Clock,
  Eye, EyeOff, Shield, Zap, MessageCircle,
  Check, Heart, ExternalLink,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_ROBLOX_PRODUCTS, GRUPOS } from "@/data/roblox";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

const BRAND      = "#EF4444";
const BRAND_DARK = "#DC2626";

const TABS = [
  { id:"cuenta",   label:"👤 Via Account" },
  { id:"grupo",    label:"👥 Via Group"   },
  { id:"gamepass", label:"🎮 Game Pass"   },
];

const badgeStyle: Record<string, string> = {
  "Popular":"badge-popular", "Sale":"badge-oferta", "Best value":"badge-valor",
};

function RobloxDescription({ productType, bonusRobux, robux }: {
  productType: string; bonusRobux?: number; robux: number;
}) {
  const t = useT();
  const isGrupo = productType === "grupo";

  if (isGrupo) {
    return (
      <div className="space-y-4">
        <h4 className="text-sm font-bold" style={{ color:"var(--text)" }}>📋 {t.roblox.deliveryInstructions}</h4>
        <div className="rounded-xl p-4 space-y-2"
          style={{ background:"rgba(239,68,68,0.07)", border:"1.5px solid rgba(239,68,68,0.3)" }}>
          <p className="text-xs font-bold text-red-400 mb-1">⚠️ {t.roblox.mandatoryReq}</p>
          <p className="text-xs" style={{ color:"var(--text-muted)" }}>
            {t.roblox.accountMustBe} <strong style={{ color:"var(--text)" }}>{t.roblox.min14Days}</strong> {t.roblox.inGroupShort}
          </p>
        </div>
        <div className="rounded-xl p-4 space-y-3" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
          <p className="text-xs font-bold" style={{ color:"var(--text)" }}>👥 {t.roblox.joinOneGroup}</p>
          {Object.entries(GRUPOS).map(([key, g]) => (
            <a key={key} href={g.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:opacity-80"
              style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ background:`linear-gradient(135deg,${BRAND_DARK},#7F1D1D)` }}>
                {key === "grupo1" ? "1" : "2"}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold" style={{ color:"var(--text)" }}>{g.name}</p>
                <p className="text-[10px]" style={{ color:BRAND }}>{t.roblox.viewGroupOnRoblox}</p>
              </div>
              <ExternalLink size={12} style={{ color:"var(--text-subtle)" }}/>
            </a>
          ))}
        </div>
        <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
          {[
            { icon:"✅", text:t.roblox.grupo_feat1 },
            { icon:"⚡", text:t.roblox.grupo_feat2 },
            { icon:"🛡️", text:t.roblox.grupo_feat3 },
            { icon:"💬", text:t.roblox.grupo_feat4 },
          ].map((item,i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
              <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color:"var(--text)" }}>📋 {t.roblox.deliveryInstructions}</h4>
      <div className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
        <span>🎮</span>
        <p><strong style={{ color:"var(--text)" }}>KidStore Team</strong> — PC / Mobile / Console</p>
      </div>
      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>❓ {t.roblox.whatWeNeed}</p>
        {[t.roblox.need_item1, t.roblox.need_item2].map((txt,i) => (
          <p key={i} className="text-xs flex gap-2" style={{ color:"var(--text-muted)" }}><span>•</span><span>{txt}</span></p>
        ))}
      </div>
      {bonusRobux && (
        <div className="rounded-xl p-4 flex gap-3"
          style={{ background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.25)" }}>
          <span className="text-lg flex-shrink-0">🎁</span>
          <div className="text-xs">
            <p className="font-bold mb-0.5" style={{ color:"#4ADE80" }}>{t.roblox.bonusIncluded}</p>
            <p style={{ color:"var(--text-muted)" }}>
              {t.roblox.bonusDesc1} <strong style={{ color:"var(--text)" }}>
              {bonusRobux.toLocaleString()} Robux</strong> {t.roblox.bonusDesc2}
            </p>
          </div>
        </div>
      )}
      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        {[
          { icon:"⚡", text:t.roblox.cuenta_feat1 },
          { icon:"✅", text:t.roblox.cuenta_feat2 },
          { icon:"🛡️", text:t.roblox.cuenta_feat3 },
          { icon:"🌐", text:t.roblox.cuenta_feat4 },
          { icon:"💬", text:t.roblox.cuenta_feat5 },
        ].map((item,i) => (
          <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
            <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RobloxProductClient({ slug }: { slug: string }) {
  const product = ALL_ROBLOX_PRODUCTS.find(p => p.slug === slug);
  if (!product) notFound();

  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();
  const p           = product;
  const discountPct = Math.round((1 - p.price / p.priceOld) * 100);
  const isGrupo     = p.productType === "grupo";

  const [showPass,  setShowPass]  = useState(false);
  const [whatsapp,  setWhatsapp]  = useState(false);
  const [addedCart, setAddedCart] = useState(false);
  const [fieldUser, setFieldUser] = useState("");
  const [fieldPass, setFieldPass] = useState("");
  const [fieldGame, setFieldGame] = useState("");
  const [errors,    setErrors]    = useState<Record<string, boolean>>({});

  const { addItem, isInCart }          = useCart();
  const { toggle: toggleWish, isWished } = useWishlist();
  const alreadyInCart = isInCart(p.slug);
  const wished        = isWished(p.slug);

  function validate() {
    if (whatsapp) return true;
    const e: Record<string, boolean> = {};
    if (!fieldUser.trim()) e.user = true;
    if (!isGrupo && !fieldPass.trim()) e.pass = true;
    if (!fieldGame.trim()) e.gameName = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildOrderData() {
    return {
      user:     fieldUser || undefined,
      pass:     (!isGrupo && fieldPass) ? fieldPass : undefined,
      gameName: fieldGame || undefined,
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
      game:"Roblox", gameSlug:"roblox",
    });
  }

  const inputStyle = (err?: boolean) => ({
    background:"var(--card)",
    border:`1px solid ${err ? "#EF4444" : "var(--border)"}`,
    color:"var(--text)",
  });

  return (
    <>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* Tabs */}
        <div className="sticky top-[65px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth:"none" }}>
              <div className="flex">
                {TABS.map(tab => (
                  <Link key={tab.id} href={`/games/roblox?tab=${tab.id}`}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: p.tab === tab.id ? BRAND : "var(--text-muted)" }}>
                    {tab.label}
                    {p.tab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:`linear-gradient(90deg,${BRAND_DARK},${BRAND})` }}/>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap" style={{ color:"var(--text-subtle)" }}>
            <Link href="/" className="hover:opacity-80">{t.gamePage.home}</Link>
            <ChevronRight size={11}/><Link href="/games" className="hover:opacity-80">{t.gamePage.games}</Link>
            <ChevronRight size={11}/><Link href="/games/roblox" className="hover:opacity-80">Roblox</Link>
            <ChevronRight size={11}/><Link href={`/games/roblox?tab=${p.tab}`} className="hover:opacity-80">{p.tabLabel}</Link>
            <ChevronRight size={11}/><span style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* LEFT */}
            <div className="space-y-6">
              <div className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio:"4/3", background:`linear-gradient(135deg,rgba(239,68,68,0.15),rgba(10,5,20,0.85))`, border:"1px solid var(--border)" }}>
                <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill className="object-contain p-8" priority/>
                {/* Badges */}
                {p.bonusRobux && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black"
                    style={{ background:"rgba(16,185,129,0.2)", border:"1px solid rgba(16,185,129,0.4)", color:"#4ADE80" }}>
                    🎁 {t.roblox.youReceive} {p.bonusRobux.toLocaleString()} Robux
                  </div>
                )}
                {p.deliveryTime && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
                    style={{ background:"rgba(0,0,0,0.6)", color:"rgba(255,255,255,0.8)" }}>
                    <Clock size={11}/> {lang==="EN" ? p.deliveryTimeEN || p.deliveryTime : p.deliveryTime}
                  </div>
                )}
              </div>
              <div className="rounded-2xl p-6" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                <RobloxDescription productType={p.productType} bonusRobux={p.bonusRobux} robux={p.robux}/>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">
              {p.badge && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badgeStyle[p.badge] ?? "badge-popular"}`}>
                  {badge(p.badge)}
                </span>
              )}

              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</h1>
                    {p.bonusRobux && (
                      <p className="text-sm mt-0.5 font-bold" style={{ color:"#4ADE80" }}>
                        🎁 {t.roblox.youReceive} {p.bonusRobux.toLocaleString()} Robux
                      </p>
                    )}
                  </div>
                  <button onClick={handleWishlist}
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 mt-0.5"
                    style={{ background: wished ? "rgba(239,68,68,0.1)" : "var(--card)", border:`1.5px solid ${wished ? "rgba(239,68,68,0.4)" : "var(--border)"}` }}>
                    <Heart size={18} style={{ color: wished ? "#EF4444" : "var(--text-muted)" }} fill={wished ? "#EF4444" : "none"}/>
                  </button>
                </div>
                <p className="text-xs mt-0.5" style={{ color:"var(--text-subtle)" }}>{p.format} · {p.region}</p>
                {p.deliveryTime && (
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color:"var(--text-subtle)" }}>
                    <Clock size={11}/> {lang==="EN" ? p.deliveryTimeEN || p.deliveryTime : p.deliveryTime}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold" style={{ color:BRAND }}>{formatPrice(p.price)}</p>
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

              {/* Notice */}
              {isGrupo ? (
                <div className="rounded-xl p-4 flex gap-3"
                  style={{ background:"rgba(239,68,68,0.07)", border:"1.5px solid rgba(239,68,68,0.3)" }}>
                  <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5"/>
                  <div className="text-xs">
                    <p className="font-bold text-red-400 mb-0.5">{t.roblox.req14Days}</p>
                    <p style={{ color:"var(--text-muted)" }}>
                      {t.roblox.req14DaysDesc}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-4 flex gap-3"
                  style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)" }}>
                  <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5"/>
                  <div className="text-xs" style={{ color:"var(--text-muted)" }}>
                    <p className="font-semibold text-red-400 mb-0.5">{t.roblox.importantNotice}</p>
                    <p>{t.roblox.importantNoticeDesc}</p>
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              <button onClick={() => setWhatsapp(!whatsapp)}
                className="w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left"
                style={{ background: whatsapp ? "rgba(37,211,102,0.08)" : "var(--card)", border:`1px solid ${whatsapp ? "rgba(37,211,102,0.35)" : "var(--border)"}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: whatsapp ? "rgba(37,211,102,0.15)" : "var(--surface)" }}>💬</div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                    style={{ color: whatsapp ? "#4ADE80" : BRAND }}>{t.roblox.recommended}</p>
                  <p className="text-xs font-semibold" style={{ color:"var(--text)" }}>
                    {t.roblox.preferWhatsapp}
                  </p>
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
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.user ? "#EF4444" : "var(--text-subtle)" }}>
                      {isGrupo ? t.roblox.robloxUsername : t.roblox.userEmailPhone}
                      {errors.user && <span className="normal-case font-normal"> — {t.form.required}</span>}
                    </label>
                    <input type="text"
                      placeholder={isGrupo ? "YourRobloxUsername" : "your_user / email@example.com"}
                      value={fieldUser}
                      onChange={e => { setFieldUser(e.target.value); setErrors(prev => ({ ...prev, user:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.user)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : BRAND)}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : "var(--border)")}/>
                  </div>
                  {!isGrupo && (
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                        style={{ color: errors.pass ? "#EF4444" : "var(--text-subtle)" }}>
                        {t.form.password}{errors.pass && <span className="normal-case font-normal"> — {t.form.required}</span>}
                      </label>
                      <div className="relative">
                        <input type={showPass ? "text" : "password"} placeholder="••••••••"
                          value={fieldPass}
                          onChange={e => { setFieldPass(e.target.value); setErrors(prev => ({ ...prev, pass:false })); }}
                          className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                          style={inputStyle(errors.pass)}
                          onFocus={e => (e.currentTarget.style.borderColor = errors.pass ? "#EF4444" : BRAND)}
                          onBlur={e  => (e.currentTarget.style.borderColor = errors.pass ? "#EF4444" : "var(--border)")}/>
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                          style={{ color:"var(--text-subtle)" }}>
                          {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.gameName ? "#EF4444" : "var(--text-subtle)" }}>
                      {t.roblox.robloxDisplayName}{errors.gameName && <span className="normal-case font-normal"> — {t.form.required}</span>}
                    </label>
                    <input type="text" placeholder="YourRobloxName"
                      value={fieldGame}
                      onChange={e => { setFieldGame(e.target.value); setErrors(prev => ({ ...prev, gameName:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.gameName)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.gameName ? "#EF4444" : BRAND)}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.gameName ? "#EF4444" : "var(--border)")}/>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-4 text-xs space-y-2"
                  style={{ background:"rgba(37,211,102,0.06)", border:"1px solid rgba(37,211,102,0.2)", color:"var(--text-muted)" }}>
                  <p className="font-semibold" style={{ color:"var(--text)" }}>{t.roblox.howItWorks}</p>
                  <p>1. {t.roblox.whatsappStep1}</p>
                  <p>2. {t.roblox.whatsappStep2_product}</p>
                  <p>3. {t.roblox.whatsappStep3}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: alreadyInCart ? `rgba(239,68,68,0.1)` : "var(--card)",
                    border:`1.5px solid ${alreadyInCart || addedCart ? BRAND : "var(--border)"}`,
                    color:BRAND,
                  }}>
                  {addedCart ? <Check size={16}/> : <ShoppingCart size={16}/>}
                  {addedCart ? t.product.added : alreadyInCart ? t.product.inCart : t.product.addToCart}
                </button>
                <button onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background:`linear-gradient(135deg,${BRAND_DARK},#7F1D1D)`, boxShadow:`0 4px 20px ${BRAND}40` }}>
                  <Zap size={16}/> {t.product.buyNow}
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 pt-1">
                {[
                  { icon:<Shield        size={13} className="text-green-400"/>,  text:t.product.securePayment  },
                  { icon:<Zap           size={13} className="text-yellow-400"/>, text:t.product.fastDelivery   },
                  { icon:<MessageCircle size={13} className="text-blue-400"/>,   text:t.product.support247     },
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
