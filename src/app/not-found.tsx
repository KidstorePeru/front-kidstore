"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { usePreferences } from "@/context/PreferencesContext";
import { whatsappLink } from "@/config/site";

// Página 404 con la marca de KidStore (rutas, productos o categorías que no existen).
export default function NotFound() {
  const { lang } = usePreferences();
  const EN = lang === "EN";
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center px-4 py-24 text-center"
        style={{ background: "var(--bg)", minHeight: "70vh" }}>
        <p className="text-6xl font-black mb-4"
          style={{ background: "linear-gradient(135deg,#1E3A8A,#EA580C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          404
        </p>
        <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "var(--text)" }}>
          {EN ? "We couldn't find this page" : "No encontramos esta página"}
        </h1>
        <p className="text-sm mb-8 max-w-md" style={{ color: "var(--text-muted)" }}>
          {EN
            ? "The link may be wrong or the product is no longer available. Take a look at our games or message us."
            : "Puede que el enlace esté mal o que el producto ya no esté disponible. Mira nuestros juegos o escríbenos."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/games"
            className="px-6 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#1E3A8A,#EA580C)" }}>
            {EN ? "View all games" : "Ver todos los juegos"}
          </Link>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl text-sm font-bold"
            style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
            {EN ? "Message us on WhatsApp" : "Escríbenos por WhatsApp"}
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
