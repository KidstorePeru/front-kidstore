"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Copy, Check, ChevronRight,
  Star, Zap, Shield, Clock,
  Gamepad2, Smartphone, Shirt, Coins, Sparkles, Trophy, Music,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PAVOS, PAQUETES, CLUB, BATTLE_PASSES } from "@/data/fortnite";
import FortniteShopTab from "@/components/game/FortniteShopTab";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

// ─── BOTS ─────────────────────────────────────────────────
const BOTS = Array.from({ length: 20 }, (_, i) => `KIDSTORE${String(i + 1).padStart(4, "0")}`);
const BOT_GRADIENTS = [
  ["#7C3AED","#4F46E5"], ["#0EA5E9","#6366F1"], ["#EC4899","#8B5CF6"],
  ["#14B8A6","#0EA5E9"], ["#F59E0B","#EF4444"], ["#10B981","#0EA5E9"],
  ["#8B5CF6","#EC4899"], ["#EF4444","#F97316"], ["#6366F1","#14B8A6"],
  ["#F97316","#EAB308"], ["#06B6D4","#8B5CF6"], ["#84CC16","#10B981"],
  ["#A855F7","#EC4899"], ["#3B82F6","#06B6D4"], ["#22C55E","#84CC16"],
  ["#D946EF","#7C3AED"], ["#F43F5E","#EC4899"], ["#0891B2","#3B82F6"],
  ["#65A30D","#22C55E"], ["#EA580C","#F59E0B"],
];

const badgeStyle: Record<string, string> = {
  "Popular":"badge-popular", "Oferta":"badge-oferta", "Mejor valor":"badge-valor", "Nuevo":"badge-nuevo",
};

// ─── TABS — sin duplicado ──────────────────────────────────
function getTabs(lang: string) {
  return [
    { id:"tienda",   label: lang === "EN" ? "🛒 Shop"           : "🛒 Tienda"          },
    { id:"bots",     label: lang === "EN" ? "🤖 Add Bots"       : "🤖 Agregar Bots"    },
    { id:"pavos",    label: lang === "EN" ? "⬡ V-Bucks Top-Up"  : "⬡ Recarga de Pavos" },
    { id:"paquetes", label: lang === "EN" ? "📦 Bundles"         : "📦 Paquetes"         },
    { id:"pases",    label: lang === "EN" ? "🎫 Passes"          : "🎫 Pases"            },
  ];
}

// ─── PRODUCT CARD ─────────────────────────────────────────
function ProductCard({ name, subtitle, amount, description, price, priceOld, badge, img, slug, fromPrice }: {
  name?:string; subtitle?:string; amount?:string; description:string;
  price:number; priceOld:number; badge:string; img:string; slug:string;
  fromPrice?: boolean;
}) {
  const { formatPrice: fmt, lang } = usePreferences();
  const t = useT();
  const translateBadge = useBadge();
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 group"
      style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
      <div className="relative w-full overflow-hidden"
        style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(15,10,40,0.6))" }}>
        <Image src={img} alt={name ?? amount ?? "producto"} fill
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105" />
        {badge && (
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeStyle[badge] ?? "badge-popular"}`}>
            {translateBadge(badge)}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        {name     && <p className="text-sm font-bold leading-tight mb-0.5" style={{ color:"var(--text)" }}>{name}</p>}
        {subtitle && <p className="text-[11px] mb-1" style={{ color:"var(--text-subtle)" }}>{subtitle}</p>}
        {amount   && <p className="text-xs font-semibold mb-2" style={{ color:"var(--brand-light)" }}>{amount}</p>}
        <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color:"var(--text-muted)" }}>{description}</p>
        <div className="flex items-end justify-between gap-3 mt-auto">
          <div>
            {!fromPrice && <p className="text-[11px] line-through" style={{ color:"var(--text-subtle)" }}>{fmt(priceOld)}</p>}
            <p className="text-xl font-bold" style={{ color:"var(--brand-light)" }}>
              {fromPrice ? (lang === "EN" ? "From " : "Desde ") : ""}{fmt(price)}
            </p>
            {fromPrice && <p className="text-[10px]" style={{ color:"var(--text-subtle)" }}>{lang === "EN" ? "1 to 6 months" : "1 a 6 meses"}</p>}
          </div>
          <Link href={`/games/fortnite/${slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 whitespace-nowrap"
            style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", boxShadow:"0 2px 12px rgba(124,58,237,0.35)" }}>
            <ShoppingCart size={13} /> {t.product.buyNow}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── BOTS ─────────────────────────────────────────────────
function TabBots() {
  const { lang } = usePreferences();
  const [copied, setCopied] = useState<string|null>(null);
  const handleCopy = (id:string) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(()=>setCopied(null), 2000);
  };
  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl p-5 mb-8 flex gap-4"
        style={{background:"rgba(59,130,246,0.07)",border:"1px solid rgba(59,130,246,0.18)"}}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{background:"rgba(59,130,246,0.15)",border:"1px solid rgba(59,130,246,0.25)"}}>
          <Clock size={18} className="text-blue-400"/>
        </div>
        <div>
          <p className="text-sm font-bold mb-1" style={{color:"var(--text)"}}>{lang === "EN" ? "Why add a bot?" : "¿Por qué agregar un bot?"}</p>
          <p className="text-xs leading-relaxed" style={{color:"var(--text-muted)"}}>
            {lang === "EN"
              ? <>To send you gifts in Fortnite we must be friends for at least{" "}<span className="font-bold" style={{color:"var(--text)"}}>48 hours</span> before your order. Add any of these IDs from the Epic Games app and then place your order.</>
              : <>Para enviarte regalos en Fortnite debemos ser amigos por al menos{" "}<span className="font-bold" style={{color:"var(--text)"}}>48 horas</span> antes de tu pedido. Agrega cualquiera de estos IDs desde la app de Epic Games y luego realiza tu compra.</>
            }
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {BOTS.map((id, index) => {
          const [from, to] = BOT_GRADIENTS[index % BOT_GRADIENTS.length];
          return (
            <div key={id} className="rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5"
              style={{background:"var(--card)",border:"1px solid var(--border)"}}>
              <div className="relative flex items-center justify-center py-5"
                style={{background:`linear-gradient(135deg,${from}22,${to}12)`,borderBottom:"1px solid var(--border)"}}>
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{background:`linear-gradient(135deg,${from},${to})`,boxShadow:`0 4px 20px ${from}50`}}>
                  <div className="absolute inset-0 opacity-20"
                    style={{backgroundImage:"radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)"}}/>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="13" r="7" fill="rgba(255,255,255,0.9)"/>
                    <path d="M8 39 C8 29 13 25 20 25 C27 25 32 29 32 39" fill="rgba(255,255,255,0.85)"/>
                    <path d="M13 11 Q20 5 27 11" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  </svg>
                  <div className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-black text-white"
                    style={{background:"rgba(0,0,0,0.4)",backdropFilter:"blur(4px)"}}>
                    {index+1}
                  </div>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold"
                  style={{background:"rgba(16,185,129,0.15)",border:"1px solid rgba(16,185,129,0.3)",color:"#6EE7B7"}}>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/> Online
                </div>
              </div>
              <div className="p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{color:"var(--text-subtle)"}}>Epic ID</p>
                <p className="text-sm font-bold mb-3 break-all leading-snug" style={{color:"var(--text)"}}>{id}</p>
                <button onClick={()=>handleCopy(id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: copied===id ? "rgba(16,185,129,0.12)" : `linear-gradient(135deg,${from}20,${to}15)`,
                    border:     copied===id ? "1px solid rgba(16,185,129,0.35)" : `1px solid ${from}40`,
                    color:      copied===id ? "#6EE7B7" : "var(--text-muted)",
                  }}>
                  {copied===id ? <Check size={13}/> : <Copy size={13}/>}
                  {copied===id ? (lang === "EN" ? "Copied!" : "¡Copiado!") : (lang === "EN" ? "Copy ID" : "Copiar ID")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PAVOS ────────────────────────────────────────────────
function TabPavos() {
  const { lang } = usePreferences();
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {PAVOS.map((p) => (
          <ProductCard key={p.id} amount={lang==="EN"?p.amountEN||p.amount:p.amount} description={lang==="EN"?p.descriptionEN:p.description}
            price={p.price} priceOld={p.priceOld} badge={p.badge} img={p.img} slug={p.slug}/>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
        <div className="px-6 py-4 flex items-center gap-3"
          style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(59,130,246,0.08))", borderBottom:"1px solid var(--border)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(124,58,237,0.2)", border:"1px solid rgba(124,58,237,0.3)" }}>
            <span className="text-lg">⬡</span>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "EN" ? "Product Information" : "Información del Producto"}</p>
            <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{lang === "EN" ? "What are V-Bucks? — General explanation" : "¿Qué son los paVos? — Explicación general"}</p>
          </div>
        </div>
        <div className="p-6 space-y-6" style={{ background:"var(--card)" }}>
          <div>
            <h3 className="text-sm font-bold mb-2" style={{ color:"var(--text)" }}>{lang === "EN" ? "What are V-Bucks?" : "¿Qué son los paVos (V-Bucks)?"}</h3>
            <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
              {lang === "EN"
                ? <><strong style={{ color:"var(--text)" }}>V-Bucks</strong> are the official Fortnite currency. With them you can buy skins, emotes, pickaxes, gliders, packs and the Battle Pass each season.</>
                : <>Los <strong style={{ color:"var(--text)" }}>paVos (V-Bucks)</strong> son la moneda oficial de Fortnite. Con ellos puedes comprar skins, gestos, picos, planeadores, packs y el Pase de Batalla de cada temporada.</>
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-4 space-y-3" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"rgba(59,130,246,0.15)" }}>
                  <Gamepad2 size={15} className="text-blue-400"/>
                </div>
                <p className="text-xs font-bold" style={{ color:"var(--text)" }}>{lang === "EN" ? "Compatibility" : "Compatibilidad"}</p>
              </div>
              <ul className="space-y-1.5">
                {(lang === "EN" ? ["PC (Epic Games / Steam)","PlayStation 4 / 5","Xbox One / Series","Nintendo Switch","Mobile devices"] : ["PC (Epic Games / Steam)","PlayStation 4 / 5","Xbox One / Series","Nintendo Switch","Dispositivos móviles"]).map(p=>(
                  <li key={p} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} className="text-green-400 flex-shrink-0"/> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-4 space-y-3" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"rgba(124,58,237,0.15)" }}>
                  <Sparkles size={15} className="text-purple-400"/>
                </div>
                <p className="text-xs font-bold" style={{ color:"var(--text)" }}>{lang === "EN" ? "Benefits" : "Beneficios"}</p>
              </div>
              <ul className="space-y-1.5">
                {(lang === "EN" ? ["Exclusive cosmetics","Customize your character","Season skins","Unique emotes and dances","Access to premium content"] : ["Cosméticos exclusivos","Personaliza tu personaje","Skins de temporada","Gestos y bailes únicos","Acceso a contenido premium"]).map(b=>(
                  <li key={b} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} className="text-purple-400 flex-shrink-0"/> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-4 space-y-3" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"rgba(245,158,11,0.15)" }}>
                  <Coins size={15} className="text-yellow-400"/>
                </div>
                <p className="text-xs font-bold" style={{ color:"var(--text)" }}>{lang === "EN" ? "In-game usage" : "Uso en el juego"}</p>
              </div>
              <ul className="space-y-1.5">
                {(lang === "EN" ? ["Buy skins and emotes","Unlock emotes","Season Battle Pass","Daily shop items","Gift items to friends"] : ["Comprar skins y gestos","Desbloquear emotes","Pase de Batalla de temporada","Artículos de la tienda diaria","Regalar ítems a amigos"]).map(u=>(
                  <li key={u} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} className="text-yellow-400 flex-shrink-0"/> {u}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2" style={{ borderTop:"1px solid var(--border)" }}>
            {[
              { icon:<Smartphone size={12}/>, label: lang === "EN" ? "PC · PS · Xbox · Switch · Mobile" : "PC · PS · Xbox · Switch · Móvil", color:"text-blue-400",   bg:"rgba(59,130,246,0.1)",  border:"rgba(59,130,246,0.25)"  },
              { icon:<Shirt      size={12}/>, label: lang === "EN" ? "Skins, emotes & cosmetics" : "Skins, emotes y cosméticos",       color:"text-purple-400", bg:"rgba(124,58,237,0.1)", border:"rgba(124,58,237,0.25)" },
              { icon:<Trophy     size={12}/>, label: lang === "EN" ? "Unlock the Battle Pass" : "Desbloquea el Pase de Batalla",    color:"text-yellow-400", bg:"rgba(245,158,11,0.1)",  border:"rgba(245,158,11,0.25)"  },
            ].map(chip=>(
              <div key={chip.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium ${chip.color}`}
                style={{ background:chip.bg, border:`1px solid ${chip.border}` }}>
                {chip.icon} {chip.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAQUETES ─────────────────────────────────────────────
function TabPaquetes() {
  const { lang } = usePreferences();
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {PAQUETES.map((p) => (
          <ProductCard key={p.id} name={lang==="EN"?p.nameEN||p.name:p.name} amount={lang==="EN"?p.amountEN||p.amount:p.amount} description={lang==="EN"?p.descriptionEN:p.description}
            price={p.price} priceOld={p.priceOld} badge={p.badge} img={p.img} slug={p.slug}/>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
        <div className="px-6 py-4 flex items-center gap-3"
          style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(236,72,153,0.08))", borderBottom:"1px solid var(--border)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(124,58,237,0.2)", border:"1px solid rgba(124,58,237,0.3)" }}>
            <span className="text-lg">📦</span>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "EN" ? "What are Fortnite Bundles?" : "¿Qué son los Paquetes de Fortnite?"}</p>
            <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{lang === "EN" ? "Exclusive bundles with cosmetics + V-Bucks" : "Bundles exclusivos con cosméticos + V-Bucks"}</p>
          </div>
        </div>
        <div className="p-6 space-y-6" style={{ background:"var(--card)" }}>
          <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
            {lang === "EN"
              ? <><strong style={{ color:"var(--text)" }}>Fortnite Bundles</strong> are special bundles that include exclusive cosmetics and V-Bucks at a reduced price. Perfect for getting exclusive content and saving V-Bucks.</>
              : <>Los <strong style={{ color:"var(--text)" }}>Paquetes de Fortnite</strong> son bundles especiales que incluyen cosméticos exclusivos y V-Bucks a un precio reducido. Perfectos para obtener contenido exclusivo y ahorrar paVos.</>
            }
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon:<Shirt size={20} className="text-purple-400"/>, title: lang === "EN" ? "Exclusive outfits" : "Outfits exclusivos", desc: lang === "EN" ? "Skins only available in bundles, not in the daily shop." : "Skins que solo se consiguen en paquetes, no disponibles en la tienda diaria.", bg:"rgba(124,58,237,0.1)", border:"rgba(124,58,237,0.2)" },
              { icon:<Coins size={20} className="text-yellow-400"/>, title: lang === "EN" ? "V-Bucks included" : "V-Bucks incluidos",  desc: lang === "EN" ? "Each bundle includes V-Bucks to spend freely in the in-game shop." : "Cada paquete trae V-Bucks para gastar libremente en tienda del juego.",         bg:"rgba(245,158,11,0.1)",  border:"rgba(245,158,11,0.2)"  },
              { icon:<Zap   size={20} className="text-green-400"/>,  title: lang === "EN" ? "Instant access" : "Acceso inmediato",   desc: lang === "EN" ? "Cosmetics unlock instantly when activated on your account." : "Los cosméticos se desbloquean al instante al activarlos en tu cuenta.",          bg:"rgba(16,185,129,0.1)",  border:"rgba(16,185,129,0.2)"  },
            ].map(item=>(
              <div key={item.title} className="rounded-xl p-4 flex flex-col items-center text-center gap-3"
                style={{ background:item.bg, border:`1px solid ${item.border}` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:"rgba(255,255,255,0.05)" }}>
                  {item.icon}
                </div>
                <p className="text-xs font-bold" style={{ color:"var(--text)" }}>{item.title}</p>
                <p className="text-[11px] leading-relaxed" style={{ color:"var(--text-muted)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PASES ────────────────────────────────────────────────
function TabPases() {
  const { lang } = usePreferences();
  return (
    <div>
      <h3 className="text-sm font-bold mb-4" style={{ color:"var(--text)" }}>🎮 {lang === "EN" ? "Fortnite Crew" : "Club de Fortnite"}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {CLUB.map((p) => (
          <ProductCard key={p.id} name={lang==="EN"?p.nameEN||p.name:p.name} subtitle={lang==="EN"?p.subtitleEN||p.subtitle:p.subtitle} description={lang==="EN"?p.descriptionEN:p.description}
            price={p.price} priceOld={p.priceOld} badge={p.badge} img={p.img} slug={p.slug}
            fromPrice={p.productType === "club-xbox"}/>
        ))}
      </div>
      <h3 className="text-sm font-bold mb-4" style={{ color:"var(--text)" }}>⭐ {lang === "EN" ? "Battle Passes" : "Pases de Batalla"}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {BATTLE_PASSES.map((p) => (
          <ProductCard key={p.id} name={lang==="EN"?p.nameEN||p.name:p.name} subtitle={lang==="EN"?p.subtitleEN||p.subtitle:p.subtitle} description={lang==="EN"?p.descriptionEN:p.description}
            price={p.price} priceOld={p.priceOld} badge={p.badge} img={p.img} slug={p.slug}/>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
        <div className="px-6 py-4 flex items-center gap-3"
          style={{ background:"linear-gradient(135deg,rgba(245,158,11,0.12),rgba(124,58,237,0.08))", borderBottom:"1px solid var(--border)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)" }}>
            <span className="text-lg">⭐</span>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "EN" ? "What's the difference?" : "¿Cuál es la diferencia?"}</p>
            <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{lang === "EN" ? "Club, Battle Pass and Special Passes explained" : "Club, Battle Pass y Pases Especiales explicados"}</p>
          </div>
        </div>
        <div className="p-6 space-y-6" style={{ background:"var(--card)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl p-5 space-y-3" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"rgba(124,58,237,0.15)" }}>
                  <Gamepad2 size={16} className="text-purple-400"/>
                </div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>🎮 Club de Fortnite</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
                {lang === "EN" ? "Monthly subscription with 1,000 V-Bucks, the active Battle Pass, and an exclusive Club pack each month." : "Suscripción mensual con 1.000 V-Bucks, el Pase de Batalla activo y un pack exclusivo del Club cada mes."}
              </p>
              <ul className="space-y-1.5">
                {(lang === "EN" ? ["1,000 V-Bucks every month","Battle Pass included","Exclusive Club skin and cosmetics"] : ["1.000 V-Bucks cada mes","Pase de Batalla incluido","Skin y cosméticos exclusivos del Club"]).map(b=>(
                  <li key={b} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} className="text-purple-400 flex-shrink-0"/> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-5 space-y-3" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"rgba(245,158,11,0.15)" }}>
                  <Trophy size={16} className="text-yellow-400"/>
                </div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>⭐ Pase de Batalla</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
                {lang === "EN" ? "Unlock over 100 rewards by leveling up during the season: skins, emotes, V-Bucks and more." : "Desbloquea más de 100 recompensas subiendo de nivel durante la temporada: skins, gestos, V-Bucks y más."}
              </p>
              <ul className="space-y-1.5">
                {(lang === "EN" ? ["Over 100 unlockable rewards","Exclusive season cosmetics","Ability to earn back V-Bucks"] : ["Más de 100 recompensas desbloqueables","Cosméticos exclusivos de temporada","Posibilidad de recuperar V-Bucks"]).map(b=>(
                  <li key={b} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} className="text-yellow-400 flex-shrink-0"/> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-5 space-y-3" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"rgba(16,185,129,0.15)" }}>
                  <Music size={16} className="text-emerald-400"/>
                </div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>🎵 Pases Especiales</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
                {lang === "EN" ? "Unlock unique rewards for specific modes: Festival, LEGO or Fortnite OG, with exclusive content." : "Desbloquean recompensas únicas para modos específicos: Festival, LEGO o Fortnite OG, con contenido exclusivo."}
              </p>
              <ul className="space-y-1.5">
                {(lang === "EN" ? ["Exclusive rewards for each mode","Unique themed cosmetics","Independent Pass progression"] : ["Recompensas exclusivas de cada modo","Cosméticos únicos y temáticos","Progreso independiente del Pase"]).map(b=>(
                  <li key={b} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} className="text-emerald-400 flex-shrink-0"/> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2" style={{ borderTop:"1px solid var(--border)" }}>
            {[
              { label: lang === "EN" ? "🎮 Club — Monthly subscription" : "🎮 Club — Suscripción mensual",     color:"text-purple-400", bg:"rgba(124,58,237,0.1)", border:"rgba(124,58,237,0.2)" },
              { label: lang === "EN" ? "⭐ Battle Pass — 100+ rewards" : "⭐ Battle Pass — 100+ recompensas", color:"text-yellow-400", bg:"rgba(245,158,11,0.1)",  border:"rgba(245,158,11,0.2)"  },
              { label: lang === "EN" ? "🎵 Special Passes — Unique modes" : "🎵 Pases Especiales — Modos únicos",color:"text-emerald-400",bg:"rgba(16,185,129,0.1)", border:"rgba(16,185,129,0.2)"  },
            ].map(chip=>(
              <span key={chip.label} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold ${chip.color}`}
                style={{ background:chip.bg, border:`1px solid ${chip.border}` }}>
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── INNER ────────────────────────────────────────────────
function FortnitePageInner() {
  const { lang } = usePreferences();
  const t = useT();
  const TABS = getTabs(lang);
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tabParam     = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam ?? "tienda");

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  function handleTabClick(id: string) {
    setActiveTab(id);
    router.push(`/games/fortnite?tab=${id}`, { scroll: false });
  }

  return (
    <>
      <Navbar />
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* HERO */}
        <section className="relative overflow-hidden" style={{ height:"65vh", minHeight:"460px" }}>
          <Image src="/games/fortnite.jpg" alt="Fortnite" fill className="object-cover object-center" priority/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to right,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.45) 55%,rgba(0,0,0,0.1) 100%)" }}/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 60%)" }}/>

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 z-10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-xs" style={{ color:"rgba(255,255,255,0.45)" }}>
                <Link href="/" className="hover:text-white transition-colors">{t.checkout.home}</Link>
                <ChevronRight size={11}/>
                <Link href="/games" className="hover:text-white transition-colors">{t.gamePage.games}</Link>
                <ChevronRight size={11}/>
                <span className="text-white">Fortnite</span>
              </nav>
            </div>
          </div>

          {/* Hero text */}
          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-20 w-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-popular px-3 py-1 rounded-full text-xs font-bold">Battle Royale</span>
                <span className="badge-nuevo px-3 py-1 rounded-full text-xs font-bold">Free to Play</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold text-white leading-none tracking-tight mb-4">Fortnite</h1>
              <div className="flex items-center gap-5 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4,5].map(i=><Star key={i} size={14} fill="currentColor" className="text-yellow-400"/>)}
                  <span className="text-white text-sm font-semibold ml-1">4.9</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.45)" }}>
                  <Zap size={13} className="text-yellow-400"/><span className="text-xs">{lang === "EN" ? "Instant delivery" : "Entrega instantánea"}</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.45)" }}>
                  <Shield size={13} className="text-green-400"/><span className="text-xs">{lang === "EN" ? "Secure payment" : "Pago seguro"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TABS — offset = alto del Navbar (66px móvil / 107px con fila de categorías en desktop) */}
        <div className="sticky top-[66px] md:top-[107px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth:"none" }}>
              <div className="flex">
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => handleTabClick(tab.id)}
                    className="flex-shrink-0 px-5 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: activeTab === tab.id ? "var(--brand-light)" : "var(--text-muted)" }}>
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:"linear-gradient(90deg,#7C3AED,#A78BFA)" }}/>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
          {activeTab === "tienda"   && <FortniteShopTab />}
          {activeTab === "bots"     && <TabBots />}
          {activeTab === "pavos"    && <TabPavos />}
          {activeTab === "paquetes" && <TabPaquetes />}
          {activeTab === "pases"    && <TabPases />}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function FortnitePageClient() {
  return (
    <Suspense fallback={null}>
      <FortnitePageInner />
    </Suspense>
  );
}
