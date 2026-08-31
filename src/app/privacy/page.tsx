"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePreferences } from "@/context/PreferencesContext";
import {
  ShieldCheck, Database, Eye, CreditCard, Cookie,
  UserCheck, Mail, AlertTriangle, ArrowRight, Lock,
} from "lucide-react";

export default function PrivacyPage() {
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
              <ShieldCheck size={30} className="text-white"/>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {isEN ? "Privacy Policy" : "Pol\u00edtica de Privacidad"}
            </h1>
            <p className="text-sm text-white/60 max-w-md mx-auto">
              {isEN ? "Your privacy is important to us" : "Tu privacidad es importante para nosotros"}
            </p>
          </div>
        </div>

        {/* ═══ Content ═══ */}
        <div className="max-w-[860px] mx-auto px-4 lg:px-8 py-10">

          {/* Intro + Notice */}
          <div className="rounded-2xl p-6 mb-4 relative overflow-hidden"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <p className="text-sm leading-[1.8]" style={{ color: "var(--text-muted)" }}>
              {isEN
                ? <><strong style={{ color: "var(--text)" }}>KidStore</strong> is committed to the security of our users' data. We handle your information responsibly and transparently.</>
                : <><strong style={{ color: "var(--text)" }}>KidStore</strong> est&aacute; comprometido con la seguridad de los datos de nuestros usuarios. Manejamos tu informaci&oacute;n de forma responsable y transparente.</>}
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-xl p-4 mb-8"
            style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#F59E0B" }}/>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {isEN
                ? <><strong>Note:</strong> This policy may change over time. We recommend reviewing this page periodically.</>
                : <><strong>Aviso:</strong> Esta pol&iacute;tica puede cambiar con el tiempo. Te recomendamos revisar esta p&aacute;gina peri&oacute;dicamente.</>}
            </p>
          </div>

          <div className="space-y-5">

            <Section icon={<Database size={18}/>} title={isEN ? "Information we collect" : "Informaci\u00f3n que recopilamos"}>
              <Bullets items={isEN
                ? [<><strong>Game account data</strong> (username, UID, credentials — only for delivery)</>, <><strong>Email address</strong></>, <><strong>Purchase and recharge history</strong></>, <><strong>Payment method used</strong> (we do not store card or bank data)</>]
                : [<><strong>Datos de cuenta de juego</strong> (usuario, UID, credenciales &mdash; solo para entrega)</>, <><strong>Direcci&oacute;n de correo electr&oacute;nico</strong></>, <><strong>Historial de compras y recargas</strong></>, <><strong>M&eacute;todo de pago utilizado</strong> (no almacenamos datos de tarjetas ni bancarios)</>]
              }/>
            </Section>

            <Section icon={<Eye size={18}/>} title={isEN ? "How we use your information" : "C\u00f3mo usamos tu informaci\u00f3n"}>
              <Bullets items={isEN
                ? ["Process and complete your orders", "Maintain a transaction record", <>Send <strong>email notifications</strong> about payment approvals and deliveries</>, "Improve our products and services"]
                : ["Procesar y completar tus pedidos", "Mantener un registro de transacciones", <>Enviar <strong>notificaciones por correo</strong> sobre aprobaci&oacute;n de pagos y entregas</>, "Mejorar nuestros productos y servicios"]
              }/>
            </Section>

            <Section icon={<CreditCard size={18}/>} title={isEN ? "Payment data" : "Datos de pago"}>
              <P>
                {isEN
                  ? <>All payments (<strong>Yape, Plin, BCP, Interbank, BBVA, PayPal, Binance Pay, Bizum</strong>) are verified manually by our team. We only record the <strong>payment reference and amount</strong>. KidStore <strong>never stores</strong> sensitive bank data, card numbers or wallet addresses.</>
                  : <>Todos los pagos (<strong>Yape, Plin, BCP, Interbank, BBVA, PayPal, Binance Pay, Bizum</strong>) son verificados manualmente por nuestro equipo. Solo registramos la <strong>referencia y monto del pago</strong>. KidStore <strong>nunca almacena</strong> datos bancarios sensibles, n&uacute;meros de tarjeta ni direcciones de billetera.</>}
              </P>
              <div className="mt-3 rounded-xl p-4" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-subtle)" }}>
                  {isEN
                    ? <>For <strong>PayPal</strong> and <strong>Binance Pay</strong>, your financial data is processed exclusively by those platforms under their own privacy and security policies.</>
                    : <>Para <strong>PayPal</strong> y <strong>Binance Pay</strong>, tus datos financieros son procesados exclusivamente por esas plataformas bajo sus propias pol&iacute;ticas de privacidad y seguridad.</>}
                </p>
              </div>
            </Section>

            <Section icon={<Lock size={18}/>} title={isEN ? "Security" : "Seguridad"}>
              <P>
                {isEN
                  ? <>KidStore uses <strong>up-to-date security systems</strong>. Your password is stored <strong>encrypted</strong> and never shared. We access game accounts <strong>only for the time needed</strong> to complete deliveries.</>
                  : <>KidStore utiliza <strong>sistemas de seguridad actualizados</strong>. Tu contrase&ntilde;a se almacena de forma <strong>cifrada</strong> y nunca se comparte. Accedemos a las cuentas de juego <strong>solo el tiempo necesario</strong> para completar las entregas.</>}
              </P>
            </Section>

            <Section icon={<Cookie size={18}/>} title="Cookies">
              <P>
                {isEN
                  ? <>We use <strong>essential cookies only</strong> for site functionality (session, language and theme). We do <strong>not</strong> use advertising tracking cookies.</>
                  : <>Usamos <strong>cookies esenciales</strong> para el funcionamiento del sitio (sesi&oacute;n, idioma y tema). <strong>No</strong> usamos cookies de seguimiento publicitario.</>}
              </P>
            </Section>

            <Section icon={<UserCheck size={18}/>} title={isEN ? "Your rights" : "Tus derechos"}>
              <Bullets items={isEN
                ? [<>You can request <strong>access, correction or deletion</strong> of your data</>, <>We do <strong>not sell or transfer</strong> your information to third parties</>]
                : [<>Puedes solicitar <strong>acceso, correcci&oacute;n o eliminaci&oacute;n</strong> de tus datos</>, <><strong>No vendemos ni cedemos</strong> tu informaci&oacute;n a terceros</>]
              }/>
            </Section>

            <Section icon={<Mail size={18}/>} title={isEN ? "Contact" : "Contacto"}>
              <P>
                {isEN
                  ? <>For privacy inquiries, <Link href="/contact" className="font-semibold underline" style={{ color: "var(--brand-light)" }}>contact us</Link> through our support channels.</>
                  : <>Para consultas sobre privacidad, <Link href="/contact" className="font-semibold underline" style={{ color: "var(--brand-light)" }}>cont&aacute;ctanos</Link> a trav&eacute;s de nuestros canales de soporte.</>}
              </P>
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
                <Link href="/refunds" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                  style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                  {isEN ? "Refunds" : "Reembolsos"}
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

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] leading-[1.85]" style={{ color: "var(--text-muted)" }}>{children}</p>;
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-[13px] leading-[1.7]" style={{ color: "var(--text-muted)" }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[9px]" style={{ background: "var(--brand-light)" }}/>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
