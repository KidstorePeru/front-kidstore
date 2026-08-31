"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePreferences } from "@/context/PreferencesContext";
import { Shield, FileText, CreditCard, Package, Truck, RefreshCw, Mail, AlertCircle, Gamepad2, UserCheck, ArrowRight } from "lucide-react";

export default function TermsPage() {
  const { lang } = usePreferences();
  const isEN = lang === "EN";

  return (
    <>
      <Navbar/>
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

        {/* ═══ Hero ═══ */}
        <div className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #4C1D95 100%)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px)", backgroundSize: "28px 28px" }}/>
          <div className="absolute -left-32 top-0 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(167,139,250,0.25),transparent 70%)" }}/>
          <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(234,88,12,0.15),transparent 70%)" }}/>

          <div className="max-w-[860px] mx-auto px-4 lg:px-8 py-16 md:py-20 text-center relative z-10">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
              <Shield size={30} className="text-white"/>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {isEN ? "Terms & Conditions" : "T\u00e9rminos y Condiciones"}
            </h1>
            <p className="text-sm text-white/50">
              {isEN ? "Last updated: March 30, 2026" : "\u00daltima actualizaci\u00f3n: 30 de marzo de 2026"}
            </p>
          </div>
        </div>

        {/* ═══ Content ═══ */}
        <div className="max-w-[860px] mx-auto px-4 lg:px-8 py-10">

          {/* Intro */}
          <div className="rounded-2xl p-6 mb-8 relative overflow-hidden"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(124,58,237,0.06),transparent 70%)" }}/>
            <p className="text-sm leading-[1.8] relative z-10" style={{ color: "var(--text-muted)" }}>
              {isEN
                ? <>These <strong style={{ color: "var(--text)" }}>Terms and Conditions</strong> govern the use of the KidStore website and the purchase of digital products offered. By accessing, browsing or purchasing, you accept these Terms.</>
                : <>Estos <strong style={{ color: "var(--text)" }}>T&eacute;rminos y Condiciones</strong> regulan el uso del sitio web KidStore y la compra de productos digitales ofrecidos. Al acceder, navegar o comprar, aceptas estos T&eacute;rminos.</>}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-5">

            {/* 1 */}
            <Section icon={<Gamepad2 size={18}/>} title={isEN ? "1. What we offer" : "1. Qu\u00e9 ofrecemos"}>
              <P isEN={isEN}
                en={<>KidStore is a <strong>digital marketplace</strong> specializing in in-game currency recharges and digital products for multiple games: <strong>Fortnite, Roblox, Genshin Impact, Honkai Star Rail, Zenless Zone Zero, Wuthering Waves, Marvel Rivals, Wild Rift, Pokemon GO, Honor of Kings, Teamfight Tactics</strong> and <strong>Discord Nitro</strong>.</>}
                es={<>KidStore es un <strong>marketplace digital</strong> especializado en recargas de monedas in-game y productos digitales para m&uacute;ltiples juegos: <strong>Fortnite, Roblox, Genshin Impact, Honkai Star Rail, Zenless Zone Zero, Wuthering Waves, Marvel Rivals, Wild Rift, Pokemon GO, Honor of Kings, Teamfight Tactics</strong> y <strong>Discord Nitro</strong>.</>}/>
            </Section>

            {/* 2 */}
            <Section icon={<AlertCircle size={18}/>} title={isEN ? "2. No affiliation" : "2. No afiliaci\u00f3n"}>
              <P isEN={isEN}
                en={<>KidStore is <strong>not affiliated, sponsored or approved</strong> by Epic Games, miHoYo/HoYoverse, Riot Games, Niantic, Roblox Corporation, Discord Inc. or any other game developer. All trademarks are property of their respective owners.</>}
                es={<>KidStore <strong>no est&aacute; afiliado, patrocinado ni aprobado</strong> por Epic Games, miHoYo/HoYoverse, Riot Games, Niantic, Roblox Corporation, Discord Inc. ni ning&uacute;n otro desarrollador. Todas las marcas son propiedad de sus respectivos due&ntilde;os.</>}/>
            </Section>

            {/* 3 */}
            <Section icon={<UserCheck size={18}/>} title={isEN ? "3. Customer requirements" : "3. Requisitos del cliente"}>
              <Bullets isEN={isEN}
                en={[
                  <>Provide the <strong>correct account data</strong> required for each game (username, UID, credentials)</>,
                  <>Have your account <strong>in good standing</strong> and eligible to receive products</>,
                  <>Meet any <strong>game-specific requirements</strong> (e.g., gifting enabled in Fortnite, active 2FA)</>,
                  <>Respond to our team if <strong>additional information</strong> is needed for delivery</>,
                ]}
                es={[
                  <>Proporcionar los <strong>datos de cuenta correctos</strong> seg&uacute;n cada juego (usuario, UID, credenciales)</>,
                  <>Tener tu cuenta <strong>en buen estado</strong> y habilitada para recibir productos</>,
                  <>Cumplir los <strong>requisitos espec&iacute;ficos</strong> de cada juego (ej: gifting activado en Fortnite, 2FA activo)</>,
                  <>Responder a nuestro equipo si se necesita <strong>informaci&oacute;n adicional</strong> para la entrega</>,
                ]}/>
            </Section>

            {/* 4 */}
            <Section icon={<CreditCard size={18}/>} title={isEN ? "4. Payment methods" : "4. M\u00e9todos de pago"}>
              <P isEN={isEN}
                en={<>All payments are <strong>verified manually</strong> by our team before processing your order:</>}
                es={<>Todos los pagos son <strong>verificados manualmente</strong> por nuestro equipo antes de procesar tu pedido:</>}/>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {[
                  { label: isEN ? "Peru" : "Per\u00fa", methods: "Yape, Plin" },
                  { label: isEN ? "Bank transfer" : "Transferencia", methods: "BCP, Interbank, BBVA" },
                  { label: isEN ? "International" : "Internacional", methods: "PayPal, Binance Pay" },
                  { label: isEN ? "Spain" : "Espa\u00f1a", methods: "Bizum" },
                ].map(g => (
                  <div key={g.label} className="rounded-xl p-4"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--brand-light)" }}>{g.label}</p>
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{g.methods}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* 5 */}
            <Section icon={<Package size={18}/>} title={isEN ? "5. Available products" : "5. Productos disponibles"}>
              <P isEN={isEN}
                en={<>We sell <strong>in-game currencies</strong> (V-Bucks, Robux, Genesis Crystals, Wild Cores, Lattice, Pok&eacute;Coins, Tokens, TFT Coins, etc.), <strong>battle passes</strong>, <strong>subscriptions</strong> (Fortnite Club, Welkin Moon, Discord Nitro) and <strong>server boosts</strong>. Each <Link href="/games" className="font-semibold underline" style={{ color: "var(--brand-light)" }}>game page</Link> shows the full product catalog.</>}
                es={<>Vendemos <strong>monedas in-game</strong> (V-Bucks, Robux, Cristales G&eacute;nesis, Wild Cores, Lattice, Pok&eacute;Monedas, Tokens, TFT Coins, etc.), <strong>pases de batalla</strong>, <strong>suscripciones</strong> (Club Fortnite, Welkin Moon, Discord Nitro) y <strong>server boosts</strong>. Cada <Link href="/games" className="font-semibold underline" style={{ color: "var(--brand-light)" }}>p&aacute;gina de juego</Link> muestra el cat&aacute;logo completo.</>}/>
            </Section>

            {/* 6 */}
            <Section icon={<FileText size={18}/>} title={isEN ? "6. Purchase process" : "6. Proceso de compra"}>
              <Bullets isEN={isEN} numbered
                en={[
                  "Select the game and product you want to buy",
                  "Fill in the required account data for delivery",
                  "Choose your preferred payment method",
                  "Complete the payment and send the receipt",
                  "Our team verifies the payment and processes the order",
                  "You receive the product in your game account",
                ]}
                es={[
                  "Selecciona el juego y el producto que deseas comprar",
                  "Completa los datos de cuenta requeridos para la entrega",
                  "Elige tu m\u00e9todo de pago preferido",
                  "Realiza el pago y env\u00eda el comprobante",
                  "Nuestro equipo verifica el pago y procesa el pedido",
                  "Recibes el producto en tu cuenta del juego",
                ]}/>
            </Section>

            {/* 7 */}
            <Section icon={<Mail size={18}/>} title={isEN ? "7. Notifications" : "7. Notificaciones"}>
              <P isEN={isEN}
                en={<>You will receive <strong>email notifications</strong> when your payment is approved and when your order is delivered. You can also track the status of your orders from your <Link href="/profile?tab=pedidos" className="font-semibold underline" style={{ color: "var(--brand-light)" }}>profile</Link>.</>}
                es={<>Recibir&aacute;s <strong>notificaciones por correo</strong> cuando tu pago sea aprobado y cuando tu pedido sea entregado. Tambi&eacute;n puedes seguir el estado de tus pedidos desde tu <Link href="/profile?tab=pedidos" className="font-semibold underline" style={{ color: "var(--brand-light)" }}>perfil</Link>.</>}/>
            </Section>

            {/* 8 */}
            <Section icon={<Truck size={18}/>} title={isEN ? "8. Delivery & contingencies" : "8. Entrega y contingencias"}>
              <P isEN={isEN}
                en={<>Delivery times are <strong>estimated</strong> and may vary by product (typically <strong>5 minutes to 12 hours</strong>). Delivery is considered complete when the product is credited to your game account. If delivery cannot be completed due to causes beyond KidStore&rsquo;s control, we offer <strong>retries, exchanges or store credit</strong>.</>}
                es={<>Los tiempos de entrega son <strong>estimados</strong> y pueden variar seg&uacute;n el producto (t&iacute;picamente entre <strong>5 minutos y 12 horas</strong>). La entrega se considera completada cuando el producto se acredita en tu cuenta del juego. Si no puede completarse por causas ajenas a KidStore, ofrecemos <strong>reintentos, cambios o cr&eacute;dito en la tienda</strong>.</>}/>
            </Section>

            {/* 9 */}
            <Section icon={<RefreshCw size={18}/>} title={isEN ? "9. Refunds" : "9. Reembolsos"}>
              <P isEN={isEN}
                en={<>Due to the digital nature of the products, <strong>all purchases are final</strong> once delivered. If there is a problem attributable to KidStore (non-delivery, wrong product, duplicate charge), we will resolve it with a retry, exchange or store credit. See our <Link href="/refunds" className="font-semibold underline" style={{ color: "var(--brand-light)" }}>Refund Policy</Link> for full details.</>}
                es={<>Por la naturaleza digital de los productos, <strong>todas las compras son finales</strong> una vez entregadas. Si hay un problema atribuible a KidStore (no entrega, producto equivocado, cobro duplicado), lo resolveremos con un reintento, cambio o cr&eacute;dito. Consulta nuestra <Link href="/refunds" className="font-semibold underline" style={{ color: "var(--brand-light)" }}>Pol&iacute;tica de Reembolsos</Link> para m&aacute;s detalles.</>}/>
            </Section>

            {/* 10 */}
            <Section icon={<Mail size={18}/>} title={isEN ? "10. Contact" : "10. Contacto"}>
              <P isEN={isEN}
                en={<>For inquiries, <Link href="/contact" className="font-semibold underline" style={{ color: "var(--brand-light)" }}>contact us</Link> through our support channels: <strong>WhatsApp, Discord, Instagram, Facebook</strong> or <strong>TikTok</strong>.</>}
                es={<>Para consultas, <Link href="/contact" className="font-semibold underline" style={{ color: "var(--brand-light)" }}>cont&aacute;ctanos</Link> por nuestros canales de soporte: <strong>WhatsApp, Discord, Instagram, Facebook</strong> o <strong>TikTok</strong>.</>}/>
            </Section>

          </div>

          {/* CTA */}
          <div className="mt-10 rounded-2xl p-8 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(124,58,237,0.02))", border: "1px solid var(--border)" }}>
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(124,58,237,0.08),transparent 70%)" }}/>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-center">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {isEN ? "Have questions about these terms?" : "\u00bfTienes preguntas sobre estos t\u00e9rminos?"}
              </p>
              <div className="flex gap-3">
                <Link href="/faq" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                  style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  {isEN ? "FAQ" : "FAQ"}
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                  style={{ background: "var(--brand)", boxShadow: "0 4px 16px rgba(124,58,237,0.25)" }}>
                  {isEN ? "Contact us" : "Cont\u00e1ctanos"} <ArrowRight size={13}/>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer/>
    </>
  );
}

/* ── Reusable building blocks ── */
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl p-6 relative overflow-hidden"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,0.04),transparent 70%)" }}/>
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(124,58,237,0.06))", border: "1px solid rgba(124,58,237,0.15)", color: "var(--brand-light)" }}>
          {icon}
        </div>
        <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>{title}</h2>
      </div>
      <div className="relative z-10 ml-12">{children}</div>
    </section>
  );
}

function P({ isEN, en, es }: { isEN: boolean; en: React.ReactNode; es: React.ReactNode }) {
  return <p className="text-[13px] leading-[1.85]" style={{ color: "var(--text-muted)" }}>{isEN ? en : es}</p>;
}

function Bullets({ isEN, en, es, numbered }: { isEN: boolean; en: React.ReactNode[]; es: React.ReactNode[]; numbered?: boolean }) {
  const items = isEN ? en : es;
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-[13px] leading-[1.7]" style={{ color: "var(--text-muted)" }}>
          {numbered ? (
            <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
              style={{ background: "rgba(124,58,237,0.08)", color: "var(--brand-light)", border: "1px solid rgba(124,58,237,0.12)" }}>
              {i + 1}
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[9px]" style={{ background: "var(--brand-light)" }}/>
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
