"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, ExternalLink } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LATTICES, MarvelRivalsProduct } from "@/data/marvelrivals";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

const badgeStyle: Record<string, string> = {
  "Popular":"badge-popular", "Oferta":"badge-oferta", "Mejor valor":"badge-valor",
};

// ── Product Card ───────────────────────────────────────────────
function ProductCard({ p }: { p: MarvelRivalsProduct }) {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();
    const disc = Math.round((1 - p.price / p.priceOld) * 100);
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 group"
      style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
      <div className="relative w-full overflow-hidden"
        style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,rgba(220,38,38,0.15),rgba(10,5,30,0.8))" }}>
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
        <p className="text-sm font-bold leading-tight mb-1" style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</p>
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color:"var(--text-muted)" }}>{lang==="EN" ? p.descriptionEN || p.description : p.description}</p>
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <p className="text-[11px] line-through" style={{ color:"var(--text-subtle)" }}>{formatPrice(p.priceOld)}</p>
            <p className="text-xl font-bold" style={{ color:"#EF4444" }}>{formatPrice(p.price)}</p>
          </div>
          <Link href={`/games/marvel-rivals/${p.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 whitespace-nowrap"
            style={{ background:"linear-gradient(135deg,#DC2626,#7F1D1D)", boxShadow:"0 2px 12px rgba(220,38,38,0.35)" }}>
            <ShoppingCart size={13}/> {t.product.buyNow}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── How to find UID ────────────────────────────────────────────
function UIDGuide() {
  const { lang } = usePreferences();
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ background:"linear-gradient(135deg,rgba(220,38,38,0.12),rgba(127,29,29,0.08))", borderBottom:"1px solid var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:"rgba(220,38,38,0.15)", border:"1px solid rgba(220,38,38,0.3)" }}>
          <span className="text-lg">🆔</span>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "¿Cómo encontrar tu UID de Marvel Rivals?" : "How to find your Marvel Rivals UID?"}</p>
          <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "Sigue estos 3 pasos simples" : "Follow these 3 simple steps"}</p>
        </div>
      </div>
      <div className="p-6" style={{ background:"var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            {[
              { step:"1", text: lang === "ES" ? "Inicia sesión en el juego usando tu cuenta." : "Log in to the game using your account." },
              { step:"2", text: lang === "ES" ? 'Toca el ícono "Avatar" ubicado en la esquina superior derecha de la pantalla principal.' : 'Tap the "Avatar" icon located in the upper right corner of the main screen.' },
              { step:"3", text: lang === "ES" ? "Tu UID de Marvel Rivals se mostrará en la pantalla." : "Your Marvel Rivals UID will be displayed on screen." },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
                  style={{ background:"linear-gradient(135deg,#DC2626,#7F1D1D)" }}>
                  {item.step}
                </div>
                <p className="text-sm pt-0.5 leading-relaxed" style={{ color:"var(--text-muted)" }}>{item.text}</p>
              </div>
            ))}
          </div>
          {/* UID reference image */}
          <div className="rounded-xl overflow-hidden"
            style={{ border:"1px solid var(--border)", background:"var(--surface)" }}>
            <Image src="/marvel-rivals/tu-uid.png" alt={lang === "ES" ? "Cómo encontrar tu UID" : "How to find your UID"} width={400} height={280}
              className="w-full object-contain"/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── About section ──────────────────────────────────────────────
function AboutSection() {
  const { lang } = usePreferences();
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
      <div className="px-6 py-4"
        style={{ background:"linear-gradient(135deg,rgba(220,38,38,0.12),rgba(127,29,29,0.08))", borderBottom:"1px solid var(--border)" }}>
        <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "📖 Descripción" : "📖 Description"}</p>
      </div>
      <div className="p-6 space-y-6" style={{ background:"var(--card)" }}>

        {/* Acerca de */}
        <div>
          <p className="text-sm font-bold mb-2" style={{ color:"var(--text)" }}>{lang === "ES" ? "Acerca de Marvel Rivals" : "About Marvel Rivals"}</p>
          <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
            {lang === "ES"
              ? "Marvel Rivals es un juego competitivo multijugador donde equipos de superhéroes y villanos del universo Marvel se enfrentan en combates estratégicos. Cada personaje posee habilidades únicas que permiten crear combinaciones y estrategias en mapas dinámicos inspirados en los cómics de Marvel."
              : "Marvel Rivals is a competitive multiplayer game where teams of superheroes and villains from the Marvel universe engage in strategic combat. Each character has unique abilities that allow for combinations and strategies on dynamic maps inspired by Marvel comics."}
          </p>
          <p className="text-xs leading-relaxed mt-2" style={{ color:"var(--text-muted)" }}>
            {lang === "ES"
              ? "El juego ofrece combates intensos en equipo, eventos especiales, skins exclusivas y múltiples modos de juego donde los jugadores pueden utilizar a sus personajes favoritos del universo Marvel."
              : "The game offers intense team combat, special events, exclusive skins and multiple game modes where players can use their favorite characters from the Marvel universe."}
          </p>
        </div>

        <div style={{ borderTop:"1px solid var(--border)", paddingTop:"20px" }}>
          <p className="text-sm font-bold mb-3" style={{ color:"var(--text)" }}>
            {lang === "ES" ? "¿Cómo recargar Marvel Rivals Lattices en KidStore Perú?" : "How to recharge Marvel Rivals Lattices on KidStore?"}
          </p>
          <div className="space-y-2.5">
            {(lang === "ES" ? [
              "Seleccione la cantidad de Lattices.",
              "Introduzca su UID.",
              "Realiza tu compra y selecciona tu método de pago.",
              "Una vez realizado el pago, Marvel Rivals Lattices se acreditará en su cuenta en breve.",
            ] : [
              "Select the amount of Lattices.",
              "Enter your UID.",
              "Complete your purchase and select your payment method.",
              "Once payment is made, Marvel Rivals Lattices will be credited to your account shortly.",
            ]).map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0 mt-0.5"
                  style={{ background:"linear-gradient(135deg,#DC2626,#7F1D1D)" }}>
                  {i + 1}
                </span>
                <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function MarvelRivalsPageClient() {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  return (
    <>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* Hero */}
        <section className="relative overflow-hidden" style={{ height:"60vh", minHeight:"420px" }}>
          <Image src="/games/marvel-rivals.jpg" alt="Marvel Rivals" fill
            className="object-cover object-top" priority/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to right,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.45) 60%,rgba(0,0,0,0.1) 100%)" }}/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to top,rgba(0,0,0,0.88) 0%,transparent 55%)" }}/>
          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-14 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold badge-popular">Hero Shooter</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background:"rgba(220,38,38,0.2)", border:"1px solid rgba(220,38,38,0.4)", color:"#FCA5A5" }}>
                    Global
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-3">
                  Marvel Rivals
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
                    <span className="text-xs">{lang === "ES" ? "Entrega en minutos" : "Delivery in minutes"}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">{lang === "ES" ? "🛡️ Solo necesitas tu UID" : "🛡️ Only your UID needed"}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">{lang === "ES" ? "💬 Soporte 24/7" : "💬 24/7 Support"}</span>
                  </div>
                </div>
                <p className="mt-4 text-base" style={{ color:"rgba(255,255,255,0.7)" }}>
                  {t.gameCard.from} <span className="text-2xl font-bold text-white">{formatPrice(4.9)}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 space-y-10">

          {/* Sección paquetes */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background:"rgba(220,38,38,0.15)", border:"1px solid rgba(220,38,38,0.3)" }}>
                💎
              </div>
              <h2 className="text-base font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "Elige tu paquete" : "Choose your package"}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                style={{ background:"rgba(220,38,38,0.1)", border:"1px solid rgba(220,38,38,0.25)", color:"#FCA5A5" }}>
                🌐 Global
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {LATTICES.map(p => <ProductCard key={p.id} p={p}/>)}
            </div>
          </div>

          {/* Guía UID */}
          <UIDGuide/>

          {/* Descripción */}
          <AboutSection/>
        </div>
      </main>
      <Footer/>
    </>
  );
}
