"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, User, Hash } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LUNITA, PASES, WWProduct } from "@/data/wutheringwaves";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

const WW_STYLE = `
  :root, [data-theme="light"] {
    --ww-teal:       #0E7490;
    --ww-teal-dark:  #0C4A5C;
    --ww-teal-bg:    rgba(14,116,144,0.07);
    --ww-teal-bdr:   rgba(14,116,144,0.22);
    --ww-vio:        #5B21B6;
    --ww-vio-bg:     rgba(91,33,182,0.07);
    --ww-vio-bdr:    rgba(91,33,182,0.22);
    --ww-btn:        linear-gradient(135deg,#0C4A5C,#0891B2);
    --ww-glow:       rgba(14,116,144,0.2);
  }
  [data-theme="dark"] {
    --ww-teal:       #67E8F9;
    --ww-teal-dark:  #06B6D4;
    --ww-teal-bg:    rgba(103,232,249,0.07);
    --ww-teal-bdr:   rgba(103,232,249,0.2);
    --ww-vio:        #C4B5FD;
    --ww-vio-bg:     rgba(196,181,253,0.07);
    --ww-vio-bdr:    rgba(196,181,253,0.2);
    --ww-btn:        linear-gradient(135deg,#0C4A5C,#06B6D4);
    --ww-glow:       rgba(6,182,212,0.28);
  }
`;

const TABS = [
  { id:"lunita", label:"🌙 Lunita"       },
  { id:"pases",  label:"📅 Monthly Pass" },
];

const badgeStyle: Record<string, string> = {
  "Popular":     "badge-popular",
  "Sale":        "badge-oferta",
  "Best value":  "badge-valor",
  "Oferta":      "badge-oferta",
  "Mejor valor": "badge-valor",
};

// ── Product Card ───────────────────────────────────────────────
function ProductCard({ p }: { p: WWProduct }) {
  const t = useT();
  const badge = useBadge();
  const { formatPrice, lang } = usePreferences();
  const discC = Math.round((1 - p.priceCuenta / p.priceOldCuenta) * 100);
  const discU = Math.round((1 - p.priceUID    / p.priceOldUID)    * 100);

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 group"
      style={{ background:"var(--card)", border:"1px solid var(--border)" }}
    >
      {/* Image */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,var(--ww-teal-bg),rgba(3,8,20,0.9))" }}
      >
        <Image
          src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
        {p.badge && (
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeStyle[p.badge] ?? "badge-popular"}`}>
            {badge(p.badge)}
          </span>
        )}
        {p.bonus && (
          <div
            className="absolute bottom-0 inset-x-0 px-3 py-2"
            style={{ background:"linear-gradient(to top,rgba(0,0,0,0.75),transparent)" }}
          >
            <p className="text-[10px] font-bold" style={{ color:"#4ADE80" }}>✨ {lang==="EN" ? p.bonusEN || p.bonus : p.bonus}</p>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-bold mb-0.5" style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</p>
        {p.subtitle && (
          <p className="text-[11px] mb-2" style={{ color:"var(--ww-teal)" }}>{lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}</p>
        )}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color:"var(--text-muted)" }}>
          {lang==="EN" ? p.descriptionEN || p.description : p.description}
        </p>

        {/* Dual prices */}
        <div className="rounded-xl overflow-hidden mb-3" style={{ border:"1px solid var(--border)" }}>
          {/* Via Cuenta — cheapest */}
          <div
            className="flex items-center justify-between px-3 py-2.5"
            style={{ background:"var(--ww-vio-bg)", borderBottom:"1px solid var(--border)" }}
          >
            <div className="flex items-center gap-1.5">
              <User size={11} style={{ color:"var(--ww-vio)" }}/>
              <span className="text-[10px] font-bold" style={{ color:"var(--ww-vio)" }}>
                {t.ww.viaCuentaLabel}
              </span>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full font-black"
                style={{ background:"rgba(16,185,129,0.2)", color:"#22C55E" }}
              >
                💰 -{discC}%
              </span>
            </div>
            <p className="text-sm font-black" style={{ color:"var(--ww-vio)" }}>
              {formatPrice(p.priceCuenta)}
            </p>
          </div>
          {/* Via UID */}
          <div
            className="flex items-center justify-between px-3 py-2"
            style={{ background:"var(--ww-teal-bg)" }}
          >
            <div className="flex items-center gap-1.5">
              <Hash size={10} style={{ color:"var(--ww-teal)" }}/>
              <span className="text-[10px] font-semibold" style={{ color:"var(--ww-teal)" }}>
                {t.ww.viaUIDLabel}
              </span>
              <span
                className="text-[9px] px-1 py-0.5 rounded-full"
                style={{ background:"rgba(103,232,249,0.1)", color:"var(--ww-teal)" }}
              >
                -{discU}%
              </span>
            </div>
            <p className="text-xs font-bold" style={{ color:"var(--ww-teal)" }}>
              {formatPrice(p.priceUID)}
            </p>
          </div>
        </div>

        <Link
          href={`/games/wuthering-waves/${p.slug}`}
          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.02]"
          style={{ background:"var(--ww-btn)", boxShadow:"0 2px 12px var(--ww-glow)" }}
        >
          <ShoppingCart size={13}/> {t.product.buy}
        </Link>
      </div>
    </div>
  );
}

// ── Method Cards ───────────────────────────────────────────────
function MethodCards() {
  const t = useT();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
      {/* Via Cuenta */}
      <div
        className="rounded-2xl p-5 space-y-3 relative"
        style={{ background:"var(--ww-vio-bg)", border:"1.5px solid var(--ww-vio-bdr)" }}
      >
        <div
          className="absolute -top-3 left-4 px-3 py-1 rounded-full text-[10px] font-black text-white"
          style={{ background:"linear-gradient(135deg,#059669,#10B981)" }}
        >
          {t.ww.lowestPrice}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background:"var(--ww-vio-bg)", border:"1.5px solid var(--ww-vio-bdr)" }}
          >
            <User size={20} style={{ color:"var(--ww-vio)" }}/>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color:"var(--ww-vio)" }}>{t.ww.viaCuentaTitle}</p>
            <p className="text-[11px]" style={{ color:"var(--text-subtle)" }}>{t.ww.viaCuentaSubtitle}</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{t.ww.viaCuentaDesc}</p>
        <ul className="space-y-1.5">
          {[t.ww.viaCuenta_item1, t.ww.viaCuenta_item2, t.ww.viaCuenta_item3].map(i => (
            <li key={i} className="flex items-center gap-2 text-[11px]" style={{ color:"var(--text-muted)" }}>
              <Check size={11} style={{ color:"var(--ww-vio)", flexShrink:0 }}/>{i}
            </li>
          ))}
        </ul>
      </div>

      {/* Via UID */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{ background:"var(--ww-teal-bg)", border:"1px solid var(--ww-teal-bdr)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background:"var(--ww-teal-bg)", border:"1px solid var(--ww-teal-bdr)" }}
          >
            <Hash size={20} style={{ color:"var(--ww-teal)" }}/>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color:"var(--ww-teal)" }}>{t.ww.viaUIDTitle}</p>
            <p className="text-[11px]" style={{ color:"var(--text-subtle)" }}>{t.ww.viaUIDSubtitle}</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{t.ww.viaUIDDesc}</p>
        <ul className="space-y-1.5">
          {[t.ww.viaUID_item1, t.ww.viaUID_item2, t.ww.viaUID_item3].map(i => (
            <li key={i} className="flex items-center gap-2 text-[11px]" style={{ color:"var(--text-muted)" }}>
              <Check size={11} style={{ color:"var(--ww-teal)", flexShrink:0 }}/>{i}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Info Lunita ───────────────────────────────────────────────
function InfoLunita() {
  const t = useT();

  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border:"1px solid var(--border)" }}>
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ background:"var(--ww-teal-bg)", borderBottom:"1px solid var(--border)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:"var(--ww-teal-bg)", border:"1px solid var(--ww-teal-bdr)" }}
        >
          <span className="text-lg">🌙</span>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{t.ww.whatIsLunita}</p>
          <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{t.ww.lunitaPremium}</p>
        </div>
      </div>

      <div className="p-6 space-y-6" style={{ background:"var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon:"🌙", title:t.ww.lunita_1_title, body:t.ww.lunita_1_body, items:[t.ww.lunita_1_item1, t.ww.lunita_1_item2, t.ww.lunita_1_item3] },
            { icon:"✨", title:t.ww.lunita_2_title, body:t.ww.lunita_2_body, items:[t.ww.lunita_2_item1, t.ww.lunita_2_item2, t.ww.lunita_2_item3] },
            { icon:"⚡", title:t.ww.lunita_3_title, body:t.ww.lunita_3_body, items:[t.ww.lunita_3_item1, t.ww.lunita_3_item2, t.ww.lunita_3_item3] },
          ].map(card => (
            <div
              key={card.title}
              className="rounded-xl p-5 space-y-3"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background:"var(--ww-teal-bg)" }}
                >
                  {card.icon}
                </div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{card.title}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{card.body}</p>
              <ul className="space-y-1.5">
                {card.items.map(i => (
                  <li key={i} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} style={{ color:"var(--ww-teal)", flexShrink:0 }}/>{i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <MethodCards/>
      </div>
    </div>
  );
}

// ── Info Pase ─────────────────────────────────────────────────
function InfoPase() {
  const t = useT();

  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border:"1px solid var(--border)" }}>
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ background:"var(--ww-teal-bg)", borderBottom:"1px solid var(--border)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:"var(--ww-teal-bg)", border:"1px solid var(--ww-teal-bdr)" }}
        >
          <span className="text-lg">📅</span>
        </div>
        <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{t.ww.whatIncludesPase}</p>
      </div>

      <div className="p-6 space-y-5" style={{ background:"var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon:"🌙", title:t.ww.pase_1_title, body:t.ww.pase_1_body },
            { icon:"📅", title:t.ww.pase_2_title, body:t.ww.pase_2_body },
            { icon:"⏱️", title:t.ww.pase_3_title, body:t.ww.pase_3_body },
          ].map(c => (
            <div
              key={c.title}
              className="rounded-xl p-5 space-y-2"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background:"var(--ww-teal-bg)" }}
                >
                  {c.icon}
                </div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{c.title}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{c.body}</p>
            </div>
          ))}
        </div>
        <MethodCards/>
      </div>
    </div>
  );
}

// ── Inner ──────────────────────────────────────────────────────
function WWPageInner() {
  const t = useT();
  const { formatPrice } = usePreferences();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tabParam     = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam ?? "lunita");

  useEffect(() => { if (tabParam) setActiveTab(tabParam); }, [tabParam]);

  function handleTab(id: string) {
    setActiveTab(id);
    router.push(`/games/wuthering-waves?tab=${id}`, { scroll:false });
  }

  const products = activeTab === "pases" ? PASES : LUNITA;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: WW_STYLE }}/>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ height:"65vh", minHeight:"440px" }}>
          <Image
            src="/games/wuthering-waves.jpg" alt="Wuthering Waves" fill
            className="object-cover object-top" priority
          />
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to right,rgba(0,0,0,0.93) 0%,rgba(0,0,0,0.48) 60%,transparent 100%)" }}
          />
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to top,rgba(0,0,0,0.92) 0%,transparent 55%)" }}
          />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 z-10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-xs" style={{ color:"rgba(255,255,255,0.45)" }}>
                <Link href="/" className="hover:text-white transition-colors">{t.gamePage.home}</Link>
                <span>›</span>
                <Link href="/games" className="hover:text-white transition-colors">{t.gamePage.games}</Link>
                <span>›</span>
                <span className="text-white">Wuthering Waves</span>
              </nav>
            </div>
          </div>

          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-14 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold badge-popular">
                    {t.ww.actionRPG}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background:"rgba(103,232,249,0.15)", border:"1px solid rgba(103,232,249,0.4)", color:"#67E8F9" }}
                  >
                    🌐 {t.product.global}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-3">
                  Wuthering Waves
                </h1>
                <div className="flex flex-wrap gap-3">
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{ background:"rgba(196,181,253,0.15)", border:"1px solid rgba(196,181,253,0.3)" }}
                  >
                    <User size={12} style={{ color:"#C4B5FD" }}/>
                    <span className="text-xs font-semibold" style={{ color:"#C4B5FD" }}>{t.ww.viaCuentaLabel}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-black"
                      style={{ background:"rgba(16,185,129,0.25)", color:"#4ADE80" }}
                    >
                      {t.ww.cheapestShort}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{ background:"rgba(103,232,249,0.1)", border:"1px solid rgba(103,232,249,0.25)" }}
                  >
                    <Hash size={12} style={{ color:"#67E8F9" }}/>
                    <span className="text-xs font-semibold" style={{ color:"#67E8F9" }}>{t.ww.viaUIDLabel}</span>
                    <span className="text-[10px] ml-1" style={{ color:"rgba(255,255,255,0.5)" }}>
                      {t.ww.noPasswordShort}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-base" style={{ color:"rgba(255,255,255,0.7)" }}>
                  {t.product.from}{" "}
                  <span className="text-2xl font-bold text-white">{formatPrice(4.99)}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TABS ── */}
        <div
          className="sticky top-[65px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth:"none" }}>
              <div className="flex">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTab(tab.id)}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: activeTab === tab.id ? "var(--ww-teal)" : "var(--text-muted)" }}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:"var(--ww-teal)" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">

          {/* Method legend */}
          <div
            className="flex items-center gap-2 flex-wrap mb-8 px-4 py-3 rounded-2xl"
            style={{ background:"var(--card)", border:"1px solid var(--border)" }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color:"var(--text-subtle)" }}>
              {t.ww.chooseMethod}
            </span>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background:"var(--ww-vio-bg)", border:"1px solid var(--ww-vio-bdr)" }}
            >
              <User size={12} style={{ color:"var(--ww-vio)" }}/>
              <span className="text-xs font-bold" style={{ color:"var(--ww-vio)" }}>{t.ww.viaCuentaLabel}</span>
              <span
                className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                style={{ background:"rgba(16,185,129,0.2)", color:"#22C55E" }}
              >
                {t.ww.cheapestShort}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background:"var(--ww-teal-bg)", border:"1px solid var(--ww-teal-bdr)" }}
            >
              <Hash size={12} style={{ color:"var(--ww-teal)" }}/>
              <span className="text-xs font-semibold" style={{ color:"var(--ww-teal)" }}>{t.ww.viaUIDLabel}</span>
              <span className="text-[10px] ml-1" style={{ color:"var(--text-subtle)" }}>{t.ww.noPasswordShort}</span>
            </div>
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
            {products.map(p => <ProductCard key={p.id} p={p}/>)}
          </div>

          {activeTab === "lunita" && <InfoLunita/>}
          {activeTab === "pases"  && <InfoPase/>}
        </div>
      </main>
      <Footer/>
    </>
  );
}

export default function WutheringWavesPageClient() {
  return (
    <Suspense fallback={null}>
      <WWPageInner/>
    </Suspense>
  );
}
