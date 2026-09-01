"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, ExternalLink, AlertTriangle, Info,
  Clock, Check, ChevronUp, ChevronDown, Zap, X,
  Shield, MessageCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  VIA_CUENTA, VIA_GRUPO, GRUPOS,
  GAMEPASS_PRICE_PER_1000, GAMEPASS_MIN_ROBUX, GAMEPASS_STEP,
  calcGamePassPrice, calcRobuxAfterTax,
  RobloxProduct,
} from "@/data/roblox";
import { useCart } from "@/context/CartContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

const BRAND      = "#EF4444";
const BRAND_DARK = "#DC2626";
const IMG        = "/roblox/robux.png";

const TABS = [
  { id:"cuenta",   label:"👤 Via Account" },
  { id:"grupo",    label:"👥 Via Group"   },
  { id:"gamepass", label:"🎮 Game Pass"   },
];

const badgeStyle: Record<string, string> = {
  "Popular":     "badge-popular",
  "Sale":        "badge-oferta",
  "Best value":  "badge-valor",
  "Oferta":      "badge-oferta",
  "Mejor valor": "badge-valor",
};

// ── Product Card ───────────────────────────────────────────────
function ProductCard({ p }: { p: RobloxProduct }) {
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
        style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,rgba(239,68,68,0.12),rgba(10,5,20,0.85))" }}
      >
        <Image
          src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill
          className="object-contain p-5 transition-transform duration-300 group-hover:scale-105"
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
          {p.bonusRobux ? `${p.robux.toLocaleString()} Robux` : (lang==="EN" ? p.nameEN || p.name : p.name)}
        </p>
        {p.bonusRobux && (
          <p className="text-[11px] font-bold mb-1" style={{ color:"#4ADE80" }}>
            🎁 {t.roblox.youReceive} {p.bonusRobux.toLocaleString()} Robux
          </p>
        )}
        {p.deliveryTime && (
          <p className="text-[10px] flex items-center gap-1 mb-1.5" style={{ color:"var(--text-subtle)" }}>
            <Clock size={10}/> {lang==="EN" ? p.deliveryTimeEN || p.deliveryTime : p.deliveryTime}
          </p>
        )}
        <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color:"var(--text-muted)" }}>
          {lang==="EN" ? p.descriptionEN || p.description : p.description}
        </p>
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div>
            <p className="text-[11px] line-through" style={{ color:"var(--text-subtle)" }}>
              {formatPrice(p.priceOld)}
            </p>
            <p className="text-xl font-bold" style={{ color:BRAND }}>
              {formatPrice(p.price)}
            </p>
          </div>
          <Link
            href={`/games/roblox/${p.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 whitespace-nowrap"
            style={{ background:`linear-gradient(135deg,${BRAND_DARK},#7F1D1D)`, boxShadow:`0 2px 12px ${BRAND}50` }}
          >
            <ShoppingCart size={13}/> {t.product.buy}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Tab Cuenta ─────────────────────────────────────────────────
function TabCuenta() {
  const t = useT();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
          style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.28)" }}
        >
          <Clock size={16} className="flex-shrink-0 mt-0.5 text-yellow-400"/>
          <div className="text-xs">
            <p className="font-bold mb-0.5" style={{ color:"#FBBF24" }}>{t.roblox.deliveryTime}</p>
            <p style={{ color:"var(--text-muted)" }}>{t.roblox.deliveryTimeDesc}</p>
          </div>
        </div>
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
          style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)" }}
        >
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-red-400"/>
          <div className="text-xs">
            <p className="font-bold mb-0.5 text-red-400">{t.roblox.requiresAccount}</p>
            <p style={{ color:"var(--text-muted)" }}>{t.roblox.requiresAccountDesc}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {VIA_CUENTA.map(p => <ProductCard key={p.id} p={p}/>)}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{ background:"linear-gradient(135deg,rgba(239,68,68,0.1),rgba(127,29,29,0.07))", borderBottom:"1px solid var(--border)" }}
        >
          <span className="text-lg">💡</span>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{t.roblox.howViaAccount}</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5" style={{ background:"var(--card)" }}>
          {[
            { icon:"🔑", title:t.roblox.step_account_1_title, body:t.roblox.step_account_1_body },
            { icon:"🛒", title:t.roblox.step_account_2_title, body:t.roblox.step_account_2_body },
            { icon:"💎", title:t.roblox.step_account_3_title, body:t.roblox.step_account_3_body },
          ].map(c => (
            <div
              key={c.title}
              className="rounded-xl p-4 space-y-2"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}
            >
              <p className="text-lg mb-1">{c.icon}</p>
              <p className="text-xs font-bold" style={{ color:"var(--text)" }}>{c.title}</p>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab Grupo ──────────────────────────────────────────────────
function TabGrupo() {
  const t = useT();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl overflow-hidden" style={{ border:"1.5px solid rgba(239,68,68,0.35)" }}>
        <div
          className="px-5 py-4 flex items-center gap-2"
          style={{ background:"rgba(239,68,68,0.1)", borderBottom:"1px solid rgba(239,68,68,0.25)" }}
        >
          <AlertTriangle size={15} style={{ color:BRAND }}/>
          <p className="text-sm font-bold" style={{ color:BRAND }}>⚠️ {t.roblox.mandatoryReq}</p>
        </div>
        <div className="p-5 space-y-4" style={{ background:"var(--card)" }}>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>
            {t.roblox.mustBe}{" "}
            <span style={{ color:BRAND }}>14 {t.roblox.days}</span>{" "}
            {t.roblox.inGroup}
          </p>
          <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
            {t.roblox.groupReqDesc}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(GRUPOS).map(([key, g]) => (
              <a
                key={key} href={g.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all hover:scale-[1.02]"
                style={{ background:"var(--surface)", border:`1.5px solid rgba(239,68,68,0.25)` }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ background:`linear-gradient(135deg,${BRAND_DARK},#7F1D1D)` }}
                >
                  {key === "grupo1" ? "1" : "2"}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold" style={{ color:"var(--text)" }}>
                    {t.roblox.group} {key === "grupo1" ? "1" : "2"}
                  </p>
                  <p className="text-[11px]" style={{ color:BRAND }}>{g.name}</p>
                </div>
                <div
                  className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                  style={{ background:"rgba(239,68,68,0.12)", color:BRAND }}
                >
                  <ExternalLink size={11}/> {t.roblox.join}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
        style={{ background:"rgba(16,185,129,0.07)", border:"1px solid rgba(16,185,129,0.25)" }}
      >
        <Check size={16} className="flex-shrink-0 mt-0.5 text-green-400"/>
        <div className="text-xs">
          <p className="font-bold mb-0.5 text-green-400">{t.roblox.noPassword}</p>
          <p style={{ color:"var(--text-muted)" }}>{t.roblox.noPasswordDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {VIA_GRUPO.map(p => <ProductCard key={p.id} p={p}/>)}
      </div>
    </div>
  );
}

// ── Game Pass Guide Modal ──────────────────────────────────────
function GamePassGuide({ onClose }: { onClose: () => void }) {
  const t = useT();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.82)", backdropFilter:"blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden max-h-[88vh] flex flex-col"
        style={{ background:"var(--card)", border:"1px solid var(--border)" }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}
        >
          <div>
            <p className="text-sm font-bold" style={{ color:"var(--text)" }}>
              🎮 {t.roblox.howToCreateGamePass}
            </p>
            <p className="text-[11px]" style={{ color:"var(--text-subtle)" }}>{t.roblox.followSteps}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-70 transition-all"
            style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--text-muted)" }}
          >
            <X size={14}/>
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-4">
          <div
            className="rounded-xl p-3.5"
            style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)" }}
          >
            <p className="text-xs font-bold text-red-400 mb-0.5">{t.roblox.prerequisite}</p>
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>{t.roblox.prerequisiteDesc}</p>
          </div>

          <div className="space-y-3">
            {[
              { step:"1", title:t.roblox.gp_step1_title, desc:t.roblox.gp_step1_desc, note:null },
              { step:"2", title:t.roblox.gp_step2_title, desc:t.roblox.gp_step2_desc, note:null },
              { step:"3", title:t.roblox.gp_step3_title, desc:t.roblox.gp_step3_desc, note:null },
              { step:"4", title:t.roblox.gp_step4_title, desc:t.roblox.gp_step4_desc, note:null },
              { step:"5", title:t.roblox.gp_step5_title, desc:t.roblox.gp_step5_desc, note:t.roblox.gp_step5_note },
              { step:"6", title:t.roblox.gp_step6_title, desc:t.roblox.gp_step6_desc, note:null },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0 mt-0.5"
                  style={{ background:`linear-gradient(135deg,${BRAND_DARK},#7F1D1D)` }}
                >
                  {item.step}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold mb-0.5" style={{ color:"var(--text)" }}>{item.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>{item.desc}</p>
                  {item.note && (
                    <p
                      className="text-[11px] mt-1.5 px-2.5 py-1.5 rounded-lg font-semibold"
                      style={{ background:"rgba(245,158,11,0.1)", color:"#FBBF24", border:"1px solid rgba(245,158,11,0.25)" }}
                    >
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-3.5"
            style={{ background:"rgba(16,185,129,0.07)", border:"1px solid rgba(16,185,129,0.2)" }}
          >
            <p className="text-xs" style={{ color:"var(--text-muted)" }}>
              💡 <strong style={{ color:"var(--text)" }}>{t.roblox.tip}:</strong> {t.roblox.tipDesc}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01]"
            style={{ background:`linear-gradient(135deg,${BRAND_DARK},#7F1D1D)`, boxShadow:`0 4px 16px ${BRAND}40` }}
          >
            ✓ {t.roblox.understoodGamePass}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tab Game Pass ──────────────────────────────────────────────
function TabGamePass() {
  const t = useT();
  const { formatPrice } = usePreferences();
  const [robux,     setRobux]     = useState(1000);
  const [inputVal,  setInputVal]  = useState("1000");
  const [fieldUser, setFieldUser] = useState("");
  const [fieldLink, setFieldLink] = useState("");
  const [whatsapp,  setWhatsapp]  = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [errors,    setErrors]    = useState<Record<string, boolean>>({});
  const [added,     setAdded]     = useState(false);
  const { addItem } = useCart();

  const price    = calcGamePassPrice(robux);
  const afterTax = calcRobuxAfterTax(robux);
  const taxAmt   = robux - afterTax;
  const priceOld = Math.ceil(price * 1.4 * 100) / 100;

  function clamp(v: number) {
    return Math.max(GAMEPASS_MIN_ROBUX, Math.round(v / GAMEPASS_STEP) * GAMEPASS_STEP);
  }
  function handleInput(v: string) {
    setInputVal(v);
    const n = parseInt(v.replace(/\D/g, ""), 10);
    if (!isNaN(n)) setRobux(clamp(n));
  }
  function handleBlur() {
    const v = clamp(robux);
    setRobux(v); setInputVal(v.toString());
  }
  function step(dir: 1 | -1) {
    const n = clamp(robux + dir * GAMEPASS_STEP);
    setRobux(n); setInputVal(n.toString());
  }
  function quickSet(v: number) { setRobux(v); setInputVal(v.toString()); }

  function validate() {
    if (whatsapp) return true;
    const e: Record<string, boolean> = {};
    if (!fieldUser.trim()) e.user = true;
    if (!fieldLink.trim()) e.link = true;
    setErrors(e); return Object.keys(e).length === 0;
  }

  function getCartItem() {
    return {
      slug:`gamepass-${robux}`,
      name:`${robux.toLocaleString()} Robux (Game Pass) → ${afterTax.toLocaleString()} net`,
      img: IMG,
      price, priceOld,
      region:"Global", format:"Digital", tabLabel:"Game Pass",
      orderData:{ gameName: fieldUser || undefined, user: fieldLink || undefined },
    };
  }

  function handleAdd() {
    if (!validate()) return;
    addItem(getCartItem());
    setAdded(true); setTimeout(() => setAdded(false), 2000);
  }
  function handleBuyNow() {
    if (!validate()) return;
    addItem(getCartItem());
    window.location.href = "/checkout";
  }

  const QUICK = [1000, 2000, 5000, 10000];

  return (
    <div className="space-y-6">
      {/* Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-xl p-4 space-y-2"
          style={{ background:"rgba(245,158,11,0.07)", border:"1.5px solid rgba(245,158,11,0.28)" }}
        >
          <p className="text-xs font-bold" style={{ color:"#FBBF24" }}>⚡ {t.roblox.immediateProcess}</p>
          <p className="text-xs" style={{ color:"var(--text-muted)" }}>
            {t.roblox.immediateProcessDesc1}
            <strong style={{ color:"var(--text)" }}> {t.roblox.pending}</strong>{" "}
            {t.roblox.immediateProcessDesc2}
            <strong style={{ color:"var(--text)" }}> {t.roblox.businessDays}</strong>{" "}
            {t.roblox.immediateProcessDesc3}
          </p>
        </div>
        <div
          className="rounded-xl p-4 space-y-2"
          style={{ background:"rgba(239,68,68,0.07)", border:"1.5px solid rgba(239,68,68,0.25)" }}
        >
          <p className="text-xs font-bold text-red-400">⚠️ {t.roblox.taxNotice}</p>
          <p className="text-xs" style={{ color:"var(--text-muted)" }}>
            {t.roblox.taxNoticeDesc1}
            <strong style={{ color:"var(--text)" }}> 1,000 Robux</strong>,{" "}
            {t.roblox.taxNoticeDesc2}
            <strong style={{ color:"#4ADE80" }}> 700 Robux</strong>{" "}
            {t.roblox.net}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── Image + Calculator ── */}
        <div className="space-y-5">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border:"1px solid var(--border)", background:"linear-gradient(135deg,rgba(239,68,68,0.12),rgba(10,5,20,0.85))" }}
          >
            <div className="relative w-full" style={{ aspectRatio:"4/3" }}>
              <Image src={IMG} alt="Robux Game Pass" fill className="object-contain p-8"/>
              <div
                className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black"
                style={{ background:"linear-gradient(135deg,#DC2626,#7F1D1D)", color:"white" }}
              >
                💎 {robux.toLocaleString()} Robux
              </div>
              <div
                className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background:"rgba(16,185,129,0.2)", border:"1px solid rgba(16,185,129,0.4)", color:"#4ADE80" }}
              >
                → {afterTax.toLocaleString()} {t.roblox.net}
              </div>
            </div>
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ borderTop:"1px solid var(--border)" }}
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color:"var(--text-subtle)" }}>
                  {t.product.price}
                </p>
                <p className="text-2xl font-black" style={{ color:BRAND }}>{formatPrice(price)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color:"var(--text-subtle)" }}>
                  {t.roblox.youWillReceive}
                </p>
                <p className="text-xl font-bold" style={{ color:"#4ADE80" }}>{afterTax.toLocaleString()} Robux</p>
                <p className="text-[10px]" style={{ color:"var(--text-subtle)" }}>{t.roblox.inBusinessDays}</p>
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
            <div
              className="px-5 py-3.5"
              style={{ background:`linear-gradient(135deg,rgba(239,68,68,0.1),rgba(127,29,29,0.06))`, borderBottom:"1px solid var(--border)" }}
            >
              <p className="text-sm font-bold" style={{ color:"var(--text)" }}>🧮 {t.roblox.taxCalculator}</p>
              <p className="text-[11px]" style={{ color:"var(--text-subtle)" }}>{t.roblox.taxCalculatorDesc}</p>
            </div>
            <div className="p-4 space-y-4" style={{ background:"var(--card)" }}>
              {/* Stepper */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => step(-1)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95"
                  style={{ background:"var(--surface)", border:`1.5px solid var(--border)`, color:"var(--text)" }}
                >
                  <ChevronDown size={20}/>
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text" inputMode="numeric" value={inputVal}
                    onChange={e => handleInput(e.target.value)} onBlur={handleBlur}
                    className="w-full text-center text-2xl font-black py-2.5 px-4 rounded-xl outline-none"
                    style={{ background:"var(--surface)", border:`1.5px solid ${BRAND}`, color:"var(--text)" }}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
                    style={{ color:"var(--text-subtle)" }}
                  >R</span>
                </div>
                <button
                  onClick={() => step(1)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95"
                  style={{ background:"var(--surface)", border:`1.5px solid var(--border)`, color:"var(--text)" }}
                >
                  <ChevronUp size={20}/>
                </button>
              </div>

              {/* Quick select */}
              <div className="grid grid-cols-4 gap-2">
                {QUICK.map(v => (
                  <button
                    key={v} onClick={() => quickSet(v)}
                    className="py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.04]"
                    style={{
                      background: robux === v ? `rgba(239,68,68,0.12)` : "var(--surface)",
                      border:`1.5px solid ${robux === v ? BRAND : "var(--border)"}`,
                      color: robux === v ? BRAND : "var(--text-muted)",
                    }}
                  >
                    {v >= 1000 ? `${v/1000}k` : v}
                  </button>
                ))}
              </div>

              {/* Breakdown */}
              <div
                className="rounded-xl p-3.5 space-y-2"
                style={{ background:"var(--surface)", border:"1px solid var(--border)" }}
              >
                {[
                  { label:t.roblox.robuxInGamePass,  value:`${robux.toLocaleString()} R`,    color:"var(--text)" },
                  { label:t.roblox.robloxTax,        value:`-${taxAmt.toLocaleString()} R`,  color:BRAND         },
                  { label:t.roblox.netRobuxReceived, value:`${afterTax.toLocaleString()} R`, color:"#4ADE80"     },
                  { label:t.roblox.priceToPay,       value:formatPrice(price),               color:BRAND, bold:true },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between text-xs">
                    <span style={{ color:"var(--text-muted)" }}>{row.label}</span>
                    <span className={row.bold ? "text-sm font-black" : "font-bold"} style={{ color:row.color }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Form ── */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
            <div
              className="px-5 py-3.5"
              style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)" }}
            >
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color:"var(--text)" }}>
                📋 {t.roblox.orderDetails}
              </p>
            </div>
            <div className="p-5 space-y-4" style={{ background:"var(--card)" }}>

              {/* WhatsApp toggle */}
              <button
                onClick={() => setWhatsapp(!whatsapp)}
                className="w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left"
                style={{
                  background: whatsapp ? "rgba(37,211,102,0.08)" : "var(--surface)",
                  border:`1px solid ${whatsapp ? "rgba(37,211,102,0.35)" : "var(--border)"}`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: whatsapp ? "rgba(37,211,102,0.15)" : "var(--card)" }}
                >
                  💬
                </div>
                <div className="flex-1">
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                    style={{ color: whatsapp ? "#4ADE80" : BRAND }}
                  >
                    {t.roblox.recommended}
                  </p>
                  <p className="text-xs font-semibold" style={{ color:"var(--text)" }}>
                    {t.roblox.preferWhatsapp}
                  </p>
                </div>
                <div className="mt-0.5 flex-shrink-0">
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: whatsapp ? "#4ADE80" : "var(--border)", background: whatsapp ? "#4ADE80" : "transparent" }}
                  >
                    {whatsapp && <div className="w-2 h-2 rounded-full bg-white"/>}
                  </div>
                </div>
              </button>

              {!whatsapp ? (
                <div className="space-y-3">
                  <div>
                    <label
                      className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.user ? "#EF4444" : "var(--text-subtle)" }}
                    >
                      {t.roblox.robloxUsername}
                      {errors.user && <span className="normal-case font-normal"> — {t.form.required}</span>}
                    </label>
                    <input
                      type="text" placeholder="YourRobloxUsername" value={fieldUser}
                      onChange={e => { setFieldUser(e.target.value); setErrors(p => ({ ...p, user:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ background:"var(--surface)", border:`1px solid ${errors.user ? "#EF4444" : "var(--border)"}`, color:"var(--text)" }}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : BRAND)}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : "var(--border)")}
                    />
                  </div>
                  <div>
                    <label
                      className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.link ? "#EF4444" : "var(--text-subtle)" }}
                    >
                      {t.roblox.gamePassLink}
                      {errors.link && <span className="normal-case font-normal"> — {t.form.required}</span>}
                    </label>
                    <input
                      type="url" placeholder="https://www.roblox.com/game-pass/..." value={fieldLink}
                      onChange={e => { setFieldLink(e.target.value); setErrors(p => ({ ...p, link:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={{ background:"var(--surface)", border:`1px solid ${errors.link ? "#EF4444" : "var(--border)"}`, color:"var(--text)" }}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.link ? "#EF4444" : BRAND)}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.link ? "#EF4444" : "var(--border)")}
                    />
                    <button
                      onClick={() => setShowGuide(true)}
                      className="text-[11px] mt-1.5 font-semibold underline transition-all hover:opacity-70"
                      style={{ color:BRAND }}
                    >
                      {t.roblox.howToCreateGamePassLink} →
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-xl p-4 text-xs space-y-2"
                  style={{ background:"rgba(37,211,102,0.06)", border:"1px solid rgba(37,211,102,0.2)", color:"var(--text-muted)" }}
                >
                  <p className="font-semibold" style={{ color:"var(--text)" }}>{t.roblox.howItWorks}</p>
                  <p>1. {t.roblox.whatsappStep1}</p>
                  <p>2. {t.roblox.whatsappStep2}</p>
                  <p>3. {t.roblox.whatsappStep3}</p>
                </div>
              )}

              {/* Order summary */}
              <div
                className="rounded-xl p-3.5"
                style={{ background:"var(--surface)", border:`1px solid rgba(239,68,68,0.2)` }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color:"var(--text-subtle)" }}>
                  {t.roblox.orderSummary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ background:"linear-gradient(135deg,rgba(239,68,68,0.15),rgba(10,5,20,0.8))" }}
                    >
                      <Image src={IMG} alt="Robux" fill className="object-contain p-1"/>
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ color:"var(--text)" }}>
                        {robux.toLocaleString()} Robux (Game Pass)
                      </p>
                      <p className="text-[11px]" style={{ color:"#4ADE80" }}>
                        → {afterTax.toLocaleString()} {t.roblox.netInAccount}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-black" style={{ color:BRAND }}>{formatPrice(price)}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAdd}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{ background:"var(--surface)", border:`1.5px solid ${added ? BRAND : "var(--border)"}`, color:BRAND }}
                >
                  {added ? <Check size={16}/> : <ShoppingCart size={16}/>}
                  {added ? t.product.added : t.product.addToCart}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background:`linear-gradient(135deg,${BRAND_DARK},#7F1D1D)`, boxShadow:`0 4px 20px ${BRAND}40` }}
                >
                  <Zap size={16}/> {t.product.buyNow}
                </button>
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-5 pt-1">
                {[
                  { icon:<Shield        size={12} className="text-green-400"/>,  text:t.product.securePayment },
                  { icon:<Zap           size={12} className="text-yellow-400"/>, text:t.product.instant       },
                  { icon:<MessageCircle size={12} className="text-blue-400"/>,   text:t.product.support247    },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-1">
                    {item.icon}
                    <span className="text-[10px]" style={{ color:"var(--text-subtle)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showGuide && <GamePassGuide onClose={() => setShowGuide(false)}/>}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
function RobloxPageInner() {
  const t = useT();
  const { formatPrice } = usePreferences();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const tabParam     = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam ?? "cuenta");

  useEffect(() => { if (tabParam) setActiveTab(tabParam); }, [tabParam]);

  function handleTab(id: string) {
    setActiveTab(id);
    router.push(`/games/roblox?tab=${id}`, { scroll: false });
  }

  return (
    <>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden" style={{ height:"60vh", minHeight:"420px" }}>
          <Image
            src="/games/roblox.jpg" alt="Roblox" fill
            className="object-cover object-center" priority
          />
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to right,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.45) 60%,rgba(0,0,0,0.1) 100%)" }}
          />
          <div className="absolute inset-0"
            style={{ background:"linear-gradient(to top,rgba(0,0,0,0.88) 0%,transparent 55%)" }}
          />

          {/* Breadcrumb */}
          <div className="absolute top-6 left-0 right-0 z-10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
              <nav className="flex items-center gap-2 text-xs" style={{ color:"rgba(255,255,255,0.45)" }}>
                <Link href="/" className="hover:text-white transition-colors">{t.gamePage.home}</Link>
                <span>›</span>
                <Link href="/games" className="hover:text-white transition-colors">{t.gamePage.games}</Link>
                <span>›</span>
                <span className="text-white">Roblox</span>
              </nav>
            </div>
          </div>

          <div className="absolute inset-0 z-10 flex items-end">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8 pb-14 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold badge-popular">
                    {t.roblox.gamingPlatform}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background:"rgba(239,68,68,0.2)", border:"1px solid rgba(239,68,68,0.4)", color:"#FCA5A5" }}
                  >
                    🌐 {t.product.global}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#4ADE80" }}
                  >
                    {t.roblox.rechargeMethodsCount}
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-3">Roblox</h1>
                <p className="text-base mb-2" style={{ color:"rgba(255,255,255,0.65)" }}>
                  {t.roblox.heroSubtitle}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5" style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"/>
                    <span className="text-xs">{t.product.immediateDelivery}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">🛡️ {t.product.secure100}</span>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.6)" }}>
                    <span className="text-xs">💬 {t.product.support247}</span>
                  </div>
                </div>
                <p className="mt-4 text-base" style={{ color:"rgba(255,255,255,0.7)" }}>
                  {t.product.from}{" "}
                  <span className="text-2xl font-bold text-white">{formatPrice(6.9)}</span>
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
                    key={tab.id} onClick={() => handleTab(tab.id)}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: activeTab === tab.id ? BRAND : "var(--text-muted)" }}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:`linear-gradient(90deg,${BRAND_DARK},${BRAND})` }}
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
          {activeTab === "cuenta"   && <TabCuenta/>}
          {activeTab === "grupo"    && <TabGrupo/>}
          {activeTab === "gamepass" && <TabGamePass/>}
        </div>
      </main>
      <Footer/>
    </>
  );
}

export default function RobloxPageClient() {
  return (
    <Suspense fallback={null}>
      <RobloxPageInner/>
    </Suspense>
  );
}
