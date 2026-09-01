"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { WILD_CORES, BUNDLES, WildRiftProduct } from "@/data/wildrift";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

// ── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id:"cores",   label:"💎 Wild Cores" },
  { id:"bundles", label:"📦 Bundles"    },
];

const badgeStyle: Record<string, string> = {
  "Popular":     "badge-popular",
  "Sale":        "badge-oferta",
  "Best value":  "badge-valor",
  "Oferta":      "badge-oferta",
  "Mejor valor": "badge-valor",
};

// ── ProductCard ───────────────────────────────────────────────
function ProductCard({ p }: { p: WildRiftProduct }) {
  const t = useT();
  const badge = useBadge();
  const { formatPrice: fmt, lang } = usePreferences();
  const disc = Math.round((1 - p.price / p.priceOld) * 100);

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 group"
      style={{ background:"var(--card)", border:"1px solid var(--border)" }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,rgba(14,165,233,0.15),rgba(5,10,40,0.7))" }}
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
        <p className="text-sm font-bold leading-tight mb-0.5" style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</p>
        {p.amount && (
          <p className="text-xs font-semibold mb-1" style={{ color:"#38BDF8" }}>{lang==="EN" ? p.amountEN || p.amount : p.amount}</p>
        )}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color:"var(--text-muted)" }}>
          {lang==="EN" ? p.descriptionEN || p.description : p.description}
        </p>
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <p className="text-[11px] line-through" style={{ color:"var(--text-subtle)" }}>
              {fmt(p.priceOld)}
            </p>
            <p className="text-xl font-bold" style={{ color:"#38BDF8" }}>
              {fmt(p.price)}
            </p>
          </div>
          <Link
            href={`/games/wild-rift/${p.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 whitespace-nowrap"
            style={{ background:"linear-gradient(135deg,#0EA5E9,#0369A1)", boxShadow:"0 2px 12px rgba(14,165,233,0.35)" }}
          >
            <ShoppingCart size={13}/> {t.product.buy}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Info Cores ────────────────────────────────────────────────
function InfoCores() {
  const t = useT();

  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border:"1px solid var(--border)" }}>
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ background:"linear-gradient(135deg,rgba(14,165,233,0.12),rgba(3,105,161,0.08))", borderBottom:"1px solid var(--border)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:"rgba(14,165,233,0.15)", border:"1px solid rgba(14,165,233,0.3)" }}
        >
          <span className="text-lg">💎</span>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{t.wildrift.howCoresWork}</p>
          <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{t.tft.everythingYouNeed}</p>
        </div>
      </div>

      <div className="p-6" style={{ background:"var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon:"🎮", title:t.wildrift.cores_1_title,
              body:t.wildrift.cores_1_body,
              items:[t.wildrift.cores_1_item1, t.wildrift.cores_1_item2, t.wildrift.cores_1_item3],
            },
            {
              icon:"🔑", title:t.wildrift.cores_2_title,
              body:t.wildrift.cores_2_body,
              items:[t.wildrift.cores_2_item1, t.wildrift.cores_2_item2, t.wildrift.cores_2_item3],
            },
            {
              icon:"🌎", title:t.wildrift.cores_3_title,
              body:t.wildrift.cores_3_body,
              items:[t.wildrift.cores_3_item1, t.wildrift.cores_3_item2, t.wildrift.cores_3_item3],
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
                  style={{ background:"rgba(14,165,233,0.12)" }}
                >
                  {card.icon}
                </div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{card.title}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{card.body}</p>
              <ul className="space-y-1.5">
                {card.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} className="flex-shrink-0" style={{ color:"#38BDF8" }}/> {item}
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

// ── Info Bundles ──────────────────────────────────────────────
function InfoBundles() {
  const t = useT();

  return (
    <div className="rounded-2xl overflow-hidden mt-10" style={{ border:"1px solid var(--border)" }}>
      <div
        className="px-6 py-4 flex items-center gap-3"
        style={{ background:"linear-gradient(135deg,rgba(14,165,233,0.12),rgba(3,105,161,0.08))", borderBottom:"1px solid var(--border)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:"rgba(14,165,233,0.15)", border:"1px solid rgba(14,165,233,0.3)" }}
        >
          <span className="text-lg">📦</span>
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{t.wildrift.whatBundlesInclude}</p>
          <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{t.wildrift.bundlesSubtitle}</p>
        </div>
      </div>

      <div className="p-6" style={{ background:"var(--card)" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon:"👗", title:t.wildrift.bundle_1_title, body:t.wildrift.bundle_1_body },
            { icon:"💎", title:t.wildrift.bundle_2_title, body:t.wildrift.bundle_2_body },
            { icon:"⚡", title:t.wildrift.bundle_3_title, body:t.wildrift.bundle_3_body },
          ].map(card => (
            <div
              key={card.title}
              className="rounded-xl p-5 space-y-2"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{ background:"rgba(14,165,233,0.12)" }}
                >
                  {card.icon}
                </div>
                <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{card.title}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Inner component ───────────────────────────────────────────
function WildRiftPageInner() {
  const t = useT();
  const { formatPrice } = usePreferences();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tabParam     = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam ?? "cores");

  useEffect(() => { if (tabParam) setActiveTab(tabParam); }, [tabParam]);

  function handleTab(id: string) {
    setActiveTab(id);
    router.push(`/games/wild-rift?tab=${id}`, { scroll: false });
  }

  const products = activeTab === "bundles" ? BUNDLES : WILD_CORES;

  return (
    <>
      <Navbar />
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ height:"60vh", minHeight:"420px" }}>
          <Image
            src="/games/wild-rift.jpg" alt="Wild Rift" fill
            className="object-cover object-center" priority
          />
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to right,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.45) 60%,rgba(0,0,0,0.1) 100%)" }}
          />
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 55%)" }}
          />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 z-10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-xs" style={{ color:"rgba(255,255,255,0.45)" }}>
                <Link href="/" className="hover:text-white transition-colors">{t.gamePage.home}</Link>
                <span>›</span>
                <Link href="/games" className="hover:text-white transition-colors">{t.gamePage.games}</Link>
                <span>›</span>
                <span className="text-white">Wild Rift</span>
              </nav>
            </div>
          </div>

          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-14 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold badge-popular">
                    {t.wildrift.mobileMoba}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background:"rgba(14,165,233,0.2)", border:"1px solid rgba(14,165,233,0.4)", color:"#38BDF8" }}
                  >
                    LAN · LAS
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-3">
                  Wild Rift
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
                    <span className="text-xs">{t.tft.deliveryHero}</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">🛡️ {t.tft.secureAccess}</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">💬 {t.product.support}</span>
                  </div>
                </div>
                <p className="mt-4 text-base" style={{ color:"rgba(255,255,255,0.7)" }}>
                  {t.product.from}{" "}
                  <span className="text-2xl font-bold text-white">{formatPrice(14.9)}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TABS ── */}
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
                    onClick={() => handleTab(tab.id)}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: activeTab === tab.id ? "#38BDF8" : "var(--text-muted)" }}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:"linear-gradient(90deg,#0EA5E9,#38BDF8)" }}
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

          {/* Region notice */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
            style={{ background:"rgba(14,165,233,0.07)", border:"1px solid rgba(14,165,233,0.25)" }}
          >
            <span className="text-base flex-shrink-0">🌎</span>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>
              <strong style={{ color:"#38BDF8" }}>{t.wildrift.lanLasOnly}.</strong>{" "}
              {t.wildrift.lanLasDesc}
            </p>
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} p={p}/>)}
          </div>

          {activeTab === "cores"   && <InfoCores/>}
          {activeTab === "bundles" && <InfoBundles/>}
        </div>
      </main>
      <Footer/>
    </>
  );
}

export default function WildRiftPageClient() {
  return (
    <Suspense fallback={null}>
      <WildRiftPageInner/>
    </Suspense>
  );
}
