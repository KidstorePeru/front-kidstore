"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, User, Menu, X, ChevronDown, Heart, Sun, Moon } from "lucide-react";
import { categories } from "@/data";
import { usePreferences } from "@/context/PreferencesContext";
import { useAuth } from "@/context/AuthContext";
import { useAuthModal } from "@/components/auth/AuthModal";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import SearchBar from "@/components/ui/SearchBar";
import CartDrawer from "@/components/ui/CartDrawer";

function Dropdown<T extends string>({
  value, options, onSelect, label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onSelect: (v: T) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2.5 h-8 rounded-lg text-xs font-semibold transition-all"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        {label && <span className="mr-0.5">{label}</span>}
        <span style={{ color: "var(--text)" }}>{value}</span>
        <ChevronDown size={11} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className="absolute top-full mt-1.5 right-0 z-50 rounded-xl overflow-hidden py-1 min-w-[120px]"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); setOpen(false); }}
              className="w-full px-4 py-2.5 text-xs text-left transition-colors flex items-center justify-between"
              style={{
                color:      opt.value === value ? "var(--brand-light)" : "var(--text-muted)",
                background: opt.value === value ? "rgba(124,58,237,0.1)" : "transparent",
              }}
            >
              {opt.label}
              {opt.value === value && (
                <span style={{ color: "var(--brand-light)" }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [cartOpen,     setCartOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { totalItems: cartCount } = useCart();
  const { items: wishItems }      = useWishlist();
  const wishCount                 = wishItems.length;
  const { lang, currency, theme, setLang, setCurrency, setTheme } = usePreferences();
  const { user, logout }          = useAuth();
  const { openModal }              = useAuthModal();
  const isDark                    = theme === "dark";

  // Cerrar menú usuario al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const t = {
    login:    lang === "ES" ? "Acceder"         : "Login",
    register: lang === "ES" ? "Registro"        : "Register",
    allGames: lang === "ES" ? "Todos los juegos": "All Games",
    logout:   lang === "ES" ? "Salir"           : "Sign out",
  };

  const userMenuItems = [
    { href: "/profile",           icon: "👤", label: lang === "ES" ? "Mi cuenta"       : "My account" },
    { href: "/profile?tab=pedidos", icon: "🛍️", label: lang === "ES" ? "Mis pedidos"    : "My orders"  },
    { href: "/wishlist",           icon: "❤️", label: lang === "ES" ? "Lista de deseos": "Wishlist"    },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: "var(--navbar-bg)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
          transition: "background 0.35s ease",
        }}
      >
        {/* Línea de acento top */}
        <div
          className="h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #7C3AED, #A78BFA, #7C3AED, transparent)",
          }}
        />

        {/* FILA PRINCIPAL */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-3">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/imagotipo-kidstore.png"
              alt="KidStore"
              width={200}
              height={56}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* SearchBar centrado */}
          <div className="hidden md:flex justify-center">
            <SearchBar />
          </div>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">

            <Dropdown
              value={lang}
              label="🌐"
              options={[
                { value: "ES", label: "Español" },
                { value: "EN", label: "English" },
              ]}
              onSelect={(v) => setLang(v as "ES" | "EN")}
            />

            <Dropdown
              value={currency}
              label="💰"
              options={[
                { value: "PEN", label: "PEN (S/)" },
                { value: "USD", label: "USD ($)"  },
                { value: "EUR", label: "EUR (€)"  },
              ]}
              onSelect={(v) => setCurrency(v as "PEN" | "USD" | "EUR")}
            />

            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:scale-105"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <div className="w-px h-5 mx-0.5" style={{ background: "var(--border)" }} />

            {/* ── USER AREA ── */}
            {user ? (
              /* Usuario logueado → dropdown */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2.5 h-9 rounded-lg transition-all hover:opacity-80"
                  style={{ background: "var(--card)", border: "1px solid var(--border)" }}
                >
                  {/* Avatar inicial */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#1E3A8A,#EA580C)" }}
                  >
                    {user.username[0].toUpperCase()}
                  </div>
                  {/* Nombre */}
                  <p className="text-xs font-bold truncate max-w-[80px] hidden sm:block"
                    style={{ color: "var(--text)" }}>
                    {user.username}
                  </p>
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                    style={{ color: "var(--text-muted)" }}
                  />
                </button>

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div
                    className="absolute top-full mt-2 right-0 z-50 rounded-2xl overflow-hidden py-1.5 min-w-[210px]"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    }}
                  >
                    {/* Header */}
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                          style={{ background: "linear-gradient(135deg,#1E3A8A,#EA580C)" }}
                        >
                          {user.username[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate" style={{ color: "var(--text)" }}>
                            {user.username}
                          </p>
                          <p className="text-[10px] truncate" style={{ color: "var(--text-subtle)" }}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      {userMenuItems.map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold transition-all"
                          style={{ color: "var(--text-muted)" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "var(--surface)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <span className="text-sm">{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Divider + Cerrar sesión */}
                    <div className="mx-3" style={{ borderTop: "1px solid var(--border)" }} />
                    <button
                      onClick={async () => { await logout(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold transition-all text-left mt-1"
                      style={{ color: "#EF4444" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <span className="text-sm">🚪</span>
                      {lang === "ES" ? "Cerrar sesión" : "Sign out"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Sin sesión → login/registro */
              <button
                onClick={() => openModal("login")}
                className="flex items-center gap-2 px-2.5 h-9 rounded-lg transition-all"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <User size={13} style={{ color: "var(--text-muted)" }} />
                </div>
                <div className="text-xs leading-none">
                  <p className="font-semibold" style={{ color: "var(--text-muted)" }}>
                    {t.login}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--text-subtle)" }}>
                    {t.register}
                  </p>
                </div>
              </button>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:scale-105"
              style={{ color: "var(--text-subtle)" }}
            >
              <Heart size={16} />
              {wishCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] text-white flex items-center justify-center font-bold"
                  style={{ background: "#EF4444" }}
                >
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Carrito */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Shopping cart"
              className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:scale-105"
              style={{ color: "var(--text-subtle)" }}
            >
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] text-white flex items-center justify-center font-bold btn-primary">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: carrito + wishlist + hamburguesa */}
          <div className="md:hidden col-start-3 flex items-center gap-1.5">
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-subtle)" }}
            >
              <Heart size={16} />
              {wishCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] text-white flex items-center justify-center font-bold"
                  style={{ background: "#EF4444" }}
                >
                  {wishCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Shopping cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-subtle)" }}
            >
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] text-white flex items-center justify-center font-bold btn-primary">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-lg"
              style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* CATEGORÍAS */}
        <nav className="hidden md:block" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="max-w-[1400px] mx-auto px-4 lg:px-6">
            <ul className="flex items-center justify-center gap-0.5 h-10">
              <li>
                <Link
                  href="/games"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap"
                  style={{ color: "var(--brand)" }}
                >
                  🎮 {t.allGames}
                </Link>
              </li>
              <li className="w-px h-4 mx-1 flex-shrink-0" style={{ background: "var(--border)" }} />
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "var(--text)";
                      (e.currentTarget as HTMLElement).style.background = "var(--card)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{lang === "EN" ? cat.nameEN : cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div
            className="md:hidden py-4 px-4"
            style={{ background: "var(--bg)", borderTop: "1px solid var(--border)" }}
          >
            <div className="mb-4">
              <SearchBar />
            </div>

            {/* Usuario mobile */}
            {user ? (
              <div className="flex items-center justify-between mb-4 p-3 rounded-xl"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white"
                    style={{ background: "linear-gradient(135deg,#1E3A8A,#EA580C)" }}
                  >
                    {user.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: "var(--text)" }}>{user.username}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-subtle)" }}>{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={async () => { await logout(); setMenuOpen(false); }}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-lg"
                  style={{ color: "#EF4444", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mb-4">
                <button onClick={() => { openModal("login"); setMenuOpen(false); }}
                  className="flex-1 flex items-center justify-center py-2.5 rounded-xl text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#1E3A8A,#EA580C)" }}>
                  {t.login}
                </button>
                <button onClick={() => { openModal("register"); setMenuOpen(false); }}
                  className="flex-1 flex items-center justify-center py-2.5 rounded-xl text-xs font-bold"
                  style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}>
                  {t.register}
                </button>
              </div>
            )}

            {/* Mobile links usuario logueado */}
            {user && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { href: "/profile",            icon: "👤", label: lang === "ES" ? "Mi cuenta"    : "Account"  },
                  { href: "/profile?tab=pedidos", icon: "🛍️", label: lang === "ES" ? "Pedidos"      : "Orders"   },
                  { href: "/wishlist",            icon: "❤️", label: lang === "ES" ? "Deseos"       : "Wishlist" },
                ].map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center text-xs font-medium"
                    style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Dropdown
                value={lang}
                label="🌐"
                options={[
                  { value: "ES", label: "Español" },
                  { value: "EN", label: "English" },
                ]}
                onSelect={(v) => setLang(v as "ES" | "EN")}
              />
              <Dropdown
                value={currency}
                label="💰"
                options={[
                  { value: "PEN", label: "PEN (S/)" },
                  { value: "USD", label: "USD ($)"  },
                  { value: "EUR", label: "EUR (€)"  },
                ]}
                onSelect={(v) => setCurrency(v as "PEN" | "USD" | "EUR")}
              />
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-xs"
                style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
              >
                {isDark ? <Sun size={13} /> : <Moon size={13} />}
                {isDark
                  ? lang === "ES" ? "Claro"  : "Light"
                  : lang === "ES" ? "Oscuro" : "Dark"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center text-xs font-medium"
                  style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span>{lang === "EN" ? cat.nameEN : cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
