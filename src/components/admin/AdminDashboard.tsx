"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, ShoppingBag, Users, BarChart3,
  LogOut, Shield, DollarSign, Clock, Check, X,
  Search, ChevronDown, RefreshCw, Package, Wallet,
  Menu, TrendingUp, AlertCircle, Eye, EyeOff,
  CheckCircle, XCircle, RotateCcw, Truck, Ban,
  ChevronRight, Copy, CheckCheck, ExternalLink,
  Filter, Phone, Mail, Calendar, Hash,
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────
interface OrderItem {
  slug: string; name: string; img: string;
  price: number; quantity: number; total: string;
}
interface Order {
  id: string; userId: string; status: string;
  createdAt: string; paymentMethod: string; total: number;
  items: OrderItem[];
  currency?: string;
  formData?: Record<string, any>;
}
interface KUser {
  id: string; username: string; email: string;
  avatar?: string; phone?: string; createdAt: string;
}
interface Transaction {
  userId: string; date: string; description: string;
  amount: string; type: string; status: string;
}

// ── API helpers — connect to Railway backend ──────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";
const ADMIN_TOKEN = "kidstore-admin-secret-2025";

async function fetchAdminOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`/api/admin-orders`, { cache: "no-store" });
    const json = await res.json();
    // Accept both { success, orders } and { orders } formats
    const rawOrders = json.orders ?? json.data ?? json.result ?? [];
    if (!Array.isArray(rawOrders) || rawOrders.length === 0) return [];

    // Deduplicate by orderId — keep latest version
    const seen = new Map<string, any>();
    for (const o of rawOrders) {
      const key = String(o.orderId ?? o.id);
      if (!seen.has(key) || new Date(o.updatedAt) > new Date(seen.get(key).updatedAt)) {
        seen.set(key, o);
      }
    }

    return Array.from(seen.values()).map((o: any) => ({
      id: String(o.orderId ?? o.id),
      userId: o.userEmail,
      status: o.status === "pending" ? "pendiente" : o.status === "processing" ? "procesando" : o.status === "delivered" ? "entregado" : o.status === "cancelled" ? "cancelado" : o.status,
      createdAt: o.createdAt,
      paymentMethod: o.paymentMethod,
      total: o.total,
      currency: o.currency,
      formData: o.formData,
      items: (o.items || []).map((i: any) => ({
        slug: i.id, name: i.name, img: i.image || "", price: i.price, quantity: i.quantity, total: `${i.price * i.quantity}`,
      })),
    }));
  } catch { return []; }
}

async function fetchAdminUsers(): Promise<KUser[]> {
  try {
    const res = await fetch(`/api/admin-orders`, { cache: "no-store" });
    const json = await res.json();
    const rawOrders2 = json.orders ?? json.data ?? json.result ?? [];
    if (!Array.isArray(rawOrders2) || rawOrders2.length === 0) return [];

    // Extract unique users from orders — deduplicate by email
    const userMap = new Map<string, KUser>();
    for (const o of rawOrders2) {
      const email = o.userEmail;
      if (!userMap.has(email)) {
        userMap.set(email, {
          id: email,
          username: o.formData?.name || email.split("@")[0],
          email,
          phone: o.formData?.phone,
          createdAt: o.createdAt,
        });
      }
    }
    return Array.from(userMap.values());
  } catch { return []; }
}

function getAllTransactions(): Transaction[] {
  return [];
}

async function updateOrderStatus(orderId: string, status: string) {
  const statusMap: Record<string, string> = {
    pendiente: "pending", procesando: "processing", entregado: "delivered",
    completado: "delivered", reembolso: "cancelled", cancelado: "cancelled",
  };
  try {
    await fetch(`/api/admin-orders/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: Number(orderId), status: statusMap[status] || status }),
    });
  } catch {}
}

// ── Helpers ────────────────────────────────────────────────────
function currencySymbol(c?: string): string {
  if (!c) return "$";
  const s = c.toUpperCase();
  if (s === "PEN") return "S/";
  if (s === "EUR") return "\u20AC";
  return "$";
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
  } catch {
    return iso;
  }
}

function formatMoney(amount: number, currency?: string): string {
  return `${currencySymbol(currency)} ${amount.toFixed(2)}`;
}

// ── Status config ──────────────────────────────────────────────
const STATUS: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  pendiente:  { label:"Pendiente",  color:"#F59E0B", bg:"rgba(245,158,11,0.10)",  border:"rgba(245,158,11,0.25)",  icon:<Clock size={12}/>        },
  procesando: { label:"Procesando", color:"#60A5FA", bg:"rgba(96,165,250,0.10)",  border:"rgba(96,165,250,0.25)",  icon:<RotateCcw size={12}/>     },
  completado: { label:"Completado", color:"#22C55E", bg:"rgba(34,197,94,0.10)",   border:"rgba(34,197,94,0.25)",   icon:<CheckCircle size={12}/>   },
  entregado:  { label:"Entregado",  color:"#34D399", bg:"rgba(52,211,153,0.10)",  border:"rgba(52,211,153,0.25)",  icon:<Truck size={12}/>         },
  reembolso:  { label:"Reembolso",  color:"#F97316", bg:"rgba(249,115,22,0.10)",  border:"rgba(249,115,22,0.25)",  icon:<RotateCcw size={12}/>     },
  cancelado:  { label:"Cancelado",  color:"#EF4444", bg:"rgba(239,68,68,0.10)",   border:"rgba(239,68,68,0.25)",   icon:<XCircle size={12}/>       },
};

const STATUS_FLOW = ["pendiente","procesando","entregado","completado","reembolso","cancelado"];

const PAYMENT_COLORS: Record<string, { color: string; bg: string }> = {
  yape:           { color:"#6F2DA8", bg:"rgba(111,45,168,0.12)" },
  plin:           { color:"#00BFA5", bg:"rgba(0,191,165,0.12)" },
  transferencia:  { color:"#60A5FA", bg:"rgba(96,165,250,0.12)" },
  paypal:         { color:"#00457C", bg:"rgba(0,69,124,0.18)" },
  binance:        { color:"#F0B90B", bg:"rgba(240,185,11,0.12)" },
  bizum:          { color:"#00A5E0", bg:"rgba(0,165,224,0.12)" },
};

const PAYMENT_LABELS: Record<string, string> = {
  yape:"Yape", plin:"Plin", transferencia:"Transferencia Bancaria",
  paypal:"PayPal", binance:"Binance Pay", bizum:"Bizum",
};

const NAV = [
  { id:"dashboard",     icon:<LayoutDashboard size={16}/>, label:"Dashboard"      },
  { id:"pedidos",       icon:<ShoppingBag     size={16}/>, label:"Pedidos"        },
  { id:"usuarios",      icon:<Users           size={16}/>, label:"Usuarios"       },
  { id:"transacciones", icon:<BarChart3       size={16}/>, label:"Transacciones"  },
];

// ── Shared styles ──────────────────────────────────────────────
const card = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 16,
};

const cardInner = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: 12,
};

// ══════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const router = useRouter();
  const { admin, loading, logoutAdmin } = useAdminAuth();
  const [tab,         setTab]         = useState("dashboard");
  const [sidebar,     setSidebar]     = useState(false);
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [users,       setUsers]       = useState<KUser[]>([]);
  const [transactions,setTransactions]= useState<Transaction[]>([]);

  useEffect(() => {
    if (!loading && !admin) router.push("/admin/login");
  }, [admin, loading, router]);

  const refresh = useCallback(async () => {
    const [ordersData, usersData] = await Promise.all([fetchAdminOrders(), fetchAdminUsers()]);
    setOrders(ordersData);
    setUsers(usersData);
    setTransactions(getAllTransactions());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // ── Notification system ──────────────────────────────────────
  const knownOrderIds = useRef<Set<string>>(new Set());
  const [toast, setToast] = useState<{ id: string; name: string; total: number; currency?: string } | null>(null);
  const isFirstLoad = useRef(true);

  // Request browser notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Play notification sound
  function playSound() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.value = 0.3;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
      // Second tone
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1100;
        osc2.type = "sine";
        gain2.gain.value = 0.3;
        osc2.start();
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc2.stop(ctx.currentTime + 0.5);
      }, 200);
    } catch {}
  }

  // Check for new orders and notify
  useEffect(() => {
    if (orders.length === 0) return;

    if (isFirstLoad.current) {
      // First load — just register all known IDs, don't notify
      orders.forEach(o => knownOrderIds.current.add(o.id));
      isFirstLoad.current = false;
      return;
    }

    const newOrders = orders.filter(o => !knownOrderIds.current.has(o.id));
    if (newOrders.length > 0) {
      orders.forEach(o => knownOrderIds.current.add(o.id));

      const latest = newOrders[0];
      const customerName = (latest as any).formData?.name || latest.userId;

      // Play sound
      playSound();

      // Show browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`🛒 Nuevo pedido #${latest.id}`, {
          body: `${customerName} — ${formatMoney(latest.total, (latest as any).currency)}`,
          icon: "/logo/isotipo-kidstore.png",
        });
      }

      // Show in-app toast (30 seconds so admin has time to see it)
      setToast({ id: latest.id, name: customerName, total: latest.total, currency: (latest as any).currency });
      setTimeout(() => setToast(null), 30000);
    }
  }, [orders]);

  // Poll for new orders every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => { refresh(); }, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (loading || !admin) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:"#080C18" }}>
      <span className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor:"#EA580C", borderTopColor:"transparent" }}/>
    </div>
  );

  const totalRevenue    = orders.reduce((s,o) => s + (o.total ?? 0), 0);
  const pendingOrders   = orders.filter(o => o.status==="pendiente").length;
  const processingOrders= orders.filter(o => o.status==="procesando").length;
  const completedOrders = orders.filter(o => ["completado","entregado"].includes(o.status)).length;

  return (
    <div className="min-h-screen flex" style={{ background:"#080C18", color:"#E6EDF3" }}>

      {/* ─── TOAST NOTIFICATION ──────────────────────────── */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] animate-[fadeSlideIn_0.3s_ease]"
          style={{ animation: "fadeSlideIn 0.3s ease" }}>
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl"
            style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)", border: "1px solid rgba(255,255,255,0.15)", minWidth: 320, backdropFilter: "blur(16px)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.15)" }}>
              <ShoppingBag size={18} className="text-white"/>
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white/70">🔔 Nuevo pedido #{toast.id}</p>
              <p className="text-sm font-bold text-white">{toast.name}</p>
              <p className="text-xs text-white/50">{formatMoney(toast.total, toast.currency)}</p>
            </div>
            <button onClick={() => { setToast(null); setTab("pedidos"); }}
              className="text-[10px] px-3 py-1.5 rounded-lg font-bold text-white"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              Ver
            </button>
            <button onClick={() => setToast(null)} className="text-white/40 hover:text-white/80">
              <X size={14}/>
            </button>
          </div>
        </div>
      )}

      {/* ─── SIDEBAR ─────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebar ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background:"#0A0F1C", borderRight:"1px solid rgba(255,255,255,0.06)" }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
          <Image src="/logo/imagotipo-kidstore.png" alt="KidStore"
            width={120} height={44} className="object-contain"
            style={{ filter:"brightness(0) invert(1)" }}/>
        </div>

        {/* Admin info */}
        <div className="mx-3 mt-4 mb-2 px-3 py-3 rounded-2xl"
          style={{ background:"rgba(124,58,237,0.06)", border:"1px solid rgba(124,58,237,0.14)" }}>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
              style={{ background:"linear-gradient(135deg,#7C3AED,#EA580C)" }}>
              {admin.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-white truncate">{admin.name}</p>
              <p className="text-[10px] truncate" style={{ color:"rgba(255,255,255,0.35)" }}>{admin.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 ml-[42px]">
            <Shield size={9} style={{ color:"#7C3AED" }}/>
            <span className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color:"#7C3AED" }}>
              {admin.role === "owner" ? "Propietario" : "Colaborador"}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 mt-2 space-y-0.5 overflow-y-auto">
          {NAV.map(item => {
            const active = tab === item.id;
            return (
              <button key={item.id}
                onClick={() => { setTab(item.id); setSidebar(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all text-left"
                style={{
                  background: active ? "rgba(124,58,237,0.10)" : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.38)",
                }}>
                <span style={{ color: active ? "#7C3AED" : "rgba(255,255,255,0.22)" }}>{item.icon}</span>
                {item.label}
                {item.id==="pedidos" && pendingOrders > 0 && (
                  <span className="ml-auto text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full"
                    style={{ background:"rgba(245,158,11,0.18)", color:"#F59E0B" }}>
                    {pendingOrders}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <button onClick={() => { logoutAdmin(); router.push("/admin/login"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:opacity-70"
            style={{ color:"#EF4444", background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.12)" }}>
            <LogOut size={14}/> Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebar && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background:"rgba(0,0,0,0.65)" }}
          onClick={() => setSidebar(false)}/>
      )}

      {/* ─── MAIN ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between px-4 lg:px-6 h-14 flex-shrink-0"
          style={{ background:"#0A0F1C", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebar(true)}
              style={{ color:"rgba(255,255,255,0.5)" }}>
              <Menu size={20}/>
            </button>
            <div>
              <p className="text-[14px] font-bold text-white">{NAV.find(n=>n.id===tab)?.label}</p>
              {tab==="pedidos" && pendingOrders > 0 && (
                <p className="text-[10px]" style={{ color:"#F59E0B" }}>{pendingOrders} pendiente{pendingOrders>1?"s":""} de atender</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all hover:opacity-70"
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.42)" }}>
              <RefreshCw size={12}/> Actualizar
            </button>
            <Link href="/" target="_blank"
              className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-xl transition-all hover:opacity-70"
              style={{ background:"rgba(234,88,12,0.08)", border:"1px solid rgba(234,88,12,0.2)", color:"#EA580C" }}>
              <ExternalLink size={12}/> Ver tienda
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6" style={{ background:"#080C18" }}>
          {tab==="dashboard"     && <TabDashboard orders={orders} users={users} transactions={transactions} totalRevenue={totalRevenue} pendingOrders={pendingOrders} processingOrders={processingOrders} completedOrders={completedOrders} onChangeTab={setTab}/>}
          {tab==="pedidos"       && <TabPedidos   orders={orders} users={users} onRefresh={refresh}/>}
          {tab==="usuarios"      && <TabUsuarios  users={users}  orders={orders}/>}
          {tab==="transacciones" && <TabTransacciones orders={orders} transactions={transactions} users={users}/>}
        </main>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════
function TabDashboard({ orders, users, transactions, totalRevenue, pendingOrders, processingOrders, completedOrders, onChangeTab }: {
  orders: Order[]; users: KUser[]; transactions: Transaction[];
  totalRevenue: number; pendingOrders: number; processingOrders: number; completedOrders: number;
  onChangeTab: (t: string) => void;
}) {
  const recentOrders = [...orders].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0,5);
  const recentUsers = [...users].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0,5);

  // ── Statistics calculations ──
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const lastMonth = new Date(now.getFullYear(), now.getMonth()-1, 1);
  const lastMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth()+1).padStart(2,"0")}`;

  const deliveredOrders = orders.filter(o => ["completado","entregado"].includes(o.status));
  const cancelledOrders = orders.filter(o => o.status === "cancelado").length;
  const deliveredRevenue = deliveredOrders.reduce((s,o) => s + (o.total ?? 0), 0);

  const thisMonthOrders = orders.filter(o => o.createdAt?.startsWith(thisMonth));
  const lastMonthOrders = orders.filter(o => o.createdAt?.startsWith(lastMonthKey));
  const thisMonthRevenue = thisMonthOrders.reduce((s,o) => s + (o.total ?? 0), 0);
  const lastMonthRevenue = lastMonthOrders.reduce((s,o) => s + (o.total ?? 0), 0);
  const revenueChange = lastMonthRevenue > 0 ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 100;

  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const successRate = orders.length > 0 ? Math.round((deliveredOrders.length / orders.length) * 100) : 0;

  // Monthly revenue chart (last 6 months)
  const monthlyData: { month: string; label: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    const label = d.toLocaleDateString("es", { month:"short" }).toUpperCase();
    const revenue = orders.filter(o => o.createdAt?.startsWith(key)).reduce((s,o) => s + (o.total ?? 0), 0);
    monthlyData.push({ month: key, label, revenue });
  }
  const maxMonthly = Math.max(...monthlyData.map(m => m.revenue), 1);

  // Top products
  const productMap = new Map<string, { name: string; count: number; revenue: number }>();
  for (const o of orders) {
    for (const i of (o.items || [])) {
      const key = i.name;
      const existing = productMap.get(key) || { name: key, count: 0, revenue: 0 };
      existing.count += i.quantity;
      existing.revenue += i.price * i.quantity;
      productMap.set(key, existing);
    }
  }
  const topProducts = Array.from(productMap.values()).sort((a,b) => b.revenue - a.revenue).slice(0,5);

  // Payment methods breakdown
  const paymentMap = new Map<string, { count: number; total: number }>();
  for (const o of orders) {
    const pm = o.paymentMethod || "otro";
    const existing = paymentMap.get(pm) || { count: 0, total: 0 };
    existing.count++;
    existing.total += o.total ?? 0;
    paymentMap.set(pm, existing);
  }
  const paymentBreakdown = Array.from(paymentMap.entries()).sort((a,b) => b[1].total - a[1].total);

  // Top customers
  const customerMap = new Map<string, { email: string; name: string; orders: number; total: number }>();
  for (const o of orders) {
    const email = o.userId;
    const existing = customerMap.get(email) || { email, name: (o as any).formData?.name || email.split("@")[0], orders: 0, total: 0 };
    existing.orders++;
    existing.total += o.total ?? 0;
    customerMap.set(email, existing);
  }
  const topCustomers = Array.from(customerMap.values()).sort((a,b) => b.total - a.total).slice(0,5);

  return (
    <div className="space-y-5">

      {/* KPI Cards — Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon:<DollarSign size={18}/>, label:"INGRESOS TOTALES", value:`S/ ${deliveredRevenue.toFixed(2)}`, color:"#22C55E", bg:"rgba(34,197,94,0.08)", sub:`${orders.length} pedido${orders.length!==1?"s":""}` },
          { icon:<Clock size={18}/>, label:"PENDIENTES", value:String(pendingOrders), color:"#F59E0B", bg:"rgba(245,158,11,0.08)", sub:"Requieren atención", action:() => onChangeTab("pedidos") },
          { icon:<RotateCcw size={18}/>, label:"EN PROCESO", value:String(processingOrders), color:"#60A5FA", bg:"rgba(96,165,250,0.08)", sub:"Siendo atendidos" },
          { icon:<CheckCircle size={18}/>, label:"COMPLETADOS", value:String(completedOrders), color:"#34D399", bg:"rgba(52,211,153,0.08)", sub:"Entregados con éxito" },
        ].map(s => (
          <div key={s.label}
            className={`rounded-2xl p-4 ${s.action ? "cursor-pointer hover:opacity-90 transition-all" : ""}`}
            style={{ ...card, ...(s.action && pendingOrders > 0 ? { border:`1px solid rgba(245,158,11,0.25)` } : {}) }}
            onClick={s.action}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background:s.bg, color:s.color }}>{s.icon}</div>
              <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color:"rgba(255,255,255,0.35)" }}>{s.label}</p>
            </div>
            <p className="text-2xl font-black mb-0.5" style={{ color:s.color }}>{s.value}</p>
            <p className="text-[11px]" style={{ color:"rgba(255,255,255,0.28)" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* KPI Cards — Row 2: Extra stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl p-4" style={card}>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color:"rgba(255,255,255,0.35)" }}>ESTE MES</p>
          <p className="text-xl font-black" style={{ color:"#A78BFA" }}>S/ {thisMonthRevenue.toFixed(2)}</p>
          <p className="text-[11px] mt-1" style={{ color: revenueChange >= 0 ? "#22C55E" : "#EF4444" }}>
            {revenueChange >= 0 ? "↑" : "↓"} {Math.abs(revenueChange)}% vs mes anterior
          </p>
        </div>
        <div className="rounded-2xl p-4" style={card}>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color:"rgba(255,255,255,0.35)" }}>PROMEDIO POR PEDIDO</p>
          <p className="text-xl font-black" style={{ color:"#F97316" }}>S/ {avgOrderValue.toFixed(2)}</p>
          <p className="text-[11px] mt-1" style={{ color:"rgba(255,255,255,0.28)" }}>{orders.length} pedidos totales</p>
        </div>
        <div className="rounded-2xl p-4" style={card}>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color:"rgba(255,255,255,0.35)" }}>TASA DE ÉXITO</p>
          <p className="text-xl font-black" style={{ color:"#22C55E" }}>{successRate}%</p>
          <p className="text-[11px] mt-1" style={{ color:"rgba(255,255,255,0.28)" }}>{deliveredOrders.length} entregados · {cancelledOrders} cancelados</p>
        </div>
        <div className="rounded-2xl p-4" style={card}>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color:"rgba(255,255,255,0.35)" }}>CLIENTES ÚNICOS</p>
          <p className="text-xl font-black" style={{ color:"#60A5FA" }}>{users.length}</p>
          <p className="text-[11px] mt-1" style={{ color:"rgba(255,255,255,0.28)" }}>
            {users.length > 0 ? `${(totalRevenue / users.length).toFixed(2)} S/ promedio` : "Sin clientes"}
          </p>
        </div>
      </div>

      {/* Pending alert */}
      {pendingOrders > 0 && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer transition-all hover:opacity-90"
          style={{ background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.2)" }}
          onClick={() => onChangeTab("pedidos")}>
          <AlertCircle size={18} style={{ color:"#F59E0B", flexShrink:0 }}/>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold" style={{ color:"#F59E0B" }}>
              {pendingOrders} pedido{pendingOrders>1?"s":""} pendiente{pendingOrders>1?"s":""}
            </p>
            <p className="text-[11px]" style={{ color:"rgba(255,255,255,0.35)" }}>
              Haz clic para ir a pedidos y actualizar su estado
            </p>
          </div>
          <ChevronRight size={16} style={{ color:"#F59E0B", flexShrink:0 }}/>
        </div>
      )}

      {/* Monthly revenue chart + Payment methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={card}>
          <p className="text-[13px] font-bold text-white mb-4">📊 Ingresos mensuales</p>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <p className="text-[10px] font-bold" style={{ color: m.month === thisMonth ? "#A78BFA" : "rgba(255,255,255,0.3)" }}>
                  S/{m.revenue.toFixed(0)}
                </p>
                <div className="w-full rounded-lg transition-all"
                  style={{
                    height: `${Math.max((m.revenue / maxMonthly) * 100, 4)}%`,
                    background: m.month === thisMonth
                      ? "linear-gradient(180deg, #7C3AED, #5B21B6)"
                      : "rgba(255,255,255,0.06)",
                    border: m.month === thisMonth ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.04)",
                  }}/>
                <p className="text-[10px] font-bold" style={{ color: m.month === thisMonth ? "#A78BFA" : "rgba(255,255,255,0.25)" }}>
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div className="rounded-2xl p-5" style={card}>
          <p className="text-[13px] font-bold text-white mb-4">💳 Métodos de pago</p>
          <div className="space-y-3">
            {paymentBreakdown.map(([method, data]) => {
              const pc = PAYMENT_COLORS[method] ?? { color:"#888", bg:"rgba(136,136,136,0.1)" };
              const pct = totalRevenue > 0 ? Math.round((data.total / totalRevenue) * 100) : 0;
              return (
                <div key={method}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold capitalize" style={{ color:pc.color }}>
                      {PAYMENT_LABELS[method] ?? method}
                    </span>
                    <span className="text-[10px]" style={{ color:"rgba(255,255,255,0.35)" }}>
                      {data.count} · S/{data.total.toFixed(0)} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background:"rgba(255,255,255,0.04)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background:pc.color }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top products + Top customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top products */}
        <div className="rounded-2xl overflow-hidden" style={card}>
          <div className="px-5 py-3.5 flex items-center justify-between"
            style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-[13px] font-bold text-white">🏆 Top productos</p>
          </div>
          <div className="divide-y" style={{ borderColor:"rgba(255,255,255,0.03)" }}>
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 px-5 py-3">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{ background: i === 0 ? "rgba(234,88,12,0.15)" : "rgba(255,255,255,0.04)", color: i === 0 ? "#EA580C" : "rgba(255,255,255,0.3)" }}>
                  {i+1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold truncate text-white">{p.name}</p>
                  <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.3)" }}>{p.count} vendidos</p>
                </div>
                <p className="text-[12px] font-bold flex-shrink-0" style={{ color:"#22C55E" }}>S/ {p.revenue.toFixed(2)}</p>
              </div>
            ))}
            {topProducts.length === 0 && (
              <div className="p-8 text-center"><p className="text-[12px]" style={{ color:"rgba(255,255,255,0.2)" }}>Sin datos</p></div>
            )}
          </div>
        </div>

        {/* Top customers */}
        <div className="rounded-2xl overflow-hidden" style={card}>
          <div className="px-5 py-3.5 flex items-center justify-between"
            style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-[13px] font-bold text-white">👑 Top clientes</p>
            <button onClick={() => onChangeTab("usuarios")} className="text-[11px] font-semibold hover:opacity-70" style={{ color:"#7C3AED" }}>Ver todos →</button>
          </div>
          <div className="divide-y" style={{ borderColor:"rgba(255,255,255,0.03)" }}>
            {topCustomers.map((c, i) => (
              <div key={c.email} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                  style={{ background: i === 0 ? "linear-gradient(135deg,#7C3AED,#EA580C)" : "rgba(255,255,255,0.06)" }}>
                  {c.name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold truncate text-white">{c.name}</p>
                  <p className="text-[10px] truncate" style={{ color:"rgba(255,255,255,0.3)" }}>{c.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[12px] font-bold" style={{ color:"#EA580C" }}>S/ {c.total.toFixed(2)}</p>
                  <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.25)" }}>{c.orders} pedidos</p>
                </div>
              </div>
            ))}
            {topCustomers.length === 0 && (
              <div className="p-8 text-center"><p className="text-[12px]" style={{ color:"rgba(255,255,255,0.2)" }}>Sin datos</p></div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent orders */}
        <div className="rounded-2xl overflow-hidden" style={card}>
          <div className="px-5 py-3.5 flex items-center justify-between"
            style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-[13px] font-bold text-white">Pedidos recientes</p>
            <button onClick={() => onChangeTab("pedidos")} className="text-[11px] font-semibold hover:opacity-70"
              style={{ color:"#7C3AED" }}>Ver todos &rarr;</button>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-10 text-center">
              <Package size={28} className="mx-auto mb-2" style={{ color:"rgba(255,255,255,0.1)" }}/>
              <p className="text-[12px]" style={{ color:"rgba(255,255,255,0.22)" }}>Sin pedidos todavia</p>
            </div>
          ) : (
            <div>
              {/* Table header */}
              <div className="grid grid-cols-12 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.08em]"
                style={{ color:"rgba(255,255,255,0.25)", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <span className="col-span-2">ID</span>
                <span className="col-span-4">Productos</span>
                <span className="col-span-3">Estado</span>
                <span className="col-span-3 text-right">Total</span>
              </div>
              <div className="divide-y" style={{ borderColor:"rgba(255,255,255,0.03)" }}>
                {recentOrders.map(o => {
                  const sc = STATUS[o.status] ?? STATUS.pendiente;
                  return (
                    <div key={o.id} className="grid grid-cols-12 items-center px-5 py-3 hover:bg-white/[0.015] transition-colors">
                      <span className="col-span-2 text-[12px] font-bold text-white">#{o.id}</span>
                      <span className="col-span-4 text-[11px] truncate pr-2" style={{ color:"rgba(255,255,255,0.4)" }}>
                        {o.items?.map(i=>i.name).join(", ")}
                      </span>
                      <span className="col-span-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ color:sc.color, background:sc.bg, border:`1px solid ${sc.border}` }}>
                          {sc.icon} {sc.label}
                        </span>
                      </span>
                      <span className="col-span-3 text-right">
                        <span className="text-[13px] font-black" style={{ color:"#EA580C" }}>
                          {formatMoney(o.total ?? 0, (o as any).currency)}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Recent customers */}
        <div className="rounded-2xl overflow-hidden" style={card}>
          <div className="px-5 py-3.5 flex items-center justify-between"
            style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-[13px] font-bold text-white">Clientes recientes</p>
            <button onClick={() => onChangeTab("usuarios")} className="text-[11px] font-semibold hover:opacity-70"
              style={{ color:"#7C3AED" }}>Ver todos &rarr;</button>
          </div>
          {recentUsers.length === 0 ? (
            <div className="p-10 text-center">
              <Users size={28} className="mx-auto mb-2" style={{ color:"rgba(255,255,255,0.1)" }}/>
              <p className="text-[12px]" style={{ color:"rgba(255,255,255,0.22)" }}>Sin clientes todavia</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor:"rgba(255,255,255,0.03)" }}>
              {recentUsers.map(u => {
                const userOrders = orders.filter(o=>o.userId===u.id);
                return (
                  <div key={u.id} className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.015] transition-colors">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-black text-white flex-shrink-0"
                      style={{ background:"linear-gradient(135deg,#7C3AED,#EA580C)" }}>
                      {u.username[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white truncate">{u.username}</p>
                      <p className="text-[11px] truncate" style={{ color:"rgba(255,255,255,0.32)" }}>{u.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[12px] font-bold" style={{ color:"#7C3AED" }}>
                        {userOrders.length} pedido{userOrders.length!==1?"s":""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// COPY BUTTON
// ══════════════════════════════════════════════════════════════
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-all hover:opacity-70 flex-shrink-0"
      style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.35)" }}>
      {copied ? <CheckCheck size={10}/> : <Copy size={10}/>}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
// PEDIDOS
// ══════════════════════════════════════════════════════════════
function TabPedidos({ orders, users, onRefresh }: { orders: Order[]; users: KUser[]; onRefresh: () => void }) {
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("todos");
  const [expanded, setExpanded] = useState<string|null>(null);
  const [updating, setUpdating] = useState<string|null>(null);

  const userMap = Object.fromEntries(users.map(u=>[u.id, u]));

  const filtered = orders
    .filter(o => {
      const matchF = filter==="todos" || o.status===filter;
      const matchS = !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.items?.some(i=>i.name.toLowerCase().includes(search.toLowerCase())) ||
        userMap[o.userId]?.username.toLowerCase().includes(search.toLowerCase()) ||
        userMap[o.userId]?.email.toLowerCase().includes(search.toLowerCase());
      return matchF && matchS;
    })
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  async function changeStatus(orderId: string, status: string) {
    setUpdating(orderId);
    await new Promise(r => setTimeout(r, 300));
    await updateOrderStatus(orderId, status);
    await onRefresh();
    setUpdating(null);
  }

  const counts: Record<string,number> = { todos: orders.length };
  orders.forEach(o => { counts[o.status] = (counts[o.status]??0)+1; });

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {[{id:"todos",label:"Todos"}, ...STATUS_FLOW.map(s=>({id:s,label:STATUS[s]?.label??s}))].map(f => {
          const active = filter === f.id;
          const sc = STATUS[f.id];
          return (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all"
              style={{
                background: active ? (sc?.bg ?? "rgba(124,58,237,0.10)") : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? (sc?.border ?? "rgba(124,58,237,0.3)") : "rgba(255,255,255,0.06)"}`,
                color: active ? (sc?.color ?? "#7C3AED") : "rgba(255,255,255,0.35)",
              }}>
              {active && sc?.icon}
              {f.label}
              {(counts[f.id] ?? 0) > 0 && (
                <span className="font-black text-[10px]" style={{ opacity:0.7 }}>({counts[f.id]})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:"rgba(255,255,255,0.22)" }}/>
        <input type="text" placeholder="Buscar por ID, producto o cliente..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-[13px] outline-none text-white placeholder:text-white/20"
          style={{ ...card }}/>
      </div>

      {/* Orders list */}
      {filtered.length===0 ? (
        <div className="rounded-2xl p-14 text-center" style={card}>
          <Package size={32} className="mx-auto mb-3" style={{ color:"rgba(255,255,255,0.1)" }}/>
          <p className="text-[14px] font-bold text-white mb-1">Sin pedidos</p>
          <p className="text-[12px]" style={{ color:"rgba(255,255,255,0.28)" }}>No se encontraron resultados para este filtro</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(order => {
            const sc  = STATUS[order.status] ?? STATUS.pendiente;
            const u   = userMap[order.userId];
            const exp = expanded===order.id;
            const pm  = PAYMENT_COLORS[order.paymentMethod] ?? { color:"#A78BFA", bg:"rgba(167,139,250,0.1)" };
            const cur = (order as any).currency;
            const fd  = (order as any).formData;

            return (
              <div key={order.id} className="rounded-2xl overflow-hidden transition-all"
                style={{ ...card, ...(exp ? { border:`1px solid ${sc.border}` } : {}) }}>

                {/* Header row */}
                <div className="px-5 py-4 flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpanded(exp ? null : order.id)}>
                  {/* Status bar */}
                  <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background:sc.color, opacity:0.7 }}/>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[14px] font-black text-white">#{order.id}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ color:sc.color, background:sc.bg, border:`1px solid ${sc.border}` }}>
                        {sc.icon} {sc.label}
                      </span>
                      {/* Payment badge */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ color:pm.color, background:pm.bg }}>
                        {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                      </span>
                      <span className="text-[11px]" style={{ color:"rgba(255,255,255,0.25)" }}>
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {u && (
                        <span className="flex items-center gap-1 text-[11px]" style={{ color:"rgba(255,255,255,0.45)" }}>
                          <Users size={10}/> {u.username}
                        </span>
                      )}
                      {u && (
                        <span className="flex items-center gap-1 text-[11px]" style={{ color:"rgba(255,255,255,0.3)" }}>
                          <Mail size={10}/> {u.email}
                        </span>
                      )}
                      <span className="text-[11px] truncate" style={{ color:"rgba(255,255,255,0.28)" }}>
                        {order.items?.map(i=>i.name).join(" · ")}
                      </span>
                    </div>
                  </div>

                  {/* Total + toggle */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-[16px] font-black" style={{ color:"#EA580C" }}>
                        {formatMoney(order.total ?? 0, cur)}
                      </p>
                      <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.22)" }}>
                        {order.items?.length} producto{order.items?.length!==1?"s":""}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.35)" }}>
                      <ChevronDown size={15} className={`transition-transform duration-200 ${exp?"rotate-180":""}`}/>
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {exp && (
                  <div className="border-t space-y-5 px-5 py-5" style={{ borderColor:"rgba(255,255,255,0.05)" }}>

                    {/* Client info */}
                    {u && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2.5"
                          style={{ color:"rgba(255,255,255,0.28)" }}>Informacion del cliente</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {[
                            { icon:<Users size={11}/>,    label:"USUARIO",  value:u.username },
                            { icon:<Mail size={11}/>,     label:"CORREO",   value:u.email    },
                            { icon:<Phone size={11}/>,    label:"TELEFONO", value:u.phone ?? "No registrado" },
                          ].map(row => (
                            <div key={row.label} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl"
                              style={cardInner}>
                              <div className="flex items-center gap-2 min-w-0">
                                <span style={{ color:"rgba(255,255,255,0.25)", flexShrink:0 }}>{row.icon}</span>
                                <div className="min-w-0">
                                  <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color:"rgba(255,255,255,0.25)" }}>{row.label}</p>
                                  <p className="text-[12px] font-semibold text-white truncate">{row.value}</p>
                                </div>
                              </div>
                              {row.value !== "No registrado" && <CopyBtn text={row.value}/>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Form data (game info) */}
                    {fd && Object.keys(fd).length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2.5"
                          style={{ color:"rgba(255,255,255,0.28)" }}>Datos del formulario</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {Object.entries(fd).filter(([k]) => !["name","phone"].includes(k)).map(([k, v]) => {
                            const labelMap: Record<string, string> = {
                              epicUser: "USUARIO EPIC",
                              gameName: "NOMBRE EN JUEGO",
                              platform: "PLATAFORMA",
                              riotId: "RIOT ID",
                              uid: "UID",
                              server: "SERVIDOR",
                              trainerCode: "CODIGO ENTRENADOR",
                              discordTag: "DISCORD TAG",
                            };
                            return (
                              <div key={k} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl"
                                style={cardInner}>
                                <div className="min-w-0">
                                  <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color:"rgba(255,255,255,0.25)" }}>
                                    {labelMap[k] || k.toUpperCase()}
                                  </p>
                                  <p className="text-[12px] font-semibold text-white truncate">{String(v)}</p>
                                </div>
                                <CopyBtn text={String(v)}/>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Products */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2.5"
                        style={{ color:"rgba(255,255,255,0.28)" }}>Productos del pedido</p>
                      <div className="space-y-1.5">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                            style={cardInner}>
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                              style={{ background:"rgba(255,255,255,0.05)" }}>
                              {(item.img || (item as any).image) && (
                                <img src={item.img || (item as any).image} alt={item.name}
                                  className="w-full h-full object-contain p-1"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}/>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-white truncate">{item.name}</p>
                              <p className="text-[11px]" style={{ color:"rgba(255,255,255,0.3)" }}>
                                Cant: {item.quantity} &middot; Precio: {formatMoney(item.price ?? 0, cur)}
                              </p>
                            </div>
                            <p className="text-[13px] font-black flex-shrink-0" style={{ color:"#EA580C" }}>
                              {formatMoney(parseFloat(item.total) || 0, cur)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Total row */}
                      <div className="flex items-center justify-between px-4 py-3 mt-2 rounded-xl"
                        style={{ background:"rgba(234,88,12,0.06)", border:"1px solid rgba(234,88,12,0.15)" }}>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.08em] font-bold" style={{ color:"rgba(255,255,255,0.3)" }}>Metodo de pago</p>
                          <span className="text-[12px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5"
                            style={{ color:pm.color, background:pm.bg }}>
                            {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-[0.08em] font-bold" style={{ color:"rgba(255,255,255,0.3)" }}>Total del pedido</p>
                          <p className="text-xl font-black" style={{ color:"#EA580C" }}>
                            {formatMoney(order.total ?? 0, cur)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status management */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-3"
                        style={{ color:"rgba(255,255,255,0.28)" }}>Actualizar estado</p>
                      <div className="flex flex-wrap gap-2">
                        {STATUS_FLOW.map(key => {
                          const s = STATUS[key];
                          const isActive = order.status===key;
                          const isLoading = updating===order.id;
                          return (
                            <button key={key}
                              disabled={isActive || isLoading}
                              onClick={() => changeStatus(order.id, key)}
                              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all hover:opacity-80 disabled:cursor-default"
                              style={{
                                background: isActive ? s.bg : "rgba(255,255,255,0.03)",
                                border: `1px solid ${isActive ? s.border : "rgba(255,255,255,0.06)"}`,
                                color: isActive ? s.color : "rgba(255,255,255,0.35)",
                                opacity: isActive ? 1 : isLoading ? 0.4 : 1,
                              }}>
                              {s.icon}
                              <span>{isLoading && !isActive ? "..." : s.label}</span>
                              {isActive && <Check size={12} className="ml-0.5"/>}
                            </button>
                          );
                        })}
                      </div>
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
// USUARIOS
// ══════════════════════════════════════════════════════════════
function TabUsuarios({ users, orders }: { users: KUser[]; orders: Order[] }) {
  const [search,   setSearch]   = useState("");
  const [expanded, setExpanded] = useState<string|null>(null);

  const filtered = users.filter(u =>
    !search ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  ).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const usersWithOrders = users.filter(u => orders.some(o => o.userId === u.id)).length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="px-4 py-4 rounded-2xl flex items-center gap-3" style={card}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(124,58,237,0.08)", color:"#7C3AED" }}>
            <Users size={16}/>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color:"rgba(255,255,255,0.35)" }}>Total clientes</p>
            <p className="text-xl font-black" style={{ color:"#7C3AED" }}>{users.length}</p>
          </div>
        </div>
        <div className="px-4 py-4 rounded-2xl flex items-center gap-3" style={card}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(34,197,94,0.08)", color:"#22C55E" }}>
            <ShoppingBag size={16}/>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color:"rgba(255,255,255,0.35)" }}>Con pedidos</p>
            <p className="text-xl font-black" style={{ color:"#22C55E" }}>{usersWithOrders}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:"rgba(255,255,255,0.22)" }}/>
        <input type="text" placeholder="Buscar por nombre o email..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-[13px] outline-none text-white placeholder:text-white/20"
          style={card}/>
      </div>

      {/* Users */}
      {filtered.length===0 ? (
        <div className="rounded-2xl p-14 text-center" style={card}>
          <Users size={32} className="mx-auto mb-3" style={{ color:"rgba(255,255,255,0.1)" }}/>
          <p className="text-[14px] font-bold text-white">Sin clientes registrados</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(u => {
            const userOrders = orders.filter(o=>o.userId===u.id);
            const totalSpent = userOrders.reduce((s,o)=>s+(o.total??0),0);
            const exp = expanded===u.id;
            return (
              <div key={u.id} className="rounded-2xl overflow-hidden"
                style={{ ...card, ...(exp ? { border:"1px solid rgba(124,58,237,0.25)" } : {}) }}>
                <div className="px-5 py-3.5 flex items-center gap-3 cursor-pointer"
                  onClick={() => setExpanded(exp ? null : u.id)}>
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black text-white flex-shrink-0"
                    style={{ background:"linear-gradient(135deg,#7C3AED,#EA580C)" }}>
                    {u.username[0]?.toUpperCase() ?? "?"}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-white truncate">{u.username}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[11px] truncate" style={{ color:"rgba(255,255,255,0.35)" }}>{u.email}</span>
                      {u.phone && (
                        <span className="flex items-center gap-1 text-[11px]" style={{ color:"rgba(255,255,255,0.28)" }}>
                          <Phone size={9}/> {u.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-[12px] font-bold" style={{ color:"#7C3AED" }}>{userOrders.length} pedido{userOrders.length!==1?"s":""}</p>
                      <p className="text-[11px]" style={{ color:"#22C55E" }}>${totalSpent.toFixed(2)}</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background:"rgba(255,255,255,0.04)", color:"rgba(255,255,255,0.35)" }}>
                      <ChevronDown size={15} className={`transition-transform duration-200 ${exp?"rotate-180":""}`}/>
                    </div>
                  </div>
                </div>

                {exp && (
                  <div className="border-t px-5 py-4 space-y-4" style={{ borderColor:"rgba(255,255,255,0.05)" }}>
                    {/* Contact info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { icon:<Mail size={11}/>,     label:"EMAIL",     value:u.email            },
                        { icon:<Phone size={11}/>,    label:"TELEFONO",  value:u.phone??"--"      },
                        { icon:<Hash size={11}/>,     label:"ID USUARIO",value:u.id               },
                        { icon:<Calendar size={11}/>, label:"REGISTRO",  value:formatDate(u.createdAt) },
                      ].map(row => (
                        <div key={row.label} className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl"
                          style={cardInner}>
                          <div className="flex items-center gap-2 min-w-0">
                            <span style={{ color:"rgba(255,255,255,0.25)", flexShrink:0 }}>{row.icon}</span>
                            <div className="min-w-0">
                              <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color:"rgba(255,255,255,0.25)" }}>{row.label}</p>
                              <p className="text-[12px] font-semibold text-white truncate">{row.value}</p>
                            </div>
                          </div>
                          {row.value !== "--" && <CopyBtn text={row.value}/>}
                        </div>
                      ))}
                    </div>

                    {/* User orders */}
                    {userOrders.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2"
                          style={{ color:"rgba(255,255,255,0.28)" }}>Historial de pedidos</p>
                        <div className="space-y-1.5">
                          {userOrders.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(o => {
                            const sc = STATUS[o.status] ?? STATUS.pendiente;
                            return (
                              <div key={o.id} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                                style={cardInner}>
                                <span className="text-[12px] font-bold text-white">#{o.id}</span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ color:sc.color, background:sc.bg }}>
                                  {sc.icon} {sc.label}
                                </span>
                                <span className="text-[11px] flex-1 truncate" style={{ color:"rgba(255,255,255,0.28)" }}>
                                  {o.items?.map(i=>i.name).join(", ")}
                                </span>
                                <span className="text-[11px]" style={{ color:"rgba(255,255,255,0.25)" }}>
                                  {formatDate(o.createdAt)}
                                </span>
                                <span className="text-[12px] font-black flex-shrink-0" style={{ color:"#EA580C" }}>
                                  {formatMoney(o.total ?? 0, (o as any).currency)}
                                </span>
                              </div>
                            );
                          })}
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
// TRANSACCIONES (derived from orders)
// ══════════════════════════════════════════════════════════════
function TabTransacciones({ orders, transactions, users }: { orders: Order[]; transactions: Transaction[]; users: KUser[] }) {
  const [search,     setSearch]     = useState("");
  const [dateFilter, setDateFilter] = useState("todos");

  const userMap = Object.fromEntries(users.map(u=>[u.id,u]));

  // Derive transactions from orders
  const derivedTx = orders.map(o => ({
    userId: o.userId,
    date: o.createdAt,
    description: o.items?.map(i => i.name).join(", ") || `Pedido #${o.id}`,
    amount: o.total ?? 0,
    currency: (o as any).currency,
    status: o.status,
    orderId: o.id,
    paymentMethod: o.paymentMethod,
  }));

  const now = Date.now();
  const MS: Record<string,number> = {
    "hoy":    86400000,
    "7dias":  7*86400000,
    "30dias": 30*86400000,
    "todos":  0,
  };

  const filtered = [...derivedTx]
    .filter(tx => {
      const inDate = !MS[dateFilter] || (now - new Date(tx.date).getTime()) <= MS[dateFilter];
      const inSearch = !search ||
        tx.description.toLowerCase().includes(search.toLowerCase()) ||
        userMap[tx.userId]?.username.toLowerCase().includes(search.toLowerCase()) ||
        tx.orderId.toLowerCase().includes(search.toLowerCase());
      return inDate && inSearch;
    })
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalRevenue = filtered.reduce((s,t) => s + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="px-4 py-4 rounded-2xl flex items-center gap-3" style={card}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(34,197,94,0.08)", color:"#22C55E" }}>
            <DollarSign size={16}/>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color:"rgba(255,255,255,0.35)" }}>Ingresos (filtro)</p>
            <p className="text-xl font-black" style={{ color:"#22C55E" }}>${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
        <div className="px-4 py-4 rounded-2xl flex items-center gap-3" style={card}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(96,165,250,0.08)", color:"#60A5FA" }}>
            <BarChart3 size={16}/>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color:"rgba(255,255,255,0.35)" }}>Transacciones</p>
            <p className="text-xl font-black" style={{ color:"#60A5FA" }}>{filtered.length}</p>
          </div>
        </div>
        <div className="px-4 py-4 rounded-2xl flex items-center gap-3 col-span-2 lg:col-span-1" style={card}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:"rgba(124,58,237,0.08)", color:"#7C3AED" }}>
            <Users size={16}/>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color:"rgba(255,255,255,0.35)" }}>Clientes activos</p>
            <p className="text-xl font-black" style={{ color:"#7C3AED" }}>
              {new Set(filtered.map(t=>t.userId)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1.5">
          {[{id:"todos",label:"Todos"},{id:"hoy",label:"Hoy"},{id:"7dias",label:"7 dias"},{id:"30dias",label:"30 dias"}].map(f => (
            <button key={f.id} onClick={() => setDateFilter(f.id)}
              className="px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all"
              style={{
                background: dateFilter===f.id ? "rgba(124,58,237,0.10)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${dateFilter===f.id ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)"}`,
                color: dateFilter===f.id ? "#7C3AED" : "rgba(255,255,255,0.35)",
              }}>{f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"rgba(255,255,255,0.22)" }}/>
          <input type="text" placeholder="Buscar..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-[12px] outline-none text-white placeholder:text-white/20"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)" }}/>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={card}>
        <div className="grid grid-cols-12 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em]"
          style={{ borderBottom:"1px solid rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.25)" }}>
          <span className="col-span-2">Fecha</span>
          <span className="col-span-3">Cliente</span>
          <span className="col-span-3">Descripcion</span>
          <span className="col-span-2 text-right">Monto</span>
          <span className="col-span-2 text-right">Estado</span>
        </div>
        {filtered.length===0 ? (
          <div className="p-12 text-center">
            <BarChart3 size={28} className="mx-auto mb-3" style={{ color:"rgba(255,255,255,0.1)" }}/>
            <p className="text-[13px] font-bold text-white">Sin transacciones</p>
            <p className="text-[11px] mt-1" style={{ color:"rgba(255,255,255,0.25)" }}>
              No se encontraron resultados para este filtro
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor:"rgba(255,255,255,0.03)" }}>
            {filtered.map((tx, i) => {
              const u = userMap[tx.userId];
              const sc = STATUS[tx.status] ?? STATUS.pendiente;
              return (
                <div key={i} className="grid grid-cols-12 items-center px-5 py-3 hover:bg-white/[0.015] transition-colors">
                  <div className="col-span-2">
                    <p className="text-[12px] font-semibold text-white">
                      {formatDate(tx.date).split(",")[0]}
                    </p>
                    <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.25)" }}>
                      {formatDate(tx.date).split(",")[1]?.trim()}
                    </p>
                  </div>
                  <div className="col-span-3 min-w-0 pr-2">
                    {u ? (
                      <>
                        <p className="text-[12px] font-semibold text-white truncate">{u.username}</p>
                        <p className="text-[10px] truncate" style={{ color:"rgba(255,255,255,0.25)" }}>{u.email}</p>
                      </>
                    ) : (
                      <p className="text-[12px]" style={{ color:"rgba(255,255,255,0.25)" }}>--</p>
                    )}
                  </div>
                  <div className="col-span-3 min-w-0 pr-2">
                    <p className="text-[12px] text-white truncate">{tx.description}</p>
                    <p className="text-[10px]" style={{ color:"rgba(255,255,255,0.22)" }}>
                      #{tx.orderId} &middot; {PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod}
                    </p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-[13px] font-black" style={{ color:"#EA580C" }}>
                      {formatMoney(tx.amount, tx.currency)}
                    </p>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>
                      {sc.icon} {sc.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
