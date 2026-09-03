"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  ChevronRight, ShoppingCart, AlertTriangle,
  Shield, Zap, MessageCircle,
  Check, Heart, Clock,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_DISCORD_PRODUCTS } from "@/data/discord";
import { usePreferences } from "@/context/PreferencesContext";
import { useGameVisibility } from "@/hooks/useGameVisibility";
import { useT, useBadge } from "@/i18n";

const SLUG = "discord";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

// ── Discord accent (compatible tema claro y oscuro) ───────────
const ACCENT       = "#5865F2";
const ACCENT_LIGHT = "#7983F5";
const ACCENT_BG    = "rgba(88,101,242,0.1)";

const TABS_ES = [
  { id: "nitro",   label: "💎 Nitro"   },
  { id: "mejoras", label: "🚀 Mejoras" },
  { id: "tienda",  label: "🛍️ Tienda"  },
];
const TABS_EN = [
  { id: "nitro",   label: "💎 Nitro"   },
  { id: "mejoras", label: "🚀 Boosts"  },
  { id: "tienda",  label: "🛍️ Store"   },
];

function inputStyle(err?: boolean): React.CSSProperties {
  return {
    background: "var(--surface)",
    border: `1px solid ${err ? "#EF4444" : "var(--border)"}`,
    color: "var(--text)",
  };
}

// ══════════════════════════════════════════════════════════════
// DESCRIPCIÓN IZQUIERDA — varía según tipo de producto
// ══════════════════════════════════════════════════════════════
function DiscordDescription({ productType, isTrialProduct, isKey }: {
  productType: string;
  isTrialProduct?:   boolean;
  isKey?:            boolean;
}) {
  const { lang } = usePreferences();
  const isNitro   = productType === "nitro";
  const isMejoras = productType === "mejoras";

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color: "var(--text)" }}>{lang === "ES" ? "📋 Instrucciones de entrega" : "📋 Delivery instructions"}</h4>

      <div className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
        <span>💬</span>
        <p><strong style={{ color: "var(--text)" }}>{lang === "ES" ? "Equipo KidStore" : "KidStore Team"}</strong> — {lang === "ES" ? "Disponible en PC y móvil" : "Available on PC and mobile"}</p>
      </div>

      {/* Aviso de prueba — solo para Nitro 3 meses (key) */}
      {isTrialProduct && (
        <div className="rounded-xl p-4 space-y-2"
          style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.3)" }}>
          <p className="text-xs font-bold flex items-center gap-2" style={{ color: "#F59E0B" }}>
            <AlertTriangle size={13}/> {lang === "ES" ? "Versión de PRUEBA" : "TRIAL Version"}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {lang === "ES"
              ? <>Este producto solo funciona para cuentas que <strong style={{ color: "var(--text)" }}>nunca han tenido Nitro</strong> o que <strong style={{ color: "var(--text)" }}>no hayan tenido Nitro durante 1 año</strong> (probable).</>
              : <>This product only works for accounts that have <strong style={{ color: "var(--text)" }}>never had Nitro</strong> or that <strong style={{ color: "var(--text)" }}>haven&apos;t had Nitro for 1 year</strong> (likely).</>}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {lang === "ES"
              ? <>El código tiene validez de <strong style={{ color: "var(--text)" }}>24 horas</strong>. Actívalo inmediatamente tras recibirlo.</>
              : <>The code is valid for <strong style={{ color: "var(--text)" }}>24 hours</strong>. Activate it immediately after receiving it.</>}
          </p>
        </div>
      )}

      {/* Qué necesitamos */}
      <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color: "var(--text)" }}>{lang === "ES" ? "❓ ¿Qué necesitamos?" : "❓ What do we need?"}</p>
        {isMejoras ? (
          <>
            <p className="text-xs flex gap-2" style={{ color: "var(--text-muted)" }}><span>•</span><span>{lang === "ES" ? "El enlace de invitación permanente de tu servidor." : "The permanent invitation link of your server."}</span></p>
            <p className="text-xs flex gap-2" style={{ color: "var(--text-muted)" }}><span>•</span><span>{lang === "ES" ? "Sin caducidad, captcha, preguntas ni límites de entrada." : "No expiration, captcha, questions or entry limits."}</span></p>
            <p className="text-xs flex gap-2" style={{ color: "var(--text-muted)" }}><span>•</span><span>{lang === "ES" ? "El filtro anti-raid debe estar desactivado." : "The anti-raid filter must be disabled."}</span></p>
          </>
        ) : isKey ? (
          <>
            <p className="text-xs flex gap-2" style={{ color: "var(--text-muted)" }}><span>•</span><span>{lang === "ES" ? "Solo necesitamos tu correo de contacto para enviarte el código." : "We only need your contact email to send you the code."}</span></p>
            <p className="text-xs flex gap-2" style={{ color: "var(--text-muted)" }}><span>•</span><span>{lang === "ES" ? "También podemos enviarte el código por WhatsApp o Discord al finalizar el pago." : "We can also send you the code via WhatsApp or Discord after payment."}</span></p>
          </>
        ) : (
          <>
            <p className="text-xs flex gap-2" style={{ color: "var(--text-muted)" }}><span>•</span><span>{lang === "ES" ? "Tu correo electrónico de Discord." : "Your Discord email address."}</span></p>
            <p className="text-xs flex gap-2" style={{ color: "var(--text-muted)" }}>
              <span>•</span>
              <span>{lang === "ES"
                ? "Tras el pago te contactamos por WhatsApp para coordinar el acceso de forma segura. Nunca pedimos tu contraseña por la web."
                : "After payment we contact you on WhatsApp to coordinate access securely. We never ask for your password on the website."}</span>
            </p>
          </>
        )}
      </div>

      {/* Contenido Nitro */}
      {isNitro && (
        <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-bold mb-2" style={{ color: "var(--text)" }}>{lang === "ES" ? "💎 ¿Qué incluye Discord Nitro?" : "💎 What does Discord Nitro include?"}</p>
          {(lang === "ES" ? [
            { icon: "🎭", text: "Emojis animados y stickers en cualquier servidor." },
            { icon: "🖼️", text: "Avatar, banner y decoración de perfil animados." },
            { icon: "📁", text: "Límite de carga de archivos de 500 MB." },
            { icon: "🎥", text: "Calidad de video mejorada en llamadas." },
            { icon: "🚀", text: "2 Server Boosts para tu servidor favorito." },
          ] : [
            { icon: "🎭", text: "Animated emojis and stickers on any server." },
            { icon: "🖼️", text: "Animated avatar, banner and profile decoration." },
            { icon: "📁", text: "500 MB file upload limit." },
            { icon: "🎥", text: "Improved video quality in calls." },
            { icon: "🚀", text: "2 Server Boosts for your favorite server." },
          ]).map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Contenido Mejoras */}
      {isMejoras && (
        <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-bold mb-2" style={{ color: "var(--text)" }}>{lang === "ES" ? "🚀 ¿Qué desbloquean las mejoras?" : "🚀 What do Boosts unlock?"}</p>
          {(lang === "ES" ? [
            { icon: "🎵", text: "Calidad de audio de 384 kbps en canales de voz." },
            { icon: "😀", text: "100 slots de emojis y 5 slots de stickers extras." },
            { icon: "🖼️", text: "Banner e ícono animado para el servidor." },
            { icon: "📁", text: "Límite de carga de 100 MB para todos los miembros." },
            { icon: "🎨", text: "URL personalizada para el servidor." },
          ] : [
            { icon: "🎵", text: "384 kbps audio quality in voice channels." },
            { icon: "😀", text: "100 emoji slots and 5 extra sticker slots." },
            { icon: "🖼️", text: "Animated banner and icon for the server." },
            { icon: "📁", text: "100 MB upload limit for all members." },
            { icon: "🎨", text: "Custom URL for the server." },
          ]).map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Garantías comunes */}
      <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        {(lang === "ES" ? [
          { icon: "⚡", text: "Entrega en 1h - 12h." },
          { icon: "✅", text: "100% garantizado. Si no se puede entregar, te devolvemos el dinero." },
          { icon: "🛡️", text: "Tus datos solo se usan para la entrega y no son almacenados." },
          { icon: "🌎", text: "Servicio Global. Válido para cualquier cuenta de Discord." },
          { icon: "💬", text: "Soporte en todo momento por WhatsApp o Messenger." },
        ] : [
          { icon: "⚡", text: "Delivery in 1h - 12h." },
          { icon: "✅", text: "100% guaranteed. If we can't deliver, we refund your money." },
          { icon: "🛡️", text: "Your data is only used for delivery and is not stored." },
          { icon: "🌎", text: "Global Service. Valid for any Discord account." },
          { icon: "💬", text: "24/7 support via WhatsApp or Messenger." },
        ]).map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════
export default function DiscordProductClient({ slug }: { slug: string }) {
  const router  = useRouter();
  const product = ALL_DISCORD_PRODUCTS.find(p => p.slug === slug);
  if (!product) notFound();

  const p           = product;
  const { formatPrice: fmt, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();
  const discountPct = Math.round((1 - p.price / p.priceOld) * 100);
  const isMejoras   = p.productType === "mejoras";

  const vis    = useGameVisibility(SLUG);
  const hidden = !vis.productVisible(p.slug) || !vis.tabVisible(p.tab);
  useEffect(() => { if (hidden) router.replace(`/games/${SLUG}`); }, [hidden, router]);
  const isKey       = p.deliveryMethod === "key";

  const [whatsapp,     setWhatsapp]     = useState(false);
  const [addedCart,    setAddedCart]    = useState(false);
  const [fieldUser,    setFieldUser]    = useState("");
  const [fieldServer,  setFieldServer]  = useState("");
  const [errors,       setErrors]       = useState<Record<string, boolean>>({});

  const { addItem, isInCart }            = useCart();
  const { toggle: toggleWish, isWished } = useWishlist();
  const alreadyInCart = isInCart(p.slug);
  const wished        = isWished(p.slug);

  function validate() {
    if (whatsapp) return true;
    const e: Record<string, boolean> = {};
    if (isMejoras) {
      if (!fieldServer.trim()) e.server = true;
    } else if (!isKey) {
      if (!fieldUser.trim()) e.user = true;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildOrderData() {
    if (isMejoras) return { user: fieldServer };
    if (isKey)     return { user: fieldUser || undefined };
    return { user: fieldUser || undefined };
  }

  function handleAddToCart() {
    if (!validate()) return;
    addItem({
      slug: p.slug, name: p.name, img: p.img,
      price: p.price, priceOld: p.priceOld,
      region: p.region, format: p.format, tabLabel: p.tabLabel,
      orderData: buildOrderData(),
    });
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 2000);
  }

  function handleBuyNow() {
    if (!validate()) return;
    addItem({
      slug: p.slug, name: p.name, img: p.img,
      price: p.price, priceOld: p.priceOld,
      region: p.region, format: p.format, tabLabel: p.tabLabel,
      orderData: buildOrderData(),
    });
    window.location.href = "/checkout";
  }

  function handleWishlist() {
    toggleWish({
      slug: p.slug, name: p.name, img: p.img,
      price: p.price, priceOld: p.priceOld,
      region: p.region, format: p.format, tabLabel: p.tabLabel,
      game: "Discord", gameSlug: "discord",
    });
  }

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
                {(lang === "ES" ? TABS_ES : TABS_EN).filter(tab => vis.tabVisible(tab.id)).map(tab => (
                  <Link key={tab.id} href={`/games/discord?tab=${tab.id}`}
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
            <Link href="/" className="hover:opacity-80">{t.checkout.home}</Link>
            <ChevronRight size={11} />
            <Link href="/games" className="hover:opacity-80">{t.gamePage.games}</Link>
            <ChevronRight size={11} />
            <Link href="/games/discord" className="hover:opacity-80">Discord</Link>
            <ChevronRight size={11} />
            <Link href={`/games/discord?tab=${p.tab}`} className="hover:opacity-80">{p.tabLabel}</Link>
            <ChevronRight size={11} />
            <span style={{ color: "var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* ── IZQUIERDA ─────────────────────────────────── */}
            <div className="space-y-6">
              {/* Imagen */}
              <div className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio: "4/3", background: `linear-gradient(135deg,${ACCENT_BG},rgba(5,5,20,0.6))`, border: "1px solid var(--border)" }}>
                <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill className="object-contain p-8" priority />
              </div>
              {/* Descripción */}
              <div className="rounded-2xl p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <DiscordDescription
                  productType={p.productType}
                  isTrialProduct={p.isTrialProduct}
                  isKey={isKey}
                />
              </div>
            </div>

            {/* ── DERECHA ───────────────────────────────────── */}
            <div className="space-y-4">

              {/* Badge */}
              {p.badge && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  p.badge === "Popular" ? "badge-popular" : p.badge === "Oferta" ? "badge-oferta" : "badge-valor"
                }`}>{badge(p.badge)}</span>
              )}

              {/* Nombre + wishlist */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</h1>
                  <button onClick={handleWishlist}
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 mt-0.5"
                    style={{ background: wished ? "rgba(239,68,68,0.1)" : "var(--card)", border: `1.5px solid ${wished ? "rgba(239,68,68,0.4)" : "var(--border)"}` }}>
                    <Heart size={18} style={{ color: wished ? "#EF4444" : "var(--text-muted)" }} fill={wished ? "#EF4444" : "none"} />
                  </button>
                </div>
                {p.subtitle && <p className="text-sm mt-1 font-semibold" style={{ color: ACCENT_LIGHT }}>{lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}</p>}
              </div>

              {/* Precio */}
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

              {/* Info chips — 2 columnas, legibles en tema claro */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: t.discord.platform,         value: p.platform },
                  { label: t.discord.type,               value: p.type },
                  { label: t.discord.activatesIn, value: p.activationTime },
                  { label: t.product.region,             value: p.region },
                  { label: t.product.format,            value: p.format },
                  { label: t.discord.delivery,            value: isKey ? t.discord.keyCode : isMejoras ? t.discord.serverLink : t.discord.accountAccess },
                ].map(item => (
                  <div key={item.label} className="rounded-xl px-3 py-2.5"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
                      style={{ color: "var(--text-subtle)" }}>{item.label}</p>
                    <p className="text-xs font-bold" style={{ color: "var(--text)" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Aviso importante — 1 sola línea, compacto */}
              <div className="rounded-xl px-4 py-3 flex gap-2.5"
                style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}>
                <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="font-semibold text-red-400">{lang === "ES" ? "Aviso: " : "Notice: "}</span>
                  {isMejoras
                    ? (lang === "ES" ? "No expulses las cuentas de boost durante todo el período activo." : "Don't kick the boost accounts during the entire active period.")
                    : isKey
                    ? (lang === "ES" ? "El código es válido por 24h. Actívalo inmediatamente tras recibirlo." : "The code is valid for 24h. Activate it immediately after receiving it.")
                    : (lang === "ES" ? "Necesitaremos acceso temporal a tu cuenta para realizar la entrega." : "We will need temporary access to your account to complete the delivery.")}
                </p>
              </div>

              {/* WhatsApp toggle */}
              <button onClick={() => setWhatsapp(!whatsapp)}
                className="w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left"
                style={{ background: whatsapp ? "rgba(37,211,102,0.08)" : "var(--card)", border: `1px solid ${whatsapp ? "rgba(37,211,102,0.35)" : "var(--border)"}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: whatsapp ? "rgba(37,211,102,0.15)" : "var(--surface)" }}>💬</div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                    style={{ color: whatsapp ? "#4ADE80" : ACCENT_LIGHT }}>{lang === "ES" ? "Opción recomendada" : "Recommended option"}</p>
                  <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                    {lang === "ES" ? "Prefiero enviar la información por WhatsApp o Messenger" : "I prefer to send the information via WhatsApp or Messenger"}
                  </p>
                </div>
                <div className="mt-0.5 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{ borderColor: whatsapp ? "#4ADE80" : "var(--border)", background: whatsapp ? "#4ADE80" : "transparent" }}>
                    {whatsapp && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </button>

              {/* Formulario */}
              {!whatsapp && (
                <div className="space-y-3">
                  {isMejoras ? (
                    /* Solo enlace del servidor */
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                        style={{ color: errors.server ? "#EF4444" : "var(--text-subtle)" }}>
                        {lang === "ES" ? "Enlace de invitación del servidor" : "Server invitation link"}
                        {errors.server && <span className="normal-case font-normal">{lang === "ES" ? " — requerido" : " — required"}</span>}
                      </label>
                      <input type="url" placeholder="https://discord.gg/tu-servidor"
                        value={fieldServer} onChange={e => { setFieldServer(e.target.value); setErrors(p => ({ ...p, server: false })); }}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={inputStyle(errors.server)}
                        onFocus={e => (e.currentTarget.style.borderColor = errors.server ? "#EF4444" : ACCENT)}
                        onBlur={e  => (e.currentTarget.style.borderColor = errors.server ? "#EF4444" : "var(--border)")} />
                      <p className="text-[11px] mt-1.5" style={{ color: "var(--text-subtle)" }}>
                        {lang === "ES" ? "Sin caducidad, captcha, preguntas ni límites de entrada." : "No expiration, captcha, questions or entry limits."}
                      </p>
                    </div>
                  ) : isKey ? (
                    /* Key: solo email opcional */
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                        style={{ color: "var(--text-subtle)" }}>
                        {lang === "ES" ? "Tu correo de contacto (opcional)" : "Your contact email (optional)"}
                      </label>
                      <input type="email" placeholder="correo@email.com"
                        value={fieldUser} onChange={e => setFieldUser(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                        style={inputStyle()}
                        onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                        onBlur={e  => (e.currentTarget.style.borderColor = "var(--border)")} />
                      <p className="text-[11px] mt-1.5" style={{ color: "var(--text-subtle)" }}>
                        {lang === "ES" ? "También podemos enviarte el código por WhatsApp o Discord al finalizar el pago." : "We can also send you the code via WhatsApp or Discord after payment."}
                      </p>
                    </div>
                  ) : (
                    /* Acceso a cuenta: email + pass + backup codes */
                    <>
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                          style={{ color: errors.user ? "#EF4444" : "var(--text-subtle)" }}>
                          {lang === "ES" ? "Correo electrónico de Discord" : "Discord email address"}
                          {errors.user && <span className="normal-case font-normal">{lang === "ES" ? " — requerido" : " — required"}</span>}
                        </label>
                        <input type="email" placeholder="correo@email.com"
                          value={fieldUser} onChange={e => { setFieldUser(e.target.value); setErrors(p => ({ ...p, user: false })); }}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                          style={inputStyle(errors.user)}
                          onFocus={e => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : ACCENT)}
                          onBlur={e  => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : "var(--border)")} />
                      </div>

                      <p className="text-[11px] flex items-start gap-1.5" style={{ color: "var(--text-subtle)" }}>
                        <span aria-hidden>🔒</span> {t.form.noPasswordNote}
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* WhatsApp instructions */}
              {whatsapp && (
                <div className="rounded-xl p-4 text-xs space-y-2"
                  style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)", color: "var(--text-muted)" }}>
                  <p className="font-semibold" style={{ color: "var(--text)" }}>{lang === "ES" ? "¿Cómo funciona?" : "How does it work?"}</p>
                  <p>{lang === "ES" ? <>1. Haz clic en <strong style={{ color: "var(--text)" }}>&quot;Comprar ahora&quot;</strong> y te redirigiremos a WhatsApp.</> : <>1. Click <strong style={{ color: "var(--text)" }}>&quot;Buy now&quot;</strong> and we will redirect you to WhatsApp.</>}</p>
                  <p>{lang === "ES" ? "2. Envíanos el nombre del producto y los datos necesarios." : "2. Send us the product name and the required details."}</p>
                  <p>{lang === "ES" ? `3. Nuestro equipo procesará tu pedido en ${p.deliveryTime ?? "1h - 12h"}.` : `3. Our team will process your order in ${p.deliveryTime ?? "1h - 12h"}.`}</p>
                </div>
              )}

              {/* Botones */}
              <div className="grid grid-cols-2 gap-3 pt-1">
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
                  style={{ background: `linear-gradient(135deg,${ACCENT},#4752C4)`, boxShadow: `0 4px 20px rgba(88,101,242,0.35)` }}>
                  <Zap size={16} /> {t.product.buyNow}
                </button>
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-5 pt-1">
                {[
                  { icon: <Shield        size={13} className="text-green-400" />,  text: t.trust.securePayment },
                  { icon: <Clock         size={13} className="text-yellow-400" />, text: p.deliveryTime ?? "1h-12h" },
                  { icon: <MessageCircle size={13} className="text-blue-400" />,   text: t.trust.support },
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
