"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight, ShoppingCart, AlertTriangle,
  Shield, Zap, Info, X, MessageCircle,
  Check, Heart,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_ROCKET_LEAGUE_PRODUCTS } from "@/data/rocketleague";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

// ── Tabs ────────────────────────────────────────────────────────
function getTabs(lang: string) {
  return [
    { id:"creditos",  label: lang === "EN" ? "Credits"  : "Créditos" },
    { id:"paquetes",  label: lang === "EN" ? "Bundles"  : "Paquetes" },
  ];
}

// ── Badge classes ────────────────────────────────────────────────
const badgeClass: Record<string, string> = {
  "Popular":"badge-popular", "Oferta":"badge-oferta", "Mejor valor":"badge-valor",
};

// ── Platform SVG icons ───────────────────────────────────────────
function PlatformIcon({ id, size = 22 }: { id: string; size?: number }) {
  if (id === "epic") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M3 2h18v2H3zm0 18h18v2H3zM3 2v20h2V2zm16 0v20h2V2zM8 7h8v2H8zm0 4h8v2H8zm0 4h5v2H8z"/>
    </svg>
  );
  if (id === "xbox") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M4.102 5.384C2.795 6.99 2 9.05 2 11.3c0 3.117 1.538 5.876 3.903 7.575C7.25 16.454 9.8 13.587 12 11.3c2.2 2.287 4.75 5.154 6.097 7.575A9.93 9.93 0 0 0 22 11.3c0-2.25-.795-4.31-2.102-5.916 0 0-1.575-1.885-3.82.204C14.898 6.568 13.37 8.17 12 9.6c-1.37-1.43-2.899-3.032-4.078-4.012-2.245-2.09-3.82-.204-3.82-.204ZM12 2c-1.73 0-3.355.43-4.773 1.19C8.465 1.94 10.62 3.8 12 5.3c1.38-1.5 3.535-3.36 4.773-2.11A9.952 9.952 0 0 0 12 2Z"/>
    </svg>
  );
  if (id === "playstation") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M8.984 2.596v14.47l3.915 1.338V6.688c0-.676.3-1.15.78-.983.6.207.72.9.72 1.575v5.645c1.74.976 4.8.107 4.8-3.584 0-3.794-1.62-5.423-4.8-6.36-1.2-.366-3.315-.69-5.415-.385zM0 17.34l5.04 1.664V16.56L0 14.924v2.416zm5.04 1.664l4.575-1.49V16.08l-4.575 1.489v1.435z"/>
    </svg>
  );
  if (id === "steam") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0z"/>
    </svg>
  );
  if (id === "switch") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M14.176 24h3.674c3.376 0 6.15-2.774 6.15-6.15V6.15C24 2.775 21.226 0 17.85 0H14.1c-.074 0-.15.074-.15.15v23.7c-.001.076.075.15.226.15zm4.574-13.199c1.351 0 2.449 1.098 2.449 2.449s-1.098 2.449-2.449 2.449-2.449-1.098-2.449-2.449 1.098-2.449 2.449-2.449zM9.824 0H6.15C2.775 0 0 2.775 0 6.15v11.7C0 21.226 2.775 24 6.15 24h3.674c.151 0 .226-.074.226-.15V.15C10.05.074 9.975 0 9.824 0zm-3.6 10.801c1.351 0 2.449 1.098 2.449 2.449s-1.098 2.449-2.449 2.449S3.775 14.6 3.775 13.25s1.098-2.449 2.449-2.449z"/>
    </svg>
  );
  if (id === "facebook") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12Z"/>
    </svg>
  );
  if (id === "google") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"/>
    </svg>
  );
  if (id === "apple") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z"/>
    </svg>
  );
  if (id === "lego") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm3 3h2v2H8V8zm6 0h2v2h-2V8zm-3 4h2v2h-2v-2zm-3 0h2v2H8v-2zm6 0h2v2h-2v-2z"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M9 2C7.9 2 7 2.9 7 4v1H4C2.9 5 2 5.9 2 7v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3V4c0-1.1-.9-2-2-2H9zm0 2h6v1H9V4zm-5 3h16v13H4V7zm3 2v2h2V9H7zm4 0v2h2V9h-2zm4 0v2h2V9h-2zM7 13v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z"/>
    </svg>
  );
}

const PCOL: Record<string, string> = {
  epic:"#2a2a2a", xbox:"#107C10", facebook:"#1877F2", google:"#4285F4",
  playstation:"#003791", steam:"#1b2838", apple:"#000000", lego:"#FFD500",
  switch:"#E60012",
};

const ALL_PLATFORMS = [
  { id:"epic",        label:"Epic Games"      },
  { id:"xbox",        label:"Xbox"            },
  { id:"facebook",    label:"Facebook"        },
  { id:"google",      label:"Google"          },
  { id:"playstation", label:"PlayStation"      },
  { id:"steam",       label:"Steam"           },
  { id:"apple",       label:"Apple"           },
  { id:"lego",        label:"LEGO"            },
];

// ── Aviso Turquía ────────────────────────────────────────────────
function TurkeyNotice({ onOpen }: { onOpen: () => void }) {
  const { lang } = usePreferences();
  return (
    <div className="rounded-xl p-4 flex gap-3"
      style={{ background:"rgba(180,100,0,0.09)", border:"1.5px solid rgba(180,100,0,0.35)" }}>
      <Info size={16} className="flex-shrink-0 mt-0.5" style={{ color:"#C27803" }}/>
      <div className="text-xs">
        <p className="font-bold mb-1.5" style={{ color:"#C27803" }}>
          ⚠️ {lang === "EN" ? "Make sure your account is in the Turkey region" : "Asegúrate que tu cuenta está en la región Turquía"}
        </p>
        <p className="mb-2.5" style={{ color:"var(--text-muted)" }}>
          {lang === "EN" ? "These prices are exclusive to accounts configured in the TRY region (Turkish Lira)." : "Estos precios son exclusivos para cuentas configuradas en la región TRY (Lira Turca)."}
        </p>
        <button onClick={onOpen}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all hover:opacity-80"
          style={{ background:"rgba(180,100,0,0.12)", border:"1.5px solid rgba(180,100,0,0.4)", color:"#C27803" }}>
          🖼️ {lang === "EN" ? "View reference image" : "Ver imagen de referencia"}
        </button>
      </div>
    </div>
  );
}

// ── WhatsApp toggle ──────────────────────────────────────────────
function WhatsappToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  const { lang } = usePreferences();
  return (
    <button onClick={onToggle}
      className="w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left"
      style={{ background: active ? "rgba(37,211,102,0.08)" : "var(--card)", border:`1px solid ${active ? "rgba(37,211,102,0.35)" : "var(--border)"}` }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
        style={{ background: active ? "rgba(37,211,102,0.15)" : "var(--surface)" }}>💬</div>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
          style={{ color: active ? "#4ADE80" : "var(--brand-light)" }}>{lang === "EN" ? "Recommended option" : "Opción recomendada"}</p>
        <p className="text-xs font-semibold" style={{ color:"var(--text)" }}>
          {lang === "EN" ? "I prefer to send the information via WhatsApp or Messenger" : "Prefiero enviar la información por WhatsApp o Messenger"}
        </p>
      </div>
      <div className="mt-0.5 flex-shrink-0">
        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
          style={{ borderColor: active ? "#4ADE80" : "var(--border)", background: active ? "#4ADE80" : "transparent" }}>
          {active && <div className="w-2 h-2 rounded-full bg-white"/>}
        </div>
      </div>
    </button>
  );
}

// ── WhatsApp instructions block ──────────────────────────────────
function WhatsappInstructions() {
  const { lang } = usePreferences();
  const t = useT();
  return (
    <div className="rounded-xl p-4 text-xs space-y-2"
      style={{ background:"rgba(37,211,102,0.06)", border:"1px solid rgba(37,211,102,0.2)", color:"var(--text-muted)" }}>
      <p className="font-semibold" style={{ color:"var(--text)" }}>{lang === "EN" ? "How does it work?" : "¿Cómo funciona?"}</p>
      <p>{lang === "EN" ? "1. Click on" : "1. Haz clic en"} <strong style={{ color:"var(--text)" }}>{t.product.buyNow}</strong> {lang === "EN" ? "and we'll redirect you to WhatsApp." : "y te redirigiremos a WhatsApp."}</p>
      <p>{lang === "EN" ? "2. Send us the product name and your account info." : "2. Envíanos el nombre del producto y la info de tu cuenta."}</p>
      <p>{lang === "EN" ? "3. Our team will process your order in minutes." : "3. Nuestro equipo procesará tu pedido en minutos."}</p>
    </div>
  );
}

// ── Platform button grid ─────────────────────────────────────────
function PlatformGrid({
  platforms, selected, onSelect,
}: { platforms: typeof ALL_PLATFORMS; selected: string | null; onSelect: (id: string) => void }) {
  const { lang } = usePreferences();
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block"
        style={{ color:"var(--text-subtle)" }}>{lang === "EN" ? "Rocket League access method" : "Medio de acceso a Rocket League"}</label>
      <div className="grid grid-cols-4 gap-2">
        {platforms.map(pl => {
          const color  = PCOL[pl.id] ?? "#666";
          const active = selected === pl.id;
          return (
            <button key={pl.id} onClick={() => onSelect(pl.id)}
              className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl text-center transition-all"
              style={{
                background: active ? `${color}18` : "var(--card)",
                border:`1.5px solid ${active ? color : "var(--border)"}`,
                boxShadow: active ? `0 0 0 3px ${color}18` : "none",
              }}>
              <span style={{ color: active ? color : "var(--text-muted)" }}>
                <PlatformIcon id={pl.id} size={22}/>
              </span>
              <span className="text-[10px] font-semibold leading-tight"
                style={{ color: active ? color : "var(--text-muted)" }}>{pl.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Descripción: Créditos / Paquetes (con credenciales) ─────────
function DescCredenciales({ type }: { type: "creditos" | "paquete" }) {
  const { lang } = usePreferences();
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color:"var(--text)" }}>📋 {lang === "EN" ? "Delivery instructions" : "Instrucciones de entrega"}</h4>
      <div className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
        <span>🎮</span>
        <p><strong style={{ color:"var(--text)" }}>{lang === "EN" ? "Rocket League Team" : "Equipo Rocket League"}</strong> — {lang === "EN" ? "Available on all platforms" : "Disponible en todas las plataformas"}</p>
      </div>
      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>❓ {lang === "EN" ? "What do we need?" : "¿Qué necesitamos?"}</p>
        {(lang === "EN"
          ? ["Your Epic Games account data / linked platform."]
          : ["Los datos de tu cuenta Epic Games / plataforma vinculada."]
        ).map((t,i) => (
          <p key={i} className="text-xs flex gap-2" style={{ color:"var(--text-muted)" }}><span>•</span><span>{t}</span></p>
        ))}
      </div>
      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        {(lang === "EN" ? [
          { icon:"✅", text:"100% guaranteed credits delivery." },
          { icon:"🛡️",text:"Your data is only used to complete the purchase." },
          { icon:"⚡", text:"Delivery in 5-10 minutes" },
          { icon:"🛒", text:"Credits available on all linked platforms." },
          { icon:"💡", text:"Epic Games account linked to your platform, no parental controls (18+)." },
        ] : [
          { icon:"✅", text:"Entrega de créditos 100% garantizada." },
          { icon:"🛡️",text:"Tus datos solo se usan para completar la compra." },
          { icon:"⚡", text:"Entrega en 5-10 minutos" },
          { icon:"🛒", text:"Créditos disponibles en todas las plataformas vinculadas." },
          { icon:"💡", text:"Cuenta Epic Games vinculada a tu plataforma, sin controles parentales (18+)." },
        ]).map((item,i) => (
          <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
            <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function RocketLeagueProductClient({ slug }: { slug: string }) {
  const product = ALL_ROCKET_LEAGUE_PRODUCTS.find(p => p.slug === slug);
  if (!product) notFound();

  const p           = product;
  const type        = p.productType;

  const { addItem, isInCart } = useCart();
  const { toggle: toggleWish, isWished } = useWishlist();
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();
  const TABS = getTabs(lang);

  const displayName = lang==="EN" ? (p.nameEN || p.name) ?? (p.amountEN || p.amount) ?? "" : p.name ?? p.amount ?? "";

  // ── State ─────────────────────────────────────────────────────
  const [whatsapp,     setWhatsapp]     = useState(false);
  const [platform,     setPlatform]     = useState<string | null>(null);
  const [lightbox,     setLightbox]     = useState(false);
  const [addedCart,    setAddedCart]    = useState(false);

  // Precio activo
  const activePrice    = p.price;
  const activePriceOld = p.priceOld;
  const discountPct    = Math.round((1 - activePrice / activePriceOld) * 100);
  const activeSubtitle = lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle;
  const alreadyInCart  = isInCart(p.slug);
  const wished         = isWished(p.slug);

  // ── Form state ────────────────────────────────────────────────
  const [fieldUser,     setFieldUser]     = useState("");
  const [fieldGameName, setFieldGameName] = useState("");
  const [errors,        setErrors]        = useState<Record<string, boolean>>({});

  function validate(): boolean {
    if (whatsapp) return true;
    const e: Record<string, boolean> = {};
    if (!fieldUser.trim())     e.user     = true;
    if (!fieldGameName.trim()) e.gameName = true;
    if (!platform)             e.platform = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildOrderData() {
    return {
      user:     fieldUser     || undefined,
      gameName: fieldGameName || undefined,
      platform: platform      || undefined,
    };
  }

  function handleAddToCart() {
    if (!validate()) return;
    addItem({
      slug:      p.slug,
      name:      displayName,
      img:       p.img,
      price:     activePrice,
      priceOld:  activePriceOld,
      region:    p.region,
      format:    p.format,
      tabLabel:  p.tabLabel,
      orderData: buildOrderData(),
    });
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 2000);
  }

  function handleBuyNow() {
    if (!validate()) return;
    addItem({
      slug:      p.slug,
      name:      displayName,
      img:       p.img,
      price:     activePrice,
      priceOld:  activePriceOld,
      region:    p.region,
      format:    p.format,
      tabLabel:  p.tabLabel,
      orderData: buildOrderData(),
    });
    window.location.href = "/checkout";
  }

  function handleWishlist() {
    toggleWish({
      slug:     p.slug,
      name:     displayName,
      img:      p.img,
      price:    activePrice,
      priceOld: activePriceOld,
      region:   p.region,
      format:   p.format,
      tabLabel: p.tabLabel,
      game:     "Rocket League",
      gameSlug: "rocket-league",
    });
  }

  // ── Qué secciones mostrar ─────────────────────────────────────
  const showTurkeyNotice   = p.needsTurkey;
  const showSecurityNotice = true;

  // Reference image for Turkey notice lightbox
  const referenceImg = "/rocket-league/ref-turkey.png";

  return (
    <>
      <Navbar />
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* ── Barra de tabs ─────────────────────────────────── */}
        <div className="sticky top-[65px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth:"none" }}>
              <div className="flex">
                {TABS.map(tab => (
                  <Link key={tab.id} href={`/games/rocket-league?tab=${tab.id}`}
                    className="flex-shrink-0 px-5 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: p.tab === tab.id ? "var(--brand-light)" : "var(--text-muted)" }}>
                    {tab.label}
                    {p.tab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:"linear-gradient(90deg,#EA580C,#F97316)" }}/>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">

          {/* ── Breadcrumb ────────────────────────────────────── */}
          <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap" style={{ color:"var(--text-subtle)" }}>
            <Link href="/" className="hover:opacity-80">{t.checkout.home}</Link>
            <ChevronRight size={11}/>
            <Link href="/games" className="hover:opacity-80">{t.gamePage.games}</Link>
            <ChevronRight size={11}/>
            <Link href="/games/rocket-league" className="hover:opacity-80">Rocket League</Link>
            <ChevronRight size={11}/>
            <Link href={`/games/rocket-league?tab=${p.tab}`} className="hover:opacity-80">{lang === "EN" ? p.tabLabelEN || p.tabLabel : p.tabLabel}</Link>
            <ChevronRight size={11}/>
            <span style={{ color:"var(--text)" }}>{displayName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* ── IZQUIERDA: imagen + descripción ─────────────── */}
            <div className="space-y-6">
              <div className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,rgba(234,88,12,0.18),rgba(15,10,40,0.7))", border:"1px solid var(--border)" }}>
                <Image src={p.img} alt={displayName} fill className="object-contain p-8" priority/>
              </div>
              <div className="rounded-2xl p-6" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                <DescCredenciales type={type as "creditos" | "paquete"} />
              </div>
            </div>

            {/* ── DERECHA: formulario ──────────────────────────── */}
            <div className="space-y-4">

              {/* Badge */}
              {p.badge && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badgeClass[p.badge] ?? "badge-popular"}`}>
                  {badge(p.badge)}
                </span>
              )}

              {/* Nombre + wishlist */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-2xl font-bold" style={{ color:"var(--text)" }}>{displayName}</h1>
                  <button onClick={handleWishlist}
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 mt-0.5"
                    style={{
                      background: wished ? "rgba(239,68,68,0.1)" : "var(--card)",
                      border: `1.5px solid ${wished ? "rgba(239,68,68,0.4)" : "var(--border)"}`,
                    }}
                    title={wished ? (lang === "EN" ? "Remove from wishlist" : "Quitar de lista de deseos") : (lang === "EN" ? "Add to wishlist" : "Añadir a lista de deseos")}>
                    <Heart size={18}
                      style={{ color: wished ? "#EF4444" : "var(--text-muted)" }}
                      fill={wished ? "#EF4444" : "none"}
                    />
                  </button>
                </div>
                {activeSubtitle && (
                  <p className="text-sm mt-1" style={{ color:"var(--text-subtle)" }}>{activeSubtitle}</p>
                )}
                {p.amount && p.name && (
                  <p className="text-sm mt-1 font-semibold" style={{ color:"var(--brand-light)" }}>{lang==="EN" ? p.amountEN || p.amount : p.amount}</p>
                )}
              </div>

              {/* Precio */}
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold" style={{ color:"var(--brand-light)" }}>S/ {activePrice.toFixed(2)}</p>
                <p className="text-base line-through mb-0.5" style={{ color:"var(--text-subtle)" }}>S/ {activePriceOld.toFixed(2)}</p>
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
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color:"var(--text-subtle)" }}>
                      {item.label}
                    </p>
                    <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Aviso seguridad */}
              {showSecurityNotice && (
                <div className="rounded-xl p-4 flex gap-3"
                  style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)" }}>
                  <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5"/>
                  <div className="text-xs" style={{ color:"var(--text-muted)" }}>
                    <p className="font-semibold text-red-400 mb-0.5">{lang === "EN" ? "Important notice" : "Aviso importante"}</p>
                    <p>{lang === "EN" ? "We will need access to your account to complete the top-up. Your data is only used to complete the purchase within the game." : "Necesitaremos acceder a tu cuenta para realizar la recarga. Tus datos solo se utilizan para completar la compra dentro del juego."}</p>
                  </div>
                </div>
              )}

              {/* Aviso Turquía */}
              {showTurkeyNotice && <TurkeyNotice onOpen={() => setLightbox(true)} />}

              {/* Toggle WhatsApp */}
              <WhatsappToggle active={whatsapp} onToggle={() => setWhatsapp(!whatsapp)} />

              {/* Formulario */}
              {!whatsapp ? (
                <div className="space-y-3">

                  {/* Credenciales */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.user ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "EN" ? "Username / Email / Phone" : "Usuario / Correo / Teléfono"} {errors.user && <span className="normal-case font-normal">— {lang === "EN" ? "required" : "requerido"}</span>}
                    </label>
                    <input
                      type="text"
                      placeholder="tu_usuario / correo@email.com"
                      value={fieldUser}
                      onChange={e => { setFieldUser(e.target.value); setErrors(prev => ({ ...prev, user: false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background:"var(--card)",
                        border:`1px solid ${errors.user ? "#EF4444" : "var(--border)"}`,
                        color:"var(--text)",
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : "#EA580C")}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : "var(--border)")}
                    />
                  </div>
                  <p className="text-[11px] flex items-start gap-1.5 -mt-1" style={{ color:"var(--text-subtle)" }}>
                    <span aria-hidden>🔒</span> {t.form.noPasswordNote}
                  </p>

                  {/* Nombre en el juego */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.gameName ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "EN" ? "In-game username" : "Nombre de usuario en el juego"}
                      {errors.gameName && <span className="normal-case font-normal"> — {lang === "EN" ? "required" : "requerido"}</span>}
                    </label>
                    <input
                      type="text"
                      placeholder="TuNombreDeJugador"
                      value={fieldGameName}
                      onChange={e => { setFieldGameName(e.target.value); setErrors(prev => ({ ...prev, gameName: false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{
                        background:"var(--card)",
                        border:`1px solid ${errors.gameName ? "#EF4444" : "var(--border)"}`,
                        color:"var(--text)",
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.gameName ? "#EF4444" : "#EA580C")}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.gameName ? "#EF4444" : "var(--border)")}
                    />
                  </div>

                  {/* Plataformas */}
                  <div>
                    <PlatformGrid
                      platforms={ALL_PLATFORMS}
                      selected={platform}
                      onSelect={id => { setPlatform(platform === id ? null : id); setErrors(prev => ({ ...prev, platform: false })); }}
                    />
                    {errors.platform && (
                      <p className="text-[11px] mt-1.5 font-semibold" style={{ color:"#EF4444" }}>
                        {lang === "EN" ? "Select a Rocket League access method" : "Selecciona un medio de acceso a Rocket League"}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <WhatsappInstructions />
              )}

              {/* Botones */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: alreadyInCart ? "rgba(234,88,12,0.12)" : "var(--card)",
                    border:`1.5px solid ${alreadyInCart || addedCart ? "#EA580C" : "var(--brand)"}`,
                    color:"var(--brand-light)",
                  }}>
                  {addedCart ? <Check size={16}/> : <ShoppingCart size={16}/>}
                  {addedCart ? t.product.added : alreadyInCart ? t.product.inCart : t.product.addToCart}
                </button>
                <button onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background:"linear-gradient(135deg,#EA580C,#C2410C)", boxShadow:"0 4px 20px rgba(234,88,12,0.4)" }}>
                  <Zap size={16}/> {t.product.buyNow}
                </button>
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-6 pt-1">
                {[
                  { icon:<Shield        size={13} className="text-green-400"/>,  text:t.trust.securePayment    },
                  { icon:<Zap           size={13} className="text-yellow-400"/>, text:t.trust.instantDelivery },
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

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,0.88)", backdropFilter:"blur(8px)" }}
          onClick={() => setLightbox(false)}>
          <div className="relative max-w-5xl w-full rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
            style={{ border:"1px solid var(--border)" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ background:"var(--card)", borderBottom:"1px solid var(--border)" }}>
              <div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "EN" ? "Turkey Region — Reference" : "Región Turquía — Referencia"}</p>
                <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{lang === "EN" ? "This is how the region should look in your account" : "Así debe verse la región en tu cuenta"}</p>
              </div>
              <button onClick={() => setLightbox(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-70"
                style={{ background:"var(--surface)", color:"var(--text-muted)" }}>
                <X size={15}/>
              </button>
            </div>
            <div className="overflow-y-auto" style={{ background:"#0a0a0a" }}>
              <div className="space-y-2 p-2">
                <img src="/rocket-league/referencia-1.png" alt="Referencia 1" className="w-full h-auto rounded-lg"/>
                <img src="/rocket-league/referencia-2.png" alt="Referencia 2" className="w-full h-auto rounded-lg"/>
              </div>
            </div>
            <button onClick={() => setLightbox(false)}
              className="w-full py-3.5 text-sm font-semibold hover:opacity-80 flex-shrink-0"
              style={{ background:"var(--card)", color:"var(--text-muted)", borderTop:"1px solid var(--border)" }}>
              {lang === "EN" ? "Close" : "Cerrar"}
            </button>
          </div>
        </div>
      )}

      <Footer/>
    </>
  );
}
