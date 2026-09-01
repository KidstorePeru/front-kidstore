"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  ChevronRight, ShoppingCart, AlertTriangle,
  Shield, Zap, MessageCircle,
  Check, Heart,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_TFT_PRODUCTS } from "@/data/tft";
import { usePreferences } from "@/context/PreferencesContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useT, useBadge } from "@/i18n";

// ── Tabs ──────────────────────────────────────────────────────
const TABS = [
  { id: "coins", label: "🪙 TFT Coins" },
];

// ── Accent color ──────────────────────────────────────────────
const ACCENT        = "#B89D40";
const ACCENT_LIGHT  = "#E8C84A";
const ACCENT_BG     = "rgba(184,157,64,0.12)";

// ── Platform icons ────────────────────────────────────────────
function PlatformIcon({ id, size = 22 }: { id: string; size?: number }) {
  if (id === "riot") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12.534 21.77L9.22 18.5H4.5v-14h15v14h-4.737l-2.229 3.27zM6.5 6.5v10h3.72l1.78 2.42 1.78-2.42H17.5v-10H6.5zm2 2h7v1.5h-7V8.5zm0 3h7v1.5h-7V11.5zm0 3h5v1.5h-5V14.5z"/>
    </svg>
  );
  if (id === "facebook") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.885v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z"/>
    </svg>
  );
  if (id === "xbox") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M4.102 5.384C2.795 6.99 2 9.05 2 11.3c0 3.117 1.538 5.876 3.903 7.575C7.25 16.454 9.8 13.587 12 11.3c2.2 2.287 4.75 5.154 6.097 7.575A9.93 9.93 0 0 0 22 11.3c0-2.25-.795-4.31-2.102-5.916 0 0-1.575-1.885-3.82.204C14.898 6.568 13.37 8.17 12 9.6c-1.37-1.43-2.899-3.032-4.078-4.012-2.245-2.09-3.82-.204-3.82-.204ZM12 2c-1.73 0-3.355.43-4.773 1.19C8.465 1.94 10.62 3.8 12 5.3c1.38-1.5 3.535-3.36 4.773-2.11A9.952 9.952 0 0 0 12 2Z"/>
    </svg>
  );
  if (id === "playstation") return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M8.984 2.596v14.347l3.214 1.028V5.96s2.751-.269 2.751 2.655c0 3.035-3.251 4.11-3.251 4.11s3.495.28 6.201-1.404c2.096-1.426 2.345-4.179 1.407-6.029-.653-1.316-2.27-2.696-6.322-2.696-1.71 0-4 0-4 0zM2 17.8l4.441 1.403L9.5 20.33v-2.088l-4.619-1.477V16.77L2 17.8zm15.148-.493c-1.396-.205-2.88.044-3.957.608v2.08c.869-.477 2.619-.868 3.699-.322.622.32.535.83-.016 1.137-.547.304-1.464.453-2.498.302v1.82s.853.186 1.879.124c1.404-.082 3.115-.693 3.371-2.302.229-1.414-.626-2.975-2.478-3.447z"/>
    </svg>
  );
  return <span>{id}</span>;
}

const TFT_PLATFORMS = [
  { id: "riot",        label: "Riot" },
  { id: "facebook",    label: "Facebook" },
  { id: "xbox",        label: "Xbox" },
  { id: "playstation", label: "PlayStation" },
];

const PCOL: Record<string, string> = {
  riot: "#D4373A", facebook: "#1877F2", xbox: "#107C10", playstation: "#003087",
};

// ── Description ───────────────────────────────────────────────
function TFTDescription() {
  const t = useT();
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color: "var(--text)" }}>📋 {t.tft.deliveryInstructions}</h4>
      <div className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
        <span>🎮</span>
        <p><strong style={{ color: "var(--text)" }}>KidStore Team</strong> — {t.tft.availablePlatforms}</p>
      </div>
      <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color: "var(--text)" }}>❓ {t.tft.whatWeNeed}</p>
        {[t.tft.need_item1, t.tft.need_item2].map((txt, i) => (
          <p key={i} className="text-xs flex gap-2" style={{ color: "var(--text-muted)" }}>
            <span>•</span><span>{txt}</span>
          </p>
        ))}
      </div>

      <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-2" style={{ color: "var(--text)" }}>🪙 {t.tft.whatAreCoinsShort}</p>
        {[
          { icon: "🎭", text: t.tft.coin_feat1 },
          { icon: "🛒", text: t.tft.coin_feat2 },
          { icon: "🌎", text: t.tft.coin_feat3 },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {[
          { icon: "⚡", text: t.product.deliveryTime },
          { icon: "✅", text: t.product.guarantee },
          { icon: "🛡️", text: t.product.dataPrivacy },
          { icon: "🌎", text: t.tft.globalRiot },
          { icon: "💬", text: t.product.supportDesc },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function TFTProductClient({ slug }: { slug: string }) {
  const router  = useRouter();
  const product = ALL_TFT_PRODUCTS.find(p => p.slug === slug);
  if (!product) notFound();

  const p           = product;
  const t           = useT();
  const badge       = useBadge();
  const { formatPrice: fmt, lang } = usePreferences();
  const discountPct = Math.round((1 - p.price / p.priceOld) * 100);

  const [platform,  setPlatform]  = useState<string | null>(null);
  const [whatsapp,  setWhatsapp]  = useState(false);
  const [addedCart, setAddedCart] = useState(false);
  const [fieldUser, setFieldUser] = useState("");
  const [fieldGame, setFieldGame] = useState("");
  const [errors,    setErrors]    = useState<Record<string, boolean>>({});

  const { addItem, isInCart }            = useCart();
  const { toggle: toggleWish, isWished } = useWishlist();
  const alreadyInCart = isInCart(p.slug);
  const wished        = isWished(p.slug);

  function validate() {
    if (whatsapp) return true;
    const e: Record<string, boolean> = {};
    if (!fieldUser.trim()) e.user     = true;
    if (!fieldGame.trim()) e.gameName = true;
    if (!platform)         e.platform = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleAddToCart() {
    if (!validate()) return;
    addItem({
      slug: p.slug, name: p.name, img: p.img,
      price: p.price, priceOld: p.priceOld,
      region: p.region, format: p.format, tabLabel: p.tabLabel,
      orderData: {
        user: fieldUser || undefined,
        gameName: fieldGame || undefined, platform: platform || undefined,
      },
    });
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 2000);
  }

  function handleBuyNow() {
    if (whatsapp) {
      const msg = encodeURIComponent(
        `Hi! I want to buy:\n🪙 *${p.name}*\n${p.subtitle}\n🌎 ${p.region}\n💰 S/ ${p.price.toFixed(2)}\n\nCan you help me?`
      );
      window.open(`https://wa.me/51983454837?text=${msg}`, "_blank");
      return;
    }
    if (!validate()) return;
    addItem({
      slug: p.slug, name: p.name, img: p.img,
      price: p.price, priceOld: p.priceOld,
      region: p.region, format: p.format, tabLabel: p.tabLabel,
      orderData: {
        user: fieldUser || undefined,
        gameName: fieldGame || undefined, platform: platform || undefined,
      },
    });
    router.push("/checkout");
  }

  function handleWishlist() {
    toggleWish({
      slug: p.slug, name: p.name, img: p.img,
      price: p.price, priceOld: p.priceOld,
      region: p.region, format: p.format, tabLabel: p.tabLabel,
      game: "Teamfight Tactics", gameSlug: "team-fight-tactics",
    });
  }

  const inputStyle = (err?: boolean): React.CSSProperties => ({
    background: "var(--card)",
    border: `1px solid ${err ? "#EF4444" : "var(--border)"}`,
    color: "var(--text)",
  });

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

        {/* Tabs sticky */}
        <div className="sticky top-[66px] md:top-[107px] z-40 w-full"
          style={{ background: "var(--navbar-bg)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              <div className="flex">
                {TABS.map(tab => (
                  <Link key={tab.id} href={`/games/team-fight-tactics?tab=${tab.id}`}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: p.tab === tab.id ? ACCENT_LIGHT : "var(--text-muted)" }}>
                    {tab.label}
                    {p.tab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background: `linear-gradient(90deg,${ACCENT},${ACCENT_LIGHT})` }} />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap" style={{ color: "var(--text-subtle)" }}>
            <Link href="/" className="hover:opacity-80">{t.gamePage.home}</Link>
            <ChevronRight size={11} />
            <Link href="/games" className="hover:opacity-80">{t.gamePage.games}</Link>
            <ChevronRight size={11} />
            <Link href="/games/team-fight-tactics" className="hover:opacity-80">Teamfight Tactics</Link>
            <ChevronRight size={11} />
            <Link href={`/games/team-fight-tactics?tab=${p.tab}`} className="hover:opacity-80">{p.tabLabel}</Link>
            <ChevronRight size={11} />
            <span style={{ color: "var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* ── LEFT — image + description ── */}
            <div className="space-y-6">
              <div className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio: "4/3", background: `linear-gradient(135deg,rgba(184,157,64,0.18),rgba(5,3,15,0.8))`, border: "1px solid var(--border)" }}>
                <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill className="object-contain p-8" priority />
              </div>
              <div className="rounded-2xl p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <TFTDescription />
              </div>
            </div>

            {/* ── RIGHT — info + purchase ── */}
            <div className="space-y-4">

              {/* Badge */}
              {p.badge && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  p.badge === "Popular" ? "badge-popular" : p.badge === "Oferta" ? "badge-oferta" : "badge-valor"
                }`}>{badge(p.badge)}</span>
              )}

              {/* Name + wishlist */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</h1>
                  <button onClick={handleWishlist}
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 mt-0.5"
                    style={{ background: wished ? "rgba(239,68,68,0.1)" : "var(--card)", border: `1.5px solid ${wished ? "rgba(239,68,68,0.4)" : "var(--border)"}` }}>
                    <Heart size={18} style={{ color: wished ? "#EF4444" : "var(--text-muted)" }} fill={wished ? "#EF4444" : "none"} />
                  </button>
                </div>
                <p className="text-sm mt-1 font-semibold" style={{ color: ACCENT_LIGHT }}>{lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-subtle)" }}>{p.region}</p>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold" style={{ color: ACCENT_LIGHT }}>{fmt(p.price)}</p>
                <p className="text-base line-through mb-0.5" style={{ color: "var(--text-subtle)" }}>{fmt(p.priceOld)}</p>
                {discountPct > 0 && (
                  <span className="mb-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                    style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#4ADE80" }}>
                    -{discountPct}%
                  </span>
                )}
              </div>

              {/* Format + Region */}
              <div className="grid grid-cols-2 gap-3">
                {[{ label: t.product.format, value: p.format }, { label: t.product.region, value: p.region }].map(item => (
                  <div key={item.label} className="rounded-xl px-4 py-3"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--text-subtle)" }}>{item.label}</p>
                    <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Important notice */}
              <div className="rounded-xl p-4 flex gap-3"
                style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <AlertTriangle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  <p className="font-semibold text-red-400 mb-0.5">{t.roblox.importantNotice}</p>
                  <p>{t.tft.importantNoticeDesc}</p>
                </div>
              </div>

              {/* WhatsApp toggle */}
              <button onClick={() => setWhatsapp(!whatsapp)}
                className="w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left"
                style={{ background: whatsapp ? "rgba(37,211,102,0.08)" : "var(--card)", border: `1px solid ${whatsapp ? "rgba(37,211,102,0.35)" : "var(--border)"}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: whatsapp ? "rgba(37,211,102,0.15)" : "var(--surface)" }}>💬</div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                    style={{ color: whatsapp ? "#4ADE80" : ACCENT_LIGHT }}>{t.roblox.recommended}</p>
                  <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                    {t.roblox.preferWhatsapp}
                  </p>
                </div>
                <div className="mt-0.5 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: whatsapp ? "#4ADE80" : "var(--border)", background: whatsapp ? "#4ADE80" : "transparent" }}>
                    {whatsapp && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </button>

              {/* Form */}
              {!whatsapp ? (
                <div className="space-y-3">

                  {/* Username */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.user ? "#EF4444" : "var(--text-subtle)" }}>
                      {t.roblox.userEmailPhone}
                      {errors.user && <span className="normal-case font-normal"> — {t.form.required}</span>}
                    </label>
                    <input type="text" placeholder="your_user / email@example.com"
                      value={fieldUser} onChange={e => { setFieldUser(e.target.value); setErrors(p => ({ ...p, user: false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.user)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : ACCENT)}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : "var(--border)")} />
                  </div>

                  {/* Seguridad: nunca se pide la contraseña en la web */}
                  <p className="text-[11px] flex items-start gap-1.5 -mt-1" style={{ color: "var(--text-subtle)" }}>
                    <span aria-hidden>🔒</span> {t.form.noPasswordNote}
                  </p>

                  {/* In-game name */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.gameName ? "#EF4444" : "var(--text-subtle)" }}>
                      {t.tft.summonerName}
                      {errors.gameName && <span className="normal-case font-normal"> — {t.form.required}</span>}
                    </label>
                    <input type="text" placeholder="YourPlayerName"
                      value={fieldGame} onChange={e => { setFieldGame(e.target.value); setErrors(p => ({ ...p, gameName: false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.gameName)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.gameName ? "#EF4444" : ACCENT)}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.gameName ? "#EF4444" : "var(--border)")} />
                  </div>

                  {/* Platform */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block"
                      style={{ color: errors.platform ? "#EF4444" : "var(--text-subtle)" }}>
                      {t.tft.riotAccessMethod}
                      {errors.platform && <span className="normal-case font-normal"> — {t.form.required}</span>}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {TFT_PLATFORMS.map(pl => {
                        const color  = PCOL[pl.id] ?? "#666";
                        const active = platform === pl.id;
                        return (
                          <button key={pl.id}
                            onClick={() => { setPlatform(active ? null : pl.id); setErrors(prev => ({ ...prev, platform: false })); }}
                            className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl text-center transition-all"
                            style={{
                              background: active ? `${color}18` : "var(--card)",
                              border: `1.5px solid ${active ? color : "var(--border)"}`,
                              boxShadow: active ? `0 0 0 3px ${color}18` : "none",
                            }}>
                            <span style={{ color: active ? color : "var(--text-muted)" }}>
                              <PlatformIcon id={pl.id} size={22} />
                            </span>
                            <span className="text-[10px] font-semibold leading-tight"
                              style={{ color: active ? color : "var(--text-muted)" }}>
                              {pl.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.platform && (
                      <p className="text-[11px] mt-1.5 font-semibold" style={{ color: "#EF4444" }}>
                        {t.tft.selectAccessMethod}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-4 text-xs space-y-2"
                  style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)", color: "var(--text-muted)" }}>
                  <p className="font-semibold" style={{ color: "var(--text)" }}>{t.roblox.howItWorks}</p>
                  <p>1. {t.roblox.whatsappStep1}</p>
                  <p>2. {t.tft.whatsappStep2}</p>
                  <p>3. {t.tft.whatsappStep3}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: alreadyInCart ? ACCENT_BG : "var(--card)",
                    border: `1.5px solid ${alreadyInCart || addedCart ? ACCENT : "var(--border)"}`,
                    color: ACCENT_LIGHT,
                  }}>
                  {addedCart ? <Check size={16} /> : <ShoppingCart size={16} />}
                  {addedCart ? t.product.added : alreadyInCart ? t.product.inCart : t.product.addToCart}
                </button>
                <button onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background: `linear-gradient(135deg,${ACCENT},#8B6914)`, boxShadow: `0 4px 20px rgba(184,157,64,0.4)` }}>
                  <Zap size={16} /> {t.product.buyNow}
                </button>
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-6 pt-1">
                {[
                  { icon: <Shield size={13} className="text-green-400" />,       text: t.product.securePayment },
                  { icon: <Zap    size={13} className="text-yellow-400" />,      text: t.tft.deliveryStrip    },
                  { icon: <MessageCircle size={13} className="text-blue-400" />, text: t.product.support      },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-1.5">
                    {item.icon}
                    <span className="text-[11px]" style={{ color: "var(--text-subtle)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
