"use client";

import Link from "next/link";
import Image from "next/image";
import { useT } from "@/i18n";
import { usePreferences } from "@/context/PreferencesContext";
import {
  Zap, Shield, Clock, Mail, MessageCircle, MapPin,
  Gamepad2, CreditCard, ArrowRight,
} from "lucide-react";

/* ── Payment logos from /public/*.png ── */
const PAYMENTS = [
  { name: "Yape",      img: "/yape.png"      },
  { name: "BCP",       img: "/bcp.png"       },
  { name: "Interbank", img: "/interbank.png"  },
  { name: "BBVA",      img: "/bbva.png"      },
  { name: "PayPal",    img: "/paypal.png"     },
  { name: "Binance",   img: "/binance.png"    },
  { name: "Bizum",     img: "/bizum.png"      },
  { name: "Plin",      img: "/plin.webp"      },
];

/* ── Payment methods grid (no marquee to avoid layout bugs) ── */
function PaymentGrid() {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap">
      {PAYMENTS.map((p) => (
        <div key={p.name}
          className="flex items-center justify-center rounded-2xl transition-all hover:scale-105 hover:-translate-y-0.5"
          style={{ background: "var(--card)", border: "1px solid var(--border)", width: 120, height: 56 }}>
          <Image src={p.img} alt={p.name} width={80} height={36}
            className="h-7 w-auto object-contain" style={{ maxWidth: 80 }}/>
        </div>
      ))}
    </div>
  );
}

/* ── Reusable link column ── */
function FooterLinkCol({ title, links, hrefs }: { title: string; links: string[]; hrefs?: string[] }) {
  return (
    <>
      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-5" style={{ color: "var(--text-muted)" }}>
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((l, i) => (
          <li key={l}>
            <Link href={hrefs?.[i] ?? "#"} className="text-[13px] group flex items-center gap-1.5 transition-colors"
              style={{ color: "var(--text-subtle)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--brand-light)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-subtle)")}>
              <ArrowRight size={10} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"/>
              <span>{l}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ── Footer ── */
export default function Footer({ showExtras = false }: { showExtras?: boolean }) {
  const t = useT();
  const { lang } = usePreferences();

  return (
    <footer>

      {/* ═══ Payment methods — only on homepage ═══ */}
      {showExtras && (
        <div style={{ background: "var(--bg)", transition: "background 0.35s ease" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <CreditCard size={20} style={{ color: "var(--brand-light)" }}/>
              <h3 className="text-lg font-bold tracking-tight" style={{ color: "var(--text)" }}>
                {t.footer.paymentMethods}
              </h3>
            </div>
            <PaymentGrid/>
          </div>
        </div>
      )}

      {/* ═══ Trust strip ═══ */}
      <div className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #4C1D95 100%)" }}>
        {/* dot pattern */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px,transparent 1px)", backgroundSize: "24px 24px" }}/>
        {/* glow */}
        <div className="absolute -left-20 -top-20 w-60 h-60 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(167,139,250,0.25),transparent 70%)" }}/>
        <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(234,88,12,0.15),transparent 70%)" }}/>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 py-5 relative z-10 flex items-center justify-center gap-6 md:gap-14 flex-wrap">
          {[
            { icon: <Zap size={14}/>,    label: lang === "ES" ? "Entrega instantánea" : "Instant delivery" },
            { icon: <Shield size={14}/>, label: lang === "ES" ? "Pago 100% seguro"    : "100% secure payment" },
            { icon: <Clock size={14}/>,  label: lang === "ES" ? "Soporte 24/7"        : "24/7 Support" },
            { icon: <Gamepad2 size={14}/>, label: lang === "ES" ? "13 juegos"          : "13 games" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)" }}>
                <span className="text-white">{item.icon}</span>
              </div>
              <span className="text-[11px] font-bold text-white tracking-wide">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ Main footer ═══ */}
      <div className="relative overflow-hidden"
        style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", transition: "background 0.35s ease" }}>

        {/* Subtle decorative gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
          style={{ background: "linear-gradient(90deg,transparent,var(--brand),transparent)", opacity: 0.3 }}/>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 pt-14 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6">

            {/* ── Brand + Socials ── */}
            <div className="lg:col-span-4">
              <Image src="/logo/imagotipo-kidstore.png" alt="KidStore"
                width={160} height={48} className="h-10 w-auto mb-5"/>
              <p className="text-[13px] leading-relaxed max-w-[280px] mb-6" style={{ color: "var(--text-subtle)" }}>
                {t.footer.tagline}
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: "var(--text-subtle)" }}>
                {t.footer.followUs}
              </p>
              <div className="flex gap-2.5">
                {[
                  { label: "WhatsApp", href: "https://wa.me/51983454837",
                    d: "M12.04 2A10 10 0 0 0 2 12.05a10 10 0 0 0 1.4 5.13L2 22l4.95-1.38A10 10 0 0 0 22 12.05 10 10 0 0 0 12.04 2Zm5.03 13.56c-.2.58-1.2 1.1-1.65 1.17-.44.06-.99.1-1.6-.1a14.6 14.6 0 0 1-1.45-.54 11.3 11.3 0 0 1-4.45-3.93 4.9 4.9 0 0 1-1.04-2.6c-.02-.97.37-1.44.72-1.6a.64.64 0 0 1 .5-.04c.15.04.35.06.48.37.15.35.53 1.28.57 1.37.05.1.08.2.02.32-.05.1-.08.17-.17.27-.08.1-.18.22-.26.3-.09.08-.18.17-.08.34.1.17.47.77 1 1.25.7.62 1.28.82 1.47.91.18.09.29.08.4-.04.1-.12.45-.52.57-.7.12-.18.24-.15.4-.09.17.06 1.06.5 1.24.59.18.09.3.13.34.21.05.07.05.42-.14 1Z",
                    viewBox: "0 0 24 24" },
                  { label: "TikTok", href: "https://www.tiktok.com/@kidstore.peru",
                    d: "M16.6 5.82A4.28 4.28 0 0 1 13.6 2h-3v13.4a2.59 2.59 0 0 1-2.6 2.5 2.59 2.59 0 0 1-2.6-2.5A2.59 2.59 0 0 1 8 12.9c.28 0 .56.04.82.12V9.8A5.8 5.8 0 0 0 2 15.4a5.81 5.81 0 0 0 5.82 5.8 5.81 5.81 0 0 0 5.82-5.8V9.48a7.47 7.47 0 0 0 4.36 1.4V7.62a4.28 4.28 0 0 1-1.4-1.8Z",
                    viewBox: "0 0 20 22" },
                  { label: "Instagram", href: "https://www.instagram.com/kidstore.peru",
                    d: "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.7 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.22-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12c0-3.2.01-3.58.07-4.85C2.38 3.86 3.9 2.31 7.15 2.16 8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.7.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z",
                    viewBox: "0 0 24 24" },
                  { label: "Facebook", href: "https://www.facebook.com/kidstore.gg",
                    d: "M24 12c0-6.63-5.37-12-12-12S0 5.37 0 12c0 5.99 4.39 10.95 10.13 11.85V15.47H7.08V12h3.05V9.36c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.33l-.53 3.47h-2.8v8.38C19.61 22.95 24 17.99 24 12Z",
                    viewBox: "0 0 24 24" },
                  { label: "Discord", href: "https://discord.gg/kidstoreperu",
                    d: "M20.32 4.37A19.8 19.8 0 0 0 15.44 3c-.21.38-.46.89-.63 1.29a18.4 18.4 0 0 0-5.6 0A13 13 0 0 0 8.57 3 19.7 19.7 0 0 0 3.7 4.37 20.6 20.6 0 0 0 .1 17.77a19.9 19.9 0 0 0 6.07 3.06 14 14 0 0 0 1.27-2.07 12.9 12.9 0 0 1-2-.96l.49-.38a14.2 14.2 0 0 0 12.14 0l.49.38c-.64.38-1.31.7-2 .96.37.73.8 1.42 1.27 2.07a19.8 19.8 0 0 0 6.07-3.06A20.5 20.5 0 0 0 20.32 4.37ZM8.02 15.08c-1.18 0-2.15-1.09-2.15-2.42s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.33-.95 2.42-2.15 2.42Zm7.97 0c-1.18 0-2.15-1.09-2.15-2.42s.95-2.42 2.15-2.42 2.17 1.09 2.15 2.42c0 1.33-.95 2.42-2.15 2.42Z",
                    viewBox: "0 0 24 24" },
                ].map((s) => (
                  <a key={s.label} href={s.href} title={s.label}
                    target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 hover:-translate-y-1"
                    style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <svg viewBox={s.viewBox} className="w-[18px] h-[18px]"
                      fill="var(--text-muted)">
                      <path d={s.d}/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* ── Store ── */}
            <div className="lg:col-span-2">
              <FooterLinkCol title={t.footer.store} links={t.footer.storeLinks}
                hrefs={["/games", "/games/fortnite", "/games/roblox", "/games/genshin-impact"]}/>
            </div>

            {/* ── Support ── */}
            <div className="lg:col-span-2">
              <FooterLinkCol title={t.footer.support} links={t.footer.supportLinks}
                hrefs={["/faq", "/contact", "/faq"]}/>
            </div>

            {/* ── Legal ── */}
            <div className="lg:col-span-2">
              <FooterLinkCol title={t.footer.legal} links={t.footer.legalLinks}
                hrefs={["/terms", "/privacy", "/refunds"]}/>
            </div>

            {/* ── Contact ── */}
            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-5" style={{ color: "var(--text-muted)" }}>
                {t.footer.contact}
              </h4>
              <div className="space-y-3.5">
                {[
                  { icon: <Clock size={14}/>,          label: t.footer.hoursValue,          color: "var(--brand-light)" },
                  { icon: <Mail size={14}/>,           label: "contacto@kidstoreperu.com",  href: "mailto:contacto@kidstoreperu.com" },
                  { icon: <MessageCircle size={14}/>,  label: "WhatsApp: +51 983 454 837", href: "https://wa.me/51983454837" },
                  { icon: <MapPin size={14}/>,         label: "Lima, Perú" },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--card)", border: "1px solid var(--border)", color: c.color ?? "var(--text-subtle)" }}>
                      {c.icon}
                    </div>
                    {c.href ? (
                      <a href={c.href} className="text-[13px] transition-colors"
                        {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        style={{ color: "var(--text-subtle)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--brand-light)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-subtle)")}>
                        {c.label}
                      </a>
                    ) : (
                      <span className="text-[13px] font-semibold" style={{ color: c.color ? "var(--text)" : "var(--text-subtle)" }}>
                        {c.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
              {t.footer.copyright}
            </p>
            <div className="flex items-center gap-6 text-xs" style={{ color: "var(--text-subtle)" }}>
              <Link href="/terms" className="transition-colors hover:opacity-80"
                onMouseEnter={e => (e.currentTarget.style.color = "var(--brand-light)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-subtle)")}>
                {t.footer.terms}
              </Link>
              <Link href="/privacy" className="transition-colors hover:opacity-80"
                onMouseEnter={e => (e.currentTarget.style.color = "var(--brand-light)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-subtle)")}>
                {t.footer.privacy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
