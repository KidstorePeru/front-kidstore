"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePreferences } from "@/context/PreferencesContext";
import {
  RefreshCw, Ban, CreditCard, Coins, CheckCircle,
  XCircle, Bell, MessageCircle, AlertTriangle, ArrowRight,
} from "lucide-react";

export default function RefundsPage() {
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
              <RefreshCw size={30} className="text-white"/>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {isEN ? "Refund Policy" : "Pol\u00edtica de Reembolsos"}
            </h1>
            <p className="text-sm text-white/50">
              {isEN ? "Last updated: March 30, 2026" : "\u00daltima actualizaci\u00f3n: 30 de marzo de 2026"}
            </p>
          </div>
        </div>

        {/* ═══ Content ═══ */}
        <div className="max-w-[860px] mx-auto px-4 lg:px-8 py-10">

          {/* Important notice */}
          <div className="flex items-start gap-3 rounded-xl p-4 mb-8"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#EF4444" }}/>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {isEN
                ? <><strong>Important:</strong> By purchasing on KidStore, you accept this policy.</>
                : <><strong>Importante:</strong> Al comprar en KidStore, aceptas esta pol&iacute;tica.</>}
            </p>
          </div>

          <div className="space-y-5">

            {/* 1. All purchases are final */}
            <Section icon={<Ban size={18}/>} title={isEN ? "1. All purchases are final" : "1. Todas las compras son finales"}>
              <P>
                {isEN
                  ? <>Due to the <strong>digital nature</strong> of the products, all purchases are <strong>final once delivered</strong>. We do not issue refunds to the original payment method. If there is a problem, we resolve it with a <strong>retry, exchange or store credit</strong>.</>
                  : <>Debido a la <strong>naturaleza digital</strong> de los productos, todas las compras son <strong>finales una vez entregadas</strong>. No realizamos reembolsos al m&eacute;todo de pago original. Si hay un problema, lo resolvemos con un <strong>reintento, cambio o cr&eacute;dito en la tienda</strong>.</>}
              </P>
            </Section>

            {/* 2. PayPal and Binance */}
            <Section icon={<CreditCard size={18}/>} title={isEN ? "2. PayPal & Binance payments" : "2. Pagos por PayPal y Binance"}>
              <P>
                {isEN
                  ? <>If you paid through <strong>PayPal</strong> or <strong>Binance Pay</strong>, you can open a dispute or claim directly with the corresponding platform according to their own deadlines and conditions. KidStore will cooperate by providing the necessary information to resolve the case.</>
                  : <>Si realizaste el pago a trav&eacute;s de <strong>PayPal</strong> o <strong>Binance Pay</strong>, puedes abrir una disputa o reclamo directamente con la plataforma correspondiente seg&uacute;n sus propios plazos y condiciones. KidStore colaborar&aacute; proporcionando la informaci&oacute;n necesaria para resolver el caso.</>}
              </P>
              <div className="flex gap-3 mt-4">
                {["PayPal", "Binance Pay"].map(g => (
                  <span key={g} className="px-4 py-2 rounded-xl text-xs font-bold"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
                    {g}
                  </span>
                ))}
              </div>
            </Section>

            {/* 3. Other methods */}
            <Section icon={<CreditCard size={18}/>} title={isEN ? "3. Other payment methods" : "3. Otros m\u00e9todos de pago"}>
              <P>
                {isEN
                  ? <>Payments via <strong>Yape, Plin, BCP, Interbank, BBVA</strong> and <strong>Bizum</strong> are <strong>non-refundable</strong> once the product has been delivered. If the payment has not yet been approved by our team, you can request cancellation.</>
                  : <>Los pagos por <strong>Yape, Plin, BCP, Interbank, BBVA</strong> y <strong>Bizum</strong> <strong>no son reembolsables</strong> una vez que el producto ha sido entregado. Si el pago a&uacute;n no ha sido aprobado por nuestro equipo, puedes solicitar la cancelaci&oacute;n.</>}
              </P>
              <div className="flex gap-2 mt-4 flex-wrap">
                {["Yape", "Plin", "BCP", "Interbank", "BBVA", "Bizum"].map(m => (
                  <span key={m} className="px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                    {m}
                  </span>
                ))}
              </div>
            </Section>

            {/* 4. Store credit */}
            <Section icon={<Coins size={18}/>} title={isEN ? "4. Store credit" : "4. Cr\u00e9dito de tienda"}>
              <P>
                {isEN
                  ? <>If an internal refund is applicable, it will be issued exclusively as <strong>store credit</strong> for use on KidStore. Credit is <strong>not redeemable for cash</strong>.</>
                  : <>Si corresponde un reembolso interno, se realizar&aacute; exclusivamente como <strong>cr&eacute;dito de tienda</strong> para usar en KidStore. El cr&eacute;dito <strong>no es canjeable por dinero</strong>.</>}
              </P>
            </Section>

            {/* 5. When credit applies — YES */}
            <Section icon={<CheckCircle size={18}/>} title={isEN ? "5. When store credit may apply" : "5. Cu\u00e1ndo aplica cr\u00e9dito de tienda"}
              iconColor="#22C55E" iconBg="rgba(34,197,94,0.1)">
              <div className="space-y-3">
                {(isEN
                  ? [
                      { label: "Non-delivery",       desc: "Could not be completed due to causes attributable to KidStore" },
                      { label: "Product error",      desc: "A different item was delivered than what was purchased" },
                      { label: "Duplicate charge",   desc: "Duplicate charge for the same order" },
                      { label: "Prior cancellation", desc: "The order has not yet been processed by our team" },
                    ]
                  : [
                      { label: "No entrega",             desc: "No se pudo completar por causas atribuibles a KidStore" },
                      { label: "Error de producto",      desc: "Se entreg\u00f3 un \u00edtem distinto al comprado" },
                      { label: "Duplicaci\u00f3n de cobro", desc: "Cargo duplicado por el mismo pedido" },
                      { label: "Cancelaci\u00f3n previa",   desc: "El pedido a\u00fan no fue procesado por nuestro equipo" },
                    ]
                ).map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl p-4"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <CheckCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: "#22C55E" }}/>
                    <div>
                      <p className="text-sm font-bold mb-0.5" style={{ color: "var(--text)" }}>{item.label}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* 6. When NOT */}
            <Section icon={<XCircle size={18}/>} title={isEN ? "6. When refund does NOT apply" : "6. Cuando NO aplica reembolso"}
              iconColor="#EF4444" iconBg="rgba(239,68,68,0.1)">
              <div className="space-y-2.5">
                {(isEN
                  ? [
                      "The order appears as delivered in your game account",
                      "Incorrect data was provided and delivery was already completed",
                      "Restrictions or sanctions imposed by the game developer",
                      "Change of mind once the order has been processed",
                      "The product has already been used or consumed in-game",
                    ]
                  : [
                      "El pedido figura como entregado en tu cuenta del juego",
                      "Se proporcionaron datos incorrectos y la entrega ya se efect\u00fa\u00f3",
                      "Restricciones o sanciones impuestas por el desarrollador del juego",
                      "Arrepentimiento o cambio de opini\u00f3n una vez procesado",
                      "El producto ya fue usado o consumido dentro del juego",
                    ]
                ).map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[13px] leading-[1.7]" style={{ color: "var(--text-muted)" }}>
                    <XCircle size={14} className="flex-shrink-0 mt-[3px]" style={{ color: "#EF4444", opacity: 0.6 }}/>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* 7. Notifications */}
            <Section icon={<Bell size={18}/>} title={isEN ? "7. Notifications" : "7. Notificaciones"}>
              <P>
                {isEN
                  ? <>You will receive an <strong>email notification</strong> when your payment is approved and another when your order is delivered.</>
                  : <>Recibir&aacute;s una <strong>notificaci&oacute;n por correo</strong> cuando tu pago sea aprobado y otra cuando tu pedido sea entregado.</>}
              </P>
            </Section>

            {/* 8. How to request */}
            <Section icon={<MessageCircle size={18}/>} title={isEN ? "8. How to request a refund" : "8. C\u00f3mo solicitar un reembolso"}>
              <P>
                {isEN
                  ? <><Link href="/contact" className="font-semibold underline" style={{ color: "var(--brand-light)" }}>Contact us</Link> through our support channels and include:</>
                  : <><Link href="/contact" className="font-semibold underline" style={{ color: "var(--brand-light)" }}>Cont&aacute;ctanos</Link> por nuestros canales de soporte e incluye:</>}
              </P>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
                {(isEN
                  ? ["Order number", "Email", "Payment method", "Problem description", "Screenshots"]
                  : ["N\u00ba de pedido", "Email", "M\u00e9todo de pago", "Descripci\u00f3n del problema", "Capturas"]
                ).map((item) => (
                  <div key={item} className="flex items-center gap-2 px-3.5 py-3 rounded-xl text-xs font-semibold"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--brand-light)" }}/>
                    {item}
                  </div>
                ))}
              </div>
            </Section>

          </div>

          {/* CTA */}
          <div className="mt-10 rounded-2xl p-8 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(124,58,237,0.02))", border: "1px solid var(--border)" }}>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-center">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {isEN ? "See also:" : "Ver tambi\u00e9n:"}
              </p>
              <div className="flex gap-3">
                <Link href="/terms" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                  style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  {isEN ? "Terms" : "T\u00e9rminos"}
                </Link>
                <Link href="/privacy" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                  style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  {isEN ? "Privacy" : "Privacidad"}
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                  style={{ background: "var(--brand)", boxShadow: "0 4px 16px rgba(124,58,237,0.25)" }}>
                  {isEN ? "Contact" : "Contacto"} <ArrowRight size={13}/>
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

function Section({ icon, title, children, iconColor, iconBg }: { icon: React.ReactNode; title: string; children: React.ReactNode; iconColor?: string; iconBg?: string }) {
  return (
    <section className="rounded-2xl p-6 relative overflow-hidden"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(124,58,237,0.04),transparent 70%)" }}/>
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: iconBg ?? "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(124,58,237,0.06))",
            border: `1px solid ${iconColor ? iconColor + "25" : "rgba(124,58,237,0.15)"}`,
            color: iconColor ?? "var(--brand-light)",
          }}>
          {icon}
        </div>
        <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>{title}</h2>
      </div>
      <div className="relative z-10 ml-12">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] leading-[1.85]" style={{ color: "var(--text-muted)" }}>{children}</p>;
}
