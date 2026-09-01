"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FOTOGRAMAS, PASES, ZZZProduct } from "@/data/zenlesszonezero";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

const ZZZ_STYLE = `
  :root, [data-theme="light"] {
    --zzz-text:      #4A7C00;
    --zzz-text-dim:  #5A9400;
    --zzz-dark:      #3A6000;
    --zzz-bg:        rgba(74, 124, 0, 0.08);
    --zzz-border:    rgba(74, 124, 0, 0.28);
    --zzz-btn-bg:    linear-gradient(135deg, #3A6000, #5A9400);
    --zzz-btn-color: #ffffff;
    --zzz-glow:      rgba(74, 124, 0, 0.2);
    --zzz-hero-badge-bg:     rgba(74,124,0,0.15);
    --zzz-hero-badge-border: rgba(74,124,0,0.5);
    --zzz-card-bg:   rgba(74, 124, 0, 0.06);
  }
  [data-theme="dark"] {
    --zzz-text:      #C8FF00;
    --zzz-text-dim:  rgba(200,255,0,0.88);
    --zzz-dark:      #8AB800;
    --zzz-bg:        rgba(200, 255, 0, 0.07);
    --zzz-border:    rgba(200, 255, 0, 0.25);
    --zzz-btn-bg:    linear-gradient(135deg, #3A4A00, #8AB800);
    --zzz-btn-color: #C8FF00;
    --zzz-glow:      rgba(200, 255, 0, 0.18);
    --zzz-hero-badge-bg:     rgba(200,255,0,0.12);
    --zzz-hero-badge-border: rgba(200,255,0,0.4);
    --zzz-card-bg:   rgba(200, 255, 0, 0.05);
  }
`;

const TABS = [
  { id:"fotogramas", label:"📷 Monochrome"      },
  { id:"pases",      label:"🎫 Inter-Knot Pass" },
];

const badgeStyle: Record<string, string> = {
  "Popular":     "badge-popular",
  "Sale":        "badge-oferta",
  "Best value":  "badge-valor",
  "Oferta":      "badge-oferta",
  "Mejor valor": "badge-valor",
};

// ── Product Card ───────────────────────────────────────────────
function ProductCard({ p }: { p: ZZZProduct }) {
  const t = useT();
  const badge = useBadge();
  const { formatPrice, lang } = usePreferences();
  const disc = Math.round((1 - p.price / p.priceOld) * 100);

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 group"
      style={{ background:"var(--card)", border:"1px solid var(--border)" }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,var(--zzz-bg),rgba(5,5,15,0.85))" }}
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
        {disc > 0 && (
          <span
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#4ADE80" }}
          >
            -{disc}%
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-bold leading-tight mb-0.5" style={{ color:"var(--text)" }}>
          {lang==="EN" ? p.nameEN || p.name : p.name}
        </p>
        {p.subtitle && (
          <p className="text-[11px] mb-1 font-medium" style={{ color:"var(--zzz-text)" }}>{lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}</p>
        )}
        {p.bonus && (
          <p className="text-[10px] mb-0.5 font-semibold" style={{ color:"#4ADE80" }}>✨ {lang==="EN" ? p.bonusEN || p.bonus : p.bonus}</p>
        )}
        {p.recurringBonus && (
          <p className="text-[10px] mb-1.5 font-semibold" style={{ color:"var(--text-subtle)" }}>🔄 {lang==="EN" ? p.recurringBonusEN || p.recurringBonus : p.recurringBonus}</p>
        )}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color:"var(--text-muted)" }}>
          {lang==="EN" ? p.descriptionEN || p.description : p.description}
        </p>
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <p className="text-[11px] line-through" style={{ color:"var(--text-subtle)" }}>
              {formatPrice(p.priceOld)}
            </p>
            <p className="text-xl font-bold" style={{ color:"var(--zzz-text)" }}>
              {formatPrice(p.price)}
            </p>
          </div>
          <Link
            href={`/games/zenless-zone-zero/${p.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 whitespace-nowrap"
            style={{ background:"var(--zzz-btn-bg)", color:"var(--zzz-btn-color)", boxShadow:"0 2px 12px var(--zzz-glow)" }}
          >
            <ShoppingCart size={13}/> {t.product.buy}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Info section header ────────────────────────────────────────
function InfoHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div
      className="px-6 py-4 flex items-center gap-3"
      style={{ background:"var(--zzz-bg)", borderBottom:"1px solid var(--border)" }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background:"var(--zzz-bg)", border:"1px solid var(--zzz-border)" }}
      >
        <span className="text-lg">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{title}</p>
        {subtitle && <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

// ── Info Fotogramas ────────────────────────────────────────────
function InfoFotogramas() {
  const t = useT();

  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border:"1px solid var(--border)" }}>
      <InfoHeader icon="📷" title={t.zzz.whatAreFotogramas} subtitle={t.zzz.fotogramasPremium}/>
      <div className="p-6" style={{ background:"var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon:"📷", title:t.zzz.foto_1_title,
              body:t.zzz.foto_1_body,
              items:[t.zzz.foto_1_item1, t.zzz.foto_1_item2, t.zzz.foto_1_item3],
            },
            {
              icon:"✨", title:t.zzz.foto_2_title,
              body:t.zzz.foto_2_body,
              items:[t.zzz.foto_2_item1, t.zzz.foto_2_item2, t.zzz.foto_2_item3],
            },
            {
              icon:"🔄", title:t.zzz.foto_3_title,
              body:t.zzz.foto_3_body,
              items:[t.zzz.foto_3_item1, t.zzz.foto_3_item2, t.zzz.foto_3_item3],
            },
          ].map(card => (
            <div
              key={card.title}
              className="rounded-xl p-5 space-y-3"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background:"var(--zzz-bg)" }}
                >
                  {card.icon}
                </div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{card.title}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{card.body}</p>
              <ul className="space-y-1.5">
                {card.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} className="flex-shrink-0" style={{ color:"var(--zzz-text)" }}/> {item}
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
  const t = useT();

  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border:"1px solid var(--border)" }}>
      <InfoHeader icon="🎫" title={t.zzz.whatIncludesMembership}/>
      <div className="p-6" style={{ background:"var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon:"💎", title:t.zzz.pase_1_title, body:t.zzz.pase_1_body },
            { icon:"📅", title:t.zzz.pase_2_title, body:t.zzz.pase_2_body },
            { icon:"⏱️", title:t.zzz.pase_3_title, body:t.zzz.pase_3_body },
          ].map(c => (
            <div
              key={c.title}
              className="rounded-xl p-5 space-y-2"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background:"var(--zzz-bg)" }}
                >
                  {c.icon}
                </div>
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

// ── Tab Bar ────────────────────────────────────────────────────
function TabBar({ activeTab, onTab }: { activeTab: string; onTab: (id: string) => void }) {
  return (
    <div
      className="sticky top-[66px] md:top-[107px] z-40 w-full"
      style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth:"none" }}>
          <div className="flex">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTab(tab.id)}
                className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                style={{ color: activeTab === tab.id ? "var(--zzz-text)" : "var(--text-muted)" }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div
                    className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                    style={{ background:"var(--zzz-text)" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Inner ──────────────────────────────────────────────────────
function ZZZPageInner() {
  const t = useT();
  const { formatPrice } = usePreferences();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tabParam     = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam ?? "fotogramas");

  useEffect(() => { if (tabParam) setActiveTab(tabParam); }, [tabParam]);

  function handleTab(id: string) {
    setActiveTab(id);
    router.push(`/games/zenless-zone-zero?tab=${id}`, { scroll: false });
  }

  const products = activeTab === "pases" ? PASES : FOTOGRAMAS;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ZZZ_STYLE }}/>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ height:"65vh", minHeight:"440px" }}>
          <Image
            src="/games/zenless-zone-zero.jpg" alt="Zenless Zone Zero" fill
            className="object-cover object-top" priority
          />
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to right,rgba(0,0,0,0.93) 0%,rgba(0,0,0,0.48) 60%,rgba(0,0,0,0.1) 100%)" }}
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
                <span className="text-white">Zenless Zone Zero</span>
              </nav>
            </div>
          </div>

          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-14 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold badge-popular">
                    {t.zzz.actionRPG}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background:"rgba(200,255,0,0.15)", border:"1px solid rgba(200,255,0,0.45)", color:"#C8FF00" }}
                  >
                    🌐 {t.product.global}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-3">
                  Zenless Zone Zero
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.65)" }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
                    <span className="text-xs">{t.zzz.deliveryHero}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.65)" }}>
                    <span className="text-xs">{t.zzz.uidOnly}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.65)" }}>
                    <span className="text-xs">{t.zzz.firstBonusHero}</span>
                  </div>
                </div>
                <p className="mt-4 text-base" style={{ color:"rgba(255,255,255,0.7)" }}>
                  {t.product.from}{" "}
                  <span className="text-2xl font-bold text-white">{formatPrice(3.50)}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TABS ── */}
        <TabBar activeTab={activeTab} onTab={handleTab}/>

        {/* ── CONTENT ── */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10">

          {/* Método: acceso a cuenta */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
            style={{ background:"var(--zzz-bg)", border:"1px solid var(--zzz-border)" }}
          >
            <span className="text-base flex-shrink-0">🎮</span>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>
              <strong style={{ color:"var(--zzz-text)" }}>{t.zzz.noPasswordTitle}</strong>{" "}
              {t.zzz.noPasswordDesc}
            </p>
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
            {products.map(p => <ProductCard key={p.id} p={p}/>)}
          </div>

          {activeTab === "fotogramas" && <InfoFotogramas/>}
          {activeTab === "pases"      && <InfoPases/>}
        </div>
      </main>
      <Footer/>
    </>
  );
}

export default function ZenlessZoneZeroPageClient() {
  return (
    <Suspense fallback={null}>
      <ZZZPageInner/>
    </Suspense>
  );
}
