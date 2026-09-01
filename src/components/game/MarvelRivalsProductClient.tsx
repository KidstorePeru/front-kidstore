"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  ChevronRight, ShoppingCart, AlertTriangle,
  Shield, Zap, Info, MessageCircle,
  Check, Heart, ExternalLink,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_MARVEL_RIVALS_PRODUCTS } from "@/data/marvelrivals";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useGameVisibility } from "@/hooks/useGameVisibility";
import { useT, useBadge } from "@/i18n";

const SLUG = "marvel-rivals";

// ── Description ────────────────────────────────────────────────
function MRDescription() {
  const [showUID, setShowUID] = useState(false);
  const { lang } = usePreferences();

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "📋 Instrucciones de entrega" : "📋 Delivery instructions"}</h4>

      <div className="rounded-xl p-4 space-y-2.5"
        style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>{lang === "ES" ? "⚡ ¿Cómo funciona?" : "⚡ How does it work?"}</p>
        {(lang === "ES" ? [
          "Selecciona la cantidad de Lattices que deseas.",
          "Ingresa tu UID de Marvel Rivals correctamente.",
          "Realiza el pago y selecciona tu método preferido.",
          "Los Lattices se acreditarán en tu cuenta en minutos.",
        ] : [
          "Select the amount of Lattices you want.",
          "Enter your Marvel Rivals UID correctly.",
          "Complete the payment and select your preferred method.",
          "Lattices will be credited to your account in minutes.",
        ]).map((t, i) => (
          <div key={i} className="flex items-start gap-2.5 text-xs" style={{ color:"var(--text-muted)" }}>
            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0 mt-0.5"
              style={{ background:"linear-gradient(135deg,#DC2626,#7F1D1D)" }}>
              {i + 1}
            </span>
            <p>{t}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl p-4 space-y-2"
        style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        {[
          { icon:"✅", text: lang === "ES" ? "100% garantizado. Si no se puede entregar, te devolvemos el dinero." : "100% guaranteed. If we can't deliver, we refund your money." },
          { icon:"🛡️", text: lang === "ES" ? "No necesitamos tu contraseña. Solo tu UID y nombre de usuario." : "We don't need your password. Only your UID and username." },
          { icon:"⚡", text: lang === "ES" ? "Entrega en pocos minutos directamente en tu cuenta." : "Delivery in minutes directly to your account." },
          { icon:"🌐", text: lang === "ES" ? "Disponible para cuentas de cualquier región (Global)." : "Available for accounts from any region (Global)." },
          { icon:"💬", text: lang === "ES" ? "Soporte disponible por WhatsApp o Messenger." : "Support available via WhatsApp or Messenger." },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
            <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
          </div>
        ))}
      </div>

      {/* UID guide toggle */}
      <div className="rounded-xl overflow-hidden" style={{ border:"1px solid rgba(220,38,38,0.25)" }}>
        <button onClick={() => setShowUID(!showUID)}
          className="w-full flex items-center justify-between px-4 py-3 text-left transition-all hover:opacity-80"
          style={{ background:"rgba(220,38,38,0.07)" }}>
          <p className="text-xs font-bold" style={{ color:"#EF4444" }}>
            {lang === "ES" ? "🆔 ¿Cómo encontrar tu UID?" : "🆔 How to find your UID?"}
          </p>
          <span className="text-xs" style={{ color:"var(--text-subtle)" }}>{showUID ? "▲" : "▼"}</span>
        </button>
        {showUID && (
          <div className="p-4 space-y-3" style={{ background:"var(--surface)" }}>
            {(lang === "ES" ? [
              "Inicia sesión en el juego usando tu cuenta.",
              'Toca el ícono "Avatar" en la esquina superior derecha.',
              "Tu UID se mostrará en la pantalla.",
            ] : [
              "Log in to the game using your account.",
              'Tap the "Avatar" icon in the upper right corner.',
              "Your UID will be displayed on screen.",
            ]).map((t, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs" style={{ color:"var(--text-muted)" }}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0"
                  style={{ background:"linear-gradient(135deg,#DC2626,#7F1D1D)" }}>
                  {i + 1}
                </span>
                <p>{t}</p>
              </div>
            ))}
            <div className="rounded-xl overflow-hidden mt-3"
              style={{ border:"1px solid var(--border)" }}>
              <Image src="/marvel-rivals/tu-uid.png" alt={lang === "ES" ? "Encontrar UID" : "Find UID"} width={400} height={240}
                className="w-full object-contain"/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function MarvelRivalsProductClient({ slug }: { slug: string }) {
  const product = ALL_MARVEL_RIVALS_PRODUCTS.find(p => p.slug === slug);
  if (!product) notFound();

  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();
  const router = useRouter();
  const p           = product;
  const discountPct = Math.round((1 - p.price / p.priceOld) * 100);

  const vis    = useGameVisibility(SLUG);
  const hidden = !vis.productVisible(p.slug);
  useEffect(() => { if (hidden) router.replace(`/games/${SLUG}`); }, [hidden, router]);

  const [whatsapp,   setWhatsapp]   = useState(false);
  const [addedCart,  setAddedCart]  = useState(false);
  const [fieldUID,   setFieldUID]   = useState("");
  const [fieldName,  setFieldName]  = useState("");
  const [errors,     setErrors]     = useState<Record<string, boolean>>({});

  const { addItem, isInCart }          = useCart();
  const { toggle: toggleWish, isWished } = useWishlist();
  const alreadyInCart = isInCart(p.slug);
  const wished        = isWished(p.slug);

  function validate() {
    if (whatsapp) return true;
    const e: Record<string, boolean> = {};
    if (!fieldUID.trim())  e.uid  = true;
    if (!fieldName.trim()) e.name = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildOrderData() {
    return {
      user:     fieldUID  || undefined,
      gameName: fieldName || undefined,
    };
  }

  function handleAddToCart() {
    if (!validate()) return;
    addItem({
      slug: p.slug, name: p.name, img: p.img,
      price: p.price, priceOld: p.priceOld,
      region: p.region, format: p.format,
      tabLabel: "Lattices",
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
      region: p.region, format: p.format,
      tabLabel: "Lattices",
      orderData: buildOrderData(),
    });
    window.location.href = "/checkout";
  }

  function handleWishlist() {
    toggleWish({
      slug: p.slug, name: p.name, img: p.img,
      price: p.price, priceOld: p.priceOld,
      region: p.region, format: p.format,
      tabLabel: "Lattices",
      game: "Marvel Rivals", gameSlug: "marvel-rivals",
    });
  }

  const inputStyle = (err?: boolean) => ({
    background:"var(--card)",
    border:`1px solid ${err ? "#EF4444" : "var(--border)"}`,
    color:"var(--text)",
  });

  const focusColor = (err?: boolean) => err ? "#EF4444" : "#DC2626";
  const blurColor  = (err?: boolean) => err ? "#EF4444" : "var(--border)";

  return (
    <>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* Breadcrumb + back to page */}
        <div className="sticky top-[66px] md:top-[107px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center">
              <Link href="/games/marvel-rivals"
                className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                style={{ color:"#EF4444" }}>
                💎 Lattices
                <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                  style={{ background:"linear-gradient(90deg,#DC2626,#EF4444)" }}/>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-8 flex-wrap" style={{ color:"var(--text-subtle)" }}>
            <Link href="/" className="hover:opacity-80">{t.checkout.home}</Link>
            <ChevronRight size={11}/>
            <Link href="/games" className="hover:opacity-80">{t.gamePage.games}</Link>
            <ChevronRight size={11}/>
            <Link href="/games/marvel-rivals" className="hover:opacity-80">Marvel Rivals</Link>
            <ChevronRight size={11}/>
            <span style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* IZQUIERDA */}
            <div className="space-y-6">
              <div className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio:"4/3", background:"linear-gradient(135deg,rgba(220,38,38,0.18),rgba(10,5,30,0.85))", border:"1px solid var(--border)" }}>
                <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill className="object-contain p-8" priority/>
              </div>
              <div className="rounded-2xl p-6" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                <MRDescription/>
              </div>
            </div>

            {/* DERECHA */}
            <div className="space-y-4">

              {/* Badge */}
              {p.badge && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  p.badge === "Popular" ? "badge-popular" : p.badge === "Oferta" ? "badge-oferta" : "badge-valor"
                }`}>{badge(p.badge)}</span>
              )}

              {/* Nombre + wishlist */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold" style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</h1>
                  <p className="text-sm mt-0.5" style={{ color:"var(--text-subtle)" }}>
                    {p.format} · {p.region}
                  </p>
                </div>
                <button onClick={handleWishlist}
                  className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 mt-0.5"
                  style={{ background: wished ? "rgba(239,68,68,0.1)" : "var(--card)", border:`1.5px solid ${wished ? "rgba(239,68,68,0.4)" : "var(--border)"}` }}>
                  <Heart size={18} style={{ color: wished ? "#EF4444" : "var(--text-muted)" }} fill={wished ? "#EF4444" : "none"}/>
                </button>
              </div>

              {/* Precio */}
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold" style={{ color:"#EF4444" }}>{formatPrice(p.price)}</p>
                <p className="text-base line-through mb-0.5" style={{ color:"var(--text-subtle)" }}>{formatPrice(p.priceOld)}</p>
                <span className="mb-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#4ADE80" }}>
                  -{discountPct}%
                </span>
              </div>

              {/* Formato + Región */}
              <div className="grid grid-cols-2 gap-3">
                {[{ label:t.product.format, value:p.format }, { label:t.product.region, value:p.region }].map(item => (
                  <div key={item.label} className="rounded-xl px-4 py-3"
                    style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color:"var(--text-subtle)" }}>{item.label}</p>
                    <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Aviso UID */}
              <div className="rounded-xl p-4 flex gap-3"
                style={{ background:"rgba(220,38,38,0.07)", border:"1.5px solid rgba(220,38,38,0.3)" }}>
                <AlertTriangle size={15} className="flex-shrink-0 mt-0.5" style={{ color:"#EF4444" }}/>
                <div className="text-xs">
                  <p className="font-semibold mb-0.5" style={{ color:"#EF4444" }}>{lang === "ES" ? "Aviso importante" : "Important notice"}</p>
                  <p style={{ color:"var(--text-muted)" }}>
                    {lang === "ES"
                      ? "Debes ingresar correctamente tu UID para realizar la recarga. Un UID incorrecto puede causar demoras o fallas en la entrega."
                      : "You must enter your UID correctly to complete the recharge. An incorrect UID may cause delays or delivery failures."}
                  </p>
                </div>
              </div>

              {/* WhatsApp toggle */}
              <button onClick={() => setWhatsapp(!whatsapp)}
                className="w-full flex items-start gap-3 p-4 rounded-xl transition-all text-left"
                style={{ background: whatsapp ? "rgba(37,211,102,0.08)" : "var(--card)", border:`1px solid ${whatsapp ? "rgba(37,211,102,0.35)" : "var(--border)"}` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: whatsapp ? "rgba(37,211,102,0.15)" : "var(--surface)" }}>💬</div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                    style={{ color: whatsapp ? "#4ADE80" : "#EF4444" }}>{lang === "ES" ? "Opción recomendada" : "Recommended option"}</p>
                  <p className="text-xs font-semibold" style={{ color:"var(--text)" }}>
                    {lang === "ES" ? "Prefiero enviar la información por WhatsApp o Messenger" : "I prefer to send info via WhatsApp or Messenger"}
                  </p>
                </div>
                <div className="mt-0.5 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                    style={{ borderColor: whatsapp ? "#4ADE80" : "var(--border)", background: whatsapp ? "#4ADE80" : "transparent" }}>
                    {whatsapp && <div className="w-2 h-2 rounded-full bg-white"/>}
                  </div>
                </div>
              </button>

              {/* Formulario */}
              {!whatsapp ? (
                <div className="space-y-3">

                  {/* UID */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.uid ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "ES" ? "ID de Usuario (UID)" : "User ID (UID)"}
                      {errors.uid && <span className="normal-case font-normal"> — {lang === "ES" ? "requerido" : "required"}</span>}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === "ES" ? "Ej: 123456789" : "E.g.: 123456789"}
                      value={fieldUID}
                      onChange={e => { setFieldUID(e.target.value); setErrors(prev => ({ ...prev, uid:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.uid)}
                      onFocus={e => (e.currentTarget.style.borderColor = focusColor(errors.uid))}
                      onBlur={e  => (e.currentTarget.style.borderColor = blurColor(errors.uid))}
                    />
                    <p className="text-[10px] mt-1" style={{ color:"var(--text-subtle)" }}>
                      {lang === "ES" ? "Encuéntralo en tu perfil del juego → ícono de Avatar → esquina superior derecha." : "Find it in your game profile → Avatar icon → upper right corner."}
                    </p>
                  </div>

                  {/* Nombre de usuario */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.name ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "ES" ? "Nombre de usuario" : "Username"}
                      {errors.name && <span className="normal-case font-normal"> — {lang === "ES" ? "requerido" : "required"}</span>}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === "ES" ? "Tu nombre en Marvel Rivals" : "Your Marvel Rivals name"}
                      value={fieldName}
                      onChange={e => { setFieldName(e.target.value); setErrors(prev => ({ ...prev, name:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.name)}
                      onFocus={e => (e.currentTarget.style.borderColor = focusColor(errors.name))}
                      onBlur={e  => (e.currentTarget.style.borderColor = blurColor(errors.name))}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-4 text-xs space-y-2"
                  style={{ background:"rgba(37,211,102,0.06)", border:"1px solid rgba(37,211,102,0.2)", color:"var(--text-muted)" }}>
                  <p className="font-semibold" style={{ color:"var(--text)" }}>{lang === "ES" ? "¿Cómo funciona?" : "How does it work?"}</p>
                  <p>1. {lang === "ES" ? <>Haz clic en <strong style={{ color:"var(--text)" }}>{t.product.buyNow}</strong> y te redirigiremos a WhatsApp.</> : <>Click <strong style={{ color:"var(--text)" }}>{t.product.buyNow}</strong> and we will redirect you to WhatsApp.</>}</p>
                  <p>2. {lang === "ES" ? "Envíanos el nombre del producto y tu UID de Marvel Rivals." : "Send us the product name and your Marvel Rivals UID."}</p>
                  <p>3. {lang === "ES" ? "Nuestro equipo procesará tu pedido en minutos." : "Our team will process your order in minutes."}</p>
                </div>
              )}

              {/* Botones */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: alreadyInCart ? "rgba(220,38,38,0.1)" : "var(--card)",
                    border:`1.5px solid ${alreadyInCart || addedCart ? "#DC2626" : "var(--border)"}`,
                    color:"#EF4444",
                  }}>
                  {addedCart ? <Check size={16}/> : <ShoppingCart size={16}/>}
                  {addedCart ? t.product.added : alreadyInCart ? t.product.inCart : t.product.addToCart}
                </button>
                <button onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background:"linear-gradient(135deg,#DC2626,#7F1D1D)", boxShadow:"0 4px 20px rgba(220,38,38,0.4)" }}>
                  <Zap size={16}/> {t.product.buyNow}
                </button>
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-6 pt-1">
                {[
                  { icon:<Shield        size={13} className="text-green-400"/>,  text:t.trust.securePayment    },
                  { icon:<Zap           size={13} className="text-yellow-400"/>, text: lang === "ES" ? "Entrega rápida" : "Fast delivery" },
                  { icon:<MessageCircle size={13} className="text-blue-400"/>,   text:t.trust.support   },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-1.5">
                    {item.icon}
                    <span className="text-[11px]" style={{ color:"var(--text-subtle)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
