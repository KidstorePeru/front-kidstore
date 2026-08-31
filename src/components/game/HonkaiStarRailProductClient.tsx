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
import { ALL_HSR_PRODUCTS } from "@/data/honkaistarrail";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

const HSR_STYLE = `
  :root, [data-theme="light"] {
    --hsr-text:       #5B21B6;
    --hsr-text-dim:   #6D28D9;
    --hsr-dark:       #4C1D95;
    --hsr-bg:         rgba(91, 33, 182, 0.08);
    --hsr-border:     rgba(91, 33, 182, 0.28);
    --hsr-btn-bg:     linear-gradient(135deg, #4C1D95, #7C3AED);
    --hsr-btn-color:  #ffffff;
    --hsr-glow:       rgba(91, 33, 182, 0.22);
  }
  [data-theme="dark"] {
    --hsr-text:       #C4B5FD;
    --hsr-text-dim:   rgba(196,181,253,0.9);
    --hsr-dark:       #7C3AED;
    --hsr-bg:         rgba(196, 181, 253, 0.07);
    --hsr-border:     rgba(196, 181, 253, 0.25);
    --hsr-btn-bg:     linear-gradient(135deg, #4C1D95, #7C3AED);
    --hsr-btn-color:  #ffffff;
    --hsr-glow:       rgba(124, 58, 237, 0.3);
  }
`;

const TABS_ES = [
  { id:"esquirla", label:"💎 Esquirla Onírica" },
  { id:"pases",    label:"🚂 Pase del Expreso" },
];
const TABS_EN = [
  { id:"esquirla", label:"💎 Oneiric Shard"       },
  { id:"pases",    label:"🚂 Express Supply Pass" },
];

const badgeStyle: Record<string, string> = {
  "Popular":"badge-popular", "Oferta":"badge-oferta", "Mejor valor":"badge-valor",
};

const HSR_SERVERS_ES = ["América", "Europa", "Asia", "HK, MO, TW"];
const HSR_SERVERS_EN = ["America", "Europe", "Asia", "HK, MO, TW"];

// ── Description ────────────────────────────────────────────────
function HSRDescription({ productType, bonus }: { productType: string; bonus?: string }) {
  const { lang } = usePreferences();
  const isPase = productType === "pase";
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color:"var(--text)" }}>📋 {lang === "ES" ? "Instrucciones de entrega" : "Delivery instructions"}</h4>

      <div className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
        <span>🎮</span>
        <p><strong style={{ color:"var(--text)" }}>{lang === "ES" ? "Equipo KidStore" : "KidStore Team"}</strong> — PC / Mobile / PS5</p>
      </div>

      {/* Sin contraseña */}
      <div className="rounded-xl p-4 flex gap-3"
        style={{ background:"var(--hsr-bg)", border:"1.5px solid var(--hsr-border)" }}>
        <Check size={15} className="flex-shrink-0 mt-0.5" style={{ color:"var(--hsr-text)" }}/>
        <div className="text-xs">
          <p className="font-bold mb-0.5" style={{ color:"var(--hsr-text)" }}>{lang === "ES" ? "Sin contraseña requerida" : "No password required"}</p>
          <p style={{ color:"var(--text-muted)" }}>
            {lang === "ES" ? <>Solo necesitamos tu <strong style={{ color:"var(--text)" }}>UID</strong> y{" "}<strong style={{ color:"var(--text)" }}>servidor</strong>. Tu cuenta permanece completamente privada.</> : <>We only need your <strong style={{ color:"var(--text)" }}>UID</strong> and{" "}<strong style={{ color:"var(--text)" }}>server</strong>. Your account stays completely private.</>}
          </p>
        </div>
      </div>

      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>❓ {lang === "ES" ? "¿Qué necesitamos?" : "What do we need?"}</p>
        {(lang === "ES" ? ["Tu UID de Honkai: Star Rail.", "El servidor donde tienes tu cuenta."] : ["Your Honkai: Star Rail UID.", "The server where you have your account."]).map((t,i) => (
          <p key={i} className="text-xs flex gap-2" style={{ color:"var(--text-muted)" }}>
            <span>•</span><span>{t}</span>
          </p>
        ))}
      </div>

      {/* Cómo encontrar UID */}
      <div className="rounded-xl p-4 space-y-2.5" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>🆔 {lang === "ES" ? "¿Cómo encontrar tu UID?" : "How to find your UID?"}</p>
        {(lang === "ES" ? [
          "Abre Honkai: Star Rail en tu dispositivo.",
          "Ve al menú del Teléfono Pony → tu perfil de Trailblazer.",
          "Tu UID de 9 dígitos aparecerá debajo de tu nombre.",
        ] : [
          "Open Honkai: Star Rail on your device.",
          "Go to the Pom-Pom Phone menu → your Trailblazer profile.",
          "Your 9-digit UID will appear below your name.",
        ]).map((t,i) => (
          <div key={i} className="flex items-start gap-2.5 text-xs" style={{ color:"var(--text-muted)" }}>
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0 mt-0.5"
              style={{ background:"var(--hsr-dark)" }}>
              {i + 1}
            </span>
            <p>{t}</p>
          </div>
        ))}
      </div>

      {isPase ? (
        <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
          <p className="text-xs font-bold mb-2" style={{ color:"var(--text)" }}>🚂 {lang === "ES" ? "¿Qué incluye el Pase del Expreso?" : "What does the Express Supply Pass include?"}</p>
          {(lang === "ES" ? [
            { icon:"💎", text:"300 Jades Estelares al activar el pase." },
            { icon:"📅", text:"90 Jades Estelares cada día que inicies sesión (30 días)." },
            { icon:"💰", text:"Total potencial: hasta 3.000 Jades en 30 días." },
            { icon:"🔄", text:"Puedes acumular múltiples pases sin límite." },
          ] : [
            { icon:"💎", text:"300 Stellar Jades upon activating the pass." },
            { icon:"📅", text:"90 Stellar Jades every day you log in (30 days)." },
            { icon:"💰", text:"Total potential: up to 3,000 Jades in 30 days." },
            { icon:"🔄", text:"You can stack multiple passes without limit." },
          ]).map((item,i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
              <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <>
          {bonus && (
            <div className="rounded-xl p-4 flex gap-3"
              style={{ background:"var(--hsr-bg)", border:"1px solid var(--hsr-border)" }}>
              <Sparkles size={15} className="flex-shrink-0 mt-0.5" style={{ color:"var(--hsr-text)" }}/>
              <div className="text-xs">
                <p className="font-bold mb-0.5" style={{ color:"var(--hsr-text)" }}>✨ {lang === "ES" ? "Bonus de primera compra" : "First purchase bonus"}</p>
                <p style={{ color:"var(--text-muted)" }}>
                  {lang === "ES" ? <>Primera compra = <strong style={{ color:"var(--text)" }}>doble de Esquirlas</strong>. ({bonus})</> : <>First purchase = <strong style={{ color:"var(--text)" }}>double Shards</strong>. ({bonus})</>}
                </p>
              </div>
            </div>
          )}
          <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
            <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>💎 {lang === "ES" ? "¿Para qué sirven las Esquirlas?" : "What are the Shards used for?"}</p>
            {(lang === "ES" ? [
              { icon:"🎫", text:"Se intercambian por Jade Estelar para el Warp." },
              { icon:"⭐", text:"Cada 10 Warps cuesta 1.600 Jades Estelares." },
              { icon:"🚂", text:"También sirven para activar el Pase del Expreso." },
            ] : [
              { icon:"🎫", text:"Exchange them for Stellar Jade for Warps." },
              { icon:"⭐", text:"Every 10 Warps costs 1,600 Stellar Jades." },
              { icon:"🚂", text:"They can also be used to activate the Express Supply Pass." },
            ]).map((item,i) => (
              <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        {(lang === "ES" ? [
          { icon:"⚡", text:"Entrega en 5-10 minutos." },
          { icon:"✅", text:"100% garantizado. Si no se puede entregar, te devolvemos el dinero." },
          { icon:"🛡️", text:"No necesitamos tu contraseña. Solo UID y servidor." },
          { icon:"🌐", text:"Disponible para todos los servidores globales." },
          { icon:"💬", text:"Soporte disponible por WhatsApp o Messenger." },
        ] : [
          { icon:"⚡", text:"Delivery in 5-10 minutes." },
          { icon:"✅", text:"100% guaranteed. If we can't deliver, you get a full refund." },
          { icon:"🛡️", text:"We don't need your password. Only UID and server." },
          { icon:"🌐", text:"Available for all global servers." },
          { icon:"💬", text:"Support available via WhatsApp or Messenger." },
        ]).map((item,i) => (
          <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
            <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function HonkaiStarRailProductClient({ slug }: { slug: string }) {
  const product = ALL_HSR_PRODUCTS.find(p => p.slug === slug);
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
      game:"Honkai: Star Rail", gameSlug:"honkai-star-rail",
    });
  }

  const inputStyle = (err?: boolean) => ({
    background:"var(--card)",
    border:`1px solid ${err ? "#EF4444" : "var(--border)"}`,
    color:"var(--text)",
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HSR_STYLE }}/>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* Tabs */}
        <div className="sticky top-[65px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth:"none" }}>
              <div className="flex">
                {(lang === "ES" ? TABS_ES : TABS_EN).map(tab => (
                  <Link key={tab.id} href={`/games/honkai-star-rail?tab=${tab.id}`}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: p.tab === tab.id ? "var(--hsr-text)" : "var(--text-muted)" }}>
                    {tab.label}
                    {p.tab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:"var(--hsr-text)" }}/>
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
            <Link href="/" className="hover:opacity-80">{t.checkout.home}</Link>
            <ChevronRight size={11}/>
            <Link href="/games" className="hover:opacity-80">{t.gamePage.games}</Link>
            <ChevronRight size={11}/>
            <Link href="/games/honkai-star-rail" className="hover:opacity-80">Honkai: Star Rail</Link>
            <ChevronRight size={11}/>
            <Link href={`/games/honkai-star-rail?tab=${p.tab}`} className="hover:opacity-80">{p.tabLabel}</Link>
            <ChevronRight size={11}/>
            <span style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* IZQUIERDA */}
            <div className="space-y-6">
              <div className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,var(--hsr-bg),rgba(5,3,20,0.9))", border:"1px solid var(--border)" }}>
                <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill className="object-contain p-8" priority/>
                {p.bonus && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                    style={{ background:"var(--hsr-bg)", border:"1px solid var(--hsr-border)", color:"var(--hsr-text)" }}>
                    ✨ {lang==="EN" ? p.bonusEN || p.bonus : p.bonus}
                  </div>
                )}
              </div>
              <div className="rounded-2xl p-6" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                <HSRDescription productType={p.productType} bonus={p.bonus}/>
              </div>
            </div>

            {/* DERECHA */}
            <div className="space-y-4">

              {p.badge && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badgeStyle[p.badge] ?? "badge-popular"}`}>
                  {badge(p.badge)}
                </span>
              )}

              {/* Nombre + wishlist */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-2xl font-bold" style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</h1>
                  <button onClick={handleWishlist}
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 mt-0.5"
                    style={{ background: wished ? "rgba(239,68,68,0.1)" : "var(--card)", border:`1.5px solid ${wished ? "rgba(239,68,68,0.4)" : "var(--border)"}` }}>
                    <Heart size={18} style={{ color: wished ? "#EF4444" : "var(--text-muted)" }} fill={wished ? "#EF4444" : "none"}/>
                  </button>
                </div>
                {p.subtitle && <p className="text-sm mt-0.5 font-medium" style={{ color:"var(--hsr-text)" }}>{lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}</p>}
                {p.bonus && <p className="text-xs mt-0.5 font-semibold" style={{ color:"#4ADE80" }}>✨ {lang==="EN" ? p.bonusEN || p.bonus : p.bonus}</p>}
                <p className="text-xs mt-0.5" style={{ color:"var(--text-subtle)" }}>{p.format} · {p.region}</p>
              </div>

              {/* Precio */}
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold" style={{ color:"var(--hsr-text)" }}>{formatPrice(p.price)}</p>
                <p className="text-base line-through mb-0.5" style={{ color:"var(--text-subtle)" }}>{formatPrice(p.priceOld)}</p>
                <span className="mb-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#4ADE80" }}>
                  -{discountPct}%
                </span>
              </div>

              {/* Formato + Región */}
              <div className="grid grid-cols-2 gap-3">
                {[{ label:t.product.format, value:p.format }, { label:t.product.region, value:p.region }].map(item => (
                  <div key={item.label} className="rounded-xl px-4 py-3"
                    style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color:"var(--text-subtle)" }}>{item.label}</p>
                    <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Aviso sin contraseña */}
              <div className="rounded-xl p-4 flex gap-3"
                style={{ background:"var(--hsr-bg)", border:"1.5px solid var(--hsr-border)" }}>
                <Info size={15} className="flex-shrink-0 mt-0.5" style={{ color:"var(--hsr-text)" }}/>
                <div className="text-xs">
                  <p className="font-semibold mb-0.5" style={{ color:"var(--hsr-text)" }}>{lang === "ES" ? "Sin necesidad de contraseña" : "No password needed"}</p>
                  <p style={{ color:"var(--text-muted)" }}>
                    {lang === "ES" ? "Solo necesitamos tu UID y servidor. Tus datos de acceso permanecen completamente privados." : "We only need your UID and server. Your login data remains completely private."}
                  </p>
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
                    style={{ color: whatsapp ? "#4ADE80" : "var(--hsr-text)" }}>{lang === "ES" ? "Opción recomendada" : "Recommended option"}</p>
                  <p className="text-xs font-semibold" style={{ color:"var(--text)" }}>
                    {lang === "ES" ? "Prefiero enviar la información por WhatsApp o Messenger" : "I prefer to send the information via WhatsApp or Messenger"}
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
                  {/* UID */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.uid ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "ES" ? "UID de Honkai: Star Rail" : "Honkai: Star Rail UID"}
                      {errors.uid && <span className="normal-case font-normal"> — {lang === "ES" ? "requerido" : "required"}</span>}
                    </label>
                    <input type="text" placeholder="Ej: 600123456"
                      value={fieldUID}
                      onChange={e => { setFieldUID(e.target.value); setErrors(prev => ({ ...prev, uid:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.uid)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.uid ? "#EF4444" : "var(--hsr-dark)")}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.uid ? "#EF4444" : "var(--border)")}/>
                    <p className="text-[10px] mt-1" style={{ color:"var(--text-subtle)" }}>
                      {lang === "ES" ? "Encuéntralo en el Teléfono Pony → tu perfil de Trailblazer." : "Find it in the Pom-Pom Phone → your Trailblazer profile."}
                    </p>
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.game ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "ES" ? "Nombre del Trailblazer / Nick" : "Trailblazer Name / Nick"}
                      {errors.game && <span className="normal-case font-normal"> — {lang === "ES" ? "requerido" : "required"}</span>}
                    </label>
                    <input type="text" placeholder="TuNombreEnHSR"
                      value={fieldGame}
                      onChange={e => { setFieldGame(e.target.value); setErrors(prev => ({ ...prev, game:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.game)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.game ? "#EF4444" : "var(--hsr-dark)")}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.game ? "#EF4444" : "var(--border)")}/>
                  </div>

                  {/* Servidor */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block"
                      style={{ color: errors.server ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "ES" ? "Servidor" : "Server"}
                      {errors.server && <span className="normal-case font-normal"> — {lang === "ES" ? "requerido" : "required"}</span>}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(lang === "ES" ? HSR_SERVERS_ES : HSR_SERVERS_EN).map(sv => {
                        const active = fieldServer === sv;
                        return (
                          <button key={sv}
                            onClick={() => { setFieldServer(active ? "" : sv); setErrors(prev => ({ ...prev, server:false })); }}
                            className="py-3 px-3 rounded-xl text-xs font-semibold text-center transition-all"
                            style={{
                              background: active ? "var(--hsr-bg)" : "var(--card)",
                              border:`1.5px solid ${active ? "var(--hsr-dark)" : "var(--border)"}`,
                              color: active ? "var(--hsr-text)" : "var(--text-muted)",
                              boxShadow: active ? "0 0 0 3px var(--hsr-bg)" : "none",
                            }}>
                            {sv}
                          </button>
                        );
                      })}
                    </div>
                    {errors.server && (
                      <p className="text-[11px] mt-1.5 font-semibold" style={{ color:"#EF4444" }}>
                        {lang === "ES" ? "Selecciona tu servidor" : "Select your server"}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-4 text-xs space-y-2"
                  style={{ background:"rgba(37,211,102,0.06)", border:"1px solid rgba(37,211,102,0.2)", color:"var(--text-muted)" }}>
                  <p className="font-semibold" style={{ color:"var(--text)" }}>{lang === "ES" ? "¿Cómo funciona?" : "How does it work?"}</p>
                  <p>{lang === "ES" ? <>1. Haz clic en <strong style={{ color:"var(--text)" }}>{t.product.buyNow}</strong> y te redirigiremos a WhatsApp.</> : <>1. Click <strong style={{ color:"var(--text)" }}>{t.product.buyNow}</strong> and we will redirect you to WhatsApp.</>}</p>
                  <p>{lang === "ES" ? "2. Envíanos el nombre del producto, tu UID y servidor de HSR." : "2. Send us the product name, your UID and HSR server."}</p>
                  <p>{lang === "ES" ? "3. Nuestro equipo procesará tu pedido en 5-10 minutos." : "3. Our team will process your order in 5-10 minutes."}</p>
                </div>
              )}

              {/* Botones */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: alreadyInCart ? "var(--hsr-bg)" : "var(--card)",
                    border:`1.5px solid ${alreadyInCart || addedCart ? "var(--hsr-dark)" : "var(--border)"}`,
                    color:"var(--hsr-text)",
                  }}>
                  {addedCart ? <Check size={16}/> : <ShoppingCart size={16}/>}
                  {addedCart ? t.product.added : alreadyInCart ? t.product.inCart : t.product.addToCart}
                </button>
                <button onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background:"var(--hsr-btn-bg)", boxShadow:"0 4px 20px var(--hsr-glow)" }}>
                  <Zap size={16}/> {t.product.buyNow}
                </button>
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-6 pt-1">
                {[
                  { icon:<Shield        size={13} className="text-green-400"/>,  text:t.trust.securePayment  },
                  { icon:<Zap           size={13} className="text-yellow-400"/>, text:"5-10 min"     },
                  { icon:<MessageCircle size={13} className="text-blue-400"/>,   text:t.trust.support },
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
