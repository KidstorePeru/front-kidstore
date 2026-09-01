"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight, ShoppingCart,
  Shield, Zap, MessageCircle,
  Check, Heart,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ALL_POKEMON_GO_PRODUCTS } from "@/data/pokemongo";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useT, useBadge } from "@/i18n";

const BRAND      = "#FACC15";
const BRAND_DARK = "#EAB308";

const TABS = [
  { id:"coins", label:"🪙 PokéCoins" },
  { id:"pases", label:"🎟️ Pases"     },
];

// ── Platform icons ─────────────────────────────────────────────
function PlatformIcon({ id, size = 22 }: { id: string; size?: number }) {
  if (id === "ptc") return (
    // Pokéball icon for Pokémon Trainer Club
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
      <path d="M12 2C6.48 2 2 6.48 2 12h4c0-3.31 2.69-6 6-6s6 2.69 6 6h4C22 6.48 17.52 2 12 2z" opacity="0.4"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );
  // Facebook
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.885v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z"/>
    </svg>
  );
}

const PGO_PLATFORMS = [
  { id:"ptc",      label:"Trainer Club" },
  { id:"facebook", label:"Facebook"     },
];
const PCOL: Record<string, string> = {
  ptc:"#E3350D", facebook:"#1877F2",
};

// ── Description ────────────────────────────────────────────────
function PGODescription({ productType }: { productType: string }) {
  const { lang } = usePreferences();
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "📋 Instrucciones de entrega" : "📋 Delivery instructions"}</h4>
      <div className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
        <span>🎮</span>
        <p><strong style={{ color:"var(--text)" }}>{lang === "ES" ? "Equipo KidStore" : "KidStore Team"}</strong> — Pokémon GO (Android / iOS)</p>
      </div>

      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        <p className="text-xs font-bold mb-1" style={{ color:"var(--text)" }}>{lang === "ES" ? "❓ ¿Qué necesitamos?" : "❓ What do we need?"}</p>
        {(lang === "ES" ? [
          "Tu nombre de entrenador y el método de inicio de sesión (Pokémon Trainer Club o Facebook).",
          "La contraseña se coordina por WhatsApp al procesar el pedido — nunca se pide en la web.",
        ] : [
          "Your trainer name and login method (Pokémon Trainer Club or Facebook).",
          "The password is coordinated on WhatsApp when processing the order — never asked for on the website.",
        ]).map((t,i) => (
          <p key={i} className="text-xs flex gap-2" style={{ color:"var(--text-muted)" }}>
            <span>•</span><span>{t}</span>
          </p>
        ))}
      </div>

      {productType === "pokecoins" && (
        <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
          <p className="text-xs font-bold mb-2" style={{ color:"var(--text)" }}>{lang === "ES" ? "🪙 ¿Qué son las PokéCoins?" : "🪙 What are PokéCoins?"}</p>
          {[
            { icon:"🛒", text: lang === "ES" ? "La moneda virtual para comprar en la tienda de Pokémon GO." : "The virtual currency to buy in the Pokémon GO store." },
            { icon:"🥚", text: lang === "ES" ? "Compra incubadoras, pases de incursión y módulos cebo." : "Buy incubators, raid passes and lure modules." },
            { icon:"📦", text: lang === "ES" ? "Amplía tu almacenamiento de Pokémon y objetos." : "Expand your Pokémon and item storage." },
          ].map((item,i) => (
            <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
              <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl p-4 space-y-2" style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
        {[
          { icon:"⚡", text: lang === "ES" ? "Entrega en minutos directamente en tu cuenta." : "Delivery in minutes directly to your account." },
          { icon:"✅", text: lang === "ES" ? "100% garantizado. Si no se puede entregar, te devolvemos el dinero." : "100% guaranteed. If we can't deliver, we refund your money." },
          { icon:"🛡️", text: lang === "ES" ? "Nunca pedimos tu contraseña en la web. El acceso se coordina por WhatsApp." : "We never ask for your password on the website. Access is coordinated on WhatsApp." },
          { icon:"🌐", text: lang === "ES" ? "Disponible para cuentas de cualquier región (Global)." : "Available for accounts from any region (Global)." },
          { icon:"💬", text: lang === "ES" ? "Soporte disponible por WhatsApp o Messenger." : "Support available via WhatsApp or Messenger." },
        ].map((item,i) => (
          <div key={i} className="flex items-start gap-2 text-xs" style={{ color:"var(--text-muted)" }}>
            <span className="flex-shrink-0">{item.icon}</span><p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function PokemonGoProductClient({ slug }: { slug: string }) {
  const product = ALL_POKEMON_GO_PRODUCTS.find(p => p.slug === slug);
  if (!product) notFound();

  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const badge = useBadge();
  const p           = product;
  const discountPct = p.priceOld > p.price ? Math.round((1 - p.price / p.priceOld) * 100) : 0;

  const [platform,    setPlatform]    = useState<string | null>(null);
  const [whatsapp,    setWhatsapp]    = useState(false);
  const [addedCart,   setAddedCart]   = useState(false);
  const [fieldUser,   setFieldUser]   = useState("");
  const [fieldGame,   setFieldGame]   = useState("");
  const [errors,      setErrors]      = useState<Record<string, boolean>>({});

  const { addItem, isInCart }          = useCart();
  const { toggle: toggleWish, isWished } = useWishlist();
  const alreadyInCart = isInCart(p.slug);
  const wished        = isWished(p.slug);

  function validate() {
    if (whatsapp) return true;
    const e: Record<string, boolean> = {};
    if (!fieldUser.trim())  e.user     = true;
    if (!fieldGame.trim())  e.gameName = true;
    if (!platform)          e.platform = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildOrderData() {
    return {
      user:     fieldUser  || undefined,
      gameName: fieldGame  || undefined,
      platform: platform   || undefined,
    };
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
      game: "Pokémon GO", gameSlug: "pokemon-go",
    });
  }

  const inputStyle = (err?: boolean) => ({
    background:"var(--card)",
    border:`1px solid ${err ? "#EF4444" : "var(--border)"}`,
    color:"var(--text)",
  });

  return (
    <>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>

        {/* Tabs sticky */}
        <div className="sticky top-[66px] md:top-[107px] z-40 w-full"
          style={{ background:"var(--navbar-bg)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderBottom:"1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex justify-center overflow-x-auto" style={{ scrollbarWidth:"none" }}>
              <div className="flex">
                {TABS.map(tab => (
                  <Link key={tab.id} href={`/games/pokemon-go?tab=${tab.id}`}
                    className="flex-shrink-0 px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap"
                    style={{ color: p.tab === tab.id ? BRAND : "var(--text-muted)" }}>
                    {tab.label}
                    {p.tab === tab.id && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ background:`linear-gradient(90deg,${BRAND_DARK},${BRAND})` }}/>
                    )}
                  </Link>
                ))}
              </div>
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
            <Link href="/games/pokemon-go" className="hover:opacity-80">Pokémon GO</Link>
            <ChevronRight size={11}/>
            <Link href={`/games/pokemon-go?tab=${p.tab}`} className="hover:opacity-80">{lang==="EN" ? p.tabLabelEN || p.tabLabel : p.tabLabel}</Link>
            <ChevronRight size={11}/>
            <span style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* IZQUIERDA */}
            <div className="space-y-6">
              <div className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio:"4/3", background:`linear-gradient(135deg,rgba(250,204,21,0.15),rgba(15,23,42,0.85))`, border:"1px solid var(--border)" }}>
                <Image src={p.img} alt={lang==="EN" ? p.nameEN || p.name : p.name} fill className="object-contain p-8" priority/>
              </div>
              <div className="rounded-2xl p-6" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
                <PGODescription productType={p.productType}/>
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
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h1 className="text-2xl font-bold" style={{ color:"var(--text)" }}>{lang==="EN" ? p.nameEN || p.name : p.name}</h1>
                  <button onClick={handleWishlist}
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 mt-0.5"
                    style={{ background: wished ? "rgba(239,68,68,0.1)" : "var(--card)", border:`1.5px solid ${wished ? "rgba(239,68,68,0.4)" : "var(--border)"}` }}>
                    <Heart size={18} style={{ color: wished ? "#EF4444" : "var(--text-muted)" }} fill={wished ? "#EF4444" : "none"}/>
                  </button>
                </div>
                {p.subtitle && <p className="text-sm mt-0.5" style={{ color:BRAND }}>{lang==="EN" ? p.subtitleEN || p.subtitle : p.subtitle}</p>}
                <p className="text-xs mt-0.5" style={{ color:"var(--text-subtle)" }}>{p.format} · {p.region}</p>
              </div>

              {/* Precio */}
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold" style={{ color:BRAND }}>{formatPrice(p.price)}</p>
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

              {/* Cómo funciona la entrega */}
              <div className="rounded-xl p-4 flex gap-3"
                style={{ background:"rgba(59,130,246,0.07)", border:"1px solid rgba(59,130,246,0.2)" }}>
                <Shield size={15} className="text-blue-400 flex-shrink-0 mt-0.5"/>
                <div className="text-xs" style={{ color:"var(--text-muted)" }}>
                  <p className="font-semibold mb-0.5" style={{ color:"#60A5FA" }}>{lang === "ES" ? "Cómo funciona la entrega" : "How the delivery works"}</p>
                  <p>{lang === "ES" ? "Es con acceso a cuenta. Coordinamos el acceso contigo por WhatsApp al procesar tu pedido y nunca te pedimos tu contraseña en la web." : "This is via account access. We coordinate access with you on WhatsApp when processing your order and never ask for your password on the website."}</p>
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
                    style={{ color: whatsapp ? "#4ADE80" : BRAND }}>{lang === "ES" ? "Opción recomendada" : "Recommended option"}</p>
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

                  {/* Usuario */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.user ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "ES" ? "Usuario / Correo / Teléfono" : "User / Email / Phone"}
                      {errors.user && <span className="normal-case font-normal"> — {lang === "ES" ? "requerido" : "required"}</span>}
                    </label>
                    <input type="text" placeholder={lang === "ES" ? "tu_usuario / correo@email.com" : "your_user / email@example.com"}
                      value={fieldUser}
                      onChange={e => { setFieldUser(e.target.value); setErrors(prev => ({ ...prev, user:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.user)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : BRAND_DARK)}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.user ? "#EF4444" : "var(--border)")}/>
                  </div>

                  {/* Seguridad: nunca se pide la contraseña en la web */}
                  <p className="text-[11px] flex items-start gap-1.5 -mt-1" style={{ color:"var(--text-subtle)" }}>
                    <span aria-hidden>🔒</span> {t.form.noPasswordNote}
                  </p>

                  {/* Nombre en el juego */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                      style={{ color: errors.gameName ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "ES" ? "Nombre de entrenador" : "Trainer name"}
                      {errors.gameName && <span className="normal-case font-normal"> — {lang === "ES" ? "requerido" : "required"}</span>}
                    </label>
                    <input type="text" placeholder={lang === "ES" ? "TuNombreDeEntrenador" : "YourTrainerName"}
                      value={fieldGame}
                      onChange={e => { setFieldGame(e.target.value); setErrors(prev => ({ ...prev, gameName:false })); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                      style={inputStyle(errors.gameName)}
                      onFocus={e => (e.currentTarget.style.borderColor = errors.gameName ? "#EF4444" : BRAND_DARK)}
                      onBlur={e  => (e.currentTarget.style.borderColor = errors.gameName ? "#EF4444" : "var(--border)")}/>
                  </div>

                  {/* Plataforma */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider mb-2 block"
                      style={{ color: errors.platform ? "#EF4444" : "var(--text-subtle)" }}>
                      {lang === "ES" ? "Método de acceso a Pokémon GO" : "Pokémon GO access method"}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {PGO_PLATFORMS.map(pl => {
                        const color  = PCOL[pl.id] ?? "#666";
                        const active = platform === pl.id;
                        return (
                          <button key={pl.id}
                            onClick={() => { setPlatform(active ? null : pl.id); setErrors(prev => ({ ...prev, platform:false })); }}
                            className="flex flex-col items-center gap-2 py-4 px-2 rounded-xl text-center transition-all"
                            style={{
                              background: active ? `${color}18` : "var(--card)",
                              border:`1.5px solid ${active ? color : "var(--border)"}`,
                              boxShadow: active ? `0 0 0 3px ${color}18` : "none",
                            }}>
                            <span style={{ color: active ? color : "var(--text-muted)" }}>
                              <PlatformIcon id={pl.id} size={24}/>
                            </span>
                            <span className="text-[11px] font-semibold leading-tight"
                              style={{ color: active ? color : "var(--text-muted)" }}>{pl.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.platform && (
                      <p className="text-[11px] mt-1.5 font-semibold" style={{ color:"#EF4444" }}>
                        {lang === "ES" ? "Selecciona tu método de acceso" : "Select your access method"}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-4 text-xs space-y-2"
                  style={{ background:"rgba(37,211,102,0.06)", border:"1px solid rgba(37,211,102,0.2)", color:"var(--text-muted)" }}>
                  <p className="font-semibold" style={{ color:"var(--text)" }}>{lang === "ES" ? "¿Cómo funciona?" : "How does it work?"}</p>
                  <p>1. {lang === "ES" ? <>Haz clic en <strong style={{ color:"var(--text)" }}>{t.product.buyNow}</strong> y te redirigiremos a WhatsApp.</> : <>Click <strong style={{ color:"var(--text)" }}>{t.product.buyNow}</strong> and we will redirect you to WhatsApp.</>}</p>
                  <p>2. {lang === "ES" ? "Envíanos el nombre del producto y los datos de tu cuenta Pokémon GO." : "Send us the product name and your Pokémon GO account details."}</p>
                  <p>3. {lang === "ES" ? "Nuestro equipo procesará tu pedido en minutos." : "Our team will process your order in minutes."}</p>
                </div>
              )}

              {/* Botones */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{
                    background: alreadyInCart ? `rgba(250,204,21,0.1)` : "var(--card)",
                    border:`1.5px solid ${alreadyInCart || addedCart ? BRAND_DARK : "var(--border)"}`,
                    color: BRAND,
                  }}>
                  {addedCart ? <Check size={16}/> : <ShoppingCart size={16}/>}
                  {addedCart ? t.product.added : alreadyInCart ? t.product.inCart : t.product.addToCart}
                </button>
                <button onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{ background:`linear-gradient(135deg,${BRAND_DARK},#A16207)`, color:"#0f172a", boxShadow:`0 4px 20px ${BRAND}40` }}>
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
