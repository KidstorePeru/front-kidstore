"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight, ShoppingCart, AlertTriangle, Clock,
  Eye, EyeOff, Shield, Zap, Info, X, MessageCircle,
  ExternalLink, Check, Users, Heart,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_FORTNITE_PRODUCTS, ClubXboxOption } from "@/data/fortnite";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

// ── Tabs ────────────────────────────────────────────────────────
function getTabs(lang: string) {
  return [
    { id:"tienda",   label: lang === "EN" ? "🛒 Shop"           : "🛒 Tienda"          },
    { id:"bots",     label: lang === "EN" ? "🤖 Add Bots"       : "🤖 Agregar Bots"    },
    { id:"pavos",    label: lang === "EN" ? "⬡ V-Bucks Top-Up"  : "⬡ Recarga de Pavos" },
    { id:"paquetes", label: lang === "EN" ? "📦 Bundles"         : "📦 Paquetes"         },
    { id:"pases",    label: lang === "EN" ? "🎫 Passes"          : "🎫 Pases"            },
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
  if (id === "facebook") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.885v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z"/>
    </svg>
  );
  if (id === "google") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
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
  if (id === "apple") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M9 2C7.9 2 7 2.9 7 4v1H4C2.9 5 2 5.9 2 7v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3V4c0-1.1-.9-2-2-2H9zm0 2h6v1H9V4zm-5 3h16v13H4V7zm3 2v2h2V9H7zm4 0v2h2V9h-2zm4 0v2h2V9h-2zM7 13v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z"/>
    </svg>
  );
}

const PCOL: Record<string, string> = {
  epic:"#2a2a2a", xbox:"#107C10", facebook:"#1877F2",
  google:"#EA4335", playstation:"#003791", steam:"#1b2838",
  apple:"#555555", lego:"#C8A000",
};

const ALL_PLATFORMS = [
  { id:"epic", label:"Epic Games" }, { id:"xbox", label:"Xbox" },
  { id:"facebook", label:"Facebook" }, { id:"google", label:"Google" },
  { id:"playstation", label:"PlayStation" }, { id:"steam", label:"Steam" },
  { id:"apple", label:"Apple" }, { id:"lego", label:"LEGO" },
];

// ── Aviso 48h amigos (battle pass) ──────────────────────────────
function FriendNotice() {
  const { lang } = usePreferences();
  return (
    <div className="rounded-xl p-4 flex gap-3"
      style={{ background:"rgba(59,130,246,0.07)", border:"1.5px solid rgba(59,130,246,0.25)" }}>
      <Users size={16} className="flex-shrink-0 mt-0.5 text-blue-400"/>
      <div className="text-xs">
        <p className="font-bold mb-1" style={{ color:"#60A5FA" }}>
          ⏱️ {lang === "EN" ? "You need to have us added for 48 hours" : "Necesitas tenernos agregado 48 horas"}
        </p>
        <p style={{ color:"var(--text-muted)" }}>
          {lang === "EN"
            ? "Epic Games requires that we be friends for at least 48 hours before we can send you the gift. If you already have us added for more than 48h, delivery is immediate."
            : "Epic Games exige que seamos amigos por al menos 48 horas antes de poder enviarte el regalo. Si ya nos tienes agregado hace más de 48h, la entrega es inmediata."}
        </p>
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
        style={{ color:"var(--text-subtle)" }}>{lang === "EN" ? "Fortnite access method" : "Medio de acceso a Fortnite"}</label>
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

// ── Descripción: Pavos / Paquetes / Club Turquía (con credenciales) ─
function DescCredenciales({ type }: { type: "club-turquia" | "pavos" | "paquete" }) {
  const { lang } = usePreferences();
  const isClub = type === "club-turquia";
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color:"var(--text)" }}>📋 {lang === "EN" ? "Delivery instructions" : "Instrucciones de entrega"}</h4>
      <div className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
        <span>🎮</span>
        <p><strong style={{ color:"var(--text)" }}>{lang === "EN" ? "Fortnite Crew" : "Equipo Fortnite"}</strong> — {lang === "EN" ? "Available on all platforms" : "Disponible en todas las plataformas"}</p>
      </div>
      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>❓ {lang === "EN" ? "What do we need?" : "¿Qué necesitamos?"}</p>
        {(isClub
          ? (lang === "EN"
            ? ["Your account data (Epic Games / Xbox / PlayStation)","Our team will change the region or use the Xbox method."]
            : ["Los datos de tu cuenta (Epic Games / Xbox / PlayStation)","Nuestro equipo cambiará la región o usará el método de Xbox."])
          : (lang === "EN"
            ? ["Your Epic Games account data / linked platform."]
            : ["Los datos de tu cuenta Epic Games / plataforma vinculada."])
        ).map((t,i) => (
          <p key={i} className="text-xs flex gap-2" style={{ color:"var(--text-muted)" }}><span>•</span><span>{t}</span></p>
        ))}
      </div>
      {isClub && (
        <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
          <p className="text-xs font-bold mb-2" style={{ color:"var(--text)" }}>📦 {lang === "EN" ? "What does Fortnite Crew include?" : "¿Qué incluye el Equipo Fortnite?"}</p>
          {(lang === "EN" ? [
            { icon:"🎁", text:<><strong style={{ color:"var(--text)" }}>Monthly bundle:</strong> New outfit + Pickaxe, Glider, Emote, etc.</> },
            { icon:"🎟️",text:"Full access to the current Battle Pass" },
            { icon:"💸", text:"1,000 V-Bucks" },
            { icon:"🚀", text:"Rocket Pass Premium for Rocket League" },
            { icon:"✨", text:"Exclusive Crew styles" },
          ] : [
            { icon:"🎁", text:<><strong style={{ color:"var(--text)" }}>Paquete mensual:</strong> Nuevo atuendo + Pico, Ala delta, Emote, etc.</> },
            { icon:"🎟️",text:"Acceso completo al Pase de batalla actual" },
            { icon:"💸", text:"1.000 paVos" },
            { icon:"🚀", text:"Rocket Pass Premium para Rocket League" },
            { icon:"✨", text:"Estilos exclusivos del Equipo" },
          ]).map((item,i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
              <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
            </div>
          ))}
        </div>
      )}
      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        {(lang === "EN" ? [
          ...(type === "club-turquia" ? [{ icon:"📋", text:<><a href="https://www.fortnite.com/fortnite-crew-subscription" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline inline-flex items-center gap-1">More information about rewards <ExternalLink size={10}/></a></> }] : []),
          { icon:"✅", text:"100% guaranteed during the subscription period." },
          { icon:"🛡️",text:"Your data is only used to complete the purchase." },
          { icon:"⚡", text:"Delivery in 5-10 minutes" },
          { icon:"🛒", text:"V-Bucks available on all platforms except Nintendo." },
          { icon:"💡", text:"Xbox account linked to Epic Games, no parental controls (18+)." },
        ] : [
          ...(type === "club-turquia" ? [{ icon:"📋", text:<><a href="https://www.fortnite.com/fortnite-crew-subscription" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline inline-flex items-center gap-1">Más información sobre recompensas <ExternalLink size={10}/></a></> }] : []),
          { icon:"✅", text:"100% garantizado durante el período de suscripción." },
          { icon:"🛡️",text:"Tus datos solo se usan para completar la compra." },
          { icon:"⚡", text:"Entrega en 5-10 minutos" },
          { icon:"🛒", text:"V-Bucks disponibles en todas las plataformas excepto Nintendo." },
          { icon:"💡", text:"Cuenta Xbox vinculada a Epic Games, sin controles parentales (18+)." },
        ]).map((item,i) => (
          <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
            <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Descripción: Club Xbox ───────────────────────────────────────
function DescClubXbox() {
  const { lang } = usePreferences();
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color:"var(--text)" }}>📋 {lang === "EN" ? "Delivery instructions" : "Instrucciones de entrega"}</h4>
      <div className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
        <span>🎮</span>
        <p><strong style={{ color:"var(--text)" }}>{lang === "EN" ? "Fortnite Crew" : "Equipo Fortnite"}</strong> — {lang === "EN" ? "Available on all platforms" : "Disponible en todas las plataformas"}</p>
      </div>
      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>❓ {lang === "EN" ? "What do we need?" : "¿Qué necesitamos?"}</p>
        <p className="text-xs flex gap-2" style={{ color:"var(--text-muted)" }}><span>•</span><span>{lang === "EN" ? "Your Xbox account data." : "Los datos de tu cuenta Xbox."}</span></p>
      </div>
      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-2" style={{ color:"var(--text)" }}>📦 {lang === "EN" ? "What does Fortnite Crew include?" : "¿Qué incluye el Equipo Fortnite?"}</p>
        {(lang === "EN" ? [
          { icon:"🎁", text:<><strong style={{ color:"var(--text)" }}>Monthly bundle:</strong> New outfit + Pickaxe, Glider, Emote, etc.</> },
          { icon:"🎟️",text:"Full access to the current Battle Pass" },
          { icon:"💸", text:"1,000 V-Bucks" },
          { icon:"🚀", text:"Rocket Pass Premium for Rocket League" },
          { icon:"✨", text:"Exclusive Crew styles" },
        ] : [
          { icon:"🎁", text:<><strong style={{ color:"var(--text)" }}>Paquete mensual:</strong> Nuevo atuendo + Pico, Ala delta, Emote, etc.</> },
          { icon:"🎟️",text:"Acceso completo al Pase de batalla actual" },
          { icon:"💸", text:"1.000 paVos" },
          { icon:"🚀", text:"Rocket Pass Premium para Rocket League" },
          { icon:"✨", text:"Estilos exclusivos del Equipo" },
        ]).map((item,i) => (
          <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
            <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        {(lang === "EN" ? [
          { icon:"📋", text:<><a href="https://www.fortnite.com/fortnite-crew-subscription" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline inline-flex items-center gap-1">More information about rewards <ExternalLink size={10}/></a></> },
          { icon:"✅", text:"100% guaranteed during the subscription period." },
          { icon:"⚡", text:"Delivery in 5-10 minutes" },
          { icon:"🛒", text:"Purchase via Xbox. V-Bucks available on all platforms except Nintendo." },
          { icon:"💡", text:"Xbox account linked to Epic Games, no parental controls (18+)." },
        ] : [
          { icon:"📋", text:<><a href="https://www.fortnite.com/fortnite-crew-subscription" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline inline-flex items-center gap-1">Más información sobre recompensas <ExternalLink size={10}/></a></> },
          { icon:"✅", text:"100% garantizado durante el período de suscripción." },
          { icon:"⚡", text:"Entrega en 5-10 minutos" },
          { icon:"🛒", text:"Compra a través de Xbox. V-Bucks disponibles en todas las plataformas excepto Nintendo." },
          { icon:"💡", text:"Cuenta Xbox vinculada a Epic Games, sin controles parentales (18+)." },
        ]).map((item,i) => (
          <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
            <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Descripción: Battle Pass (regalo) ───────────────────────────
function DescBattlePass() {
  const { lang } = usePreferences();
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color:"var(--text)" }}>📋 {lang === "EN" ? "Delivery instructions" : "Instrucciones de entrega"}</h4>
      <div className="rounded-xl p-3 text-xs" style={{ background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.2)", color:"var(--text-muted)" }}>
        <p className="font-semibold mb-1.5" style={{ color:"var(--text)" }}>{lang === "EN" ? "Delivery via in-game gift." : "Entrega mediante regalo dentro del juego."}</p>
        {(lang === "EN" ? [
          "1️⃣ Send us your Epic ID (Epic Games username).",
          "2️⃣ If we are not friends yet, we will send you a friend request.",
          "3️⃣ Epic Games requires waiting 48 hours from when the friendship is accepted to send gifts.",
          "4️⃣ Once the time is met, you will receive the Pass as a gift directly in the game.",
          "5️⃣ You just need to accept the gift when the notification appears in Fortnite.",
        ] : [
          "1️⃣ Envíanos tu Epic ID (nombre de usuario de Epic Games).",
          "2️⃣ Si aún no somos amigos, te enviaremos una solicitud de amistad.",
          "3️⃣ Epic Games exige esperar 48 horas desde que se acepta la amistad para poder enviar regalos.",
          "4️⃣ Una vez cumplido el tiempo, recibirás el Pase como regalo directamente en el juego.",
          "5️⃣ Solo debes aceptar el regalo cuando aparezca la notificación en Fortnite.",
        ]).map((t,i) => <p key={i} className="leading-relaxed">{t}</p>)}
      </div>
      <div className="rounded-xl p-3 space-y-1.5" style={{ background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.25)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"#F59E0B" }}>⚠️ {lang === "EN" ? "Important requirements" : "Requisitos importantes"}</p>
        {(lang === "EN" ? [
          "Have the \"Receive gifts\" option enabled in Fortnite settings.",
          "Not have previously purchased the Pass.",
          "Be in the same or compatible store region.",
          "Be friends on Epic Games for at least 48 hours.",
        ] : [
          "Tener activada la opción \"Recibir regalos\" en la configuración de Fortnite.",
          "No haber comprado el Pase previamente.",
          "Estar en la misma región de tienda o compatible.",
          "Ser amigos en Epic Games mínimo 48 horas.",
        ]).map((t,i) => (
          <p key={i} className="text-xs flex gap-2" style={{ color:"var(--text-muted)" }}>
            <span>•</span><span>{t}</span>
          </p>
        ))}
      </div>
      <div className="rounded-xl p-3 space-y-1.5" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>⏱ {lang === "EN" ? "Delivery time" : "Tiempo de entrega"}</p>
        <p className="text-xs flex gap-2" style={{ color:"var(--text-muted)" }}>
          <span>•</span><span>{lang === "EN" ? "If we are already friends for more than 48h → immediate delivery." : "Si ya somos amigos hace más de 48h → entrega inmediata."}</span>
        </p>
        <p className="text-xs flex gap-2" style={{ color:"var(--text-muted)" }}>
          <span>•</span><span>{lang === "EN" ? "If we just added the account → up to 48 hours (Epic Games policy)." : "Si recién agregamos la cuenta → hasta 48 horas (política de Epic Games)."}</span>
        </p>
      </div>
    </div>
  );
}

// ── Selector de meses (club-xbox) ────────────────────────────────
function MonthSelector({
  options, selected, onSelect,
}: { options: ClubXboxOption[]; selected: number; onSelect: (o: ClubXboxOption) => void }) {
  const { lang } = usePreferences();
  return (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block"
        style={{ color:"var(--text-subtle)" }}>{lang === "EN" ? "Subscription duration" : "Duración de la suscripción"}</label>
      <div className="grid grid-cols-3 gap-2">
        {options.map(opt => {
          const active = selected === opt.months;
          const disc   = Math.round((1 - opt.price / opt.priceOld) * 100);
          return (
            <button key={opt.months} onClick={() => onSelect(opt)}
              className="relative flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-center transition-all"
              style={{
                background: active ? "rgba(124,58,237,0.10)" : "var(--card)",
                border:`1.5px solid ${active ? "#7C3AED" : "var(--border)"}`,
                boxShadow: active ? "0 0 0 3px rgba(124,58,237,0.08)" : "none",
              }}>
              {opt.badge && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap"
                  style={{ background:"var(--brand)", color:"white" }}>
                  {opt.badge}
                </span>
              )}
              <span className="text-sm font-bold mt-1" style={{ color: active ? "var(--brand-light)" : "var(--text)" }}>
                {opt.label}
              </span>
              <span className="text-xs font-bold" style={{ color: active ? "var(--brand-light)" : "var(--text-muted)" }}>
                S/ {opt.price.toFixed(2)}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                style={{ background:"rgba(16,185,129,0.12)", color:"#4ADE80" }}>
                -{disc}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function FortniteProductClient({ slug }: { slug: string }) {
  const product = ALL_FORTNITE_PRODUCTS.find(p => p.slug === slug);
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
  const [showPass,     setShowPass]     = useState(false);
  const [platform,     setPlatform]     = useState<string | null>(null);
  const [lightbox,     setLightbox]     = useState(false);
  const [addedCart,    setAddedCart]    = useState(false);
  // Club Xbox: mes seleccionado
  const defaultOpt  = p.monthOptions?.[0] ?? null;
  const [selectedOpt, setSelectedOpt]  = useState<ClubXboxOption | null>(defaultOpt);

  // Precio activo (para club-xbox depende de la opción; para el resto, fijo)
  const activePrice    = type === "club-xbox" ? (selectedOpt?.price    ?? p.price)    : p.price;
  const activePriceOld = type === "club-xbox" ? (selectedOpt?.priceOld ?? p.priceOld) : p.priceOld;
  const discountPct    = Math.round((1 - activePrice / activePriceOld) * 100);
  const activeSubtitle = type === "club-xbox"
    ? `Activación Vía Xbox — ${selectedOpt?.label ?? ""}`
    : (lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle);
  const alreadyInCart = isInCart(p.slug);
  const wished        = isWished(p.slug);

  // ── Form state ────────────────────────────────────────────────
  const [fieldUser,     setFieldUser]     = useState("");
  const [fieldPass,     setFieldPass]     = useState("");
  const [fieldGameName, setFieldGameName] = useState("");
  const [errors,        setErrors]        = useState<Record<string, boolean>>({});

  // Qué campos son obligatorios según productType
  const needsCredentials = type !== "battle-pass";
  const needsGameName    = true;

  function validate(): boolean {
    if (whatsapp) return true;
    const e: Record<string, boolean> = {};
    if (needsCredentials && !fieldUser.trim())     e.user     = true;
    if (needsCredentials && !fieldPass.trim())     e.pass     = true;
    if (needsGameName    && !fieldGameName.trim()) e.gameName = true;
    if (type !== "battle-pass" && !platform)       e.platform = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildOrderData() {
    return {
      user:     fieldUser     || undefined,
      pass:     fieldPass     || undefined,
      gameName: fieldGameName || undefined,
      platform: platform      || undefined,
      months:   selectedOpt?.months,
    };
  }

  function handleAddToCart() {
    if (!validate()) return;
    addItem({
      slug:      p.slug,
      name:      type === "club-xbox"
        ? `${displayName} ${selectedOpt?.label ?? ""} (Xbox)`
        : displayName,
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
      name:      type === "club-xbox"
        ? `${displayName} ${selectedOpt?.label ?? ""} (Xbox)`
        : displayName,
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
      game:     "Fortnite",
      gameSlug: "fortnite",
    });
  }

  // ── Qué secciones mostrar según productType ───────────────────
  const showTurkeyNotice  = p.needsTurkey;
  const showFriendNotice  = type === "battle-pass";
  const showSecurityNotice = type !== "battle-pass";       // Fix 2: ocultar en battle-pass
  // Credenciales (usuario + contraseña): todos EXCEPTO battle-pass — Fix 1: incluye club-xbox
  const showCredentials   = type !== "battle-pass";
  // Solo Xbox como plataforma para club-xbox
  const platformsToShow   = type === "club-xbox"
    ? ALL_PLATFORMS.filter(pl => pl.id === "xbox")
    : ALL_PLATFORMS;
  // Selector de meses solo para club-xbox
  const showMonthSelector = type === "club-xbox";

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
                  <Link key={tab.id} href={`/games/fortnite?tab=${tab.id}`}
                    className="flex-shrink-0 px-5 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: p.tab === tab.id ? "var(--brand-light)" : "var(--text-muted)" }}>
                    {tab.label}
                    {p.tab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:"linear-gradient(90deg,#7C3AED,#A78BFA)" }}/>
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
            <Link href="/games/fortnite" className="hover:opacity-80">Fortnite</Link>
            <ChevronRight size={11}/>
            <Link href={`/games/fortnite?tab=${p.tab}`} className="hover:opacity-80">{p.tabLabel}</Link>
            <ChevronRight size={11}/>
            <span style={{ color:"var(--text)" }}>{displayName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* ── IZQUIERDA: imagen + descripción ─────────────── */}
            <div className="space-y-6">
              <div className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,rgba(124,58,237,0.18),rgba(15,10,40,0.7))", border:"1px solid var(--border)" }}>
                <Image src={p.img} alt={displayName} fill className="object-contain p-8" priority/>
              </div>
              <div className="rounded-2xl p-6" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                {type === "battle-pass"   && <DescBattlePass />}
                {type === "club-xbox"     && <DescClubXbox />}
                {(type === "club-turquia" || type === "pavos" || type === "paquete") &&
                  <DescCredenciales type={type as "club-turquia" | "pavos" | "paquete"} />}
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

              {/* Aviso seguridad — oculto en battle-pass */}
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

              {/* Aviso 48h amigos (battle pass) */}
              {showFriendNotice && <FriendNotice />}

              {/* Selector de meses — SOLO club-xbox */}
              {showMonthSelector && p.monthOptions && (
                <MonthSelector
                  options={p.monthOptions}
                  selected={selectedOpt?.months ?? 1}
                  onSelect={setSelectedOpt}
                />
              )}

              {/* Toggle WhatsApp */}
              <WhatsappToggle active={whatsapp} onToggle={() => setWhatsapp(!whatsapp)} />

              {/* Formulario — condicional según productType */}
              {!whatsapp ? (
                <div className="space-y-3">

                  {/* Credenciales: todos excepto battle-pass (incluye club-xbox) */}
                  {showCredentials && (
                    <>
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
                          onFocus={e => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : "#7C3AED")}
                          onBlur={e  => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : "var(--border)")}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                          style={{ color: errors.pass ? "#EF4444" : "var(--text-subtle)" }}>
                          {lang === "EN" ? "Password" : "Contraseña"} {errors.pass && <span className="normal-case font-normal">— {lang === "EN" ? "required" : "requerido"}</span>}
                        </label>
                        <div className="relative">
                          <input
                            type={showPass ? "text" : "password"}
                            placeholder="••••••••"
                            value={fieldPass}
                            onChange={e => { setFieldPass(e.target.value); setErrors(prev => ({ ...prev, pass: false })); }}
                            className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                            style={{
                              background:"var(--card)",
                              border:`1px solid ${errors.pass ? "#EF4444" : "var(--border)"}`,
                              color:"var(--text)",
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = errors.pass ? "#EF4444" : "#7C3AED")}
                            onBlur={e  => (e.currentTarget.style.borderColor = errors.pass ? "#EF4444" : "var(--border)")}
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                            style={{ color:"var(--text-subtle)" }}>
                            {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Nombre en el juego — todos los productos */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.gameName ? "#EF4444" : "var(--text-subtle)" }}>
                      {type === "battle-pass"
                        ? (lang === "EN" ? "In-game username (Epic ID)" : "Nombre de usuario en el juego (Epic ID)")
                        : (lang === "EN" ? "In-game username" : "Nombre de usuario en el juego")}
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
                      onFocus={e => (e.currentTarget.style.borderColor = errors.gameName ? "#EF4444" : "#7C3AED")}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.gameName ? "#EF4444" : "var(--border)")}
                    />
                  </div>

                  {/* Plataformas — todos excepto battle-pass */}
                  {type !== "battle-pass" && (
                    <div>
                      <PlatformGrid
                        platforms={platformsToShow}
                        selected={platform}
                        onSelect={id => { setPlatform(platform === id ? null : id); setErrors(prev => ({ ...prev, platform: false })); }}
                      />
                      {errors.platform && (
                        <p className="text-[11px] mt-1.5 font-semibold" style={{ color:"#EF4444" }}>
                          {lang === "EN" ? "Select a Fortnite access method" : "Selecciona un medio de acceso a Fortnite"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <WhatsappInstructions />
              )}

              {/* Botones */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: alreadyInCart ? "rgba(124,58,237,0.12)" : "var(--card)",
                    border:`1.5px solid ${alreadyInCart || addedCart ? "#7C3AED" : "var(--brand)"}`,
                    color:"var(--brand-light)",
                  }}>
                  {addedCart ? <Check size={16}/> : <ShoppingCart size={16}/>}
                  {addedCart ? t.product.added : alreadyInCart ? t.product.inCart : t.product.addToCart}
                </button>
                <button onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow:"0 4px 20px rgba(124,58,237,0.4)" }}>
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
              {(p.productType === "pavos" || p.productType === "paquete") ? (
                <div className="space-y-2 p-2">
                  <img src="/fortnite/referencia-1.png" alt="Referencia 1" className="w-full h-auto rounded-lg"/>
                  <img src="/fortnite/referencia-2.png" alt="Referencia 2" className="w-full h-auto rounded-lg"/>
                </div>
              ) : p.referenceImg ? (
                <img src={p.referenceImg} alt={lang === "EN" ? "Turkey region reference" : "Referencia región Turquía"} className="w-full h-auto"/>
              ) : null}
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
