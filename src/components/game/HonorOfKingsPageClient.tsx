"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, Fingerprint } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TOKENS, HOKProduct } from "@/data/honorofkings";
import { useGameVisibility } from "@/hooks/useGameVisibility";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

/*
  HOK brand: gold / amber
  Light: #B45309 (amber-700) → ratio ~6.5:1 on white ✓
  Dark:  #FCD34D (amber-300) → ratio ~9:1 on dark   ✓
*/
const HOK_STYLE = `
  :root, [data-theme="light"] {
    --hok-text:    #B45309;
    --hok-dark:    #92400E;
    --hok-bg:      rgba(180,83,9,0.08);
    --hok-border:  rgba(180,83,9,0.25);
    --hok-btn:     linear-gradient(135deg,#92400E,#D97706);
    --hok-glow:    rgba(180,83,9,0.2);
    --hok-bonus:   rgba(180,83,9,0.1);
  }
  [data-theme="dark"] {
    --hok-text:    #FCD34D;
    --hok-dark:    #F59E0B;
    --hok-bg:      rgba(252,211,77,0.07);
    --hok-border:  rgba(252,211,77,0.22);
    --hok-btn:     linear-gradient(135deg,#92400E,#D97706);
    --hok-glow:    rgba(252,211,77,0.2);
    --hok-bonus:   rgba(252,211,77,0.1);
  }
`;

const badgeStyle: Record<string, string> = {
  "Popular":"badge-popular", "Oferta":"badge-oferta", "Mejor valor":"badge-valor",
};

// ── Product Card ───────────────────────────────────────────────
function ProductCard({ p }: { p: HOKProduct }) {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();
    const disc   = Math.round((1 - p.price / p.priceOld) * 100);
  const total  = p.bonus ? p.tokens + p.bonus : p.tokens;

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 group"
      style={{ background:"var(--card)", border:"1px solid var(--border)" }}>

      {/* Imagen */}
      <div className="relative w-full overflow-hidden"
        style={{ aspectRatio:"1/1", background:"linear-gradient(135deg,var(--hok-bg),rgba(5,3,15,0.88))" }}>
        <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"/>
        {p.badge && (
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeStyle[p.badge] ?? "badge-popular"}`}>
            {badge(p.badge)}
          </span>
        )}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#4ADE80" }}>
          -{disc}%
        </span>
        {/* Total tokens badge */}
        {p.bonus && (
          <div className="absolute bottom-0 inset-x-0 px-3 py-2"
            style={{ background:"linear-gradient(to top,rgba(0,0,0,0.75),transparent)" }}>
            <p className="text-[10px] font-black" style={{ color:"#FCD34D" }}>
              Total: {total.toLocaleString()} Tokens
            </p>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-bold mb-0.5" style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</p>

        {/* Bonus pill */}
        {p.bonus && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black"
              style={{ background:"var(--hok-bg)", border:"1px solid var(--hok-border)", color:"var(--hok-text)" }}>
              +{p.bonus} {lang === "ES" ? "de regalo" : "bonus"} 🎁
            </span>
          </div>
        )}

        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color:"var(--text-muted)" }}>{lang==="EN" ? p.descriptionEN || p.description : p.description}</p>

        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <p className="text-[11px] line-through" style={{ color:"var(--text-subtle)" }}>{formatPrice(p.priceOld)}</p>
            <p className="text-xl font-bold" style={{ color:"var(--hok-text)" }}>{formatPrice(p.price)}</p>
          </div>
          <Link href={`/games/honor-of-kings/${p.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 whitespace-nowrap"
            style={{ background:"var(--hok-btn)", boxShadow:"0 2px 12px var(--hok-glow)" }}>
            <ShoppingCart size={13}/> {t.product.buyNow}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Info section ───────────────────────────────────────────────
function InfoSection() {
  const { lang } = usePreferences();
  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border:"1px solid var(--border)" }}>
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ background:"var(--hok-bg)", borderBottom:"1px solid var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:"var(--hok-bg)", border:"1px solid var(--hok-border)" }}>
          <span className="text-lg">🪙</span>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "¿Qué son los Tokens de Honor of Kings?" : "What are Honor of Kings Tokens?"}</p>
          <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "La moneda premium del juego" : "The premium in-game currency"}</p>
        </div>
      </div>
      <div className="p-6" style={{ background:"var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon:"🪙", title: lang === "ES" ? "¿Qué son los Tokens?" : "What are Tokens?",
              body: lang === "ES" ? "Los Tokens son la moneda premium de Honor of Kings. Se usan para comprar skins exclusivas, héroes, pases de temporada y artículos del Salón del Héroe." : "Tokens are the premium currency of Honor of Kings. They are used to buy exclusive skins, heroes, season passes and Hero Hall items.",
              items: lang === "ES" ? ["Compra skins épicas y legendarias","Desbloquea héroes premium","Participa en eventos especiales"] : ["Buy epic and legendary skins","Unlock premium heroes","Participate in special events"],
            },
            {
              icon:"🎁", title: lang === "ES" ? "Tokens de regalo" : "Bonus Tokens",
              body: lang === "ES" ? "Los paquetes a partir de 800 Tokens incluyen Tokens adicionales de regalo sin costo extra. A mayor paquete, mayor el bonus recibido." : "Packs from 800 Tokens include additional bonus Tokens at no extra cost. The bigger the pack, the bigger the bonus.",
              items: lang === "ES" ? ["800 → +30 Tokens extra","2.400 → +108 Tokens extra","8.000 → +360 Tokens extra"] : ["800 → +30 extra Tokens","2,400 → +108 extra Tokens","8,000 → +360 extra Tokens"],
            },
            {
              icon:"🆔", title: lang === "ES" ? "Solo necesitas tu Player ID" : "You only need your Player ID",
              body: lang === "ES" ? "Para recargar en Honor of Kings solo necesitamos tu Player ID. Sin contraseña, sin acceso a tu cuenta. El proceso es rápido y completamente seguro." : "To top up in Honor of Kings we only need your Player ID. No password, no account access. The process is fast and completely secure.",
              items: lang === "ES" ? ["Solo Player ID de HOK","Sin necesidad de contraseña","Entrega en 5-10 minutos"] : ["Only HOK Player ID","No password needed","Delivery in 5-10 minutes"],
            },
          ].map(card => (
            <div key={card.title} className="rounded-xl p-5 space-y-3"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background:"var(--hok-bg)" }}>{card.icon}</div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{card.title}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{card.body}</p>
              <ul className="space-y-1.5">
                {card.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} className="flex-shrink-0" style={{ color:"var(--hok-text)" }}/> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Tabla de bonus */}
        <div className="mt-5 rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
          <div className="px-5 py-3 flex items-center gap-2"
            style={{ background:"var(--hok-bg)", borderBottom:"1px solid var(--border)" }}>
            <span>🎁</span>
            <p className="text-xs font-bold" style={{ color:"var(--hok-text)" }}>{lang === "ES" ? "Tabla de Tokens adicionales de regalo" : "Bonus Tokens table"}</p>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3" style={{ background:"var(--surface)" }}>
            {TOKENS.filter(t => t.bonus).map(t => (
              <div key={t.id} className="rounded-xl p-3 text-center"
                style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                <p className="text-sm font-black" style={{ color:"var(--hok-text)" }}>
                  {t.tokens.toLocaleString()}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color:"var(--text-subtle)" }}>Tokens</p>
                <div className="my-1.5 flex items-center justify-center gap-1"
                  style={{ color:"#4ADE80" }}>
                  <span className="text-xs">+</span>
                  <span className="text-sm font-black">{t.bonus}</span>
                </div>
                <p className="text-[10px]" style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "de regalo" : "bonus"}</p>
                <p className="text-[11px] font-bold mt-2" style={{ color:"var(--text)" }}>
                  = {(t.tokens + t.bonus!).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
function HOKPageInner({ tokens }: { tokens: HOKProduct[] }) {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HOK_STYLE }}/>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* Hero */}
        <section className="relative overflow-hidden" style={{ height:"65vh", minHeight:"440px" }}>
          <Image src="/games/honor-of-kings.jpg" alt="Honor of Kings" fill
            className="object-cover object-top" priority/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to right,rgba(0,0,0,0.93) 0%,rgba(0,0,0,0.48) 60%,transparent 100%)" }}/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to top,rgba(0,0,0,0.92) 0%,transparent 55%)" }}/>
          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-14 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold badge-popular">MOBA</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background:"rgba(252,211,77,0.15)", border:"1px solid rgba(252,211,77,0.4)", color:"#FCD34D" }}>
                    🌐 Global
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#4ADE80" }}>
                    🆔 Solo Player ID
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-3">
                  Honor of Kings
                </h1>
                <div className="flex items-center gap-4 flex-wrap" style={{ color:"rgba(255,255,255,0.65)" }}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400"/>
                    <span className="text-xs">{lang === "ES" ? "Entrega en 5-10 min" : "Delivery in 5-10 min"}</span>
                  </div>
                  <span className="text-xs">{lang === "ES" ? "🎁 Tokens extra en paquetes grandes" : "🎁 Extra Tokens on large packs"}</span>
                  <span className="text-xs">{lang === "ES" ? "🛡️ Sin contraseña" : "🛡️ No password"}</span>
                </div>
                <p className="mt-4 text-base" style={{ color:"rgba(255,255,255,0.7)" }}>
                  {t.gameCard.from} <span className="text-2xl font-bold text-white">{formatPrice(4.99)}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky header */}
        <div className="sticky top-[66px] md:top-[107px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-lg">🪙</span>
              <p className="text-sm font-bold" style={{ color:"var(--text)" }}>Tokens</p>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:"var(--hok-bg)", color:"var(--hok-text)", border:"1px solid var(--hok-border)" }}>
                {tokens.length} {lang === "ES" ? "paquetes" : "packs"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color:"var(--text-subtle)" }}>
              <Fingerprint size={13} style={{ color:"var(--hok-text)" }}/>
              {lang === "ES" ? "Solo necesitas tu Player ID" : "You only need your Player ID"}
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">

          {/* Aviso Player ID */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
            style={{ background:"var(--hok-bg)", border:"1px solid var(--hok-border)" }}>
            <Fingerprint size={16} className="flex-shrink-0" style={{ color:"var(--hok-text)" }}/>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>
              <strong style={{ color:"var(--hok-text)" }}>{lang === "ES" ? "Sin contraseña." : "No password."}</strong>{" "}
              {lang === "ES" ? "Para recargar en Honor of Kings solo necesitamos tu Player ID. Tus datos de acceso permanecen completamente privados." : "To top up in Honor of Kings we only need your Player ID. Your login data remains completely private."}
            </p>
          </div>

          {/* Grid — 3 columnas en md, más en xl */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {tokens.map(p => <ProductCard key={p.id} p={p}/>)}
          </div>

          <InfoSection/>
        </div>
      </main>
      <Footer/>
    </>
  );
}

export default function HonorOfKingsPageClient() {
  const tokens = useGameVisibility("honor-of-kings").filterProducts(TOKENS);
  return (
    <Suspense fallback={null}>
      <HOKPageInner tokens={tokens}/>
    </Suspense>
  );
}
