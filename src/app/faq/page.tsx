"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePreferences } from "@/context/PreferencesContext";
import {
  HelpCircle, ChevronDown, MessageCircle, ArrowRight,
  Clock, CreditCard, Gamepad2, Coins, ShoppingCart,
  UserCheck, Package, RefreshCw, Headphones,
  Zap, Shield, Search,
} from "lucide-react";

interface FaqItem {
  icon: React.ReactNode;
  q: string;
  a: string;
  category: string;
}

/* ── Accordion Item ── */
function FaqAccordion({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "var(--card)",
        border: `1px solid ${open ? "rgba(124,58,237,0.4)" : "var(--border)"}`,
        boxShadow: open
          ? "0 8px 32px rgba(124,58,237,0.1), 0 0 0 1px rgba(124,58,237,0.05)"
          : "0 2px 8px rgba(0,0,0,0.03)",
      }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left transition-all"
        aria-expanded={open}>

        {/* Icon box */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            background: open
              ? "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.08))"
              : "var(--surface)",
            border: `1px solid ${open ? "rgba(124,58,237,0.25)" : "var(--border)"}`,
            color: open ? "var(--brand-light)" : "var(--text-subtle)",
            boxShadow: open ? "0 4px 12px rgba(124,58,237,0.1)" : "none",
          }}>
          {item.icon}
        </div>

        {/* Question */}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-bold leading-snug block" style={{ color: "var(--text)" }}>
            {item.q}
          </span>
        </div>

        {/* Chevron in circle */}
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            background: open ? "rgba(124,58,237,0.1)" : "var(--surface)",
            border: `1px solid ${open ? "rgba(124,58,237,0.2)" : "var(--border)"}`,
          }}>
          <ChevronDown size={14}
            className="transition-transform duration-300"
            style={{
              color: open ? "var(--brand-light)" : "var(--text-subtle)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}/>
        </div>
      </button>

      {/* Answer */}
      <div className="transition-all duration-400 overflow-hidden"
        style={{ maxHeight: open ? "600px" : "0px", opacity: open ? 1 : 0 }}>
        <div className="px-6 pb-6 pt-0">
          <div className="ml-14 rounded-xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, var(--surface), var(--card))",
              border: "1px solid var(--border)",
            }}>
            {/* Subtle corner glow */}
            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(124,58,237,0.05),transparent 70%)" }}/>
            <p className="text-[13px] leading-[1.8] whitespace-pre-line relative z-10" style={{ color: "var(--text-muted)" }}>
              {item.a}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function FaqPage() {
  const { lang } = usePreferences();
  const isEN = lang === "EN";
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const categories = [
    { id: "all",      label: isEN ? "All"       : "Todas",     icon: <HelpCircle size={13}/> },
    { id: "general",  label: "General",                        icon: <Gamepad2 size={13}/> },
    { id: "payment",  label: isEN ? "Payments"   : "Pagos",    icon: <CreditCard size={13}/> },
    { id: "delivery", label: isEN ? "Delivery"   : "Entrega",  icon: <Package size={13}/> },
    { id: "security", label: isEN ? "Security"   : "Seguridad", icon: <Shield size={13}/> },
  ];

  const faqs: FaqItem[] = [
    {
      icon: <Gamepad2 size={17}/>,
      category: "general",
      q: isEN
        ? "What games and products do you sell?"
        : "\u00bfQu\u00e9 juegos y productos venden?",
      a: isEN
        ? "We sell in-game currency recharges and digital products for 12 games and platforms:\n\n\u2022 Fortnite (V-Bucks, Packs, Battle Pass, Club)\n\u2022 Roblox (Robux)\n\u2022 Genshin Impact (Genesis Crystals, Welkin)\n\u2022 Honkai Star Rail (Oneiric Shards)\n\u2022 Zenless Zone Zero (Monochrome)\n\u2022 Wuthering Waves (Lunite)\n\u2022 Marvel Rivals (Lattice)\n\u2022 Wild Rift (Wild Cores)\n\u2022 Pokemon GO (Pok\u00e9Coins)\n\u2022 Honor of Kings (Tokens)\n\u2022 Teamfight Tactics (TFT Coins)\n\u2022 Discord (Nitro, Server Boosts)"
        : "Vendemos recargas de monedas in-game y productos digitales para 12 juegos y plataformas:\n\n\u2022 Fortnite (V-Bucks, Packs, Pase de Batalla, Club)\n\u2022 Roblox (Robux)\n\u2022 Genshin Impact (Cristales G\u00e9nesis, Welkin)\n\u2022 Honkai Star Rail (Esquirlas On\u00edricas)\n\u2022 Zenless Zone Zero (Monochrome)\n\u2022 Wuthering Waves (Lunita)\n\u2022 Marvel Rivals (Lattice)\n\u2022 Wild Rift (Wild Cores)\n\u2022 Pokemon GO (Pok\u00e9Monedas)\n\u2022 Honor of Kings (Tokens)\n\u2022 Teamfight Tactics (TFT Coins)\n\u2022 Discord (Nitro, Server Boosts)",
    },
    {
      icon: <Clock size={17}/>,
      category: "delivery",
      q: isEN
        ? "How long does delivery take after paying?"
        : "\u00bfCu\u00e1nto tarda la entrega despu\u00e9s de pagar?",
      a: isEN
        ? "Once we verify your payment, delivery usually takes between 5 minutes and 2 hours depending on the product and availability. Some products like Discord Nitro may take up to 12 hours.\n\nWe\u2019ll notify you by email when your payment is approved and when your order is delivered."
        : "Una vez que verificamos tu pago, la entrega suele tomar entre 5 minutos y 2 horas seg\u00fan el producto y la disponibilidad. Algunos productos como Discord Nitro pueden tardar hasta 12 horas.\n\nTe notificaremos por correo electr\u00f3nico cuando tu pago sea aprobado y cuando tu pedido sea entregado.",
    },
    {
      icon: <UserCheck size={17}/>,
      category: "delivery",
      q: isEN
        ? "What information do I need to place an order?"
        : "\u00bfQu\u00e9 informaci\u00f3n necesito para hacer un pedido?",
      a: isEN
        ? "It depends on the game:\n\n\u2022 Fortnite: Your Epic Display Name and the \u201cReceive Gifts\u201d option enabled\n\u2022 Genshin / Honkai / ZZZ / Wuthering Waves: Your HoYoverse account credentials\n\u2022 Roblox: Your account credentials\n\u2022 Marvel Rivals / Honor of Kings / Pokemon GO: Your UID or Player ID\n\u2022 Wild Rift / TFT: Your Riot account info\n\u2022 Discord: Your Discord email and password\n\nEach product page explains exactly what data is needed."
        : "Depende del juego:\n\n\u2022 Fortnite: Tu Epic Display Name y la opci\u00f3n \u201cRecibir regalos\u201d activada\n\u2022 Genshin / Honkai / ZZZ / Wuthering Waves: Credenciales de tu cuenta HoYoverse\n\u2022 Roblox: Credenciales de tu cuenta\n\u2022 Marvel Rivals / Honor of Kings / Pokemon GO: Tu UID o Player ID\n\u2022 Wild Rift / TFT: Informaci\u00f3n de tu cuenta Riot\n\u2022 Discord: Tu correo y contrase\u00f1a de Discord\n\nCada p\u00e1gina de producto explica exactamente qu\u00e9 datos se necesitan.",
    },
    {
      icon: <CreditCard size={17}/>,
      category: "payment",
      q: isEN
        ? "What payment methods do you accept?"
        : "\u00bfQu\u00e9 m\u00e9todos de pago aceptan?",
      a: isEN
        ? "We accept the following payment methods:\n\n\u2022 Peru: Yape, Plin\n\u2022 Bank transfer: BCP, Interbank, BBVA\n\u2022 International: PayPal, Binance Pay\n\u2022 Spain: Bizum\n\nAll payments are verified manually by our team. Once approved, we process your order immediately."
        : "Aceptamos los siguientes m\u00e9todos de pago:\n\n\u2022 Per\u00fa: Yape, Plin\n\u2022 Transferencia bancaria: BCP, Interbank, BBVA\n\u2022 Internacional: PayPal, Binance Pay\n\u2022 Espa\u00f1a: Bizum\n\nTodos los pagos son verificados manualmente por nuestro equipo. Una vez aprobados, procesamos tu pedido de inmediato.",
    },
    {
      icon: <ShoppingCart size={17}/>,
      category: "general",
      q: isEN
        ? "How does the purchase process work?"
        : "\u00bfC\u00f3mo funciona el proceso de compra?",
      a: isEN
        ? "1. Select the game and the product you want\n2. Fill in the required data for delivery (account, UID, etc.)\n3. Choose your payment method and complete the payment\n4. Send the receipt via WhatsApp or through the checkout form\n5. Our team verifies the payment and processes the delivery\n6. You receive the product in your game account"
        : "1. Selecciona el juego y el producto que deseas\n2. Completa los datos requeridos para la entrega (cuenta, UID, etc.)\n3. Elige tu m\u00e9todo de pago y realiza el pago\n4. Env\u00eda el comprobante por WhatsApp o a trav\u00e9s del formulario de checkout\n5. Nuestro equipo verifica el pago y procesa la entrega\n6. Recibes el producto en tu cuenta del juego",
    },
    {
      icon: <Shield size={17}/>,
      category: "security",
      q: isEN
        ? "Is it safe to share my account data?"
        : "\u00bfEs seguro compartir mis datos de cuenta?",
      a: isEN
        ? "Yes. We only use your account data to process the delivery. We never change passwords, make unauthorized purchases, or share your information with third parties. For games that require credentials (Genshin, Roblox, Discord), we access your account only for the time needed to complete the delivery.\n\nFor games that use UID/Player ID (Marvel Rivals, Honor of Kings, Pokemon GO), we don\u2019t need your password at all."
        : "S\u00ed. Solo usamos tus datos de cuenta para procesar la entrega. Nunca cambiamos contrase\u00f1as, hacemos compras no autorizadas ni compartimos tu informaci\u00f3n con terceros. Para juegos que requieren credenciales (Genshin, Roblox, Discord), accedemos a tu cuenta solo el tiempo necesario para completar la entrega.\n\nPara juegos que usan UID/Player ID (Marvel Rivals, Honor of Kings, Pokemon GO), no necesitamos tu contrase\u00f1a.",
    },
    {
      icon: <RefreshCw size={17}/>,
      category: "payment",
      q: isEN
        ? "Can I request a refund?"
        : "\u00bfPuedo pedir un reembolso?",
      a: isEN
        ? "Due to the digital nature of the products, all purchases are final once delivered. However, if there\u2019s a problem attributable to KidStore (non-delivery, wrong product, duplicate charge), we\u2019ll resolve it with a retry, exchange, or store credit.\n\nIf your payment hasn\u2019t been approved yet, you can request a cancellation. See our Refund Policy for full details."
        : "Debido a la naturaleza digital de los productos, todas las compras son finales una vez entregadas. Sin embargo, si hay un problema atribuible a KidStore (no entrega, producto equivocado, cobro duplicado), lo resolveremos con un reintento, cambio o cr\u00e9dito en la tienda.\n\nSi tu pago a\u00fan no ha sido aprobado, puedes solicitar la cancelaci\u00f3n. Consulta nuestra Pol\u00edtica de Reembolsos para m\u00e1s detalles.",
    },
    {
      icon: <Coins size={17}/>,
      category: "payment",
      q: isEN
        ? "Are the prices in Peruvian Soles (PEN)?"
        : "\u00bfLos precios est\u00e1n en Soles peruanos (PEN)?",
      a: isEN
        ? "Yes, all base prices are in Peruvian Soles (S/). However, you can switch the display currency to USD or EUR using the currency selector in the navbar. The conversion is done automatically using the daily exchange rate.\n\nPayPal and Binance payments are calculated in USD/EUR with a small service fee."
        : "S\u00ed, todos los precios base est\u00e1n en Soles peruanos (S/). Sin embargo, puedes cambiar la moneda de visualizaci\u00f3n a USD o EUR usando el selector de moneda en la barra de navegaci\u00f3n. La conversi\u00f3n se realiza autom\u00e1ticamente usando el tipo de cambio diario.\n\nLos pagos por PayPal y Binance se calculan en USD/EUR con una peque\u00f1a comisi\u00f3n de servicio.",
    },
    {
      icon: <Headphones size={17}/>,
      category: "general",
      q: isEN
        ? "What are your business hours?"
        : "\u00bfEn qu\u00e9 horario atienden?",
      a: isEN
        ? "Our support team is available Monday to Sunday from 9:00 AM to 12:00 AM (Peru time, GMT-5).\n\nYou can contact us via WhatsApp, Discord, Instagram, Facebook or TikTok. WhatsApp usually has the fastest response time."
        : "Nuestro equipo de soporte est\u00e1 disponible de lunes a domingo de 9:00 AM a 12:00 AM (hora Per\u00fa, GMT-5).\n\nPuedes contactarnos por WhatsApp, Discord, Instagram, Facebook o TikTok. WhatsApp suele tener el tiempo de respuesta m\u00e1s r\u00e1pido.",
    },
  ];

  const filtered = faqs.filter(f => {
    const matchCat = filter === "all" || f.category === filter;
    const matchSearch = !search || f.q.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar/>
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

        {/* ═══ Hero ═══ */}
        <div className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #4C1D95 100%)" }}>
          {/* Patterns */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px)", backgroundSize: "28px 28px" }}/>
          <div className="absolute -left-32 top-0 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(167,139,250,0.25),transparent 70%)" }}/>
          <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(234,88,12,0.15),transparent 70%)" }}/>

          <div className="max-w-[860px] mx-auto px-4 lg:px-8 py-16 md:py-20 text-center relative z-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
              <HelpCircle size={30} className="text-white"/>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {isEN ? "Frequently Asked Questions" : "Preguntas Frecuentes"}
            </h1>
            <p className="text-sm md:text-base text-white/60 max-w-md mx-auto mb-8">
              {isEN
                ? "Everything you need to know before placing your order"
                : "Todo lo que necesitas saber antes de hacer tu pedido"}
            </p>

            {/* Search bar */}
            <div className="max-w-lg mx-auto relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"/>
              <input
                type="text"
                placeholder={isEN ? "Search questions..." : "Buscar preguntas..."}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none text-white placeholder:text-white/30"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
              />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8">
              {[
                { icon: <Zap size={14}/>,      val: "9",      label: isEN ? "answers" : "respuestas" },
                { icon: <Gamepad2 size={14}/>,  val: "12",     label: isEN ? "games"   : "juegos" },
                { icon: <CreditCard size={14}/>,val: "8",      label: isEN ? "payment methods" : "m\u00e9todos de pago" },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-white/50">{s.icon}</span>
                  <span className="text-sm font-bold text-white">{s.val}</span>
                  <span className="text-xs text-white/40">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ Content ═══ */}
        <div className="max-w-[860px] mx-auto px-4 lg:px-8 py-10">

          {/* Category filter pills */}
          <div className="flex items-center gap-2 flex-wrap mb-8 -mt-6 relative z-20 justify-center">
            {categories.map(cat => (
              <button key={cat.id}
                onClick={() => setFilter(cat.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: filter === cat.id ? "var(--brand)" : "var(--card)",
                  border: `1px solid ${filter === cat.id ? "var(--brand)" : "var(--border)"}`,
                  color: filter === cat.id ? "#fff" : "var(--text-muted)",
                  boxShadow: filter === cat.id ? "0 4px 16px rgba(124,58,237,0.25)" : "0 2px 8px rgba(0,0,0,0.04)",
                }}>
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ items */}
          <div className="space-y-3 mb-12">
            {filtered.length === 0 ? (
              <div className="text-center py-16 rounded-2xl"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <Search size={32} className="mx-auto mb-3" style={{ color: "var(--text-subtle)" }}/>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>
                  {isEN ? "No results found" : "No se encontraron resultados"}
                </p>
                <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
                  {isEN ? "Try a different search or category" : "Intenta con otra b\u00fasqueda o categor\u00eda"}
                </p>
              </div>
            ) : (
              filtered.map((faq, i) => (
                <FaqAccordion key={i} item={faq} index={i}/>
              ))
            )}
          </div>

          {/* ═══ Contact CTA ═══ */}
          <div className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(124,58,237,0.02))",
              border: "1px solid var(--border)",
            }}>
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(124,58,237,0.1),transparent 70%)" }}/>
            <div className="absolute -left-16 -bottom-16 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(234,88,12,0.08),transparent 70%)" }}/>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.15)" }}>
                <MessageCircle size={28} style={{ color: "var(--brand-light)" }}/>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>
                  {isEN ? "Didn\u2019t find what you were looking for?" : "\u00bfNo encontraste lo que buscabas?"}
                </h3>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {isEN
                    ? "Our team is ready to help you. Contact us directly."
                    : "Nuestro equipo est\u00e1 listo para ayudarte. Cont\u00e1ctanos directamente."}
                </p>
              </div>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 hover:-translate-y-0.5 flex-shrink-0"
                style={{ background: "var(--brand)", boxShadow: "0 4px 24px rgba(124,58,237,0.3)" }}>
                {isEN ? "Contact support" : "Contactar soporte"}
                <ArrowRight size={15}/>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}
