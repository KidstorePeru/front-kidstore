"use client";
// build: 2026-04-16-fix-orders
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, ArrowLeft, Shield, Zap, MessageCircle,
  ChevronRight, Check, AlertCircle, Lock,
  Gamepad2, Smartphone, X, Copy, CheckCheck,
  Trash2, Plus, Minus,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useAuth } from "@/context/AuthContext";
import { useT } from "@/i18n";

// ── Payment data ───────────────────────────────────────────────
const PAYMENT_INFO = {
  yape: {
    id: "yape",
    label: "Yape",
    icon: "💜",
    logo: "/pagos/yape.png",
    color: "#6B21A8",
    colorLight: "#A855F7",
    bgColor: "rgba(107,33,168,0.12)",
    borderColor: "rgba(107,33,168,0.4)",
    qr: "/pagos/yape-qr.png",
    phone: "963 469 586",
    name: "Freddy Aystin Rodriguez Uricay",
    instructions: "Envía el pago y adjunta el comprobante al finalizar.",
  },
  plin: {
    id: "plin",
    label: "Plin",
    icon: "💚",
    logo: "/pagos/plin.png",
    color: "#059669",
    colorLight: "#34D399",
    bgColor: "rgba(5,150,105,0.10)",
    borderColor: "rgba(5,150,105,0.35)",
    qr: "/pagos/plin-qr.png",
    phone: "963 469 586",
    name: "Freddy Aystin Rodriguez Uricay",
    instructions: "Escanea el QR con tu app bancaria y adjunta el comprobante.",
  },
  transferencia: {
    id: "transferencia",
    label: "Transferencia Bancaria",
    labelEN: "Bank Transfer",
    icon: "🏦",
    logo: "/pagos/banco.png",
    color: "#1D4ED8",
    colorLight: "#60A5FA",
    bgColor: "rgba(29,78,216,0.10)",
    borderColor: "rgba(29,78,216,0.35)",
    qr: null,
    accounts: [
      { bank: "BCP",       logo: "/pagos/bcp.png",       number: "19206197697098"      },
      { bank: "Interbank", logo: "/pagos/interbank.png",  number: "8983302393569"       },
      { bank: "BBVA",      logo: "/pagos/bbva.png",       number: "00110814021322 6768" },
    ],
    name: "Freddy Aystin Rodriguez Uricay",
    instructions: "Envía el comprobante con el N° de operación por WhatsApp o Instagram.",
  },
  paypal: {
    id: "paypal",
    label: "PayPal",
    icon: "🅿️",
    logo: "/pagos/paypal.png",
    color: "#003087",
    colorLight: "#009CDE",
    bgColor: "rgba(0,48,135,0.10)",
    borderColor: "rgba(0,156,222,0.35)",
    qr: "/pagos/paypal-qr.png",
    email: "freddyru180496@icloud.com",
    name: "Diego A. Nauto R.",
    phone: null,
    fee: "paypal" as const,
    instructions: "Envía el pago a nuestra cuenta PayPal y adjunta el comprobante.",
    paymentNote: "Estoy pagando por un servicio digital. Ya he recibido el producto y estoy satisfecho con el mismo. Autorizo este pago de forma voluntaria y no tengo intención de disputarlo.",
  },
  binance: {
    id: "binance",
    label: "Binance Pay",
    icon: "🟡",
    logo: "/pagos/binance.png",
    color: "#F0B90B",
    colorLight: "#F3D55B",
    bgColor: "rgba(240,185,11,0.10)",
    borderColor: "rgba(240,185,11,0.35)",
    qr: "/pagos/binance-qr.png",
    payId: "1066569170",
    name: "Kidstore",
    phone: null,
    fee: "binance" as const,
    instructions: "Escanea el QR o usa el Pay ID para enviar el pago por Binance Pay.",
  },
  bizum: {
    id: "bizum",
    label: "Bizum",
    icon: "💙",
    logo: "/pagos/bizum.png",
    color: "#0066FF",
    colorLight: "#4D99FF",
    bgColor: "rgba(0,102,255,0.10)",
    borderColor: "rgba(0,102,255,0.35)",
    qr: "/pagos/bizum-qr.png",
    phone: "641653591",
    name: "Angel Rodriguez",
    fee: "bizum" as const,
    instructions: "Envía el pago por Bizum y adjunta el comprobante.",
  },
} as const;

type PaymentId = keyof typeof PAYMENT_INFO;

// ── Fee calculator ─────────────────────────────────────────────
interface PriceBreakdown {
  subtotal:    number;
  feePercent:  number;
  feeFixed:    number;
  fee:         number;
  total:       number;
}

function calcBreakdown(penPrice: number, method: PaymentId, rates: Record<string, number>): PriceBreakdown {
  const usdRate = rates["USD"] ?? 0.269;
  const eurRate = rates["EUR"] ?? 0.247;

  if (method === "paypal") {
    const baseUSD    = penPrice * usdRate;
    const feePEN     = baseUSD * 0.26;
    const totalPEN   = penPrice + feePEN;
    const totalUSD   = totalPEN * usdRate;
    const feePercent = totalUSD * 0.054;
    const feeFixed   = 0.30;
    const finalUSD   = totalUSD + feePercent + feeFixed;
    return { subtotal: totalUSD, feePercent, feeFixed, fee: feePercent + feeFixed, total: finalUSD };
  }
  if (method === "binance") {
    const baseUSD = penPrice * usdRate;
    const feeAmt  = baseUSD * 0.03;
    return { subtotal: baseUSD, feePercent: feeAmt, feeFixed: 0, fee: feeAmt, total: baseUSD + feeAmt };
  }
  if (method === "bizum") {
    const baseEUR = penPrice * eurRate;
    const feeAmt  = baseEUR * 0.04;
    return { subtotal: baseEUR, feePercent: feeAmt, feeFixed: 0, fee: feeAmt, total: baseEUR + feeAmt };
  }
  return { subtotal: penPrice, feePercent: 0, feeFixed: 0, fee: 0, total: penPrice };
}

function calcFinalPrice(penPrice: number, method: PaymentId, rates: Record<string, number>): number {
  return calcBreakdown(penPrice, method, rates).total;
}

function feeLabel(method: PaymentId, t?: { checkout: { feePaypal: string; feeBinance: string; feeBizum: string } }): string | null {
  if (method === "paypal")  return t?.checkout.feePaypal  ?? "Comisión PayPal (5.4%)";
  if (method === "binance") return t?.checkout.feeBinance ?? "Comisión Binance Pay (3%)";
  if (method === "bizum")   return t?.checkout.feeBizum   ?? "Comisión Bizum (4%)";
  return null;
}

const PLATFORM_LABELS: Record<string, string> = {
  epic:"Epic Games", xbox:"Xbox", facebook:"Facebook",
  google:"Google", playstation:"PlayStation", steam:"Steam",
  apple:"Apple", lego:"LEGO",
};

// ── Copy button ────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const t = useT();
  function handle() {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={handle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
      style={{ background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.25)", color:"var(--brand-light)" }}>
      {copied ? <CheckCheck size={12}/> : <Copy size={12}/>}
      {copied ? t.checkout.copied : t.checkout.copy}
    </button>
  );
}

// ── Payment Modal ──────────────────────────────────────────────
function PaymentModal({ paymentId, total, onConfirm, onClose, loading: confirmLoading }: {
  paymentId: PaymentId; total: number; onConfirm: () => void; onClose: () => void; loading?: boolean;
}) {
  const { formatPrice, lang } = usePreferences();
  const t = useT();
  const info = PAYMENT_INFO[paymentId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.75)", backdropFilter:"blur(8px)" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl overflow-hidden flex flex-col"
        style={{ background:"var(--card)", border:`1px solid ${info.borderColor}`, maxHeight:"88vh" }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ background:info.bgColor, borderBottom:`1px solid ${info.borderColor}` }}>
          <p className="text-sm font-black uppercase tracking-widest" style={{ color: info.colorLight }}>
            {info.icon} {t.checkout.payWith} {"labelEN" in info && lang==="EN" ? info.labelEN : info.label}
          </p>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70"
            style={{ background:"rgba(255,255,255,0.08)", color:"var(--text-muted)" }}>
            <X size={14}/>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {info.logo && (
            <div className="flex justify-center">
              <div className="h-10 flex items-center">
                <Image src={info.logo} alt={info.label} width={120} height={40} className="object-contain h-10 w-auto"/>
              </div>
            </div>
          )}
          {info.qr && (
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-white p-1.5 flex items-center justify-center shadow-md">
                <Image src={info.qr} alt={`QR ${info.label}`} width={120} height={120} className="object-contain"/>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
            <span className="text-xs font-semibold" style={{ color:"var(--text-muted)" }}>{t.checkout.amountToPay}</span>
            <span className="text-base font-black" style={{ color: info.colorLight }}>
              {paymentId === "bizum" ? `€ ${total.toFixed(2)}` : (paymentId === "paypal" || paymentId === "binance") ? `$ ${total.toFixed(2)}` : `S/ ${total.toFixed(2)}`}
            </span>
          </div>

          {(paymentId === "yape" || paymentId === "plin") ? (
            <div className="space-y-2">
              {[
                { label:t.checkout.phoneLabel, value: (info as typeof PAYMENT_INFO.yape).phone },
                { label:t.checkout.nameLabel, value: (info as typeof PAYMENT_INFO.yape).name },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color:"var(--text-subtle)" }}>{row.label}</p>
                    <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{row.value}</p>
                  </div>
                  <CopyBtn text={row.value}/>
                </div>
              ))}
            </div>
          ) : paymentId === "transferencia" ? (
            <div className="space-y-2">
              {(info as typeof PAYMENT_INFO.transferencia).accounts.map(acc => (
                <div key={acc.bank} className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 flex items-center justify-center flex-shrink-0">
                      <Image src={acc.logo} alt={acc.bank} width={40} height={28} className="object-contain"/>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color:"var(--text-subtle)" }}>{acc.bank}</p>
                      <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{acc.number}</p>
                    </div>
                  </div>
                  <CopyBtn text={acc.number}/>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color:"var(--text-subtle)" }}>{t.checkout.holder}</p>
                  <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{(info as typeof PAYMENT_INFO.transferencia).name}</p>
                </div>
                <CopyBtn text={(info as typeof PAYMENT_INFO.transferencia).name}/>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {paymentId === "paypal" && (() => {
                const pp = PAYMENT_INFO.paypal;
                return (
                  <>
                    {[{ label:t.checkout.paypalEmail, value: pp.email }, { label:t.checkout.holder, value: pp.name }].map(row => (
                      <div key={row.label} className="flex items-center justify-between px-4 py-3 rounded-xl"
                        style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color:"var(--text-subtle)" }}>{row.label}</p>
                          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{row.value}</p>
                        </div>
                        <CopyBtn text={row.value}/>
                      </div>
                    ))}
                    <div className="rounded-xl overflow-hidden" style={{ border:"1px solid rgba(239,68,68,0.3)" }}>
                      <div className="px-3 py-1.5 flex items-center gap-2"
                        style={{ background:"rgba(239,68,68,0.08)", borderBottom:"1px solid rgba(239,68,68,0.2)" }}>
                        <AlertCircle size={12} className="text-red-400 flex-shrink-0"/>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color:"#F87171" }}>{t.checkout.mandatoryMsg}</p>
                      </div>
                      <div className="px-3 py-2" style={{ background:"var(--surface)" }}>
                        <p className="text-[11px] italic mb-1.5" style={{ color:"var(--text-muted)" }}>"{t.checkout.paypalNote}"</p>
                        <CopyBtn text={t.checkout.paypalNote}/>
                      </div>
                    </div>
                    <div className="rounded-xl px-3 py-2 flex gap-2"
                      style={{ background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.2)" }}>
                      <AlertCircle size={12} className="text-yellow-400 flex-shrink-0 mt-0.5"/>
                      <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>{t.checkout.attachReceipt}</p>
                    </div>
                  </>
                );
              })()}
              {paymentId === "binance" && (() => {
                const bn = PAYMENT_INFO.binance;
                return (
                  <>
                    {[{ label:t.checkout.payId, value: bn.payId }, { label:t.checkout.holder, value: bn.name }].map(row => (
                      <div key={row.label} className="flex items-center justify-between px-4 py-3 rounded-xl"
                        style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color:"var(--text-subtle)" }}>{row.label}</p>
                          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{row.value}</p>
                        </div>
                        <CopyBtn text={row.value}/>
                      </div>
                    ))}
                    <div className="rounded-xl px-4 py-3 flex gap-2"
                      style={{ background:"rgba(240,185,11,0.07)", border:"1px solid rgba(240,185,11,0.25)" }}>
                      <AlertCircle size={13} className="text-yellow-400 flex-shrink-0 mt-0.5"/>
                      <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>
                        {t.checkout.binanceUsePayId} {t.checkout.attachReceipt}
                      </p>
                    </div>
                  </>
                );
              })()}
              {paymentId === "bizum" && (() => {
                const bz = PAYMENT_INFO.bizum;
                return (
                  <>
                    {[{ label:t.checkout.bizumNumber, value: bz.phone }, { label:t.checkout.holder, value: bz.name }].map(row => (
                      <div key={row.label} className="flex items-center justify-between px-4 py-3 rounded-xl"
                        style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color:"var(--text-subtle)" }}>{row.label}</p>
                          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{row.value}</p>
                        </div>
                        <CopyBtn text={row.value}/>
                      </div>
                    ))}
                    <div className="rounded-xl px-3 py-2 flex gap-2"
                      style={{ background:"rgba(0,102,255,0.07)", border:"1px solid rgba(0,102,255,0.25)" }}>
                      <AlertCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color:"#4D99FF" }}/>
                      <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>{t.checkout.attachReceipt}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          <p className="text-xs text-center" style={{ color:"var(--text-subtle)" }}>
            {paymentId === "yape" ? t.checkout.instrYape
            : paymentId === "plin" ? t.checkout.instrPlin
            : paymentId === "transferencia" ? t.checkout.instrTransfer
            : paymentId === "paypal" ? t.checkout.instrPaypal
            : paymentId === "binance" ? t.checkout.instrBinance
            : t.checkout.instrBizum}
          </p>
        </div>

        <div className="flex-shrink-0 p-4 space-y-2"
          style={{ borderTop:`1px solid ${info.borderColor}`, background:"var(--card)" }}>
          <button onClick={onConfirm} disabled={confirmLoading}
            className="w-full py-3.5 rounded-xl text-sm font-black tracking-wide text-white transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background:`linear-gradient(135deg,${info.color},${info.colorLight})`, boxShadow:`0 4px 20px ${info.color}60` }}>
            {confirmLoading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> {lang === "EN" ? "Processing..." : "Procesando..."}</>
            ) : t.checkout.confirmOrder}
          </button>
          <button onClick={onClose}
            className="w-full py-3 rounded-xl text-xs font-semibold transition-all hover:opacity-70"
            style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
            {t.checkout.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ContactData { name: string; email: string; phone: string; }

function genOrderNumber() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── Success Screen ─────────────────────────────────────────────
function SuccessScreen({ total, paymentMethod, items, contact, orderNumber, currencyUsed }: {
  total: number; paymentMethod: PaymentId; currencyUsed: string;
  items: ReturnType<typeof useCart>["items"];
  contact: ContactData; orderNumber: string;
}) {
  const { formatPrice, lang } = usePreferences();
  const { clearCart } = useCart();
  const t = useT();
  const pm = PAYMENT_INFO[paymentMethod];
  const WHATSAPP_NUMBER = "51983454837";

  // Format total with the correct currency symbol (no double-conversion)
  const sym = currencyUsed === "USD" ? "$" : currencyUsed === "EUR" ? "€" : "S/";
  const displayTotal = `${sym} ${total.toFixed(2)}`;

  const now = new Date();
  const fecha = `${String(now.getDate()).padStart(2,"0")}/${String(now.getMonth()+1).padStart(2,"0")}/${now.getFullYear()}, ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;

  const productoLines = items.map(item => {
    const od = item.orderData;
    let line = `\u00B7 ${item.name} x${item.quantity} - S/ ${(item.price * item.quantity).toFixed(2)}`;
    if (od?.gameName) line += `\n   \uD83D\uDC64 Usuario: ${od.gameName}`;
    if (od?.user)     line += `\n   \uD83D\uDCE7 Cuenta: ${od.user}`;
    if (od?.platform) line += `\n   \uD83C\uDFAE Plataforma: ${PLATFORM_LABELS[od.platform] ?? od.platform}`;
    if (od?.months)   line += `\n   \uD83D\uDCC5 Duraci\u00F3n: ${od.months} ${od.months === 1 ? "mes" : "meses"}`;
    return line;
  }).join("\n");

  const waMessage = [
    "\u2756 *NUEVO PEDIDO - KIDSTORE* \u2756",
    "",
    `\uD83D\uDCCC Pedido N\u00B0: ${orderNumber}`,
    `\uD83D\uDC64 Cliente: ${contact.name}`,
    `\uD83D\uDCE7 Email: ${contact.email}`,
    `\uD83D\uDCDE Tel\u00E9fono: ${contact.phone}`,
    "",
    `\uD83D\uDED2 Productos:`,
    productoLines,
    "",
    `\uD83D\uDCB3 M\u00E9todo de pago: ${pm.label}`,
    `\uD83D\uDCB0 Total: ${displayTotal}`,
    "",
    `\uD83D\uDCC5 Fecha: ${fecha}`,
  ].join("\n");

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center"
      style={{ background:"var(--bg)" }}>
      <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ color:"var(--text)" }}>
        {t.checkout.thankYou} 🎉
      </h1>
      <p className="text-sm mb-10" style={{ color:"var(--text-subtle)", maxWidth:"480px" }}>{t.checkout.successMsg}</p>

      <div className="w-full max-w-lg rounded-2xl overflow-hidden mb-8 text-left"
        style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="p-5 space-y-3" style={{ borderBottom:"1px solid var(--border)" }}>
          {[
            { label:"Total",                    value:displayTotal,              color:pm.colorLight },
            { label:t.checkout.status,           value:`⏳ ${t.checkout.pending}`, color:"#F59E0B"     },
            { label:t.checkout.paymentMethod,    value:`${pm.icon} ${"labelEN" in pm && lang==="EN" ? pm.labelEN : pm.label}`, color:"var(--text)" },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-sm" style={{ color:"var(--text-muted)" }}>{row.label}:</span>
              <span className="text-sm font-bold" style={{ color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>
        <div className="p-5">
          <p className="text-xs font-bold mb-3" style={{ color:"var(--text)" }}>{t.checkout.products}:</p>
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.slug} className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(15,10,40,0.5))" }}>
                  <Image src={item.img} alt={item.name} fill className="object-contain p-1"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate" style={{ color:"var(--text)" }}>
                    {item.name}{item.quantity > 1 ? ` x${item.quantity}` : ""}
                  </p>
                  {item.orderData?.gameName && <p className="text-[11px]" style={{ color:"var(--text-subtle)" }}>👤 {item.orderData.gameName}</p>}
                  {item.orderData?.platform && <p className="text-[11px]" style={{ color:"var(--text-subtle)" }}>🎮 {PLATFORM_LABELS[item.orderData.platform] ?? item.orderData.platform}</p>}
                </div>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: pm.colorLight }}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
          style={{ background:"linear-gradient(135deg,#22C55E,#16A34A)", boxShadow:"0 4px 16px rgba(34,197,94,0.35)" }}>
          💬 {t.checkout.sendReceipt}
        </a>
        <Link href="/games/fortnite" onClick={clearCart}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
          style={{ background:"linear-gradient(135deg,#3B82F6,#1D4ED8)", boxShadow:"0 4px 16px rgba(59,130,246,0.35)" }}>
          🛒 {t.checkout.backToShop}
        </Link>
      </div>
    </div>
  );
}

// ── Order Summary ──────────────────────────────────────────────
function OrderSummary({ selectedMethod }: { selectedMethod: PaymentId }) {
  const { formatPrice, currency, rates } = usePreferences();
  const t = useT();
  const { items, totalPrice, totalItems, updateQty, removeItem } = useCart();
  const breakdown = calcBreakdown(totalPrice, selectedMethod, rates);
  const hasFee    = breakdown.fee > 0;

  if (items.length === 0) return (
    <div className="rounded-2xl p-8 text-center space-y-4"
      style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
      <ShoppingCart size={32} style={{ color:"var(--text-subtle)", margin:"0 auto" }}/>
      <p className="text-sm font-semibold" style={{ color:"var(--text)" }}>{t.checkout.emptyCart}</p>
      <Link href="/"
        className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white"
        style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)" }}>
        {t.checkout.goToShop}
      </Link>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="px-5 py-3.5 flex items-center gap-2"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
          <ShoppingCart size={15} style={{ color:"var(--brand-light)" }}/>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color:"var(--text)" }}>
            {t.checkout.summary} ({totalItems} {totalItems === 1 ? t.checkout.product : t.checkout.productsPlural})
          </p>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {items.map(item => {
            const od = item.orderData;
            const disc = item.priceOld > item.price ? Math.round((1 - item.price / item.priceOld) * 100) : 0;
            const isShopItem = item.tabLabel === "Tienda";
            return (
              <div key={item.slug} className="p-4 space-y-2">
                <div className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                    style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(15,10,40,0.5))" }}>
                    <Image src={item.img} alt={item.name} fill className="object-contain p-1.5"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color:"var(--text)" }}>{item.name}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-bold" style={{ color:"var(--brand-light)" }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      {disc > 0 && (
                        <span className="text-[10px] line-through" style={{ color:"var(--text-subtle)" }}>
                          {formatPrice(item.priceOld)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.slug, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
                      style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
                      {item.quantity === 1 ? <Trash2 size={12}/> : <Minus size={12}/>}
                    </button>
                    <span className="text-xs font-bold w-5 text-center" style={{ color:"var(--text)" }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.slug, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-70"
                      style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
                      <Plus size={12}/>
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.slug)}
                    className="flex items-center gap-1 text-[11px] font-medium transition-all hover:opacity-70"
                    style={{ color:"var(--text-subtle)", background:"none", border:"none", cursor:"pointer" }}>
                    <Trash2 size={11}/> {t.checkout.remove}
                  </button>
                </div>
                {od && Object.values(od).some(Boolean) && (
                  <div className="rounded-xl p-2.5 space-y-1"
                    style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                    {od.gameName && <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>👤 <strong style={{ color:"var(--text)" }}>{t.checkout.userLabel}:</strong> {od.gameName}</p>}
                    {od.user     && <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>{isShopItem ? "🎮" : "📧"} <strong style={{ color:"var(--text)" }}>{isShopItem ? `${t.checkout.epicUserLabel}:` : `${t.checkout.accountLabel}:`}</strong> {od.user}</p>}
                    {od.platform && <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>🎮 <strong style={{ color:"var(--text)" }}>{t.checkout.platformLabel}:</strong> {PLATFORM_LABELS[od.platform] ?? od.platform}</p>}
                    {od.months   && <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>📅 <strong style={{ color:"var(--text)" }}>{t.checkout.durationLabel}:</strong> {od.months} {od.months === 1 ? t.checkout.month : t.checkout.months}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl p-4 space-y-2.5" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="flex justify-between text-xs" style={{ color:"var(--text-muted)" }}>
          <span>{t.checkout.subtotal}</span><span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-xs" style={{ color:"var(--text-muted)" }}>
          <span>{t.checkout.digitalShipping}</span>
          <span className="text-green-400 font-semibold">{t.checkout.free}</span>
        </div>
        {hasFee && (
          selectedMethod === "paypal" ? (
            <>
              <div className="flex justify-between text-xs" style={{ color:"#009CDE" }}>
                <span>{t.checkout.feePaypal}</span><span>+ $ {breakdown.feePercent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs" style={{ color:"#009CDE" }}>
                <span>{t.checkout.feePaypalFixed}</span><span>+ $ 0.30</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-xs"
              style={{ color: selectedMethod === "binance" ? "#F3D55B" : "#4D99FF" }}>
              <span>{feeLabel(selectedMethod, t)}</span>
              <span>+ {breakdown.feePercent.toFixed(2)} {selectedMethod === "bizum" ? "€" : "$"}</span>
            </div>
          )
        )}
        <div className="flex justify-between text-sm font-bold pt-2"
          style={{ borderTop:"1px solid var(--border)", paddingTop:"10px", color:"var(--text)" }}>
          <span>{t.checkout.total}</span>
          <span style={{ color:"var(--brand-light)" }}>
            {hasFee ? `${selectedMethod === "bizum" ? "€" : "$"} ${breakdown.total.toFixed(2)}` : `S/ ${breakdown.total.toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className="rounded-xl p-3.5 flex gap-2.5"
        style={{ background:"rgba(16,185,129,0.06)", border:"1px solid rgba(16,185,129,0.2)" }}>
        <Shield size={14} className="text-green-400 flex-shrink-0 mt-0.5"/>
        <p className="text-xs" style={{ color:"var(--text-muted)" }}>
          <strong style={{ color:"var(--text)" }}>{t.checkout.securePayment}</strong> {t.checkout.sslNote}
        </p>
      </div>
    </div>
  );
}

// ── Checkout Form ──────────────────────────────────────────────
function CheckoutForm({ onOpenModal, onMethodChange }: {
  onOpenModal: (method: PaymentId, contact: ContactData) => void;
  onMethodChange: (method: PaymentId) => void;
}) {
  // ── Pre-fill with logged-in user data ──────────────────────
  const { user } = useAuth();
  const [name,   setName]   = useState(user?.username ?? "");
  const [email,  setEmail]  = useState(user?.email    ?? "");
  const [phone,  setPhone]  = useState(user?.phone ?? "");
  const [method, setMethod] = useState<PaymentId>("yape");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const { items } = useCart();
  const t = useT();

  // Sync if user logs in after mount
  useEffect(() => {
    if (user) {
      setName((n: string)  => n  || user.username);
      setEmail((e: string) => e  || user.email);
      setPhone((p: string) => p  || (user?.phone ?? ""));
    }
  }, [user]);

  function validate() {
    const e: Record<string, boolean> = {};
    if (!name.trim())                          e.name  = true;
    if (!email.trim() || !email.includes("@")) e.email = true;
    if (!phone.trim())                         e.phone = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const { currency, formatPrice, lang } = usePreferences();

  const ALL_METHODS: { id: PaymentId; icon: string; label: string; desc: string }[] = [
    { id:"yape",          icon:"💜", label:"Yape - QR",            desc:t.checkout.descYape            },
    { id:"plin",          icon:"💚", label:"Plin - QR",             desc:t.checkout.descPlin            },
    { id:"transferencia", icon:"🏦", label:lang==="EN"?"Bank Transfer":"Transferencia Bancaria", desc:t.checkout.descTransfer },
    { id:"paypal",        icon:"🅿️", label:"PayPal",               desc:t.checkout.descPaypal           },
    { id:"binance",       icon:"🟡", label:"Binance Pay",           desc:t.checkout.descBinance          },
    { id:"bizum",         icon:"💙", label:"Bizum",                 desc:t.checkout.descBizum            },
  ];

  const METHODS = ALL_METHODS.filter(m =>
    currency === "PEN" ? ["yape","plin","transferencia"].includes(m.id) :
    currency === "USD" ? ["paypal","binance"].includes(m.id) :
    currency === "EUR" ? ["bizum"].includes(m.id) : true
  );

  const validIds     = METHODS.map(m => m.id);
  const currentMethod = validIds.includes(method) ? method : validIds[0] as PaymentId;

  useEffect(() => { onMethodChange(currentMethod); }, [currentMethod]);

  return (
    <div className="space-y-6">
      {/* Datos de contacto */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="px-5 py-3.5" style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color:"var(--text)" }}>
            📋 {t.checkout.contactInfo}
          </p>
        </div>
        {/* Indicador si hay sesión activa */}
        {user && (
          <div className="mx-5 mt-4 px-3 py-2 rounded-xl flex items-center gap-2 text-xs"
            style={{ background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.2)", color:"#4ADE80" }}>
            <Check size={12} className="flex-shrink-0"/>
            {t.checkout.prefilledNote}
          </div>
        )}
        <div className="p-5 space-y-4">
          {([
            { key:"name",  label:t.checkout.name,  val:name,  set:setName,  type:"text",  ph:t.checkout.namePlaceholder,  err:errors.name  },
            { key:"email", label:t.checkout.email, val:email, set:setEmail, type:"email", ph:t.checkout.emailPlaceholder, err:errors.email },
            { key:"phone", label:t.checkout.phone, val:phone, set:setPhone, type:"tel",   ph:"+51 999 999 999",           err:errors.phone },
          ]).map(f => (
            <div key={f.key}>
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block"
                style={{ color: f.err ? "#EF4444" : "var(--text-subtle)" }}>
                {f.label}{f.err && <span className="normal-case font-normal"> — {t.checkout.required}</span>}
              </label>
              <input
                type={f.type} placeholder={f.ph} value={f.val}
                onChange={e => { (f.set as (v: string) => void)(e.target.value); setErrors(p => ({ ...p, [f.key]:false })); }}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background:"var(--card)", color:"var(--text)", border:`1px solid ${f.err ? "#EF4444" : "var(--border)"}` }}
                onFocus={e => (e.currentTarget.style.borderColor = f.err ? "#EF4444" : "#7C3AED")}
                onBlur={e  => (e.currentTarget.style.borderColor = f.err ? "#EF4444" : "var(--border)")}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Métodos de pago */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="px-5 py-3.5" style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color:"var(--text)" }}>
            💳 {t.checkout.paymentMethod}
          </p>
        </div>
        <div className="p-4 space-y-2.5">
          {METHODS.map(m => {
            const active = currentMethod === m.id;
            const info   = PAYMENT_INFO[m.id];
            return (
              <button key={m.id} onClick={() => { setMethod(m.id as PaymentId); onMethodChange(m.id as PaymentId); }}
                className="w-full flex items-center gap-3 p-4 rounded-xl transition-all text-left"
                style={{ background: active ? info.bgColor : "var(--surface)", border:`1.5px solid ${active ? info.borderColor : "var(--border)"}` }}>
                <div className="w-12 h-8 flex items-center justify-center flex-shrink-0 rounded-lg overflow-hidden"
                  style={{ background:"rgba(255,255,255,0.08)" }}>
                  <Image src={info.logo} alt={m.label} width={48} height={32} className="object-contain w-10 h-7"/>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: active ? info.colorLight : "var(--text)" }}>{m.label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color:"var(--text-subtle)" }}>{m.desc}</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ borderColor: active ? info.colorLight : "var(--border)", background: active ? info.colorLight : "transparent" }}>
                  {active && <div className="w-2 h-2 rounded-full bg-white"/>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {items.some(i => i.orderData && Object.values(i.orderData).some(Boolean)) && (
        <div className="rounded-xl p-4 flex gap-3"
          style={{ background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.2)" }}>
          <AlertCircle size={15} className="text-blue-400 flex-shrink-0 mt-0.5"/>
          <p className="text-xs" style={{ color:"var(--text-muted)" }}>
            {t.checkout.gameDataNote}
          </p>
        </div>
      )}

      {feeLabel(currentMethod, t) && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-2"
          style={{ background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.2)" }}>
          <AlertCircle size={13} className="text-yellow-400 flex-shrink-0"/>
          <p className="text-[11px]" style={{ color:"var(--text-muted)" }}>
            {t.checkout.feeNotice} {(feeLabel(currentMethod, t) ?? "").toLowerCase()} {t.checkout.feeNoticeSuffix}
          </p>
        </div>
      )}

      <button
        onClick={() => { if (validate()) onOpenModal(currentMethod, { name, email, phone }); }}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white transition-all hover:scale-[1.01]"
        style={{
          background:`linear-gradient(135deg,${PAYMENT_INFO[currentMethod].color},${PAYMENT_INFO[currentMethod].colorLight})`,
          boxShadow:`0 4px 24px ${PAYMENT_INFO[currentMethod].color}50`,
        }}>
        <Zap size={16}/>
        {t.checkout.pay} {PAYMENT_INFO[currentMethod].label}
      </button>

      <div className="flex items-center justify-center gap-6">
        {[
          { icon:<Shield size={13} className="text-green-400"/>,       text:t.trust.securePayment   },
          { icon:<Zap    size={13} className="text-yellow-400"/>,      text:t.trust.instantDelivery },
          { icon:<MessageCircle size={13} className="text-blue-400"/>, text:t.trust.support         },
        ].map(item => (
          <div key={item.text} className="flex items-center gap-1.5">
            {item.icon}
            <span className="text-[11px]" style={{ color:"var(--text-subtle)" }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN ───────────────────────────────────────────────────────
export default function CheckoutPageClient() {
  const { formatPrice, currency, rates } = usePreferences();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const t = useT();
  const [modal,          setModal]          = useState<PaymentId | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentId>("yape");
  const [success,        setSuccess]        = useState(false);
  const [paidWith,       setPaidWith]       = useState<PaymentId>("yape");
  const [contact,        setContact]        = useState<ContactData>({ name:"", email:"", phone:"" });
  const [orderNumber,    setOrderNumber]    = useState("");

  async function saveOrder(method: PaymentId, total: number, ordNum: string) {
    // Works for both logged-in users and guests — backend only needs email
    const orderItems = items.map(i => ({
      productId: i.slug, name: i.name, price: i.price, quantity: i.quantity, image: i.img,
    }));

    const formData: Record<string, string> = {
      name: contact.name, email: contact.email, phone: contact.phone,
    };
    // Add game-specific data from cart items
    for (const item of items) {
      const od = item.orderData;
      if (od?.user && !formData.epicUser)     formData.epicUser = od.user;
      if (od?.gameName && !formData.gameName)  formData.gameName = od.gameName;
      if (od?.platform && !formData.platform)  formData.platform = od.platform;
    }

    // Send to backend via Next.js proxy (avoids CORS) — retry up to 3 times
    const txCurrency = ["paypal","binance"].includes(method) ? "USD" : method === "bizum" ? "EUR" : "PEN";

    const orderPayload = {
      email: contact.email,
      order: {
        orderId: Number(ordNum),
        total,
        currency: txCurrency,
        paymentMethod: method,
        status: "pending",
        formData,
        items: orderItems.map(i => ({ id: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
      },
    };

    let savedToBackend = false;
    for (let attempt = 0; attempt < 3 && !savedToBackend; attempt++) {
      try {
        if (attempt > 0) await new Promise(r => setTimeout(r, 1000 * attempt));
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
        if (orderRes.ok) {
          savedToBackend = true;
          console.log(`[checkout] Order ${ordNum} saved to backend successfully`);
        } else {
          const errText = await orderRes.text();
          console.error(`[checkout] Order save attempt ${attempt + 1} failed — status ${orderRes.status}:`, errText);
        }
      } catch (e) {
        console.error(`[checkout] Order save attempt ${attempt + 1} error:`, e);
      }
    }

    if (!savedToBackend) {
      console.error("[checkout] All 3 attempts failed — backend unreachable.");
    }

    // Send receipt email via proxy (non-blocking)
    fetch("/api/send-receipt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: contact.email,
        customerName: contact.name,
        orderId: ordNum,
        total,
        currency: txCurrency,
        paymentMethod: method,
        formData,
        items: orderItems,
      }),
    }).catch(() => {});

    // Save to localStorage for profile page (only if logged in)
    if (user) {
      try {
        const existing = JSON.parse(localStorage.getItem("kidstore_orders") ?? "[]");
        localStorage.setItem("kidstore_orders", JSON.stringify([{
          id: ordNum, userId: user.id, status: "Pendiente", paymentMethod: method,
          total, createdAt: new Date().toISOString(), contact,
          items: items.map(i => ({ slug:i.slug, name:i.name, img:i.img, price:i.price, quantity:i.quantity })),
        }, ...existing]));
      } catch {}
    }
  }

  const [confirming,     setConfirming]     = useState(false);
  // Snapshots captured before clearCart() so SuccessScreen has correct data
  const [snapItems,      setSnapItems]      = useState<typeof items>([]);
  const [snapTotal,      setSnapTotal]      = useState(0);
  const [snapCurrency,   setSnapCurrency]   = useState("PEN");

  async function handleConfirm() {
    setConfirming(true);
    const finalTotal  = calcFinalPrice(totalPrice, paidWith, rates);
    const txCurrency  = ["paypal","binance"].includes(paidWith) ? "USD" : paidWith === "bizum" ? "EUR" : "PEN";
    // Snapshot BEFORE clearing cart
    setSnapItems([...items]);
    setSnapTotal(finalTotal);
    setSnapCurrency(txCurrency);
    await saveOrder(paidWith, finalTotal, orderNumber);
    clearCart();
    setConfirming(false);
    setModal(null);
    setSuccess(true);
  }

  if (success) {
    return (
      <SuccessScreen
        total={snapTotal}
        paymentMethod={paidWith}
        currencyUsed={snapCurrency}
        items={snapItems}
        contact={contact}
        orderNumber={orderNumber}
      />
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/games/fortnite"
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:opacity-70 transition-all"
              style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
              <ArrowLeft size={16}/>
            </Link>
            <div>
              <h1 className="text-lg font-bold" style={{ color:"var(--text)" }}>{t.checkout.title}</h1>
              <nav className="flex items-center gap-1.5 text-[11px]" style={{ color:"var(--text-subtle)" }}>
                <Link href="/" className="hover:opacity-80">{t.checkout.home}</Link>
                <ChevronRight size={10}/>
                <Link href="/games/fortnite" className="hover:opacity-80">{t.checkout.shop}</Link>
                <ChevronRight size={10}/>
                <span style={{ color:"var(--text)" }}>{t.checkout.title}</span>
              </nav>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
            <CheckoutForm onMethodChange={setSelectedMethod} onOpenModal={(m, c) => {
              setPaidWith(m);
              setContact(c);
              setOrderNumber(genOrderNumber());
              setModal(m);
            }}/>
            <div className="lg:sticky lg:top-[90px]">
              <OrderSummary selectedMethod={selectedMethod}/>
            </div>
          </div>
        </div>
      </main>
      <Footer/>

      {modal && (
        <PaymentModal
          paymentId={modal}
          total={calcFinalPrice(totalPrice, modal, rates)}
          onConfirm={handleConfirm}
          onClose={() => !confirming && setModal(null)}
          loading={confirming}
        />
      )}
    </>
  );
}
