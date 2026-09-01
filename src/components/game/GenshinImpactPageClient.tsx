"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, Star, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CRISTALES, BENDICION, GenshinProduct } from "@/data/genshinimpact";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

// Genshin brand: golden/amber
const BRAND      = "#D4AF37";
const BRAND_LIGHT = "#F5CC45";

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

// ── Product Card ───────────────────────────────────────────────
function ProductCard({ p }: { p: GenshinProduct }) {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();
    const disc = Math.round((1 - p.price / p.priceOld) * 100);
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 group"
      style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
      <div className="relative w-full overflow-hidden"
        style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,rgba(212,175,55,0.12),rgba(10,8,30,0.85))" }}>
        <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"/>
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
        {p.subtitle && <p className="text-[11px] mb-1 font-medium" style={{ color:BRAND_LIGHT }}>{lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}</p>}
        {p.bonus && (
          <p className="text-[10px] mb-1.5 font-semibold" style={{ color:"#4ADE80" }}>
            ✨ {lang==="EN" ? p.bonusEN || p.bonus : p.bonus}
          </p>
        )}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color:"var(--text-muted)" }}>{lang==="EN" ? p.descriptionEN || p.description : p.description}</p>
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <p className="text-[11px] line-through" style={{ color:"var(--text-subtle)" }}>{formatPrice(p.priceOld)}</p>
            <p className="text-xl font-bold" style={{ color:BRAND_LIGHT }}>{formatPrice(p.price)}</p>
          </div>
          <Link href={`/games/genshin-impact/${p.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 whitespace-nowrap"
            style={{ background:`linear-gradient(135deg,#92700A,${BRAND})`, boxShadow:`0 2px 12px ${BRAND}50` }}>
            <ShoppingCart size={13}/> {t.product.buyNow}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Info Cristales ─────────────────────────────────────────────
function InfoCristales() {
  const { lang } = usePreferences();
  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border:"1px solid var(--border)" }}>
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ background:`linear-gradient(135deg,rgba(212,175,55,0.12),rgba(146,112,10,0.06))`, borderBottom:"1px solid var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:`rgba(212,175,55,0.15)`, border:`1px solid rgba(212,175,55,0.3)` }}>
          <span className="text-lg">💎</span>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "¿Qué son los Cristales de Génesis?" : "What are Genesis Crystals?"}</p>
          <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "Todo lo que necesitas saber" : "Everything you need to know"}</p>
        </div>
      </div>
      <div className="p-6" style={{ background:"var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon:"💎", title: lang === "ES" ? "¿Qué son?" : "What are they?",
              body: lang === "ES" ? "Los Cristales de Génesis son la moneda premium de Genshin Impact. Se pueden intercambiar por Gemas del Destino para usar en los Banners y obtener personajes y armas 5★." : "Genesis Crystals are the premium currency of Genshin Impact. They can be exchanged for Primogems to use on Banners and obtain 5★ characters and weapons.",
              items: lang === "ES" ? ["Intercambiables por Gemas del Destino","Usables en Banners de personajes y armas","Válidos para la Bendición de la Luna Welkin"] : ["Exchangeable for Primogems","Usable on character and weapon Banners","Valid for the Welkin Moon Blessing"],
            },
            {
              icon:"✨", title: lang === "ES" ? "Bonus de primera compra" : "First purchase bonus",
              body: lang === "ES" ? "Cada paquete tiene un bonus del 100% en la primera compra. Si compras 980 Cristales por primera vez, recibirás 1.960 Cristales en total." : "Each pack has a 100% bonus on the first purchase. If you buy 980 Crystals for the first time, you will receive 1,960 Crystals total.",
              items: lang === "ES" ? ["Doble de cristales la primera vez","Aplica una vez por paquete","Reinicia con cuenta nueva"] : ["Double crystals the first time","Applies once per pack","Resets with a new account"],
            },
            {
              icon:"🔑", title: lang === "ES" ? "¿Cómo se entregan?" : "How are they delivered?",
              body: lang === "ES" ? "Accedemos a tu cuenta HoYoverse de forma segura para realizar la compra directamente en la tienda del juego. Entrega en 5-10 minutos." : "We securely access your HoYoverse account to make the purchase directly in the in-game store. Delivery in 5-10 minutes.",
              items: lang === "ES" ? ["Acceso seguro con tu cuenta HoYoverse","Sin apps de terceros","Soporte post-compra incluido"] : ["Secure access with your HoYoverse account","No third-party apps","Post-purchase support included"],
            },
          ].map(card => (
            <div key={card.title} className="rounded-xl p-5 space-y-3"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background:`rgba(212,175,55,0.12)` }}>
                  {card.icon}
                </div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{card.title}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{card.body}</p>
              <ul className="space-y-1.5">
                {card.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} className="flex-shrink-0" style={{ color:BRAND_LIGHT }}/> {item}
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

// ── Info Bendición ─────────────────────────────────────────────
function InfoBendicion() {
  const { lang } = usePreferences();
  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border:"1px solid var(--border)" }}>
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ background:`linear-gradient(135deg,rgba(212,175,55,0.12),rgba(146,112,10,0.06))`, borderBottom:"1px solid var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:`rgba(212,175,55,0.15)`, border:`1px solid rgba(212,175,55,0.3)` }}>
          <span className="text-lg">🌙</span>
        </div>
        <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "¿Qué incluye la Bendición de la Luna Welkin?" : "What does the Welkin Moon Blessing include?"}</p>
      </div>
      <div className="p-6" style={{ background:"var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon:"💎", title: lang === "ES" ? "2.700 Gemas del Destino" : "2,700 Primogems", body: lang === "ES" ? "Al activar la suscripción recibes 2.700 Gemas del Destino de forma inmediata para usar en los Banners." : "Upon activating the subscription you receive 2,700 Primogems immediately to use on Banners." },
            { icon:"🌅", title: lang === "ES" ? "90 Primogemmas diarias" : "90 Daily Primogems",  body: lang === "ES" ? "Cada día que inicies sesión durante 30 días recibirás 90 Primogemmas. Un total de hasta 2.700 Primo adicionales." : "Each day you log in for 30 days you will receive 90 Primogems. A total of up to 2,700 additional Primos." },
            { icon:"📅", title: lang === "ES" ? "Duración 30 días" : "30-day duration",        body: lang === "ES" ? "La suscripción cubre 30 días completos. Puedes acumular varias mensualidades comprando múltiples veces." : "The subscription covers 30 full days. You can stack multiple months by purchasing several times." },
          ].map(c => (
            <div key={c.title} className="rounded-xl p-5 space-y-2"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background:`rgba(212,175,55,0.12)` }}>{c.icon}</div>
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
function GenshinPageInner() {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tabParam     = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam ?? "cristales");

  useEffect(() => { if (tabParam) setActiveTab(tabParam); }, [tabParam]);

  function handleTab(id: string) {
    setActiveTab(id);
    router.push(`/games/genshin-impact?tab=${id}`, { scroll: false });
  }

  const products = activeTab === "bendicion" ? BENDICION : CRISTALES;

  return (
    <>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* Hero */}
        <section className="relative overflow-hidden" style={{ height:"65vh", minHeight:"440px" }}>
          <Image src="/games/genshin-impact.jpg" alt="Genshin Impact" fill
            className="object-cover object-top" priority/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to right,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.45) 60%,rgba(0,0,0,0.1) 100%)" }}/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 55%)" }}/>
          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-14 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold badge-popular">{lang === "ES" ? "RPG de Acción" : "Action RPG"}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background:`rgba(212,175,55,0.2)`, border:`1px solid rgba(212,175,55,0.4)`, color:BRAND_LIGHT }}>
                    🌐 Global
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-3">
                  Genshin Impact
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
                    <span className="text-xs">{lang === "ES" ? "Entrega en 5-10 min" : "Delivery in 5-10 min"}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">{lang === "ES" ? "🔑 Acceso vía HoYoverse" : "🔑 Access via HoYoverse"}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">{lang === "ES" ? "✨ Bonus primera compra" : "✨ First purchase bonus"}</span>
                  </div>
                </div>
                <p className="mt-4 text-base" style={{ color:"rgba(255,255,255,0.7)" }}>
                  {t.gameCard.from} <span className="text-2xl font-bold text-white">{formatPrice(4.99)}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="sticky top-[66px] md:top-[107px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth:"none" }}>
              <div className="flex">
                {(lang === "ES" ? TABS_ES : TABS_EN).map(tab => (
                  <button key={tab.id} onClick={() => handleTab(tab.id)}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: activeTab === tab.id ? BRAND_LIGHT : "var(--text-muted)" }}>
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:`linear-gradient(90deg,#92700A,${BRAND_LIGHT})` }}/>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">
          {/* Aviso HoYoverse */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
            style={{ background:`rgba(212,175,55,0.07)`, border:`1px solid rgba(212,175,55,0.25)` }}>
            <span className="text-base flex-shrink-0">🔑</span>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>
              <strong style={{ color:BRAND_LIGHT }}>{lang === "ES" ? "Requiere acceso a cuenta HoYoverse." : "Requires HoYoverse account access."}</strong>{" "}
              {lang === "ES" ? "Coordinamos el acceso contigo por WhatsApp al procesar tu pedido. Nunca pedimos tu contraseña en la web." : "We coordinate access with you on WhatsApp when processing your order. We never ask for your password on the website."}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {products.map(p => <ProductCard key={p.id} p={p}/>)}
          </div>

          {/* Info */}
          {activeTab === "cristales" && <InfoCristales/>}
          {activeTab === "bendicion" && <InfoBendicion/>}
        </div>
      </main>
      <Footer/>
    </>
  );
}

export default function GenshinImpactPageClient() {
  return (
    <Suspense fallback={null}>
      <GenshinPageInner/>
    </Suspense>
  );
}
