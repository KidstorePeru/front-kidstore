"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePreferences } from "@/context/PreferencesContext";
import {
  MessageCircle, Clock, HelpCircle, ArrowRight,
  ChevronRight,
} from "lucide-react";

export default function ContactPage() {
  const { lang } = usePreferences();
  const isEN = lang === "EN";

  const channels = [
    {
      name: "WhatsApp",
      desc: isEN ? "Response in minutes" : "Respuesta en minutos",
      href: "https://wa.me/51983454837",
      color: "#25D366",
      svg: "M12.04 2A10 10 0 0 0 2 12.05a10 10 0 0 0 1.4 5.13L2 22l4.95-1.38A10 10 0 0 0 22 12.05 10 10 0 0 0 12.04 2Zm5.03 13.56c-.2.58-1.2 1.1-1.65 1.17-.44.06-.99.1-1.6-.1a14.6 14.6 0 0 1-1.45-.54 11.3 11.3 0 0 1-4.45-3.93 4.9 4.9 0 0 1-1.04-2.6c-.02-.97.37-1.44.72-1.6a.64.64 0 0 1 .5-.04c.15.04.35.06.48.37.15.35.53 1.28.57 1.37.05.1.08.2.02.32-.05.1-.08.17-.17.27-.08.1-.18.22-.26.3-.09.08-.18.17-.08.34.1.17.47.77 1 1.25.7.62 1.28.82 1.47.91.18.09.29.08.4-.04.1-.12.45-.52.57-.7.12-.18.24-.15.4-.09.17.06 1.06.5 1.24.59.18.09.3.13.34.21.05.07.05.42-.14 1Z",
    },
    {
      name: "Discord",
      desc: isEN ? "Community server" : "Servidor de la comunidad",
      href: "https://discord.gg/kidstoreperu",
      color: "#5865F2",
      svg: "M20.32 4.37A19.8 19.8 0 0 0 15.44 3c-.21.38-.46.89-.63 1.29a18.4 18.4 0 0 0-5.6 0A13 13 0 0 0 8.57 3 19.7 19.7 0 0 0 3.7 4.37 20.6 20.6 0 0 0 .1 17.77a19.9 19.9 0 0 0 6.07 3.06 14 14 0 0 0 1.27-2.07 12.9 12.9 0 0 1-2-.96l.49-.38a14.2 14.2 0 0 0 12.14 0l.49.38c-.64.38-1.31.7-2 .96.37.73.8 1.42 1.27 2.07a19.8 19.8 0 0 0 6.07-3.06A20.5 20.5 0 0 0 20.32 4.37ZM8.02 15.08c-1.18 0-2.15-1.09-2.15-2.42s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.33-.95 2.42-2.15 2.42Zm7.97 0c-1.18 0-2.15-1.09-2.15-2.42s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.33-.95 2.42-2.15 2.42Z",
    },
    {
      name: "Instagram",
      desc: "@kidstore.peru",
      href: "https://www.instagram.com/kidstore.peru",
      color: "#E4405F",
      svg: "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.7 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.22-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12c0-3.2.01-3.58.07-4.85C2.38 3.86 3.9 2.31 7.15 2.16 8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.7.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z",
    },
    {
      name: "Facebook",
      desc: "KidStorePeru",
      href: "https://www.facebook.com/kidstore.gg",
      color: "#1877F2",
      svg: "M24 12c0-6.63-5.37-12-12-12S0 5.37 0 12c0 5.99 4.39 10.95 10.13 11.85V15.47H7.08V12h3.05V9.36c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.33l-.53 3.47h-2.8v8.38C19.61 22.95 24 17.99 24 12Z",
    },
    {
      name: "TikTok",
      desc: "@kidstore.peru",
      href: "https://www.tiktok.com/@kidstore.peru",
      color: "#000000",
      svg: "M16.6 5.82A4.28 4.28 0 0 1 13.6 2h-3v13.4a2.59 2.59 0 0 1-2.6 2.5 2.59 2.59 0 0 1-2.6-2.5A2.59 2.59 0 0 1 8 12.9c.28 0 .56.04.82.12V9.8A5.8 5.8 0 0 0 2 15.4a5.81 5.81 0 0 0 5.82 5.8 5.81 5.81 0 0 0 5.82-5.8V9.48a7.47 7.47 0 0 0 4.36 1.4V7.62a4.28 4.28 0 0 1-1.4-1.8Z",
    },
  ];

  return (
    <>
      <Navbar/>
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <div className="max-w-[860px] mx-auto px-4 lg:px-8 py-12">

          {/* ── Header ── */}
          <div className="text-center mb-12">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.15)" }}>
              <MessageCircle size={26} style={{ color: "var(--brand-light)" }}/>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "var(--text)" }}>
              {isEN ? "How can we help you?" : "\u00bfC\u00f3mo podemos ayudarte?"}
            </h1>
            <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {isEN
                ? "We\u2019re available to answer your questions about orders, payments or any inquiry."
                : "Estamos disponibles para resolver tus dudas sobre pedidos, pagos o cualquier consulta."}
            </p>

            {/* Hours badge */}
            <div className="inline-flex items-center gap-2.5 mt-6 px-5 py-2.5 rounded-full"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <Clock size={14} style={{ color: "var(--brand-light)" }}/>
              <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                {isEN
                  ? "Monday \u2013 Sunday \u00b7 12:00 AM \u2013 9:00 AM (Peru time)"
                  : "Lunes \u2013 Domingo \u00b7 12:00 AM \u2013 9:00 AM (hora Per\u00fa)"}
              </span>
            </div>
          </div>

          {/* ── Support channels ── */}
          <div className="mb-12">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-5 text-center"
              style={{ color: "var(--text-subtle)" }}>
              {isEN ? "Support channels" : "Canales de soporte"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {channels.map((ch) => (
                <a key={ch.name} href={ch.href}
                  target="_blank" rel="noopener noreferrer"
                  className="group rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:-translate-y-1"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: `${ch.color}12`, border: `1px solid ${ch.color}25` }}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill={ch.color}>
                      <path d={ch.svg}/>
                    </svg>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold mb-0.5" style={{ color: "var(--text)" }}>{ch.name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text-subtle)" }}>{ch.desc}</p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight size={16}
                    className="flex-shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    style={{ color: "var(--text-subtle)" }}/>
                </a>
              ))}
            </div>
          </div>

          {/* ── FAQ CTA ── */}
          <div className="rounded-2xl p-8 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(124,58,237,0.02))",
              border: "1px solid var(--border)",
            }}>
            {/* Decorative glow */}
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(124,58,237,0.08),transparent 70%)" }}/>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(234,88,12,0.06),transparent 70%)" }}/>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.12)" }}>
                <HelpCircle size={22} style={{ color: "var(--brand-light)" }}/>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>
                {isEN ? "Have a common question?" : "\u00bfTienes una pregunta frecuente?"}
              </h3>
              <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
                {isEN
                  ? "Check our frequently asked questions before contacting us."
                  : "Revisa nuestras preguntas frecuentes antes de contactarnos."}
              </p>
              <Link href="/faq"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 hover:-translate-y-0.5"
                style={{ background: "var(--brand)", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}>
                {isEN ? "View FAQ" : "Ver FAQ"}
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
