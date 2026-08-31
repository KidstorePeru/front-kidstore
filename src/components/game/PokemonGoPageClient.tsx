"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { POKECOINS, PASES, PokemonGoProduct } from "@/data/pokemongo";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

const TABS_ES = [
  { id:"coins", label:"🪙 PokéCoins" },
  { id:"pases", label:"🎟️ Pases"     },
];
const TABS_EN = [
  { id:"coins", label:"🪙 PokéCoins" },
  { id:"pases", label:"🎟️ Passes"    },
];

const badgeStyle: Record<string, string> = {
  "Popular":"badge-popular", "Oferta":"badge-oferta", "Mejor valor":"badge-valor",
};

// Brand color for Pokémon GO
const BRAND = "#FACC15"; // yellow
const BRAND_DARK = "#EAB308";

// ── Product Card ───────────────────────────────────────────────
function ProductCard({ p }: { p: PokemonGoProduct }) {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();
    const disc = Math.round((1 - p.price / p.priceOld) * 100);
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 group"
      style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
      <div className="relative w-full overflow-hidden"
        style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,rgba(250,204,21,0.12),rgba(15,23,42,0.85))" }}>
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
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-bold leading-tight mb-0.5" style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</p>
        {p.subtitle && <p className="text-[11px] mb-1" style={{ color:BRAND }}>{lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}</p>}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color:"var(--text-muted)" }}>{lang==="EN" ? p.descriptionEN || p.description : p.description}</p>
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <p className="text-[11px] line-through" style={{ color:"var(--text-subtle)" }}>{formatPrice(p.priceOld)}</p>
            <p className="text-xl font-bold" style={{ color:BRAND }}>{formatPrice(p.price)}</p>
          </div>
          <Link href={`/games/pokemon-go/${p.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 whitespace-nowrap"
            style={{ background:`linear-gradient(135deg,${BRAND_DARK},#A16207)`, color:"#0f172a", boxShadow:`0 2px 12px ${BRAND}50` }}>
            <ShoppingCart size={13}/> {t.product.buyNow}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Info section ───────────────────────────────────────────────
function AboutSection() {
  const { lang } = usePreferences();
  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border:"1px solid var(--border)" }}>
      <div className="px-6 py-4"
        style={{ background:`linear-gradient(135deg,rgba(250,204,21,0.1),rgba(234,179,8,0.06))`, borderBottom:"1px solid var(--border)" }}>
        <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "📖 Descripción" : "📖 Description"}</p>
      </div>
      <div className="p-6 space-y-6" style={{ background:"var(--card)" }}>

        {/* Acerca de */}
        <div>
          <p className="text-sm font-bold mb-2" style={{ color:"var(--text)" }}>{lang === "ES" ? "Acerca de Pokémon GO" : "About Pokémon GO"}</p>
          <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
            {lang === "ES"
              ? "Pokémon GO es un juego de realidad aumentada desarrollado por Niantic que permite a los jugadores explorar el mundo real para capturar Pokémon, participar en incursiones, completar eventos especiales y fortalecer sus equipos."
              : "Pokémon GO is an augmented reality game developed by Niantic that allows players to explore the real world to catch Pokémon, participate in raids, complete special events and strengthen their teams."}
          </p>
          <p className="text-xs leading-relaxed mt-2" style={{ color:"var(--text-muted)" }}>
            {lang === "ES"
              ? "Los entrenadores pueden participar en batallas, evolucionar Pokémon y desbloquear contenido exclusivo utilizando la moneda del juego llamada PokéCoins."
              : "Trainers can participate in battles, evolve Pokémon and unlock exclusive content using the in-game currency called PokéCoins."}
          </p>
        </div>

        {/* Qué son */}
        <div style={{ borderTop:"1px solid var(--border)", paddingTop:"20px" }}>
          <p className="text-sm font-bold mb-2" style={{ color:"var(--text)" }}>{lang === "ES" ? "¿Qué son las PokéCoins?" : "What are PokéCoins?"}</p>
          <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
            {lang === "ES"
              ? "Las PokéCoins son la moneda virtual de Pokémon GO que permite adquirir objetos dentro de la tienda del juego como incubadoras, pases de incursión, módulos cebo, mejoras de almacenamiento y otros artículos especiales."
              : "PokéCoins are the virtual currency of Pokémon GO that allows you to purchase items in the in-game store such as incubators, raid passes, lure modules, storage upgrades and other special items."}
          </p>
        </div>

        {/* Para qué sirven */}
        <div style={{ borderTop:"1px solid var(--border)", paddingTop:"20px" }}>
          <p className="text-sm font-bold mb-3" style={{ color:"var(--text)" }}>{lang === "ES" ? "¿Para qué sirven las PokéCoins?" : "What are PokéCoins used for?"}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(lang === "ES" ? [
              "Comprar incubadoras de huevos",
              "Comprar pases de incursión remota",
              "Comprar módulos cebo",
              "Ampliar el almacenamiento de Pokémon",
              "Ampliar el almacenamiento de objetos",
              "Adquirir objetos especiales dentro del juego",
            ] : [
              "Buy egg incubators",
              "Buy remote raid passes",
              "Buy lure modules",
              "Expand Pokémon storage",
              "Expand item storage",
              "Acquire special in-game items",
            ]).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:BRAND }}/>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Cómo recargar */}
        <div style={{ borderTop:"1px solid var(--border)", paddingTop:"20px" }}>
          <p className="text-sm font-bold mb-2" style={{ color:"var(--text)" }}>{lang === "ES" ? "¿Cómo se recargan las PokéCoins?" : "How are PokéCoins recharged?"}</p>
          <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
            {lang === "ES"
              ? "Para realizar la recarga de PokéCoins es necesario acceder a tu cuenta de Pokémon GO para completar la compra dentro de la tienda oficial del juego."
              : "To recharge PokéCoins, we need to access your Pokémon GO account to complete the purchase in the official in-game store."}
          </p>
          <p className="text-xs leading-relaxed mt-2" style={{ color:"var(--text-muted)" }}>
            {lang === "ES"
              ? "Una vez realizada la compra, las PokéCoins aparecerán automáticamente en tu cuenta dentro del juego."
              : "Once the purchase is made, PokéCoins will automatically appear in your in-game account."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Inner ──────────────────────────────────────────────────────
function PokemonGoPageInner() {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tabParam     = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam ?? "coins");

  useEffect(() => { if (tabParam) setActiveTab(tabParam); }, [tabParam]);

  function handleTab(id: string) {
    setActiveTab(id);
    router.push(`/games/pokemon-go?tab=${id}`, { scroll: false });
  }

  const products = activeTab === "pases" ? PASES : POKECOINS;

  return (
    <>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* Hero */}
        <section className="relative overflow-hidden" style={{ height:"60vh", minHeight:"420px" }}>
          <Image src="/games/pokemon-go.jpg" alt="Pokémon GO" fill
            className="object-cover object-center" priority/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to right,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.45) 60%,rgba(0,0,0,0.1) 100%)" }}/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to top,rgba(0,0,0,0.88) 0%,transparent 55%)" }}/>
          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-14 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold badge-popular">{lang === "ES" ? "Realidad Aumentada" : "Augmented Reality"}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background:"rgba(250,204,21,0.2)", border:`1px solid rgba(250,204,21,0.4)`, color:BRAND }}>
                    🌐 Global
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-3">
                  Pokémon GO
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
                    <span className="text-xs">{lang === "ES" ? "Entrega en minutos" : "Delivery in minutes"}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">{lang === "ES" ? "🔐 Acceso seguro a tu cuenta" : "🔐 Secure account access"}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">{lang === "ES" ? "💬 Soporte 24/7" : "💬 24/7 Support"}</span>
                  </div>
                </div>
                <p className="mt-4 text-base" style={{ color:"rgba(255,255,255,0.7)" }}>
                  {t.gameCard.from} <span className="text-2xl font-bold text-white">{formatPrice(2.9)}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="sticky top-[65px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth:"none" }}>
              <div className="flex">
                {(lang==="EN"?TABS_EN:TABS_ES).map(tab => (
                  <button key={tab.id} onClick={() => handleTab(tab.id)}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: activeTab === tab.id ? BRAND : "var(--text-muted)" }}>
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:`linear-gradient(90deg,${BRAND_DARK},${BRAND})` }}/>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.map(p => <ProductCard key={p.id} p={p}/>)}
          </div>

          {/* Descripción */}
          <AboutSection/>
        </div>
      </main>
      <Footer/>
    </>
  );
}

export default function PokemonGoPageClient() {
  return (
    <Suspense fallback={null}>
      <PokemonGoPageInner/>
    </Suspense>
  );
}
