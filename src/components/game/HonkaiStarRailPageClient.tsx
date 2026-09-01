"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ESQUIRLAS, PASES, HSRProduct } from "@/data/honkaistarrail";
import { usePreferences } from "@/context/PreferencesContext";
import { useGameVisibility } from "@/hooks/useGameVisibility";
import { useT, useBadge } from "@/i18n";

const SLUG = "honkai-star-rail";

/*
  HSR brand: deep violet / star purple
  Light:  #5B21B6 (violet-800) → ratio ~7:1 on white ✓
  Dark:   #C4B5FD (violet-300) → ratio ~9:1 on dark  ✓
*/
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
  { id:"esquirla", label:"💎 Esquirla Onírica"      },
  { id:"pases",    label:"🚂 Pase del Expreso"       },
];
const TABS_EN = [
  { id:"esquirla", label:"💎 Oneiric Shard"        },
  { id:"pases",    label:"🚂 Express Supply Pass"  },
];

const badgeStyle: Record<string, string> = {
  "Popular":"badge-popular", "Oferta":"badge-oferta", "Mejor valor":"badge-valor",
};

// ── Product Card ───────────────────────────────────────────────
function ProductCard({ p }: { p: HSRProduct }) {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();
  const disc = p.priceOld > p.price ? Math.round((1 - p.price / p.priceOld) * 100) : 0;
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 group"
      style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
      <div className="relative w-full overflow-hidden"
        style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,var(--hsr-bg),rgba(5,3,20,0.9))" }}>
        <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"/>
        {p.badge && (
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeStyle[p.badge] ?? "badge-popular"}`}>
            {badge(p.badge)}
          </span>
        )}
        {disc > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#4ADE80" }}>
            -{disc}%
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-bold leading-tight mb-0.5" style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</p>
        {p.subtitle && (
          <p className="text-[11px] mb-1 font-medium" style={{ color:"var(--hsr-text)" }}>{lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}</p>
        )}
        {p.bonus && (
          <p className="text-[10px] mb-0.5 font-semibold" style={{ color:"#4ADE80" }}>✨ {lang==="EN" ? p.bonusEN || p.bonus : p.bonus}</p>
        )}
        {p.recurringBonus && (
          <p className="text-[10px] mb-1.5 font-semibold" style={{ color:"var(--text-subtle)" }}>🔄 {lang==="EN" ? p.recurringBonusEN || p.recurringBonus : p.recurringBonus}</p>
        )}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color:"var(--text-muted)" }}>{lang==="EN" ? p.descriptionEN || p.description : p.description}</p>
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <p className="text-[11px] line-through" style={{ color:"var(--text-subtle)" }}>{formatPrice(p.priceOld)}</p>
            <p className="text-xl font-bold" style={{ color:"var(--hsr-text)" }}>{formatPrice(p.price)}</p>
          </div>
          <Link href={`/games/honkai-star-rail/${p.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 whitespace-nowrap"
            style={{ background:"var(--hsr-btn-bg)", boxShadow:"0 2px 12px var(--hsr-glow)" }}>
            <ShoppingCart size={13}/> {t.product.buyNow}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Info Esquirla ──────────────────────────────────────────────
function InfoEsquirla() {
  const { lang } = usePreferences();
  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border:"1px solid var(--border)" }}>
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ background:"var(--hsr-bg)", borderBottom:"1px solid var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:"var(--hsr-bg)", border:"1px solid var(--hsr-border)" }}>
          <span className="text-lg">💎</span>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "¿Qué son las Esquirlas Oníricas?" : "What are Oneiric Shards?"}</p>
          <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "La moneda premium de Honkai: Star Rail" : "The premium currency of Honkai: Star Rail"}</p>
        </div>
      </div>
      <div className="p-6" style={{ background:"var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon:"💎", title: lang === "ES" ? "¿Qué son?" : "What are they?",
              body: lang === "ES" ? "Las Esquirlas Oníricas son la moneda premium de Honkai: Star Rail. Se intercambian por Jade Estelar para usar en el Warp y obtener personajes y conos de luz 5★." : "Oneiric Shards are the premium currency of Honkai: Star Rail. They are exchanged for Stellar Jade to use on Warps and obtain 5★ characters and light cones.",
              items: lang === "ES" ? ["Intercambiables por Jade Estelar","Usables en Warps de personajes y conos","Válidos para el Pase de Suministros del Expreso"] : ["Exchangeable for Stellar Jade","Usable on character and light cone Warps","Valid for the Express Supply Pass"],
            },
            {
              icon:"✨", title: lang === "ES" ? "Doble por primera recarga" : "Double on first recharge",
              body: lang === "ES" ? "Cada paquete incluye un bonus del 100% en la primera recarga. Si compras 980 Esquirlas por primera vez, recibirás 1.960 en total." : "Each pack includes a 100% bonus on the first recharge. If you buy 980 Shards for the first time, you will receive 1,960 total.",
              items: lang === "ES" ? ["Doble de Esquirlas la primera vez","Aplica una vez por paquete","Aprovéchalo al máximo en cuentas nuevas"] : ["Double Shards the first time","Applies once per pack","Make the most of it on new accounts"],
            },
            {
              icon:"🔄", title: lang === "ES" ? "Bonus recurrente" : "Recurring bonus",
              body: lang === "ES" ? "Después de la primera recarga doble, cada compra del mismo paquete sigue incluyendo un extra de Esquirlas (desde el paquete de 300)." : "After the first double recharge, every purchase of the same pack still includes an extra amount of Shards (from the 300 pack onward).",
              items: lang === "ES" ? ["300 → +30 · 980 → +110 · 1.980 → +260","3.280 → +600 · 6.480 → +1.600","Es con acceso a cuenta, sin contraseña en la web"] : ["300 → +30 · 980 → +110 · 1,980 → +260","3,280 → +600 · 6,480 → +1,600","Via account access, no password on the website"],
            },
          ].map(card => (
            <div key={card.title} className="rounded-xl p-5 space-y-3"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background:"var(--hsr-bg)" }}>{card.icon}</div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{card.title}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{card.body}</p>
              <ul className="space-y-1.5">
                {card.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} className="flex-shrink-0" style={{ color:"var(--hsr-text)" }}/> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Info Pases ─────────────────────────────────────────────────
function InfoPases() {
  const { lang } = usePreferences();
  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border:"1px solid var(--border)" }}>
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ background:"var(--hsr-bg)", borderBottom:"1px solid var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:"var(--hsr-bg)", border:"1px solid var(--hsr-border)" }}>
          <span className="text-lg">🚂</span>
        </div>
        <p className="text-sm font-bold" style={{ color:"var(--text)" }}>
          {lang === "ES" ? "¿Qué incluye el Pase de Suministros del Expreso?" : "What does the Express Supply Pass include?"}
        </p>
      </div>
      <div className="p-6" style={{ background:"var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon:"💎", title: lang === "ES" ? "300 Jades Estelares al activar" : "300 Stellar Jades upon activation",  body: lang === "ES" ? "Al activar el pase recibes 300 Jades Estelares de inmediato para usar en el Warp de personajes o conos." : "Upon activating the pass you receive 300 Stellar Jades immediately to use on character or light cone Warps." },
            { icon:"📅", title: lang === "ES" ? "90 Jades diarios" : "90 Daily Jades",                body: lang === "ES" ? "Cada día que inicies sesión recibirás 90 Jades Estelares adicionales durante 30 días. Total potencial: 3.000 Jades." : "Each day you log in you will receive 90 additional Stellar Jades for 30 days. Total potential: 3,000 Jades." },
            { icon:"⏱️", title: lang === "ES" ? "Duración 30 días" : "30-day duration",                body: lang === "ES" ? "El pase dura 30 días. Puedes acumular múltiples pases comprando varias veces antes de que el actual expire." : "The pass lasts 30 days. You can stack multiple passes by purchasing several times before the current one expires." },
          ].map(c => (
            <div key={c.title} className="rounded-xl p-5 space-y-2"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background:"var(--hsr-bg)" }}>{c.icon}</div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{c.title}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Inner ──────────────────────────────────────────────────────
function HSRPageInner() {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tabParam     = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam ?? "esquirla");

  useEffect(() => { if (tabParam) setActiveTab(tabParam); }, [tabParam]);

  const vis      = useGameVisibility(SLUG);
  const tabDefs  = (lang === "ES" ? TABS_ES : TABS_EN).filter(tb => vis.tabVisible(tb.id));
  const shownTab = tabDefs.some(tb => tb.id === activeTab) ? activeTab : (tabDefs[0]?.id ?? activeTab);

  function handleTab(id: string) {
    setActiveTab(id);
    router.push(`/games/honkai-star-rail?tab=${id}`, { scroll: false });
  }

  const products = vis.filterProducts(shownTab === "pases" ? PASES : ESQUIRLAS);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HSR_STYLE }}/>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* Hero */}
        <section className="relative overflow-hidden" style={{ height:"65vh", minHeight:"440px" }}>
          <Image src="/games/honkai-star-rail.jpg" alt="Honkai: Star Rail" fill
            className="object-cover object-top" priority/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to right,rgba(0,0,0,0.93) 0%,rgba(0,0,0,0.48) 60%,rgba(0,0,0,0.08) 100%)" }}/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to top,rgba(0,0,0,0.92) 0%,transparent 55%)" }}/>
          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-14 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold badge-popular">{lang === "ES" ? "RPG por turnos" : "Turn-based RPG"}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background:"rgba(196,181,253,0.15)", border:"1px solid rgba(196,181,253,0.4)", color:"#C4B5FD" }}>
                    🌐 Global
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-3">
                  Honkai: Star Rail
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.65)" }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
                    <span className="text-xs">{lang === "ES" ? "Entrega en 5-10 min" : "Delivery in 5-10 min"}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.65)" }}>
                    <span className="text-xs">{lang === "ES" ? "🎮 Acceso a cuenta" : "🎮 Account access"}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.65)" }}>
                    <span className="text-xs">{lang === "ES" ? "✨ Doble por primera recarga" : "✨ Double on first recharge"}</span>
                  </div>
                </div>
                <p className="mt-4 text-base" style={{ color:"rgba(255,255,255,0.7)" }}>
                  {t.gameCard.from} <span className="text-2xl font-bold text-white">{formatPrice(3.5)}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        {tabDefs.length > 1 && (
        <div className="sticky top-[66px] md:top-[107px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth:"none" }}>
              <div className="flex">
                {tabDefs.map(tab => (
                  <button key={tab.id} onClick={() => handleTab(tab.id)}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: shownTab === tab.id ? "var(--hsr-text)" : "var(--text-muted)" }}>
                    {tab.label}
                    {shownTab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:"var(--hsr-text)" }}/>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">

          {/* Aviso método */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
            style={{ background:"var(--hsr-bg)", border:"1px solid var(--hsr-border)" }}>
            <span className="text-base flex-shrink-0">🎮</span>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>
              <strong style={{ color:"var(--hsr-text)" }}>{lang === "ES" ? "Recarga con acceso a cuenta." : "Top-up via account access."}</strong>{" "}
              {lang === "ES" ? "Coordinamos el acceso de forma privada por WhatsApp al procesar tu pedido. Nunca te pedimos tu contraseña en la web." : "We coordinate access privately via WhatsApp when processing your order. We never ask for your password on the website."}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
            {products.map(p => <ProductCard key={p.id} p={p}/>)}
          </div>

          {shownTab === "esquirla" && <InfoEsquirla/>}
          {shownTab === "pases"    && <InfoPases/>}
        </div>
      </main>
      <Footer/>
    </>
  );
}

export default function HonkaiStarRailPageClient() {
  return (
    <Suspense fallback={null}>
      <HSRPageInner/>
    </Suspense>
  );
}
