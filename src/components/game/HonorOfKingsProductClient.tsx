"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight, ShoppingCart, Info,
  Shield, Zap, MessageCircle,
  Check, Heart, X, Fingerprint,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_HOK_PRODUCTS } from "@/data/honorofkings";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

const HOK_STYLE = `
  :root, [data-theme="light"] {
    --hok-text:   #B45309;
    --hok-dark:   #92400E;
    --hok-bg:     rgba(180,83,9,0.08);
    --hok-border: rgba(180,83,9,0.25);
    --hok-btn:    linear-gradient(135deg,#92400E,#D97706);
    --hok-glow:   rgba(180,83,9,0.22);
  }
  [data-theme="dark"] {
    --hok-text:   #FCD34D;
    --hok-dark:   #F59E0B;
    --hok-bg:     rgba(252,211,77,0.07);
    --hok-border: rgba(252,211,77,0.22);
    --hok-btn:    linear-gradient(135deg,#92400E,#D97706);
    --hok-glow:   rgba(252,211,77,0.22);
  }
`;

const badgeStyle: Record<string, string> = {
  "Popular":"badge-popular", "Oferta":"badge-oferta", "Mejor valor":"badge-valor",
};

const TABS = [{ id:"tokens", label:"🪙 Tokens" }];

// ── Player ID Guide Modal ──────────────────────────────────────
function PlayerIDGuide({ onClose }: { onClose: () => void }) {
  const { lang } = usePreferences();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.82)", backdropFilter:"blur(8px)" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden flex flex-col"
        style={{ background:"var(--card)", border:"1px solid var(--border)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
          <div>
            <p className="text-sm font-bold" style={{ color:"var(--text)" }}>
              {lang === "ES" ? "🆔 ¿Cómo encontrar tu Player ID?" : "🆔 How to find your Player ID?"}
            </p>
            <p className="text-[11px]" style={{ color:"var(--text-subtle)" }}>
              Honor of Kings
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-70 transition-all"
            style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
            <X size={14}/>
          </button>
        </div>

        {/* Imagen guía */}
        <div className="relative w-full" style={{ aspectRatio:"9/16", maxHeight:"55vh" }}>
          <Image
            src="/honor-of-kings/mi-player-id.png"
            alt="Cómo encontrar tu Player ID en Honor of Kings"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Pasos */}
        <div className="p-5 space-y-3" style={{ background:"var(--card)" }}>
          {(lang === "ES" ? [
            { step:"1", text:'Abre Honor of Kings y ve a tu perfil.' },
            { step:"2", text:'Toca tu avatar o nombre de usuario.' },
            { step:"3", text:'Tu Player ID es el número que aparece debajo de tu nombre.' },
          ] : [
            { step:"1", text:'Open Honor of Kings and go to your profile.' },
            { step:"2", text:'Tap your avatar or username.' },
            { step:"3", text:'Your Player ID is the number shown below your name.' },
          ]).map(item => (
            <div key={item.step} className="flex items-start gap-3 text-xs" style={{ color:"var(--text-muted)" }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 mt-0.5"
                style={{ background:"var(--hok-btn)" }}>
                {item.step}
              </span>
              <p>{item.text}</p>
            </div>
          ))}
          <button onClick={onClose}
            className="w-full mt-2 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01]"
            style={{ background:"var(--hok-btn)", boxShadow:"0 4px 16px var(--hok-glow)" }}>
            {lang === "ES" ? "✓ Entendido" : "✓ Got it"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Description ────────────────────────────────────────────────
function HOKDescription({ tokens, bonus }: { tokens: number; bonus?: number }) {
  const { lang } = usePreferences();
  const total = bonus ? tokens + bonus : tokens;
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color:"var(--text)" }}>📋 {lang === "ES" ? "Instrucciones de entrega" : "Delivery instructions"}</h4>

      <div className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
        <span>🎮</span>
        <p><strong style={{ color:"var(--text)" }}>{lang === "ES" ? "Equipo KidStore" : "KidStore Team"}</strong> — Mobile / PC</p>
      </div>

      {/* Sin contraseña */}
      <div className="rounded-xl p-4 flex gap-3"
        style={{ background:"var(--hok-bg)", border:"1.5px solid var(--hok-border)" }}>
        <Check size={15} className="flex-shrink-0 mt-0.5" style={{ color:"var(--hok-text)" }}/>
        <div className="text-xs space-y-0.5">
          <p className="font-bold" style={{ color:"var(--hok-text)" }}>{lang === "ES" ? "Solo tu Player ID — Sin contraseña" : "Only your Player ID — No password"}</p>
          <p style={{ color:"var(--text-muted)" }}>
            {lang === "ES" ? "Para recargar en Honor of Kings solo necesitamos tu Player ID. No compartirás contraseña ni datos de acceso." : "To top up in Honor of Kings we only need your Player ID. You won't share your password or login data."}
          </p>
        </div>
      </div>

      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>❓ {lang === "ES" ? "¿Qué necesitamos?" : "What do we need?"}</p>
        {(lang === "ES" ? ["Tu Player ID de Honor of Kings.", "Nada más — sin contraseña, sin acceso a tu cuenta."] : ["Your Honor of Kings Player ID.", "Nothing else — no password, no account access."]).map((t,i) => (
          <p key={i} className="text-xs flex gap-2" style={{ color:"var(--text-muted)" }}>
            <span className="flex-shrink-0">•</span><span>{t}</span>
          </p>
        ))}
      </div>

      {/* Resumen de tokens */}
      {bonus && (
        <div className="rounded-xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
          <div className="px-4 py-2.5 flex items-center gap-2"
            style={{ background:"var(--hok-bg)", borderBottom:"1px solid var(--border)" }}>
            <span className="text-sm">🪙</span>
            <p className="text-xs font-bold" style={{ color:"var(--hok-text)" }}>{lang === "ES" ? "Desglose de Tokens" : "Token Breakdown"}</p>
          </div>
          <div className="p-4 space-y-2" style={{ background:"var(--surface)" }}>
            {[
              { label: lang === "ES" ? "Tokens base" : "Base Tokens",    value:`${tokens.toLocaleString()} Tokens`,    color:"var(--text)"    },
              { label: lang === "ES" ? "Tokens de regalo" : "Bonus Tokens", value:`+${bonus.toLocaleString()} Tokens 🎁`, color:"#4ADE80"       },
              { label: lang === "ES" ? "Total recibirás" : "You will receive", value:`${total.toLocaleString()} Tokens`,     color:"var(--hok-text)", bold:true },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-xs">
                <span style={{ color:"var(--text-muted)" }}>{row.label}</span>
                <span className={row.bold ? "text-sm font-black" : "font-bold"} style={{ color:row.color }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        {(lang === "ES" ? [
          { icon:"⚡", text:"Entrega en 5-10 minutos." },
          { icon:"✅", text:"100% garantizado. Si no se puede entregar, te devolvemos el dinero." },
          { icon:"🛡️", text:"No necesitamos tu contraseña. Solo Player ID." },
          { icon:"🌐", text:"Disponible para cuentas de todos los servidores (Global)." },
          { icon:"💬", text:"Soporte disponible por WhatsApp o Messenger." },
        ] : [
          { icon:"⚡", text:"Delivery in 5-10 minutes." },
          { icon:"✅", text:"100% guaranteed. If we can't deliver, you get a full refund." },
          { icon:"🛡️", text:"We don't need your password. Only Player ID." },
          { icon:"🌐", text:"Available for accounts on all servers (Global)." },
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
export default function HonorOfKingsProductClient({ slug }: { slug: string }) {
  const product = ALL_HOK_PRODUCTS.find(p => p.slug === slug);
  if (!product) notFound();
  const p = product;
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();

  const total       = p.bonus ? p.tokens + p.bonus : p.tokens;
  const discountPct = Math.round((1 - p.price / p.priceOld) * 100);

  const [fieldID,   setFieldID]   = useState("");
  const [fieldGame, setFieldGame] = useState("");
  const [whatsapp,  setWhatsapp]  = useState(false);
  const [addedCart, setAddedCart] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [errors,    setErrors]    = useState<Record<string, boolean>>({});

  const { addItem, isInCart }            = useCart();
  const { toggle: toggleWish, isWished } = useWishlist();
  const alreadyInCart = isInCart(p.slug);
  const wished        = isWished(p.slug);

  function validate() {
    if (whatsapp) return true;
    const e: Record<string, boolean> = {};
    if (!fieldID.trim())   e.id   = true;
    if (!fieldGame.trim()) e.game = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildOrderData() {
    return { user:fieldID||undefined, gameName:fieldGame||undefined };
  }

  function handleAddToCart() {
    if (!validate()) return;
    addItem({ slug:p.slug, name:p.name, img:p.img, price:p.price, priceOld:p.priceOld, region:p.region, format:p.format, tabLabel:p.tabLabel, orderData:buildOrderData() });
    setAddedCart(true); setTimeout(() => setAddedCart(false), 2000);
  }

  function handleBuyNow() {
    if (!validate()) return;
    addItem({ slug:p.slug, name:p.name, img:p.img, price:p.price, priceOld:p.priceOld, region:p.region, format:p.format, tabLabel:p.tabLabel, orderData:buildOrderData() });
    window.location.href = "/checkout";
  }

  function handleWishlist() {
    toggleWish({ slug:p.slug, name:p.name, img:p.img, price:p.price, priceOld:p.priceOld, region:p.region, format:p.format, tabLabel:p.tabLabel, game:"Honor of Kings", gameSlug:"honor-of-kings" });
  }

  const inputStyle = (err?: boolean) => ({
    background:"var(--card)", color:"var(--text)",
    border:`1px solid ${err ? "#EF4444" : "var(--border)"}`,
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HOK_STYLE }}/>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* Tab bar */}
        <div className="sticky top-[65px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center">
              {TABS.map(tab => (
                <Link key={tab.id} href="/games/honor-of-kings"
                  className="px-6 py-4 text-sm font-semibold relative"
                  style={{ color:"var(--hok-text)" }}>
                  {tab.label}
                  <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                    style={{ background:"var(--hok-text)" }}/>
                </Link>
              ))}
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
            <Link href="/games/honor-of-kings" className="hover:opacity-80">Honor of Kings</Link>
            <ChevronRight size={11}/>
            <span style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* IZQUIERDA */}
            <div className="space-y-6">
              <div className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio:"1/1", background:"linear-gradient(135deg,var(--hok-bg),rgba(5,3,15,0.92))", border:"1px solid var(--border)" }}>
                <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill className="object-contain p-10" priority/>

                {/* Bonus badge */}
                {p.bonus && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black"
                    style={{ background:"rgba(0,0,0,0.6)", border:"1px solid var(--hok-border)", color:"var(--hok-text)", backdropFilter:"blur(8px)" }}>
                    🎁 +{p.bonus} {lang === "ES" ? "de regalo" : "bonus"}
                  </div>
                )}

                {/* Total badge */}
                {p.bonus && (
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-center gap-2 py-2.5 rounded-xl"
                    style={{ background:"rgba(0,0,0,0.65)", backdropFilter:"blur(8px)", border:"1px solid var(--hok-border)" }}>
                    <span className="text-xs" style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "Total recibirás:" : "You will receive:"}</span>
                    <span className="text-base font-black" style={{ color:"var(--hok-text)" }}>
                      {total.toLocaleString()} Tokens
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-2xl p-6" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                <HOKDescription tokens={p.tokens} bonus={p.bonus}/>
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
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold" style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</h1>
                  {p.bonus && (
                    <p className="text-sm mt-0.5 font-bold" style={{ color:"#4ADE80" }}>
                      🎁 +{p.bonus} Tokens de regalo · Total: {total.toLocaleString()}
                    </p>
                  )}
                  <p className="text-xs mt-0.5" style={{ color:"var(--text-subtle)" }}>{p.format} · {p.region}</p>
                </div>
                <button onClick={handleWishlist}
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: wished ? "rgba(239,68,68,0.1)" : "var(--card)", border:`1.5px solid ${wished ? "rgba(239,68,68,0.4)" : "var(--border)"}` }}>
                  <Heart size={18} style={{ color: wished ? "#EF4444" : "var(--text-muted)" }} fill={wished ? "#EF4444" : "none"}/>
                </button>
              </div>

              {/* Precio */}
              <div className="flex items-end gap-3">
                <p className="text-4xl font-black" style={{ color:"var(--hok-text)" }}>
                  {formatPrice(p.price)}
                </p>
                <div className="mb-1 space-y-0.5">
                  <p className="text-sm line-through" style={{ color:"var(--text-subtle)" }}>{formatPrice(p.priceOld)}</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                    style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#4ADE80" }}>
                    -{discountPct}%
                  </span>
                </div>
              </div>

              {/* Tokens breakdown si hay bonus */}
              {p.bonus && (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{ background:"var(--hok-bg)", border:"1px solid var(--hok-border)" }}>
                    <span className="text-[11px] font-semibold" style={{ color:"var(--text-muted)" }}>
                      {p.tokens.toLocaleString()} {lang === "ES" ? "base" : "base"}
                    </span>
                    <span style={{ color:"var(--text-subtle)" }}>+</span>
                    <span className="text-[11px] font-black" style={{ color:"#4ADE80" }}>
                      {p.bonus} {lang === "ES" ? "regalo" : "bonus"}
                    </span>
                    <span style={{ color:"var(--text-subtle)" }}>=</span>
                    <span className="text-[12px] font-black" style={{ color:"var(--hok-text)" }}>
                      {total.toLocaleString()} Tokens
                    </span>
                  </div>
                </div>
              )}

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
                style={{ background:"var(--hok-bg)", border:"1.5px solid var(--hok-border)" }}>
                <Fingerprint size={15} className="flex-shrink-0 mt-0.5" style={{ color:"var(--hok-text)" }}/>
                <div className="text-xs">
                  <p className="font-semibold mb-0.5" style={{ color:"var(--hok-text)" }}>{lang === "ES" ? "Solo Player ID — Sin contraseña" : "Only Player ID — No password"}</p>
                  <p style={{ color:"var(--text-muted)" }}>
                    {lang === "ES" ? "Para completar tu pedido solo necesitamos tu Player ID. Tus credenciales permanecen completamente privadas." : "To complete your order we only need your Player ID. Your credentials remain completely private."}
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
                    style={{ color: whatsapp ? "#4ADE80" : "var(--hok-text)" }}>{lang === "ES" ? "Opción recomendada" : "Recommended option"}</p>
                  <p className="text-xs font-semibold" style={{ color:"var(--text)" }}>
                    {lang === "ES" ? "Prefiero enviar la información por WhatsApp o Messenger" : "I prefer to send the information via WhatsApp or Messenger"}
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ borderColor: whatsapp ? "#4ADE80" : "var(--border)", background: whatsapp ? "#4ADE80" : "transparent" }}>
                  {whatsapp && <div className="w-2 h-2 rounded-full bg-white"/>}
                </div>
              </button>

              {/* Formulario */}
              {!whatsapp && (
                <div className="space-y-3">
                  {/* Player ID */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: errors.id ? "#EF4444" : "var(--text-subtle)" }}>
                        {lang === "ES" ? "Player ID de Honor of Kings" : "Honor of Kings Player ID"}
                        {errors.id && <span className="normal-case font-normal text-red-400"> — {lang === "ES" ? "requerido" : "required"}</span>}
                      </label>
                      <button onClick={() => setShowGuide(true)}
                        className="text-[11px] font-semibold flex items-center gap-1 hover:opacity-70 transition-all"
                        style={{ color:"var(--hok-text)" }}>
                        <Info size={11}/> {lang === "ES" ? "¿Cómo encontrarlo?" : "How to find it?"}
                      </button>
                    </div>
                    <input type="text" placeholder="Ej: 123456789"
                      value={fieldID}
                      onChange={e => { setFieldID(e.target.value); setErrors(p => ({...p, id:false})); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.id)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.id ? "#EF4444" : "var(--hok-dark)")}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.id ? "#EF4444" : "var(--border)")}/>
                    <p className="text-[10px] mt-1" style={{ color:"var(--text-subtle)" }}>
                      {lang === "ES" ? "Perfil → toca tu avatar → número debajo de tu nombre." : "Profile → tap your avatar → number below your name."}
                    </p>
                  </div>

                  {/* Nick */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.game ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "ES" ? "Nombre de jugador / Nick" : "Player Name / Nick"}
                      {errors.game && <span className="normal-case font-normal text-red-400"> — {lang === "ES" ? "requerido" : "required"}</span>}
                    </label>
                    <input type="text" placeholder="TuNombreEnHOK"
                      value={fieldGame}
                      onChange={e => { setFieldGame(e.target.value); setErrors(p => ({...p, game:false})); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.game)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.game ? "#EF4444" : "var(--hok-dark)")}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.game ? "#EF4444" : "var(--border)")}/>
                  </div>
                </div>
              )}

              {whatsapp && (
                <div className="rounded-xl p-4 text-xs space-y-2"
                  style={{ background:"rgba(37,211,102,0.06)", border:"1px solid rgba(37,211,102,0.2)", color:"var(--text-muted)" }}>
                  <p className="font-semibold" style={{ color:"var(--text)" }}>{lang === "ES" ? "¿Cómo funciona?" : "How does it work?"}</p>
                  <p>{lang === "ES" ? <>1. Haz clic en <strong style={{ color:"var(--text)" }}>{t.product.buyNow}</strong> → te redirigimos a WhatsApp.</> : <>1. Click <strong style={{ color:"var(--text)" }}>{t.product.buyNow}</strong> → we redirect you to WhatsApp.</>}</p>
                  <p>{lang === "ES" ? "2. Envíanos el producto y tu Player ID de HOK." : "2. Send us the product and your HOK Player ID."}</p>
                  <p>{lang === "ES" ? "3. Tu pedido estará listo en 5-10 minutos." : "3. Your order will be ready in 5-10 minutes."}</p>
                </div>
              )}

              {/* Botones */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: alreadyInCart ? "var(--hok-bg)" : "var(--card)",
                    border:`1.5px solid ${alreadyInCart || addedCart ? "var(--hok-dark)" : "var(--border)"}`,
                    color:"var(--hok-text)",
                  }}>
                  {addedCart ? <Check size={16}/> : <ShoppingCart size={16}/>}
                  {addedCart ? t.product.added : alreadyInCart ? t.product.inCart : t.product.addToCart}
                </button>
                <button onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background:"var(--hok-btn)", boxShadow:"0 4px 20px var(--hok-glow)" }}>
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

      {showGuide && <PlayerIDGuide onClose={() => setShowGuide(false)}/>}
    </>
  );
}
