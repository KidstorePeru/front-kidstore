"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { NITRO, MEJORAS, TIENDA, DiscordProduct } from "@/data/discord";
import { usePreferences } from "@/context/PreferencesContext";
import { useGameVisibility } from "@/hooks/useGameVisibility";
import { useT, useBadge } from "@/i18n";

const SLUG = "discord";

// ── Accent color Discord ───────────────────────────────────────
const ACCENT       = "#5865F2";
const ACCENT_LIGHT = "#7983F5";
const ACCENT_GLOW  = "88,101,242";

// ── Tabs ──────────────────────────────────────────────────────
const TABS_ES = [
  { id: "nitro",   label: "💎 Nitro"    },
  { id: "mejoras", label: "🚀 Mejoras"  },
  { id: "tienda",  label: "🛍️ Tienda"   },
];
const TABS_EN = [
  { id: "nitro",   label: "💎 Nitro"    },
  { id: "mejoras", label: "🚀 Boosts"   },
  { id: "tienda",  label: "🛍️ Store"    },
];

const badgeStyle: Record<string, string> = {
  "Popular":     "badge-popular",
  "Oferta":      "badge-oferta",
  "Sale":        "badge-oferta",
  "Mejor valor": "badge-valor",
  "Best value":  "badge-valor",
};

// ── ProductCard ───────────────────────────────────────────────
function ProductCard({ p }: { p: DiscordProduct }) {
  const { formatPrice: fmt, currencySymbol, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();
  const disc = Math.round((1 - p.price / p.priceOld) * 100);
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 group"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="relative w-full overflow-hidden"
        style={{ aspectRatio: "4/3", background: `linear-gradient(135deg,rgba(${ACCENT_GLOW},0.18),rgba(5,5,20,0.75))` }}>
        <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
        {p.badge && (
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeStyle[p.badge] ?? "badge-popular"}`}>
            {badge(p.badge)}
          </span>
        )}
        {disc > 0 && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#4ADE80" }}>
            -{disc}%
          </span>
        )}
        {p.isTrialProduct && (
          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)", color: "#FCD34D" }}>
            {lang === "ES" ? "⚠ Versión Prueba" : "⚠ Trial Version"}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-bold leading-tight mb-0.5" style={{ color: "var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</p>
        {p.subtitle && (
          <p className="text-xs font-semibold mb-1" style={{ color: ACCENT_LIGHT }}>{lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}</p>
        )}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: "var(--text-muted)" }}>{lang==="EN" ? p.descriptionEN || p.description : p.description}</p>

        {/* descripción */}

        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <p className="text-[11px] line-through" style={{ color: "var(--text-subtle)" }}>{fmt(p.priceOld)}</p>
            <p className="text-xl font-bold" style={{ color: ACCENT_LIGHT }}>{fmt(p.price)}</p>
          </div>
          <Link href={`/games/discord/${p.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 whitespace-nowrap"
            style={{ background: `linear-gradient(135deg,${ACCENT},#4752C4)`, boxShadow: `0 2px 12px rgba(${ACCENT_GLOW},0.4)` }}>
            <ShoppingCart size={13} /> {t.product.buyNow}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Info sections ─────────────────────────────────────────────
function InfoNitro() {
  const { lang } = usePreferences();
  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border: "1px solid var(--border)" }}>
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ background: `linear-gradient(135deg,rgba(${ACCENT_GLOW},0.12),rgba(${ACCENT_GLOW},0.05))`, borderBottom: "1px solid var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `rgba(${ACCENT_GLOW},0.15)`, border: `1px solid rgba(${ACCENT_GLOW},0.3)` }}>
          <span className="text-lg">💎</span>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{lang === "ES" ? "¿Qué incluye Discord Nitro?" : "What does Discord Nitro include?"}</p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>{lang === "ES" ? "Todas las ventajas premium de Discord" : "All Discord premium features"}</p>
        </div>
      </div>
      <div className="p-6" style={{ background: "var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: "🎭", title: lang === "ES" ? "¿Qué es Nitro?" : "What is Nitro?",
              body: lang === "ES" ? "Discord Nitro es la suscripción premium de Discord que desbloquea emojis animados, avatar animado, mayor calidad de video, stickers y más." : "Discord Nitro is Discord's premium subscription that unlocks animated emojis, animated avatar, higher video quality, stickers and more.",
              items: lang === "ES" ? ["Emojis y stickers animados", "Avatar y banner animado", "Calidad de video mejorada"] : ["Animated emojis and stickers", "Animated avatar and banner", "Improved video quality"],
            },
            {
              icon: "🔑", title: lang === "ES" ? "¿Cómo se entrega?" : "How is it delivered?",
              body: lang === "ES" ? "Accedemos a tu cuenta de Discord de forma segura para activar la suscripción. El proceso toma entre 1 y 12 horas." : "We securely access your Discord account to activate the subscription. The process takes between 1 and 12 hours.",
              items: lang === "ES" ? ["Acceso seguro a tu cuenta", "Entrega en 1h - 12h", "Sin pasos adicionales"] : ["Secure account access", "Delivery in 1h - 12h", "No additional steps"],
            },
            {
              icon: "🌎", title: lang === "ES" ? "Servicio Global" : "Global Service",
              body: lang === "ES" ? "Esta suscripción es válida para cuentas de Discord de cualquier región del mundo." : "This subscription is valid for Discord accounts from any region in the world.",
              items: lang === "ES" ? ["Válido para todas las regiones", "Cuenta de Discord activa", "Soporte 24/7"] : ["Valid for all regions", "Active Discord account", "24/7 Support"],
            },
          ].map(card => (
            <div key={card.title} className="rounded-xl p-5 space-y-3"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background: `rgba(${ACCENT_GLOW},0.12)` }}>
                  {card.icon}
                </div>
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{card.title}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{card.body}</p>
              <ul className="space-y-1.5">
                {card.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Check size={11} className="flex-shrink-0" style={{ color: ACCENT_LIGHT }} /> {item}
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

function InfoMejoras() {
  const { lang } = usePreferences();
  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border: "1px solid var(--border)" }}>
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ background: `linear-gradient(135deg,rgba(${ACCENT_GLOW},0.12),rgba(${ACCENT_GLOW},0.05))`, borderBottom: "1px solid var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `rgba(${ACCENT_GLOW},0.15)`, border: `1px solid rgba(${ACCENT_GLOW},0.3)` }}>
          <span className="text-lg">🚀</span>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{lang === "ES" ? "¿Cómo funcionan las Mejoras?" : "How do Boosts work?"}</p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>{lang === "ES" ? "Server Boosts para tu servidor de Discord" : "Server Boosts for your Discord server"}</p>
        </div>
      </div>
      <div className="p-6" style={{ background: "var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: "⚡", title: lang === "ES" ? "¿Qué son?" : "What are they?",
              body: lang === "ES" ? "Los Server Boosts mejoran tu servidor de Discord desbloqueando más emojis, mejor calidad de audio, banner de servidor y mucho más." : "Server Boosts improve your Discord server by unlocking more emojis, better audio quality, server banner and much more.",
              items: lang === "ES" ? ["Nivel 3 del servidor", "Más slots de emojis", "Calidad de audio 384kbps"] : ["Server level 3", "More emoji slots", "Audio quality 384kbps"],
            },
            {
              icon: "🔧", title: lang === "ES" ? "¿Cómo funciona?" : "How does it work?",
              body: lang === "ES" ? "Cuentas de Discord se unirán a tu servidor y aplicarán las mejoras. El proceso es completamente automático." : "Discord accounts will join your server and apply the boosts. The process is fully automatic.",
              items: lang === "ES" ? ["Enlace de servidor sin caducidad", "Sin captcha ni preguntas", "Anti-raid desactivado"] : ["Server link without expiration", "No captcha or questions", "Anti-raid disabled"],
            },
            {
              icon: "⚠️", title: lang === "ES" ? "Requisitos importantes" : "Important requirements",
              body: lang === "ES" ? "Para que las mejoras funcionen correctamente, debes respetar ciertas condiciones en tu servidor durante el período activo." : "For the boosts to work properly, you must respect certain conditions on your server during the active period.",
              items: lang === "ES" ? ["No expulsar cuentas de boost", "Filtro anti-raid desactivado", "Sin límites de entrada"] : ["Don't kick boost accounts", "Anti-raid filter disabled", "No entry limits"],
            },
          ].map(card => (
            <div key={card.title} className="rounded-xl p-5 space-y-3"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background: `rgba(${ACCENT_GLOW},0.12)` }}>
                  {card.icon}
                </div>
                <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{card.title}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{card.body}</p>
              <ul className="space-y-1.5">
                {card.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Check size={11} className="flex-shrink-0" style={{ color: ACCENT_LIGHT }} /> {item}
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

// ── Inner ─────────────────────────────────────────────────────
function DiscordPageInner() {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tabParam     = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam ?? "nitro");

  useEffect(() => { if (tabParam) setActiveTab(tabParam); }, [tabParam]);

  const vis     = useGameVisibility(SLUG);
  const tabDefs = (lang === "ES" ? TABS_ES : TABS_EN).filter(tb => vis.tabVisible(tb.id));
  const shownTab = tabDefs.some(tb => tb.id === activeTab) ? activeTab : (tabDefs[0]?.id ?? activeTab);

  function handleTab(id: string) {
    setActiveTab(id);
    router.push(`/games/discord?tab=${id}`, { scroll: false });
  }

  const products = vis.filterProducts(
    shownTab === "mejoras" ? MEJORAS :
    shownTab === "tienda"  ? TIENDA  :
    NITRO,
  );

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

        {/* HERO */}
        <section className="relative overflow-hidden" style={{ height: "60vh", minHeight: "420px" }}>
          <Image src="/games/discord.jpg" alt="Discord" fill className="object-cover object-center" priority />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.45) 60%,rgba(0,0,0,0.1) 100%)" }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 55%)" }} />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 z-10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                <Link href="/" className="hover:text-white transition-colors">{t.checkout.home}</Link>
                <span>›</span>
                <Link href="/games" className="hover:text-white transition-colors">{t.gamePage.games}</Link>
                <span>›</span>
                <span className="text-white">Discord</span>
              </nav>
            </div>
          </div>

          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-14 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold badge-popular">{t.discord.subscription}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: `rgba(${ACCENT_GLOW},0.2)`, border: `1px solid rgba(${ACCENT_GLOW},0.4)`, color: ACCENT_LIGHT }}>
                    🌎 Global
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-3">Discord</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                    <span className="text-xs">{lang === "ES" ? "Entrega en 1h - 12h" : "Delivery in 1h - 12h"}</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">{lang === "ES" ? "🛡️ Acceso seguro a tu cuenta" : "🛡️ Secure account access"}</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">{lang === "ES" ? "🌎 Servicio Global" : "🌎 Global Service"}</span>
                  </div>
                </div>
                <p className="mt-4 text-base" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {t.gameCard.from} <span className="text-2xl font-bold text-white">{formatPrice(9.99)}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TABS */}
        {tabDefs.length > 1 && (
        <div className="sticky top-[66px] md:top-[107px] z-40 w-full"
          style={{ background: "var(--navbar-bg)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              <div className="flex">
                {tabDefs.map(tab => (
                  <button key={tab.id} onClick={() => handleTab(tab.id)}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: shownTab === tab.id ? ACCENT_LIGHT : "var(--text-muted)" }}>
                    {tab.label}
                    {shownTab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background: `linear-gradient(90deg,${ACCENT},${ACCENT_LIGHT})` }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* CONTENIDO */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">

          {/* Aviso global */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
            style={{ background: `rgba(${ACCENT_GLOW},0.07)`, border: `1px solid rgba(${ACCENT_GLOW},0.25)` }}>
            <span className="text-base flex-shrink-0">🌎</span>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              <strong style={{ color: ACCENT_LIGHT }}>{t.discord.globalService}.</strong>{" "}
              {lang === "ES" ? "Compatible con cuentas de Discord de cualquier región. La entrega se realiza con acceso seguro a tu cuenta." : "Compatible with Discord accounts from any region. Delivery is done with secure access to your account."}
            </p>
          </div>

          {/* Grid productos */}
          {products.length === 0 ? (
            <div className="rounded-2xl p-16 text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <p className="text-4xl mb-4">🛍️</p>
              <p className="font-bold mb-2" style={{ color: "var(--text)" }}>{lang === "ES" ? "Próximamente" : "Coming soon"}</p>
              <p className="text-sm" style={{ color: "var(--text-subtle)" }}>
                {lang === "ES" ? "Los productos de la tienda de Discord estarán disponibles pronto." : "Discord store products will be available soon."}
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              shownTab === "nitro"
                ? "grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto"
                : "grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto"
            }`}>
              {products.map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          )}

          {/* Info section */}
          {shownTab === "nitro"   && <InfoNitro />}
          {shownTab === "mejoras" && <InfoMejoras />}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function DiscordPageClient() {
  return (
    <Suspense fallback={null}>
      <DiscordPageInner />
    </Suspense>
  );
}
