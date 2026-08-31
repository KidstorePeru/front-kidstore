"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, Check, ChevronRight, ChevronUp, ChevronDown,
  Star, Zap, Shield, Gamepad2, Sparkles, Coins,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CREDITOS, PAQUETES, BULK_PRICES, type BulkPrice } from "@/data/rocketleague";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";
import { useCart } from "@/context/CartContext";

// ─── BRAND COLOR ──────────────────────────────────────────
const BRAND = "#EA580C";
const BRAND_DARK = "#C2410C";

const badgeStyle: Record<string, string> = {
  "Popular":"badge-popular", "Oferta":"badge-oferta", "Mejor valor":"badge-valor",
};

// ─── TABS ─────────────────────────────────────────────────
function getTabs(lang: string) {
  return [
    { id: "creditos",  label: lang === "EN" ? "Credits"    : "Creditos"  },
    { id: "paquetes",  label: lang === "EN" ? "Bundles"    : "Paquetes"  },
  ];
}

// ─── TURKEY WARNING ───────────────────────────────────────
function TurkeyWarning() {
  const { lang } = usePreferences();
  return (
    <div className="rounded-xl p-4 mb-8 flex gap-3"
      style={{ background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.22)" }}>
      <div className="text-yellow-400 flex-shrink-0 mt-0.5">&#9888;&#65039;</div>
      <div>
        <p className="text-xs font-bold text-yellow-400 mb-1.5">
          {lang === "EN" ? "Prices in Turkish Lira (TRY)" : "Precios en Lira Turca (TRY)"}
        </p>
        <ul className="space-y-1">
          <li className="text-xs" style={{ color:"var(--text-muted)" }}>
            {"\u2022"} {lang === "EN"
              ? "These prices are exclusive to accounts with the region set to Turkey (TRY \u2013 Turkish Lira)."
              : "Estos precios son exclusivos para cuentas con regi\u00f3n configurada en Turqu\u00eda (TRY \u2013 Lira Turca)."}
          </li>
          <li className="text-xs" style={{ color:"var(--text-muted)" }}>
            {"\u2022"} {lang === "EN"
              ? "If your account does not show prices in TRY, you will not be able to access these values."
              : "Si tu cuenta no muestra los precios en TRY, no podr\u00e1s acceder a estos valores."}
          </li>
        </ul>
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────
function ProductCard({ name, amount, description, price, priceOld, badge, img, slug }: {
  name?: string; amount?: string; description: string;
  price: number; priceOld: number; badge: string; img: string; slug: string;
}) {
  const { formatPrice: fmt, lang } = usePreferences();
  const t = useT();
  const translateBadge = useBadge();
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 group"
      style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
      <div className="relative w-full overflow-hidden"
        style={{ aspectRatio:"4/3", background:`linear-gradient(135deg,rgba(234,88,12,0.15),rgba(15,10,40,0.6))` }}>
        <Image src={img} alt={name ?? amount ?? "producto"} fill
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105" />
        {badge && (
          <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeStyle[badge] ?? "badge-popular"}`}>
            {translateBadge(badge)}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        {name   && <p className="text-sm font-bold leading-tight mb-0.5" style={{ color:"var(--text)" }}>{name}</p>}
        {amount && <p className="text-xs font-semibold mb-2" style={{ color: BRAND }}>{amount}</p>}
        <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color:"var(--text-muted)" }}>{description}</p>
        <div className="flex items-end justify-between gap-3 mt-auto">
          <div>
            <p className="text-[11px] line-through" style={{ color:"var(--text-subtle)" }}>{fmt(priceOld)}</p>
            <p className="text-xl font-bold" style={{ color: BRAND }}>{fmt(price)}</p>
          </div>
          <Link href={`/games/rocket-league/${slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 whitespace-nowrap"
            style={{ background:`linear-gradient(135deg,${BRAND},${BRAND_DARK})`, boxShadow:`0 2px 12px rgba(234,88,12,0.35)` }}>
            <ShoppingCart size={13} /> {t.product.buyNow}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── BULK SELECTOR ────────────────────────────────────────
function findNearest(input: number): BulkPrice {
  return BULK_PRICES.reduce((prev, curr) =>
    Math.abs(curr.credits - input) < Math.abs(prev.credits - input) ? curr : prev
  );
}

function BulkSelector() {
  const { formatPrice: fmt, lang } = usePreferences();
  const t = useT();
  const { addItem } = useCart();

  const [inputValue, setInputValue] = useState("500");
  const [matched, setMatched] = useState<BulkPrice>(findNearest(500));

  function handleInputChange(raw: string) {
    setInputValue(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num > 0) {
      setMatched(findNearest(num));
    }
  }

  function handleBlur() {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num <= 0) {
      setInputValue(String(BULK_PRICES[0].credits));
      setMatched(BULK_PRICES[0]);
    } else {
      const nearest = findNearest(num);
      setInputValue(String(nearest.credits));
      setMatched(nearest);
    }
  }

  function increment() {
    const num = parseInt(inputValue, 10) || 0;
    const next = num + 50;
    const nearest = findNearest(next);
    setInputValue(String(nearest.credits));
    setMatched(nearest);
  }

  function decrement() {
    const num = parseInt(inputValue, 10) || 100;
    const next = Math.max(50, num - 50);
    const nearest = findNearest(next);
    setInputValue(String(nearest.credits));
    setMatched(nearest);
  }

  function handleBuy() {
    addItem({
      slug:     `rl-bulk-${matched.credits}`,
      name:     lang === "EN" ? `${matched.credits} RL Credits (Bulk)` : `${matched.credits} RL Cr\u00e9ditos (Granel)`,
      img:      "/rocket-league/500credits.jpg",
      price:    matched.price,
      priceOld: matched.priceOld,
      region:   "Turqu\u00eda",
      format:   "Digital",
      tabLabel: lang === "EN" ? "Credits" : "Cr\u00e9ditos",
    });
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border:`1px solid var(--border)` }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3"
        style={{ background:`linear-gradient(135deg,rgba(234,88,12,0.15),rgba(194,65,12,0.08))`, borderBottom:"1px solid var(--border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background:"rgba(234,88,12,0.2)", border:"1px solid rgba(234,88,12,0.3)" }}>
          <Coins size={18} style={{ color: BRAND }} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>
            {lang === "EN" ? "Bulk Credits" : "Cr\u00e9ditos a granel"}
          </p>
          <p className="text-xs" style={{ color:"var(--text-subtle)" }}>
            {lang === "EN" ? "Pick any amount from our price table" : "Elige cualquier cantidad de nuestra tabla de precios"}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6" style={{ background:"var(--card)" }}>
        {/* Input + arrows + price + buy */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
              style={{ color:"var(--text-subtle)" }}>
              {lang === "EN" ? "Credits amount" : "Cantidad de cr\u00e9ditos"}
            </label>
            <div className="flex items-center gap-2">
              <button onClick={decrement}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                <ChevronDown size={16} style={{ color:"var(--text-muted)" }} />
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value.replace(/\D/g, ""))}
                onBlur={handleBlur}
                className="w-28 text-center text-lg font-bold rounded-xl py-2 px-3 outline-none"
                style={{ background:"var(--surface)", border:`1.5px solid ${BRAND}40`, color:"var(--text)" }}
              />
              <button onClick={increment}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                <ChevronUp size={16} style={{ color:"var(--text-muted)" }} />
              </button>
            </div>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <p className="text-[11px] line-through" style={{ color:"var(--text-subtle)" }}>{fmt(matched.priceOld)}</p>
              <p className="text-2xl font-bold" style={{ color: BRAND }}>{fmt(matched.price)}</p>
              <p className="text-[10px]" style={{ color:"var(--text-subtle)" }}>
                {matched.credits} {lang === "EN" ? "credits" : "cr\u00e9ditos"}
              </p>
            </div>
            <button onClick={handleBuy}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 whitespace-nowrap"
              style={{ background:`linear-gradient(135deg,${BRAND},${BRAND_DARK})`, boxShadow:`0 2px 12px rgba(234,88,12,0.35)` }}>
              <ShoppingCart size={14} /> {t.product.buyNow}
            </button>
          </div>
        </div>

        {/* Price table */}
        <div>
          <p className="text-xs font-bold mb-3" style={{ color:"var(--text)" }}>
            {lang === "EN" ? "Full price table" : "Tabla de precios completa"}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {BULK_PRICES.map((bp) => {
              const active = matched.credits === bp.credits;
              return (
                <button key={bp.credits}
                  onClick={() => { setInputValue(String(bp.credits)); setMatched(bp); }}
                  className="rounded-lg py-2 px-2 text-center transition-all hover:scale-[1.02]"
                  style={{
                    background: active ? `${BRAND}18` : "var(--surface)",
                    border: `1px solid ${active ? BRAND : "var(--border)"}`,
                  }}>
                  <p className="text-xs font-bold" style={{ color: active ? BRAND : "var(--text)" }}>
                    {bp.credits.toLocaleString()}
                  </p>
                  <p className="text-[10px]" style={{ color:"var(--text-subtle)" }}>
                    {fmt(bp.price)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TAB CREDITOS ─────────────────────────────────────────
function TabCreditos() {
  const { lang } = usePreferences();
  return (
    <div>
      <TurkeyWarning />

      {/* Fixed products grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {CREDITOS.map((p) => (
          <ProductCard
            key={p.id}
            amount={lang === "EN" ? p.amountEN || p.amount : p.amount}
            description={lang === "EN" ? p.descriptionEN : p.description}
            price={p.price}
            priceOld={p.priceOld}
            badge={p.badge}
            img={p.img}
            slug={p.slug}
          />
        ))}
      </div>

      {/* Bulk selector */}
      <div className="mb-10">
        <BulkSelector />
      </div>

      {/* Info section */}
      <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
        <div className="px-6 py-4 flex items-center gap-3"
          style={{ background:`linear-gradient(135deg,rgba(234,88,12,0.15),rgba(59,130,246,0.08))`, borderBottom:"1px solid var(--border)" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(234,88,12,0.2)", border:"1px solid rgba(234,88,12,0.3)" }}>
            <span className="text-lg">&#9917;</span>
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color:"var(--text)" }}>
              {lang === "EN" ? "Product Information" : "Informaci\u00f3n del Producto"}
            </p>
            <p className="text-xs" style={{ color:"var(--text-subtle)" }}>
              {lang === "EN" ? "What are Credits? \u2014 General explanation" : "\u00bfQu\u00e9 son los Cr\u00e9ditos? \u2014 Explicaci\u00f3n general"}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6" style={{ background:"var(--card)" }}>
          <div>
            <h3 className="text-sm font-bold mb-2" style={{ color:"var(--text)" }}>
              {lang === "EN" ? "What are Credits?" : "\u00bfQu\u00e9 son los Cr\u00e9ditos?"}
            </h3>
            <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
              {lang === "EN"
                ? <><strong style={{ color:"var(--text)" }}>Credits</strong> are the premium currency in Rocket League. With them you can buy car bodies, decals, wheels, goal explosions, and Rocket Pass items from the in-game shop.</>
                : <>Los <strong style={{ color:"var(--text)" }}>Cr\u00e9ditos</strong> son la moneda premium de Rocket League. Con ellos puedes comprar carrocer\u00edas, calcoman\u00edas, ruedas, explosiones de gol y objetos del Rocket Pass en la tienda del juego.</>
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Compatibility */}
            <div className="rounded-xl p-4 space-y-3" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"rgba(59,130,246,0.15)" }}>
                  <Gamepad2 size={15} className="text-blue-400"/>
                </div>
                <p className="text-xs font-bold" style={{ color:"var(--text)" }}>
                  {lang === "EN" ? "Compatibility" : "Compatibilidad"}
                </p>
              </div>
              <ul className="space-y-1.5">
                {(lang === "EN"
                  ? ["PC (Epic Games / Steam)", "PlayStation 4 / 5", "Xbox One / Series", "Nintendo Switch"]
                  : ["PC (Epic Games / Steam)", "PlayStation 4 / 5", "Xbox One / Series", "Nintendo Switch"]
                ).map(p => (
                  <li key={p} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} className="text-green-400 flex-shrink-0"/> {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="rounded-xl p-4 space-y-3" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"rgba(234,88,12,0.15)" }}>
                  <Sparkles size={15} style={{ color: BRAND }}/>
                </div>
                <p className="text-xs font-bold" style={{ color:"var(--text)" }}>
                  {lang === "EN" ? "Benefits" : "Beneficios"}
                </p>
              </div>
              <ul className="space-y-1.5">
                {(lang === "EN"
                  ? ["Customize your car", "Premium car bodies", "Exotic wheels & decals", "Goal explosions", "Access to Rocket Pass items"]
                  : ["Personaliza tu coche", "Carrocer\u00edas premium", "Ruedas y calcoman\u00edas ex\u00f3ticas", "Explosiones de gol", "Acceso a objetos del Rocket Pass"]
                ).map(b => (
                  <li key={b} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} style={{ color: BRAND }} className="flex-shrink-0"/> {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* In-game usage */}
            <div className="rounded-xl p-4 space-y-3" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"rgba(245,158,11,0.15)" }}>
                  <Coins size={15} className="text-yellow-400"/>
                </div>
                <p className="text-xs font-bold" style={{ color:"var(--text)" }}>
                  {lang === "EN" ? "In-game usage" : "Uso en el juego"}
                </p>
              </div>
              <ul className="space-y-1.5">
                {(lang === "EN"
                  ? ["Buy car bodies & decals", "Trade with other players", "Unlock Rocket Pass", "In-game shop items", "Blueprints crafting"]
                  : ["Comprar carrocer\u00edas y calcoman\u00edas", "Intercambiar con otros jugadores", "Desbloquear Rocket Pass", "Art\u00edculos de la tienda", "Construir blueprints"]
                ).map(u => (
                  <li key={u} className="flex items-center gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
                    <Check size={11} className="text-yellow-400 flex-shrink-0"/> {u}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TAB PAQUETES ─────────────────────────────────────────
function TabPaquetes() {
  const { lang } = usePreferences();
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
        style={{ background:"rgba(234,88,12,0.1)", border:"1px solid rgba(234,88,12,0.2)" }}>
        &#128230;
      </div>
      <p className="text-lg font-bold" style={{ color:"var(--text)" }}>
        {lang === "EN" ? "Coming soon" : "Pr\u00f3ximamente"}
      </p>
      <p className="text-sm" style={{ color:"var(--text-muted)" }}>
        {lang === "EN"
          ? "Rocket League bundles will be available soon."
          : "Los paquetes de Rocket League estar\u00e1n disponibles pronto."}
      </p>
    </div>
  );
}

// ─── INNER ────────────────────────────────────────────────
function RocketLeaguePageInner() {
  const { lang } = usePreferences();
  const t = useT();
  const TABS = getTabs(lang);
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tabParam     = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam ?? "creditos");

  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
  }, [tabParam]);

  function handleTabClick(id: string) {
    setActiveTab(id);
    router.push(`/games/rocket-league?tab=${id}`, { scroll: false });
  }

  return (
    <>
      <Navbar />
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* HERO */}
        <section className="relative overflow-hidden" style={{ height:"65vh", minHeight:"460px" }}>
          <Image src="/games/rocket-league.jpg" alt="Rocket League" fill className="object-cover object-center" priority/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to right,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.45) 55%,rgba(0,0,0,0.1) 100%)" }}/>
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 60%)" }}/>

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 z-10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-xs" style={{ color:"rgba(255,255,255,0.45)" }}>
                <Link href="/" className="hover:text-white transition-colors">{t.checkout.home}</Link>
                <ChevronRight size={11}/>
                <Link href="/games" className="hover:text-white transition-colors">{t.gamePage.games}</Link>
                <ChevronRight size={11}/>
                <span className="text-white">Rocket League</span>
              </nav>
            </div>
          </div>

          {/* Hero text */}
          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-20 w-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-popular px-3 py-1 rounded-full text-xs font-bold">Vehicular Soccer</span>
                <span className="badge-nuevo px-3 py-1 rounded-full text-xs font-bold">Free to Play</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold text-white leading-none tracking-tight mb-4">
                Rocket League
              </h1>
              <div className="flex items-center gap-5 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {[1,2,3,4].map(i => <Star key={i} size={14} fill="currentColor" className="text-yellow-400"/>)}
                  <Star size={14} fill="currentColor" className="text-yellow-400" style={{ clipPath:"inset(0 20% 0 0)" }}/>
                  <span className="text-white text-sm font-semibold ml-1">4.8</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.45)" }}>
                  <Zap size={13} className="text-yellow-400"/>
                  <span className="text-xs">{lang === "EN" ? "Instant delivery" : "Entrega instant\u00e1nea"}</span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.45)" }}>
                  <Shield size={13} className="text-green-400"/>
                  <span className="text-xs">{lang === "EN" ? "Secure payment" : "Pago seguro"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TABS */}
        <div className="sticky top-[65px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth:"none" }}>
              <div className="flex">
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => handleTabClick(tab.id)}
                    className="flex-shrink-0 px-5 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: activeTab === tab.id ? BRAND : "var(--text-muted)" }}>
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:`linear-gradient(90deg,${BRAND},${BRAND_DARK})` }}/>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
          {activeTab === "creditos" && <TabCreditos />}
          {activeTab === "paquetes" && <TabPaquetes />}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function RocketLeaguePageClient() {
  return (
    <Suspense fallback={null}>
      <RocketLeaguePageInner />
    </Suspense>
  );
}
