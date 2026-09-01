"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, Globe, Shield, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TFT_COINS, TFTProduct } from "@/data/tft";
import { useGameVisibility } from "@/hooks/useGameVisibility";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

// ── Color accent TFT ──────────────────────────────────────────
const ACCENT       = "#B89D40";
const ACCENT_LIGHT = "#E8C84A";
const ACCENT_GLOW  = "180,157,64";

// ── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: "coins", label: "🪙 TFT Coins" },
];

const badgeStyle: Record<string, string> = {
  "Popular":     "badge-popular",
  "Oferta":      "badge-oferta",
  "Mejor valor": "badge-valor",
  "Sale":        "badge-oferta",
  "Best value":  "badge-valor",
};

// ── ProductCard ───────────────────────────────────────────────
function ProductCard({ p }: { p: TFTProduct }) {
  const t = useT();
  const badge = useBadge();
  const { formatPrice: fmt, lang } = usePreferences();
  const disc = Math.round((1 - p.price / p.priceOld) * 100);

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 group"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "4/3", background: `linear-gradient(135deg,rgba(${ACCENT_GLOW},0.18),rgba(5,3,15,0.75))` }}
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
            style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#4ADE80" }}
          >
            -{disc}%
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-bold leading-tight mb-0.5" style={{ color: "var(--text)" }}>
          {lang==="EN" ? p.nameEN || p.name : p.name}
        </p>
        <p className="text-xs font-semibold mb-1" style={{ color: ACCENT_LIGHT }}>
          {lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}
        </p>
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: "var(--text-muted)" }}>
          {lang==="EN" ? p.descriptionEN || p.description : p.description}
        </p>
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <p className="text-[11px] line-through" style={{ color: "var(--text-subtle)" }}>
              {fmt(p.priceOld)}
            </p>
            <p className="text-xl font-bold" style={{ color: ACCENT_LIGHT }}>
              {fmt(p.price)}
            </p>
          </div>
          <Link
            href={`/games/team-fight-tactics/${p.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 whitespace-nowrap"
            style={{ background: `linear-gradient(135deg,${ACCENT},#8B6914)`, boxShadow: `0 2px 12px rgba(${ACCENT_GLOW},0.4)` }}
          >
            <ShoppingCart size={13} /> {t.product.buy}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Info section ──────────────────────────────────────────────
function InfoCoins() {
  const t = useT();

  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border: "1px solid var(--border)" }}>
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ background: `linear-gradient(135deg,rgba(${ACCENT_GLOW},0.12),rgba(${ACCENT_GLOW},0.05))`, borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `rgba(${ACCENT_GLOW},0.15)`, border: `1px solid rgba(${ACCENT_GLOW},0.3)` }}
        >
          <span className="text-lg">🪙</span>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{t.tft.whatAreCoins}</p>
          <p className="text-xs" style={{ color: "var(--text-subtle)" }}>{t.tft.everythingYouNeed}</p>
        </div>
      </div>

      <div className="p-6" style={{ background: "var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: "🎮", title: t.tft.info_1_title,
              body: t.tft.info_1_body,
              items: [t.tft.info_1_item1, t.tft.info_1_item2, t.tft.info_1_item3],
            },
            {
              icon: "🔑", title: t.tft.info_2_title,
              body: t.tft.info_2_body,
              items: [t.tft.info_2_item1, t.tft.info_2_item2, t.tft.info_2_item3],
            },
            {
              icon: "🌎", title: t.tft.info_3_title,
              body: t.tft.info_3_body,
              items: [t.tft.info_3_item1, t.tft.info_3_item2, t.tft.info_3_item3],
            },
          ].map(card => (
            <div
              key={card.title}
              className="rounded-xl p-5 space-y-3"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background: `rgba(${ACCENT_GLOW},0.12)` }}
                >
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

        {/* Trust chips */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
          {[
            { icon: <Globe  size={12}/>, label: t.tft.globalService, color: "text-blue-400",   bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.25)"  },
            { icon: <Shield size={12}/>, label: t.tft.secureAccess,  color: "text-green-400",  bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)"  },
            { icon: <Zap    size={12}/>, label: t.tft.deliveryChip,  color: "text-yellow-400", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)"  },
          ].map(chip => (
            <div
              key={chip.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium ${chip.color}`}
              style={{ background: chip.bg, border: `1px solid ${chip.border}` }}
            >
              {chip.icon} {chip.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Inner ─────────────────────────────────────────────────────
function TFTPageInner() {
  const t = useT();
  const { formatPrice } = usePreferences();
  const coins = useGameVisibility("team-fight-tactics").filterProducts(TFT_COINS);
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tabParam     = searchParams.get("tab");
  const [activeTab,  setActiveTab] = useState(tabParam ?? "coins");

  useEffect(() => { if (tabParam) setActiveTab(tabParam); }, [tabParam]);

  function handleTab(id: string) {
    setActiveTab(id);
    router.push(`/games/team-fight-tactics?tab=${id}`, { scroll: false });
  }

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ height: "60vh", minHeight: "420px" }}>
          <Image
            src="/games/team-fight-tactics.jpg" alt="Teamfight Tactics" fill
            className="object-cover object-center" priority
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.45) 60%,rgba(0,0,0,0.1) 100%)" }}
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 55%)" }}
          />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 z-10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                <Link href="/" className="hover:text-white transition-colors">{t.gamePage.home}</Link>
                <span>›</span>
                <Link href="/games" className="hover:text-white transition-colors">{t.gamePage.games}</Link>
                <span>›</span>
                <span className="text-white">Teamfight Tactics</span>
              </nav>
            </div>
          </div>

          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-14 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold badge-popular">
                    {t.tft.strategy}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: `rgba(${ACCENT_GLOW},0.2)`, border: `1px solid rgba(${ACCENT_GLOW},0.4)`, color: ACCENT_LIGHT }}
                  >
                    🌎 {t.product.global}
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-3">
                  Teamfight Tactics
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                    <span className="text-xs">{t.tft.deliveryHero}</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">🛡️ {t.tft.secureAccess}</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">🌎 {t.tft.globalService}</span>
                  </div>
                </div>
                <p className="mt-4 text-base" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {t.product.from}{" "}
                  <span className="text-2xl font-bold text-white">{formatPrice(17.9)}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TABS ── */}
        <div
          className="sticky top-[66px] md:top-[107px] z-40 w-full"
          style={{ background: "var(--navbar-bg)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              <div className="flex">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTab(tab.id)}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: activeTab === tab.id ? ACCENT_LIGHT : "var(--text-muted)" }}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background: `linear-gradient(90deg,${ACCENT},${ACCENT_LIGHT})` }}
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

          {/* Global notice */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
            style={{ background: `rgba(${ACCENT_GLOW},0.07)`, border: `1px solid rgba(${ACCENT_GLOW},0.25)` }}
          >
            <span className="text-base flex-shrink-0">🌎</span>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              <strong style={{ color: ACCENT_LIGHT }}>{t.tft.globalService}.</strong>{" "}
              {t.tft.globalNoticeDesc}
            </p>
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-3 gap-4">
            {coins.map(p => <ProductCard key={p.id} p={p} />)}
          </div>

          <InfoCoins />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function TFTPageClient() {
  return (
    <Suspense fallback={null}>
      <TFTPageInner />
    </Suspense>
  );
}
