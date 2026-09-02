"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, ShoppingBag, Users, LogOut, Shield,
  Clock, Check, X, Search, ChevronDown, RefreshCw, Package,
  Menu, AlertCircle, Eye, EyeOff, CheckCircle, XCircle,
  RotateCcw, Truck, Copy, CheckCheck, ExternalLink,
  Phone, Mail, Calendar, Hash, Bell, BellOff, MessageCircle,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useVisibility } from "@/context/VisibilityContext";
import { gameKey, tabKey, productKey, isVisible as isVisibleBase } from "@/config/visibility";
import { CATALOG } from "@/config/catalog";
import { games } from "@/data";
import Link from "next/link";

// ══════════════════════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════════════════════
interface OrderItem {
  slug: string; name: string; img: string;
  price: number; quantity: number; total: string;
}
interface Order {
  dbId: string;          // PK interna del backend — clave para cambiar estado
  id: string;            // número de pedido visible al cliente (order_id)
  email: string;
  customerName: string;
  phone?: string;
  status: string;        // pendiente | procesando | entregado | cancelado
  createdAt: string;
  updatedAt?: string;
  paymentMethod: string;
  total: number;
  currency: string;
  formData: Record<string, string>;
  items: OrderItem[];
}
interface Cliente {
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
  registered: boolean;
}

// ══════════════════════════════════════════════════════════════
// Helpers
// ══════════════════════════════════════════════════════════════
function currencySymbol(c?: string): string {
  const s = (c || "PEN").toUpperCase();
  if (s === "PEN") return "S/";
  if (s === "EUR") return "€";
  if (s === "USD") return "$";
  return s;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yy}, ${hh}:${mi}`;
  } catch { return iso; }
}

function relativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return "";
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 45) return "ahora mismo";
  if (s < 3600) return `hace ${Math.floor(s / 60)} min`;
  if (s < 86400) return `hace ${Math.floor(s / 3600)} h`;
  if (s < 604800) return `hace ${Math.floor(s / 86400)} d`;
  return formatDate(iso).split(",")[0];
}

/** Dinero agrupado por moneda: los pedidos vienen en PEN, USD y EUR y no se
 *  pueden sumar entre sí. */
type Money = Record<string, number>;
function sumMoney(orders: Order[]): Money {
  return orders.reduce((acc, o) => {
    const c = (o.currency || "PEN").toUpperCase();
    acc[c] = (acc[c] || 0) + (o.total || 0);
    return acc;
  }, {} as Money);
}
function fmtMoney(m: Money): string {
  const parts = Object.entries(m)
    .filter(([, v]) => Math.abs(v) > 0.005)
    .sort((a, b) => b[1] - a[1])
    .map(([c, v]) => `${currencySymbol(c)} ${v.toFixed(2)}`);
  return parts.length ? parts.join("  ·  ") : "S/ 0.00";
}
function money1(amount: number, currency?: string): string {
  return `${currencySymbol(currency)} ${(amount || 0).toFixed(2)}`;
}

/** Teléfono → formato wa.me (solo dígitos, prefijo Perú si hace falta). */
function waPhone(raw?: string): string | null {
  if (!raw) return null;
  let d = raw.replace(/\D/g, "");
  if (!d) return null;
  if (d.length === 9) d = "51" + d;                       // móvil Perú sin código
  else if (d.length === 10 && d.startsWith("0")) d = "51" + d.slice(1);
  return d.length >= 8 ? d : null;
}
function waLink(phone: string | undefined, message: string): string | null {
  const p = waPhone(phone);
  return p ? `https://wa.me/${p}?text=${encodeURIComponent(message)}` : null;
}

const FORM_LABELS: Record<string, string> = {
  epicUser: "Usuario Epic", gameName: "Nombre en juego", platform: "Plataforma",
  riotId: "Riot ID", uid: "UID", server: "Servidor", user: "Cuenta / correo",
  trainerCode: "Código entrenador", discordTag: "Discord", notes: "Notas",
};
function formLabel(k: string) { return FORM_LABELS[k] || k.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase()); }

// ── Status ─────────────────────────────────────────────────────
// El backend solo acepta 4 estados: pending | processing | delivered | cancelled
const STATUS: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode; api: string }> = {
  pendiente:  { label: "Pendiente",  color: "#F59E0B", bg: "rgba(245,158,11,0.10)", border: "rgba(245,158,11,0.28)", icon: <Clock size={12} />,       api: "pending" },
  procesando: { label: "Procesando", color: "#60A5FA", bg: "rgba(96,165,250,0.10)", border: "rgba(96,165,250,0.28)", icon: <RotateCcw size={12} />,   api: "processing" },
  entregado:  { label: "Entregado",  color: "#22C55E", bg: "rgba(34,197,94,0.10)",  border: "rgba(34,197,94,0.28)",  icon: <CheckCircle size={12} />, api: "delivered" },
  cancelado:  { label: "Cancelado",  color: "#EF4444", bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.28)",  icon: <XCircle size={12} />,     api: "cancelled" },
};
const STATUS_ORDER = ["pendiente", "procesando", "entregado", "cancelado"];
/** Siguiente paso lógico del flujo (para el botón rápido). */
const NEXT_STATUS: Record<string, string | null> = {
  pendiente: "procesando", procesando: "entregado", entregado: null, cancelado: null,
};
function apiToUi(s: string): string {
  return s === "pending" ? "pendiente" : s === "processing" ? "procesando"
    : s === "delivered" ? "entregado" : s === "cancelled" ? "cancelado" : s;
}

const PAYMENT: Record<string, { label: string; color: string; bg: string }> = {
  yape:          { label: "Yape",          color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
  plin:          { label: "Plin",          color: "#22D3EE", bg: "rgba(34,211,238,0.12)" },
  transferencia: { label: "Transferencia", color: "#60A5FA", bg: "rgba(96,165,250,0.12)" },
  paypal:        { label: "PayPal",        color: "#3B82F6", bg: "rgba(59,130,246,0.14)" },
  binance:       { label: "Binance",       color: "#F0B90B", bg: "rgba(240,185,11,0.12)" },
  bizum:         { label: "Bizum",         color: "#22D3EE", bg: "rgba(34,211,238,0.12)" },
};
function paymentInfo(m: string) { return PAYMENT[m] ?? { label: m || "—", color: "#A78BFA", bg: "rgba(167,139,250,0.12)" }; }

// ── Shared styles ──────────────────────────────────────────────
const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16 };
const cardInner = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12 };

const NAV = [
  { id: "dashboard",   icon: <LayoutDashboard size={16} />, label: "Resumen" },
  { id: "pedidos",     icon: <ShoppingBag size={16} />,     label: "Pedidos" },
  { id: "clientes",    icon: <Users size={16} />,           label: "Clientes" },
  { id: "visibilidad", icon: <EyeOff size={16} />,          label: "Visibilidad" },
];

// ══════════════════════════════════════════════════════════════
// API
// ══════════════════════════════════════════════════════════════
async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`/api/admin-orders`, { cache: "no-store" });
    const json = await res.json();
    const raw = json.orders ?? json.data ?? [];
    if (!Array.isArray(raw)) return [];

    // Defensa: deduplicar por número de pedido + email (por si quedan filas
    // duplicadas antiguas). Se conserva la más reciente.
    const seen = new Map<string, any>();
    for (const o of raw) {
      const key = `${o.userEmail ?? ""}::${o.orderId ?? o.id}`;
      const prev = seen.get(key);
      if (!prev || new Date(o.updatedAt || o.createdAt) >= new Date(prev.updatedAt || prev.createdAt)) {
        seen.set(key, o);
      }
    }

    return Array.from(seen.values()).map((o: any): Order => {
      const fd = o.formData || {};
      return {
        dbId: String(o.id ?? o.orderId),
        id: String(o.orderId ?? o.id),
        email: (o.userEmail || "").toLowerCase(),
        customerName: fd.name || (o.userEmail || "").split("@")[0] || "Cliente",
        phone: fd.phone || undefined,
        status: apiToUi(o.status),
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        paymentMethod: o.paymentMethod || "",
        total: typeof o.total === "number" ? o.total : parseFloat(o.total) || 0,
        currency: (o.currency || "PEN").toUpperCase(),
        formData: fd,
        items: (o.items || []).map((i: any): OrderItem => ({
          slug: i.id, name: i.name, img: i.image || "",
          price: i.price, quantity: i.quantity, total: `${i.price * i.quantity}`,
        })),
      };
    });
  } catch { return []; }
}

async function fetchClientes(orders: Order[]): Promise<Cliente[]> {
  let registered: any[] = [];
  try {
    const res = await fetch(`/api/admin-users`, { cache: "no-store" });
    const json = await res.json();
    registered = Array.isArray(json.users) ? json.users : [];
  } catch { /* sin endpoint / caído → solo invitados */ }

  const map = new Map<string, Cliente>();
  for (const u of registered) {
    const email = (u.email || "").toLowerCase();
    if (!email) continue;
    map.set(email, {
      email, name: u.username || email.split("@")[0],
      phone: u.phone || undefined, createdAt: u.createdAt, registered: true,
    });
  }
  for (const o of orders) {
    if (!o.email) continue;
    const ex = map.get(o.email);
    if (!ex) {
      map.set(o.email, {
        email: o.email, name: o.customerName, phone: o.phone,
        createdAt: o.createdAt, registered: false,
      });
    } else if (!ex.phone && o.phone) {
      ex.phone = o.phone;
    }
  }
  return Array.from(map.values());
}

async function pushStatus(dbId: string, uiStatus: string) {
  const api = STATUS[uiStatus]?.api ?? uiStatus;
  try {
    const res = await fetch(`/api/admin-orders/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(dbId), status: api }),
    });
    return res.ok;
  } catch { return false; }
}

// ══════════════════════════════════════════════════════════════
// Small shared UI
// ══════════════════════════════════════════════════════════════
function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-all hover:opacity-70 flex-shrink-0"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.42)" }}>
      {copied ? <CheckCheck size={10} /> : <Copy size={10} />}
      {copied ? "Copiado" : (label ?? "Copiar")}
    </button>
  );
}

function StatusPill({ status }: { status: string }) {
  const s = STATUS[status] ?? STATUS.pendiente;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
      {s.icon} {s.label}
    </span>
  );
}

function WhatsAppButton({ order, compact }: { order: Order; compact?: boolean }) {
  const msg = [
    `¡Hola ${order.customerName}! 👋 Te escribo de KidStore por tu pedido #${order.id}:`,
    "",
    ...order.items.map(i => `• ${i.name}${i.quantity > 1 ? ` x${i.quantity}` : ""}`),
    "",
    `Total: ${money1(order.total, order.currency)} — ${paymentInfo(order.paymentMethod).label}`,
    "",
    order.status === "pendiente"
      ? "¿Me confirmas el comprobante de pago para procesarlo? 🎮"
      : "Seguimos con la entrega. Cualquier duda me dices. 🎮",
  ].join("\n");
  const link = waLink(order.phone, msg);
  if (!link) return (
    <span className="text-[10px] px-2 py-1.5 rounded-lg" style={{ color: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.03)" }}>
      Sin teléfono
    </span>
  );
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-1.5 rounded-lg font-bold transition-all hover:scale-[1.03]"
      style={{
        background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff",
        fontSize: compact ? 11 : 12, padding: compact ? "6px 10px" : "8px 12px",
      }}>
      <MessageCircle size={compact ? 12 : 13} /> WhatsApp
    </a>
  );
}

function orderSummaryText(o: Order): string {
  return [
    `Pedido #${o.id} — ${STATUS[o.status]?.label ?? o.status}`,
    `Cliente: ${o.customerName}`,
    `Email: ${o.email}`,
    o.phone ? `Teléfono: ${o.phone}` : null,
    "",
    ...o.items.map(i => `• ${i.name} x${i.quantity} — ${money1(i.price * i.quantity, o.currency)}`),
    "",
    `Total: ${money1(o.total, o.currency)} (${paymentInfo(o.paymentMethod).label})`,
    ...Object.entries(o.formData).filter(([k]) => !["name", "phone"].includes(k)).map(([k, v]) => `${formLabel(k)}: ${v}`),
    `Fecha: ${formatDate(o.createdAt)}`,
  ].filter(Boolean).join("\n");
}

// ══════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const router = useRouter();
  const { admin, loading, logoutAdmin } = useAdminAuth();
  const [tab, setTab] = useState("dashboard");
  const [sidebar, setSidebar] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => { if (!loading && !admin) router.push("/admin/login"); }, [admin, loading, router]);

  const refresh = useCallback(async () => {
    const ords = await fetchOrders();
    setOrders(ords);
    setClientes(await fetchClientes(ords));
    setLastSync(new Date());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    const iv = setInterval(refresh, 10000);
    return () => clearInterval(iv);
  }, [refresh]);

  // ── Notificaciones ───────────────────────────────────────────
  const audioRef = useRef<AudioContext | null>(null);
  const knownIds = useRef<Set<string>>(new Set());
  const firstLoad = useRef(true);
  const [toast, setToast] = useState<Order | null>(null);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission | "unsupported">("unsupported");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPerm(Notification.permission);
    }
    // Desbloquear el audio con la primera interacción (política de autoplay).
    const unlock = () => {
      if (!audioRef.current) {
        try { audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch {}
      }
      audioRef.current?.resume().catch(() => {});
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => { window.removeEventListener("pointerdown", unlock); window.removeEventListener("keydown", unlock); };
  }, []);

  function playChime() {
    const ctx = audioRef.current;
    if (!ctx) return;
    try {
      ctx.resume();
      const beep = (freq: number, at: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        const t0 = ctx.currentTime + at;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.35, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.42);
        osc.start(t0); osc.stop(t0 + 0.42);
      };
      beep(880, 0); beep(1174, 0.16);
    } catch {}
  }

  async function enableNotifs() {
    if (!("Notification" in window)) return;
    const p = await Notification.requestPermission();
    setNotifPerm(p);
  }

  useEffect(() => {
    if (orders.length === 0) return;
    if (firstLoad.current) {
      orders.forEach(o => knownIds.current.add(o.dbId));
      firstLoad.current = false;
      return;
    }
    const fresh = orders.filter(o => !knownIds.current.has(o.dbId));
    orders.forEach(o => knownIds.current.add(o.dbId));
    if (fresh.length === 0) return;

    const latest = [...fresh].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    playChime();
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`🛒 Nuevo pedido #${latest.id}`, {
        body: `${latest.customerName} — ${money1(latest.total, latest.currency)}`,
        icon: "/logo/isotipo-kidstore.png",
      });
    }
    setToast(latest);
    setTimeout(() => setToast(null), 25000);
  }, [orders]);

  if (loading || !admin) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#080C18" }}>
      <span className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "#EA580C", borderTopColor: "transparent" }} />
    </div>
  );

  const pending = orders.filter(o => o.status === "pendiente").length;

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: "#080C18", color: "#E6EDF3" }}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100]" style={{ animation: "fadeSlideIn 0.3s ease" }}>
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl"
            style={{ background: "linear-gradient(135deg,#7C3AED,#5B21B6)", border: "1px solid rgba(255,255,255,0.15)", minWidth: 320 }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
              <ShoppingBag size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white/70">🔔 Nuevo pedido #{toast.id}</p>
              <p className="text-sm font-bold text-white truncate">{toast.customerName}</p>
              <p className="text-xs text-white/50">{money1(toast.total, toast.currency)}</p>
            </div>
            <button onClick={() => { setToast(null); setTab("pedidos"); }}
              className="text-[10px] px-3 py-1.5 rounded-lg font-bold text-white flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
              Ver
            </button>
            <button onClick={() => setToast(null)} className="text-white/40 hover:text-white/80 flex-shrink-0"><X size={14} /></button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebar ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#0A0F1C", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <Image src="/logo/imagotipo-kidstore.png" alt="KidStore" width={120} height={44}
            className="object-contain" style={{ filter: "brightness(0) invert(1)" }} />
        </div>

        <div className="mx-3 mt-4 mb-2 px-3 py-3 rounded-2xl" style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.14)" }}>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#7C3AED,#EA580C)" }}>
              {admin.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-white truncate">{admin.name}</p>
              <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{admin.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 ml-[42px]">
            <Shield size={9} style={{ color: "#7C3AED" }} />
            <span className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: "#7C3AED" }}>
              {admin.role === "owner" ? "Propietario" : "Colaborador"}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 mt-2 space-y-0.5 overflow-y-auto">
          {NAV.map(item => {
            const active = tab === item.id;
            return (
              <button key={item.id} onClick={() => { setTab(item.id); setSidebar(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all text-left"
                style={{ background: active ? "rgba(124,58,237,0.10)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.38)" }}>
                <span style={{ color: active ? "#7C3AED" : "rgba(255,255,255,0.22)" }}>{item.icon}</span>
                {item.label}
                {item.id === "pedidos" && pending > 0 && (
                  <span className="ml-auto text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full"
                    style={{ background: "rgba(245,158,11,0.18)", color: "#F59E0B" }}>{pending}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <button onClick={() => { logoutAdmin(); router.push("/admin/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:opacity-70"
            style={{ color: "#EF4444", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}>
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {sidebar && <div className="fixed inset-0 z-40 lg:hidden" style={{ background: "rgba(0,0,0,0.65)" }} onClick={() => setSidebar(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-4 lg:px-6 h-14 flex-shrink-0"
          style={{ background: "#0A0F1C", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3 min-w-0">
            <button className="lg:hidden" onClick={() => setSidebar(true)} style={{ color: "rgba(255,255,255,0.5)" }}><Menu size={20} /></button>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-white truncate">{NAV.find(n => n.id === tab)?.label}</p>
              {lastSync && (
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Actualizado {relativeTime(lastSync.toISOString())}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Notif state */}
            {notifPerm === "granted" ? (
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold"
                style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#22C55E" }}>
                <Bell size={12} /> Avisos activos
              </span>
            ) : notifPerm === "denied" ? (
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#F87171" }}>
                <BellOff size={12} /> Avisos bloqueados
              </span>
            ) : notifPerm !== "unsupported" ? (
              <button onClick={enableNotifs}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:opacity-80"
                style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" }}>
                <Bell size={12} /> Activar avisos
              </button>
            ) : null}
            <button onClick={refresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all hover:opacity-70"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.42)" }}>
              <RefreshCw size={12} /> Actualizar
            </button>
            <Link href="/" target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-xl transition-all hover:opacity-70"
              style={{ background: "rgba(234,88,12,0.08)", border: "1px solid rgba(234,88,12,0.2)", color: "#EA580C" }}>
              <ExternalLink size={12} /> Ver tienda
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6" style={{ background: "#080C18" }}>
          {tab === "dashboard"   && <TabDashboard orders={orders} clientes={clientes} onChangeTab={setTab} onRefresh={refresh} />}
          {tab === "pedidos"     && <TabPedidos orders={orders} onRefresh={refresh} />}
          {tab === "clientes"    && <TabClientes clientes={clientes} orders={orders} />}
          {tab === "visibilidad" && <TabVisibilidad />}
        </main>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// RESUMEN
// ══════════════════════════════════════════════════════════════
function TabDashboard({ orders, clientes, onChangeTab, onRefresh }: {
  orders: Order[]; clientes: Cliente[]; onChangeTab: (t: string) => void; onRefresh: () => void;
}) {
  const pending = orders.filter(o => o.status === "pendiente");
  const processing = orders.filter(o => o.status === "procesando");
  const delivered = orders.filter(o => o.status === "entregado");

  const todayKey = new Date().toISOString().slice(0, 10);
  const ordersToday = orders.filter(o => (o.createdAt || "").slice(0, 10) === todayKey);

  // Ingresos entregados (por moneda — no se suman entre sí)
  const revenue = sumMoney(delivered);

  // Últimos 14 días — nº de pedidos por día (agnóstico de moneda)
  const days: { key: string; label: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({
      key,
      label: String(d.getDate()),
      count: orders.filter(o => (o.createdAt || "").slice(0, 10) === key).length,
    });
  }
  const maxDay = Math.max(...days.map(d => d.count), 1);

  // Top productos por unidades
  const prodMap = new Map<string, { name: string; units: number }>();
  for (const o of orders) for (const it of o.items) {
    const e = prodMap.get(it.name) || { name: it.name, units: 0 };
    e.units += it.quantity;
    prodMap.set(it.name, e);
  }
  const topProducts = [...prodMap.values()].sort((a, b) => b.units - a.units).slice(0, 6);

  const KPIS = [
    { label: "Pendientes",  value: String(pending.length),    color: "#F59E0B", icon: <Clock size={17} />,      hint: pending.length ? "Requieren tu atención" : "Todo al día", go: "pedidos" },
    { label: "En proceso",  value: String(processing.length), color: "#60A5FA", icon: <RotateCcw size={17} />,  hint: "Los estás atendiendo" },
    { label: "Entregados",  value: String(delivered.length),  color: "#22C55E", icon: <CheckCircle size={17} />, hint: "Completados con éxito" },
    { label: "Pedidos hoy", value: String(ordersToday.length), color: "#A78BFA", icon: <ShoppingBag size={17} />, hint: `${orders.length} en total` },
  ];

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KPIS.map(k => (
          <button key={k.label} onClick={() => k.go && onChangeTab(k.go)}
            className={`rounded-2xl p-4 text-left ${k.go ? "cursor-pointer hover:opacity-90 transition-all" : "cursor-default"}`}
            style={{ ...card, ...(k.go && pending.length ? { border: "1px solid rgba(245,158,11,0.28)" } : {}) }}>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${k.color}18`, color: k.color }}>{k.icon}</div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.35)" }}>{k.label}</p>
            </div>
            <p className="text-2xl font-black mb-0.5" style={{ color: k.color }}>{k.value}</p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}>{k.hint}</p>
          </button>
        ))}
      </div>

      {/* Ingresos + clientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-2xl p-4" style={card}>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>Ingresos (pedidos entregados)</p>
          <p className="text-xl font-black" style={{ color: "#22C55E" }}>{fmtMoney(revenue)}</p>
          <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.28)" }}>Cada moneda por separado — no se convierten entre sí</p>
        </div>
        <div className="rounded-2xl p-4 flex items-center justify-between" style={card}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>Clientes</p>
            <p className="text-xl font-black" style={{ color: "#7C3AED" }}>{clientes.length}</p>
            <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.28)" }}>
              {clientes.filter(c => c.registered).length} registrados · {clientes.filter(c => !c.registered).length} invitados
            </p>
          </div>
          <button onClick={() => onChangeTab("clientes")} className="text-[11px] font-semibold hover:opacity-70" style={{ color: "#7C3AED" }}>Ver todos →</button>
        </div>
      </div>

      {/* Necesitan atención */}
      <div className="rounded-2xl overflow-hidden" style={card}>
        <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-[13px] font-bold text-white flex items-center gap-2">
            {pending.length > 0 && <span className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />}
            Pedidos por atender
          </p>
          {pending.length > 0 && <button onClick={() => onChangeTab("pedidos")} className="text-[11px] font-semibold hover:opacity-70" style={{ color: "#7C3AED" }}>Ir a pedidos →</button>}
        </div>
        {pending.length === 0 ? (
          <div className="p-10 text-center">
            <CheckCircle size={26} className="mx-auto mb-2" style={{ color: "rgba(34,197,94,0.4)" }} />
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>No hay pedidos pendientes. ¡Bien!</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {pending.slice(0, 6).map(o => (
              <OrderRow key={o.dbId} order={o} onRefresh={onRefresh} />
            ))}
          </div>
        )}
      </div>

      {/* Chart + top productos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl p-5" style={card}>
          <p className="text-[13px] font-bold text-white mb-4">Pedidos · últimos 14 días</p>
          <div className="flex gap-1.5 h-36">
            {days.map(d => (
              <div key={d.key} className="flex-1 flex flex-col justify-end items-center gap-1.5 group">
                <span className="text-[9px] font-bold transition-opacity" style={{ color: "#A78BFA", opacity: d.count > 0 ? 1 : 0 }}>{d.count}</span>
                <div className="w-full rounded-md transition-all" style={{
                  height: `${Math.max((d.count / maxDay) * 100, 2)}%`,
                  minHeight: d.count > 0 ? 8 : 3,
                  background: d.count > 0 ? "linear-gradient(180deg,#8B5CF6,#6D28D9)" : "rgba(255,255,255,0.06)",
                }} />
                <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden" style={card}>
          <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-[13px] font-bold text-white">Productos más vendidos</p>
          </div>
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
            {topProducts.length === 0 && <div className="p-6 text-center text-[12px]" style={{ color: "rgba(255,255,255,0.2)" }}>Sin datos</div>}
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 px-5 py-2.5">
                <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{ background: i === 0 ? "rgba(234,88,12,0.15)" : "rgba(255,255,255,0.04)", color: i === 0 ? "#EA580C" : "rgba(255,255,255,0.3)" }}>{i + 1}</span>
                <p className="text-[12px] font-medium truncate flex-1 text-white/90">{p.name}</p>
                <span className="text-[11px] font-bold flex-shrink-0" style={{ color: "#A78BFA" }}>{p.units}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Fila de pedido reutilizable (resumen + acciones rápidas)
// ══════════════════════════════════════════════════════════════
function OrderRow({ order, onRefresh }: { order: Order; onRefresh: () => void }) {
  const [busy, setBusy] = useState(false);
  const next = NEXT_STATUS[order.status];

  async function advance() {
    if (!next) return;
    setBusy(true);
    await pushStatus(order.dbId, next);
    await onRefresh();
    setBusy(false);
  }

  return (
    <div className="px-5 py-3 flex items-center gap-3 flex-wrap">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-[13px] font-black text-white">#{order.id}</span>
          <StatusPill status={order.status} />
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{relativeTime(order.createdAt)}</span>
        </div>
        <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
          {order.customerName} · {order.items.map(i => i.name).join(", ")}
        </p>
      </div>
      <span className="text-[14px] font-black flex-shrink-0" style={{ color: "#EA580C" }}>{money1(order.total, order.currency)}</span>
      <WhatsAppButton order={order} compact />
      {next && (
        <button onClick={advance} disabled={busy}
          className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80 disabled:opacity-40"
          style={{ background: STATUS[next].bg, border: `1px solid ${STATUS[next].border}`, color: STATUS[next].color }}>
          {busy ? "..." : <>{STATUS[next].icon} {STATUS[next].label}</>}
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PEDIDOS
// ══════════════════════════════════════════════════════════════
function TabPedidos({ orders, onRefresh }: { orders: Order[]; onRefresh: () => void }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("todos");
  const [range, setRange] = useState("todos");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const RANGES: Record<string, number> = { hoy: 86400000, "7d": 7 * 86400000, "30d": 30 * 86400000, todos: 0 };
  const now = Date.now();

  const filtered = orders
    .filter(o => {
      if (status !== "todos" && o.status !== status) return false;
      if (RANGES[range] && now - new Date(o.createdAt).getTime() > RANGES[range]) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = o.id.includes(q) || o.customerName.toLowerCase().includes(q)
          || o.email.includes(q) || (o.phone || "").includes(q)
          || o.items.some(i => i.name.toLowerCase().includes(q));
        if (!hay) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const counts: Record<string, number> = { todos: orders.length };
  orders.forEach(o => { counts[o.status] = (counts[o.status] ?? 0) + 1; });

  async function setStatusOf(dbId: string, ui: string) {
    setBusy(dbId);
    await pushStatus(dbId, ui);
    await onRefresh();
    setBusy(null);
  }

  return (
    <div className="space-y-4">
      {/* Filtros de estado */}
      <div className="flex flex-wrap gap-1.5">
        {[{ id: "todos", label: "Todos" }, ...STATUS_ORDER.map(s => ({ id: s, label: STATUS[s].label }))].map(f => {
          const active = status === f.id;
          const sc = STATUS[f.id];
          return (
            <button key={f.id} onClick={() => setStatus(f.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all"
              style={{
                background: active ? (sc?.bg ?? "rgba(124,58,237,0.12)") : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? (sc?.border ?? "rgba(124,58,237,0.3)") : "rgba(255,255,255,0.06)"}`,
                color: active ? (sc?.color ?? "#7C3AED") : "rgba(255,255,255,0.35)",
              }}>
              {active && sc?.icon}
              {f.label}
              {(counts[f.id] ?? 0) > 0 && <span className="font-black text-[10px] opacity-70">({counts[f.id]})</span>}
            </button>
          );
        })}
      </div>

      {/* Fecha + búsqueda */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1.5">
          {[{ id: "todos", label: "Siempre" }, { id: "hoy", label: "Hoy" }, { id: "7d", label: "7 días" }, { id: "30d", label: "30 días" }].map(r => (
            <button key={r.id} onClick={() => setRange(r.id)}
              className="px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all"
              style={{
                background: range === r.id ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${range === r.id ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}`,
                color: range === r.id ? "#7C3AED" : "rgba(255,255,255,0.35)",
              }}>{r.label}</button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.22)" }} />
          <input type="text" placeholder="Buscar por #, cliente, email, teléfono o producto…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-[13px] outline-none text-white placeholder:text-white/20" style={card} />
        </div>
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl p-14 text-center" style={card}>
          <Package size={30} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.1)" }} />
          <p className="text-[14px] font-bold text-white mb-1">Sin pedidos</p>
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.28)" }}>No hay resultados para este filtro</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(order => {
            const sc = STATUS[order.status] ?? STATUS.pendiente;
            const exp = expanded === order.id;
            const pm = paymentInfo(order.paymentMethod);
            const next = NEXT_STATUS[order.status];
            const gameData = Object.entries(order.formData).filter(([k, v]) => !["name", "phone"].includes(k) && v);

            return (
              <div key={order.dbId} className="rounded-2xl overflow-hidden transition-all"
                style={{ ...card, ...(exp ? { border: `1px solid ${sc.border}` } : {}) }}>

                {/* Cabecera */}
                <div className="px-4 lg:px-5 py-4 flex items-start gap-3 cursor-pointer" onClick={() => setExpanded(exp ? null : order.id)}>
                  <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: sc.color, opacity: 0.75, minHeight: 40 }} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[14px] font-black text-white">#{order.id}</span>
                      <StatusPill status={order.status} />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: pm.color, background: pm.bg }}>{pm.label}</span>
                      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{relativeTime(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-x-3 gap-y-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>
                        <Users size={10} /> {order.customerName}
                      </span>
                      {order.phone && (
                        <span className="flex items-center gap-1 text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                          <Phone size={10} /> {order.phone}
                        </span>
                      )}
                      <span className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.28)" }}>
                        {order.items.map(i => `${i.name}${i.quantity > 1 ? ` x${i.quantity}` : ""}`).join(" · ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p className="text-[16px] font-black" style={{ color: "#EA580C" }}>{money1(order.total, order.currency)}</p>
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <WhatsAppButton order={order} compact />
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}
                        onClick={() => setExpanded(exp ? null : order.id)}>
                        <ChevronDown size={14} className={`transition-transform ${exp ? "rotate-180" : ""}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalle */}
                {exp && (
                  <div className="border-t px-4 lg:px-5 py-5 space-y-5" style={{ borderColor: "rgba(255,255,255,0.05)" }}>

                    {/* Contacto */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2.5" style={{ color: "rgba(255,255,255,0.28)" }}>Contacto</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl" style={cardInner}>
                          <div className="flex items-center gap-2 min-w-0">
                            <Mail size={11} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                            <div className="min-w-0">
                              <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.25)" }}>Email</p>
                              <p className="text-[12px] font-semibold text-white truncate">{order.email}</p>
                            </div>
                          </div>
                          <CopyBtn text={order.email} />
                        </div>
                        <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl" style={cardInner}>
                          <div className="flex items-center gap-2 min-w-0">
                            <Phone size={11} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                            <div className="min-w-0">
                              <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.25)" }}>Teléfono</p>
                              <p className="text-[12px] font-semibold text-white truncate">{order.phone || "No registrado"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {order.phone && <CopyBtn text={order.phone} />}
                            <WhatsAppButton order={order} compact />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Datos del juego */}
                    {gameData.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2.5" style={{ color: "rgba(255,255,255,0.28)" }}>Datos para la entrega</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {gameData.map(([k, v]) => (
                            <div key={k} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl" style={cardInner}>
                              <div className="min-w-0">
                                <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.25)" }}>{formLabel(k)}</p>
                                <p className="text-[12px] font-semibold text-white truncate">{String(v)}</p>
                              </div>
                              <CopyBtn text={String(v)} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Productos */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2.5" style={{ color: "rgba(255,255,255,0.28)" }}>Productos</p>
                      <div className="space-y-1.5">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={cardInner}>
                            <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
                              {item.img && <img src={item.img} alt={item.name} className="w-full h-full object-contain p-1"
                                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-white truncate">{item.name}</p>
                              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                                {item.quantity} × {money1(item.price, order.currency)}
                              </p>
                            </div>
                            <p className="text-[13px] font-black flex-shrink-0" style={{ color: "#EA580C" }}>{money1(item.price * item.quantity, order.currency)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 mt-2 rounded-xl"
                        style={{ background: "rgba(234,88,12,0.06)", border: "1px solid rgba(234,88,12,0.15)" }}>
                        <span className="text-[12px] font-bold px-2 py-0.5 rounded-full" style={{ color: pm.color, background: pm.bg }}>{pm.label}</span>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-[0.08em] font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>Total</p>
                          <p className="text-xl font-black" style={{ color: "#EA580C" }}>{money1(order.total, order.currency)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.28)" }}>Estado del pedido</p>
                        <CopyBtn text={orderSummaryText(order)} label="Copiar resumen" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_ORDER.map(key => {
                          const s = STATUS[key];
                          const active = order.status === key;
                          const loading = busy === order.dbId;
                          return (
                            <button key={key} disabled={active || loading} onClick={() => setStatusOf(order.dbId, key)}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all hover:opacity-80 disabled:cursor-default"
                              style={{
                                background: active ? s.bg : "rgba(255,255,255,0.03)",
                                border: `1px solid ${active ? s.border : "rgba(255,255,255,0.06)"}`,
                                color: active ? s.color : "rgba(255,255,255,0.35)",
                                opacity: active ? 1 : loading ? 0.4 : 1,
                                ...(next === key && !active ? { boxShadow: `0 0 0 1px ${s.border}` } : {}),
                              }}>
                              {s.icon}
                              <span>{loading && !active ? "..." : s.label}</span>
                              {active && <Check size={12} />}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                        Creado {formatDate(order.createdAt)}{order.updatedAt && order.updatedAt !== order.createdAt ? ` · actualizado ${formatDate(order.updatedAt)}` : ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// CLIENTES
// ══════════════════════════════════════════════════════════════
function TabClientes({ clientes, orders }: { clientes: Cliente[]; orders: Order[] }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"todos" | "registrados" | "invitados">("todos");

  const ordersByEmail = new Map<string, Order[]>();
  for (const o of orders) {
    const arr = ordersByEmail.get(o.email) || [];
    arr.push(o);
    ordersByEmail.set(o.email, arr);
  }

  const enriched = clientes.map(c => {
    const os = (ordersByEmail.get(c.email) || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { ...c, orders: os, spent: sumMoney(os), lastOrder: os[0]?.createdAt };
  }).sort((a, b) => {
    const ta = a.lastOrder ? new Date(a.lastOrder).getTime() : new Date(a.createdAt).getTime();
    const tb = b.lastOrder ? new Date(b.lastOrder).getTime() : new Date(b.createdAt).getTime();
    return tb - ta;
  });

  const filtered = enriched.filter(c => {
    if (filter === "registrados" && !c.registered) return false;
    if (filter === "invitados" && c.registered) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.email.includes(q) || (c.phone || "").includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: clientes.length, color: "#7C3AED" },
          { label: "Registrados", value: clientes.filter(c => c.registered).length, color: "#22C55E" },
          { label: "Invitados", value: clientes.filter(c => !c.registered).length, color: "#60A5FA" },
        ].map(s => (
          <button key={s.label} onClick={() => setFilter(s.label === "Total" ? "todos" : s.label.toLowerCase() as any)}
            className="px-4 py-4 rounded-2xl text-left transition-all hover:opacity-90"
            style={{ ...card, ...(((filter === "todos" && s.label === "Total") || filter === s.label.toLowerCase()) ? { border: `1px solid ${s.color}44` } : {}) }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
            <p className="text-xl font-black mt-1" style={{ color: s.color }}>{s.value}</p>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.22)" }} />
        <input type="text" placeholder="Buscar por nombre, email o teléfono…" value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-[13px] outline-none text-white placeholder:text-white/20" style={card} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl p-14 text-center" style={card}>
          <Users size={30} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.1)" }} />
          <p className="text-[14px] font-bold text-white">Sin clientes</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(c => {
            const exp = expanded === c.email;
            const waMsg = `¡Hola ${c.name}! 👋 Te escribo de KidStore.`;
            const wa = waLink(c.phone, waMsg);
            return (
              <div key={c.email} className="rounded-2xl overflow-hidden" style={{ ...card, ...(exp ? { border: "1px solid rgba(124,58,237,0.25)" } : {}) }}>
                <div className="px-5 py-3.5 flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(exp ? null : c.email)}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#7C3AED,#EA580C)" }}>
                    {c.name[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-bold text-white truncate">{c.name}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={c.registered
                          ? { color: "#22C55E", background: "rgba(34,197,94,0.1)" }
                          : { color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)" }}>
                        {c.registered ? "Registrado" : "Invitado"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{c.email}</span>
                      {c.phone && <span className="flex items-center gap-1 text-[11px]" style={{ color: "rgba(255,255,255,0.28)" }}><Phone size={9} /> {c.phone}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-[12px] font-bold" style={{ color: "#7C3AED" }}>{c.orders.length} pedido{c.orders.length !== 1 ? "s" : ""}</p>
                      {Object.keys(c.spent).length > 0 && <p className="text-[10px]" style={{ color: "#22C55E" }}>{fmtMoney(c.spent)}</p>}
                    </div>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}>
                      <ChevronDown size={15} className={`transition-transform ${exp ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </div>

                {exp && (
                  <div className="border-t px-5 py-4 space-y-4" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { icon: <Mail size={11} />, label: "Email", value: c.email, copy: true },
                        { icon: <Phone size={11} />, label: "Teléfono", value: c.phone || "—", copy: !!c.phone },
                        { icon: <Hash size={11} />, label: "Tipo", value: c.registered ? "Cuenta registrada" : "Compró como invitado", copy: false },
                        { icon: <Calendar size={11} />, label: c.registered ? "Registro" : "Primer pedido", value: formatDate(c.createdAt), copy: false },
                      ].map(row => (
                        <div key={row.label} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl" style={cardInner}>
                          <div className="flex items-center gap-2 min-w-0">
                            <span style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>{row.icon}</span>
                            <div className="min-w-0">
                              <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.25)" }}>{row.label}</p>
                              <p className="text-[12px] font-semibold text-white truncate">{row.value}</p>
                            </div>
                          </div>
                          {row.copy && <CopyBtn text={row.value} />}
                        </div>
                      ))}
                    </div>

                    {wa && (
                      <a href={wa} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg font-bold text-[12px] px-3 py-2 transition-all hover:scale-[1.02]"
                        style={{ background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "#fff" }}>
                        <MessageCircle size={13} /> Escribir por WhatsApp
                      </a>
                    )}

                    {c.orders.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: "rgba(255,255,255,0.28)" }}>Historial ({c.orders.length})</p>
                        <div className="space-y-1.5">
                          {c.orders.map(o => (
                            <div key={o.dbId} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={cardInner}>
                              <span className="text-[12px] font-bold text-white">#{o.id}</span>
                              <StatusPill status={o.status} />
                              <span className="text-[11px] flex-1 truncate" style={{ color: "rgba(255,255,255,0.28)" }}>{o.items.map(i => i.name).join(", ")}</span>
                              <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>{relativeTime(o.createdAt)}</span>
                              <span className="text-[12px] font-black flex-shrink-0" style={{ color: "#EA580C" }}>{money1(o.total, o.currency)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// VISIBILIDAD — ocultar / mostrar juegos sin borrar nada
// ══════════════════════════════════════════════════════════════
function VisSwitch({ on, busy, onClick, label }: { on: boolean; busy: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      role="switch"
      aria-checked={on}
      aria-label={label}
      className="relative flex-shrink-0 w-10 h-[22px] rounded-full transition-colors"
      style={{
        background: on ? "#22C55E" : "rgba(255,255,255,0.12)",
        opacity: busy ? 0.4 : 1,
        cursor: busy ? "wait" : "pointer",
      }}>
      <span className="absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-all"
        style={{ left: on ? 20 : 2 }}/>
    </button>
  );
}

function TabVisibilidad() {
  const { overrides, setOverride, refresh } = useVisibility();
  const [config, setConfig]   = useState<Record<string, boolean>>(overrides);
  const [saving, setSaving]   = useState<string | null>(null);
  const [msg,    setMsg]      = useState<{ text: string; ok: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [openGame, setOpenGame] = useState<string | null>(null);
  const [openTab,  setOpenTab]  = useState<string | null>(null); // `${slug}:${tabId}`

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch("/api/site-config", { cache: "no-store" });
        const json = await res.json();
        if (json?.success && json.config && typeof json.config === "object") {
          setConfig(json.config);
        }
      } catch { /* se queda con lo que haya (cache) */ }
      finally { setLoading(false); }
    })();
  }, []);

  // Igual que en la tienda: override si existe, si no el default del código, si no visible.
  const visible = (key: string) => isVisibleBase(key, config);

  async function toggle(key: string, next: boolean, okText: string) {
    setSaving(key);
    setMsg(null);
    setConfig(prev => ({ ...prev, [key]: next }));
    setOverride(key, next);
    try {
      const res  = await fetch("/api/admin-site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: next }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.success) {
        const raw = json?.error || `Error ${res.status}`;
        throw new Error(
          /fetch failed|network|ECONNREFUSED|timeout|abort/i.test(raw)
            ? "No se pudo conectar con el servidor. Inténtalo de nuevo."
            : raw,
        );
      }
      if (json.config && typeof json.config === "object") setConfig(json.config);
      await refresh();
      setMsg({ text: okText, ok: true });
    } catch (err) {
      setConfig(prev => ({ ...prev, [key]: !next }));
      setOverride(key, !next);
      setMsg({ text: err instanceof Error ? err.message : "No se pudo guardar.", ok: false });
    } finally {
      setSaving(null);
      setTimeout(() => setMsg(null), 4000);
    }
  }

  const hiddenGames = games.filter(g => !visible(gameKey(g.slug))).length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="px-4 py-4 rounded-2xl flex items-center gap-3" style={card}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(34,197,94,0.08)", color:"#22C55E" }}>
            <Eye size={16}/>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color:"rgba(255,255,255,0.35)" }}>Juegos visibles</p>
            <p className="text-xl font-black" style={{ color:"#22C55E" }}>{games.length - hiddenGames}</p>
          </div>
        </div>
        <div className="px-4 py-4 rounded-2xl flex items-center gap-3" style={card}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(234,88,12,0.08)", color:"#EA580C" }}>
            <EyeOff size={16}/>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color:"rgba(255,255,255,0.35)" }}>Juegos ocultos</p>
            <p className="text-xl font-black" style={{ color:"#EA580C" }}>{hiddenGames}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl px-4 py-3 flex items-start gap-2.5" style={cardInner}>
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" style={{ color:"rgba(255,255,255,0.35)" }}/>
        <p className="text-[12px] leading-relaxed" style={{ color:"rgba(255,255,255,0.5)" }}>
          Apagar un juego, una pestaña o un producto lo quita de la tienda al instante
          <strong className="text-white/70"> sin borrar nada</strong>: los datos y el código quedan intactos y
          vuelve con un clic. La URL directa de algo oculto redirige a la lista de juegos.
        </p>
      </div>

      {msg && (
        <div className="rounded-2xl px-4 py-2.5 text-[12px] font-semibold"
          style={{
            background: msg.ok ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${msg.ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
            color: msg.ok ? "#22C55E" : "#EF4444",
          }}>
          {msg.ok ? "✓ " : "⚠ "}{msg.text}
        </div>
      )}

      {/* Árbol juego → pestañas → productos */}
      <div className="space-y-2">
        {CATALOG.map(g => {
          const gk       = gameKey(g.slug);
          const gVisible = visible(gk);
          const gImg     = games.find(x => x.slug === g.slug)?.image ?? "";
          const isOpen   = openGame === g.slug;
          return (
            <div key={g.slug} className="rounded-2xl overflow-hidden" style={{ ...card, opacity: gVisible ? 1 : 0.5 }}>
              {/* fila juego */}
              <div className="px-3 py-2.5 flex items-center gap-3">
                <button onClick={() => { setOpenGame(isOpen ? null : g.slug); setOpenTab(null); }}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left">
                  {gImg && (
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0" style={{ border:"1px solid rgba(255,255,255,0.06)" }}>
                      <Image src={gImg} alt={g.name} fill className="object-cover"/>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-white truncate">{g.name}</p>
                    <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.3)" }}>
                      {g.tabs.length} pestaña{g.tabs.length === 1 ? "" : "s"} &middot; {g.products.length} producto{g.products.length === 1 ? "" : "s"}
                      {g.extras?.length ? ` · ${g.extras.length} extra${g.extras.length === 1 ? "" : "s"}` : ""}
                    </p>
                  </div>
                  <ChevronDown size={15} style={{ color:"rgba(255,255,255,0.3)", transform: isOpen ? "rotate(180deg)" : "none", transition:"transform .15s" }}/>
                </button>
                <VisSwitch on={gVisible} busy={saving === gk}
                  onClick={() => toggle(gk, !gVisible, gVisible ? `"${g.name}" oculto.` : `"${g.name}" visible de nuevo.`)}
                  label={`${gVisible ? "Ocultar" : "Mostrar"} ${g.name}`}/>
              </div>

              {/* pestañas + productos */}
              {isOpen && (
                <div className="px-3 pb-3 space-y-1.5" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                  {(g.extras ?? []).map(ex => {
                    const ev = visible(ex.key);
                    return (
                      <div key={ex.key} className="rounded-xl mt-1.5 px-3 py-2 flex items-center gap-2"
                        style={{ background:"rgba(234,88,12,0.05)", opacity: ev ? 1 : 0.55 }}>
                        <span className="text-[12px] font-semibold text-white/80 flex-1 min-w-0 truncate">{ex.label}</span>
                        <VisSwitch on={ev} busy={saving === ex.key}
                          onClick={() => toggle(ex.key, !ev, ev ? `"${ex.label}" oculto.` : `"${ex.label}" visible.`)}
                          label={`${ev ? "Ocultar" : "Mostrar"} ${ex.label}`}/>
                      </div>
                    );
                  })}
                  {g.tabs.map(tb => {
                    const tk        = tabKey(g.slug, tb.id);
                    const tVisible  = visible(tk);
                    const tabProds  = g.products.filter(p => p.tab === tb.id);
                    const tabOpenId = `${g.slug}:${tb.id}`;
                    const tOpen     = openTab === tabOpenId;
                    return (
                      <div key={tb.id} className="rounded-xl mt-1.5" style={{ background:"rgba(255,255,255,0.02)", opacity: tVisible ? 1 : 0.55 }}>
                        <div className="px-3 py-2 flex items-center gap-2">
                          <button onClick={() => setOpenTab(tOpen ? null : tabOpenId)}
                            className="flex items-center gap-2 flex-1 min-w-0 text-left" disabled={tabProds.length === 0}>
                            <span className="text-[12px] font-semibold text-white/80 truncate">{tb.label}</span>
                            <span className="text-[10px]" style={{ color:"rgba(255,255,255,0.25)" }}>
                              {tabProds.length > 0 ? `${tabProds.length} prod.` : "—"}
                            </span>
                            {tabProds.length > 0 && (
                              <ChevronDown size={13} style={{ color:"rgba(255,255,255,0.25)", transform: tOpen ? "rotate(180deg)" : "none", transition:"transform .15s" }}/>
                            )}
                          </button>
                          <VisSwitch on={tVisible} busy={saving === tk}
                            onClick={() => toggle(tk, !tVisible, tVisible ? `Pestaña "${tb.label}" oculta.` : `Pestaña "${tb.label}" visible.`)}
                            label={`${tVisible ? "Ocultar" : "Mostrar"} pestaña ${tb.label}`}/>
                        </div>
                        {tOpen && tabProds.length > 0 && (
                          <div className="px-3 pb-2 space-y-1">
                            {tabProds.map(p => {
                              const pk = productKey(g.slug, p.slug);
                              const pv = visible(pk);
                              return (
                                <div key={p.slug} className="flex items-center gap-2 pl-3 py-1" style={{ opacity: pv ? 1 : 0.5 }}>
                                  <span className="text-[11px] text-white/60 flex-1 min-w-0 truncate">{p.name}</span>
                                  <VisSwitch on={pv} busy={saving === pk}
                                    onClick={() => toggle(pk, !pv, pv ? `"${p.name}" oculto.` : `"${p.name}" visible.`)}
                                    label={`${pv ? "Ocultar" : "Mostrar"} ${p.name}`}/>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {loading && (
        <p className="text-[11px] text-center" style={{ color:"rgba(255,255,255,0.25)" }}>
          Sincronizando con el servidor…
        </p>
      )}
    </div>
  );
}
