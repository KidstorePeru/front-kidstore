"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight, ShoppingCart, AlertTriangle,
  Shield, Zap, MessageCircle,
  Check, Heart, Sparkles,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_GENSHIN_PRODUCTS } from "@/data/genshinimpact";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

const BRAND       = "#D4AF37";
const BRAND_LIGHT = "#F5CC45";
const BRAND_DARK  = "#92700A";

const TABS_ES = [
  { id:"cristales", label:"💎 Cristales de Génesis" },
  { id:"bendicion", label:"🌙 Bendición Welkin"     },
];
const TABS_EN = [
  { id:"cristales", label:"💎 Genesis Crystals" },
  { id:"bendicion", label:"🌙 Welkin Blessing"  },
];

const badgeStyle: Record<string, string> = {
  "Popular":"badge-popular", "Oferta":"badge-oferta", "Mejor valor":"badge-valor",
};

// ── HoYoverse icon ─────────────────────────────────────────────
function HoyoverseIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z"/>
    </svg>
  );
}

// ── Description ────────────────────────────────────────────────
function GenshinDescription({ productType, bonus }: { productType: string; bonus?: string }) {
  const { lang } = usePreferences();
  const isBendicion = productType === "bendicion";
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color:"var(--text)" }}>📋 {lang === "ES" ? "Instrucciones de entrega" : "Delivery instructions"}</h4>
      <div className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
        <span>🎮</span>
        <p><strong style={{ color:"var(--text)" }}>{lang === "ES" ? "Equipo KidStore" : "KidStore Team"}</strong> — PC / Mobile / PS4 / PS5</p>
      </div>

      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>❓ {lang === "ES" ? "¿Qué necesitamos?" : "What do we need?"}</p>
        {(lang === "ES" ? [
          "Usuario y contraseña de tu cuenta HoYoverse.",
          "Si tienes verificación en dos pasos activada, necesitaremos acceso temporal al correo.",
        ] : [
          "Username and password for your HoYoverse account.",
          "If you have two-step verification enabled, we will need temporary access to your email.",
        ]).map((t,i) => (
          <p key={i} className="text-xs flex gap-2" style={{ color:"var(--text-muted)" }}>
            <span>•</span><span>{t}</span>
          </p>
        ))}
      </div>

      {isBendicion ? (
        <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
          <p className="text-xs font-bold mb-2" style={{ color:"var(--text)" }}>🌙 {lang === "ES" ? "¿Qué incluye la Bendición Welkin?" : "What does the Welkin Blessing include?"}</p>
          {(lang === "ES" ? [
            { icon:"💎", text:"2.700 Gemas del Destino al activar la suscripción." },
            { icon:"🌅", text:"90 Primogemmas cada día que inicies sesión (30 días)." },
            { icon:"📅", text:"Duración: 30 días. Puedes acumular comprando varias veces." },
            { icon:"💰", text:"Total potencial: hasta 5.400 recursos si inicias sesión cada día." },
          ] : [
            { icon:"💎", text:"2,700 Primogems upon activating the subscription." },
            { icon:"🌅", text:"90 Primogems every day you log in (30 days)." },
            { icon:"📅", text:"Duration: 30 days. You can stack by purchasing multiple times." },
            { icon:"💰", text:"Total potential: up to 5,400 resources if you log in every day." },
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
              style={{ background:`rgba(212,175,55,0.08)`, border:`1px solid rgba(212,175,55,0.28)` }}>
              <Sparkles size={15} className="flex-shrink-0 mt-0.5" style={{ color:BRAND_LIGHT }}/>
              <div className="text-xs">
                <p className="font-bold mb-0.5" style={{ color:BRAND_LIGHT }}>✨ {lang === "ES" ? "Bonus de primera compra" : "First purchase bonus"}</p>
                <p style={{ color:"var(--text-muted)" }}>
                  {lang === "ES" ? <>Si es tu primera compra de este paquete, recibirás el <strong style={{ color:"var(--text)" }}>doble de cristales</strong>. ({bonus})</> : <>If this is your first purchase of this pack, you will receive <strong style={{ color:"var(--text)" }}>double crystals</strong>. ({bonus})</>}
                </p>
              </div>
            </div>
          )}
          <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
            <p className="text-xs font-bold mb-2" style={{ color:"var(--text)" }}>💎 {lang === "ES" ? "¿Para qué sirven los Cristales de Génesis?" : "What are Genesis Crystals used for?"}</p>
            {(lang === "ES" ? [
              { icon:"🎫", text:"Intercámbialos por Gemas del Destino para usar en Banners." },
              { icon:"⭐", text:"Cada 10 intentos en Banner de personaje cuesta 1.600 Gemas." },
              { icon:"🌙", text:"También sirven para activar la Bendición de la Luna Welkin." },
            ] : [
              { icon:"🎫", text:"Exchange them for Primogems to use on Banners." },
              { icon:"⭐", text:"Every 10 pulls on a character Banner costs 1,600 Primogems." },
              { icon:"🌙", text:"They can also be used to activate the Welkin Moon Blessing." },
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
          { icon:"🛡️", text:"Tus datos solo se usan para la recarga y no son almacenados." },
          { icon:"🌐", text:"Disponible para cuentas de cualquier servidor (Global)." },
          { icon:"💬", text:"Soporte disponible por WhatsApp o Messenger." },
        ] : [
          { icon:"⚡", text:"Delivery in 5-10 minutes." },
          { icon:"✅", text:"100% guaranteed. If we can't deliver, you get a full refund." },
          { icon:"🛡️", text:"Your data is only used for the top-up and is not stored." },
          { icon:"🌐", text:"Available for accounts on any server (Global)." },
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
export default function GenshinImpactProductClient({ slug }: { slug: string }) {
  const product = ALL_GENSHIN_PRODUCTS.find(p => p.slug === slug);
  if (!product) notFound();

  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();
  const p           = product;
  const discountPct = Math.round((1 - p.price / p.priceOld) * 100);

  const [whatsapp,   setWhatsapp]   = useState(false);
  const [addedCart,  setAddedCart]  = useState(false);
  const [fieldUser,  setFieldUser]  = useState("");
  const [fieldGame,  setFieldGame]  = useState("");
  const [fieldServer,setFieldServer]= useState("");
  const [errors,     setErrors]     = useState<Record<string, boolean>>({});

  const { addItem, isInCart }            = useCart();
  const { toggle: toggleWish, isWished } = useWishlist();
  const alreadyInCart = isInCart(p.slug);
  const wished        = isWished(p.slug);

  // Genshin servers
  const SERVERS = lang === "ES" ? ["América", "Europa", "Asia", "HK/MO/TW"] : ["America", "Europe", "Asia", "HK/MO/TW"];

  function validate() {
    if (whatsapp) return true;
    const e: Record<string, boolean> = {};
    if (!fieldUser.trim())   e.user   = true;
    if (!fieldGame.trim())   e.gameName = true;
    if (!fieldServer.trim()) e.server = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildOrderData() {
    return {
      user:     fieldUser   || undefined,
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
      game:"Genshin Impact", gameSlug:"genshin-impact",
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
                {(lang === "ES" ? TABS_ES : TABS_EN).map(tab => (
                  <Link key={tab.id} href={`/games/genshin-impact?tab=${tab.id}`}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: p.tab === tab.id ? BRAND_LIGHT : "var(--text-muted)" }}>
                    {tab.label}
                    {p.tab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:`linear-gradient(90deg,${BRAND_DARK},${BRAND_LIGHT})` }}/>
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
            <Link href="/games/genshin-impact" className="hover:opacity-80">Genshin Impact</Link>
            <ChevronRight size={11}/>
            <Link href={`/games/genshin-impact?tab=${p.tab}`} className="hover:opacity-80">{p.tabLabel}</Link>
            <ChevronRight size={11}/>
            <span style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* IZQUIERDA */}
            <div className="space-y-6">
              <div className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio:"4/3", background:`linear-gradient(135deg,rgba(212,175,55,0.15),rgba(10,8,30,0.85))`, border:"1px solid var(--border)" }}>
                <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill className="object-cover" priority/>
                {/* Overlay bottom */}
                <div className="absolute inset-x-0 bottom-0 h-20"
                  style={{ background:"linear-gradient(to top,rgba(0,0,0,0.6),transparent)" }}/>
                {p.bonus && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                    style={{ background:`rgba(212,175,55,0.2)`, border:`1px solid rgba(212,175,55,0.5)`, color:BRAND_LIGHT }}>
                    ✨ {lang==="EN" ? p.bonusEN || p.bonus : p.bonus}
                  </div>
                )}
              </div>
              <div className="rounded-2xl p-6" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                <GenshinDescription productType={p.productType} bonus={p.bonus}/>
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
                {p.subtitle && <p className="text-sm mt-1 font-medium" style={{ color:BRAND_LIGHT }}>{lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}</p>}
                {p.bonus && (
                  <p className="text-xs mt-0.5 font-semibold" style={{ color:"#4ADE80" }}>✨ {lang==="EN" ? p.bonusEN || p.bonus : p.bonus}</p>
                )}
                <p className="text-xs mt-0.5" style={{ color:"var(--text-subtle)" }}>{p.format} · {p.region}</p>
              </div>

              {/* Precio */}
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold" style={{ color:BRAND_LIGHT }}>{formatPrice(p.price)}</p>
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

              {/* Aviso HoYoverse */}
              <div className="rounded-xl p-4 flex gap-3"
                style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)" }}>
                <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5"/>
                <div className="text-xs" style={{ color:"var(--text-muted)" }}>
                  <p className="font-semibold text-red-400 mb-0.5">{lang === "ES" ? "Aviso importante" : "Important notice"}</p>
                  <p>{lang === "ES" ? "Necesitaremos acceder a tu cuenta HoYoverse para realizar la recarga. Tus datos solo se utilizan para completar la compra dentro del juego." : "We will need to access your HoYoverse account to complete the top-up. Your data is only used to complete the purchase within the game."}</p>
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
                    style={{ color: whatsapp ? "#4ADE80" : BRAND_LIGHT }}>{lang === "ES" ? "Opción recomendada" : "Recommended option"}</p>
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
                  {/* Usuario HoYoverse */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.user ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "ES" ? "Usuario / Email HoYoverse" : "HoYoverse Username / Email"}
                      {errors.user && <span className="normal-case font-normal"> — {lang === "ES" ? "requerido" : "required"}</span>}
                    </label>
                    <input type="text" placeholder="correo@ejemplo.com"
                      value={fieldUser}
                      onChange={e => { setFieldUser(e.target.value); setErrors(prev => ({ ...prev, user:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.user)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : BRAND)}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : "var(--border)")}/>
                  </div>

                  {/* Seguridad: nunca se pide la contraseña en la web */}
                  <p className="text-[11px] flex items-start gap-1.5 -mt-1" style={{ color:"var(--text-subtle)" }}>
                    <span aria-hidden>🔒</span> {t.form.noPasswordNote}
                  </p>

                  {/* Nombre en el juego */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.gameName ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "ES" ? "Nombre del viajero en el juego" : "Traveler name in game"}
                      {errors.gameName && <span className="normal-case font-normal"> — {lang === "ES" ? "requerido" : "required"}</span>}
                    </label>
                    <input type="text" placeholder="TuNombreDeViajero"
                      value={fieldGame}
                      onChange={e => { setFieldGame(e.target.value); setErrors(prev => ({ ...prev, gameName:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.gameName)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.gameName ? "#EF4444" : BRAND)}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.gameName ? "#EF4444" : "var(--border)")}/>
                  </div>

                  {/* Servidor */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block"
                      style={{ color: errors.server ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "ES" ? "Servidor de Genshin Impact" : "Genshin Impact Server"}
                      {errors.server && <span className="normal-case font-normal"> — {lang === "ES" ? "requerido" : "required"}</span>}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {SERVERS.map(sv => {
                        const active = fieldServer === sv;
                        return (
                          <button key={sv}
                            onClick={() => { setFieldServer(active ? "" : sv); setErrors(prev => ({ ...prev, server:false })); }}
                            className="py-3 px-3 rounded-xl text-xs font-semibold text-center transition-all"
                            style={{
                              background: active ? `rgba(212,175,55,0.12)` : "var(--card)",
                              border:`1.5px solid ${active ? BRAND : "var(--border)"}`,
                              color: active ? BRAND_LIGHT : "var(--text-muted)",
                              boxShadow: active ? `0 0 0 3px rgba(212,175,55,0.1)` : "none",
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

                  {/* Medio de acceso */}
                  <div className="rounded-xl px-4 py-3 flex items-center gap-3"
                    style={{ background:"var(--card)", border:`1.5px solid rgba(212,175,55,0.3)` }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background:`rgba(212,175,55,0.12)` }}>
                      <HoyoverseIcon size={18}/>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color:"var(--text-subtle)" }}>
                        {lang === "ES" ? "Medio de acceso" : "Access method"}
                      </p>
                      <p className="text-sm font-bold" style={{ color:BRAND_LIGHT }}>{lang === "ES" ? "Cuenta HoYoverse" : "HoYoverse Account"}</p>
                    </div>
                    <Check size={16} className="ml-auto flex-shrink-0" style={{ color:BRAND_LIGHT }}/>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-4 text-xs space-y-2"
                  style={{ background:"rgba(37,211,102,0.06)", border:"1px solid rgba(37,211,102,0.2)", color:"var(--text-muted)" }}>
                  <p className="font-semibold" style={{ color:"var(--text)" }}>{lang === "ES" ? "¿Cómo funciona?" : "How does it work?"}</p>
                  <p>{lang === "ES" ? <>1. Haz clic en <strong style={{ color:"var(--text)" }}>{t.product.buyNow}</strong> y te redirigiremos a WhatsApp.</> : <>1. Click <strong style={{ color:"var(--text)" }}>{t.product.buyNow}</strong> and we will redirect you to WhatsApp.</>}</p>
                  <p>{lang === "ES" ? "2. Envíanos el nombre del producto, tu usuario HoYoverse y servidor." : "2. Send us the product name, your HoYoverse username and server."}</p>
                  <p>{lang === "ES" ? "3. Nuestro equipo procesará tu pedido en 5-10 minutos." : "3. Our team will process your order in 5-10 minutes."}</p>
                </div>
              )}

              {/* Botones */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: alreadyInCart ? `rgba(212,175,55,0.1)` : "var(--card)",
                    border:`1.5px solid ${alreadyInCart || addedCart ? BRAND : "var(--border)"}`,
                    color: BRAND_LIGHT,
                  }}>
                  {addedCart ? <Check size={16}/> : <ShoppingCart size={16}/>}
                  {addedCart ? t.product.added : alreadyInCart ? t.product.inCart : t.product.addToCart}
                </button>
                <button onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background:`linear-gradient(135deg,${BRAND_DARK},${BRAND})`,
                    color:"#0f172a",
                    boxShadow:`0 4px 20px ${BRAND}50`,
                  }}>
                  <Zap size={16}/> {t.product.buyNow}
                </button>
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-6 pt-1">
                {[
                  { icon:<Shield        size={13} className="text-green-400"/>,  text:t.trust.securePayment    },
                  { icon:<Zap           size={13} className="text-yellow-400"/>, text:"5-10 min"       },
                  { icon:<MessageCircle size={13} className="text-blue-400"/>,   text:t.trust.support   },
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
