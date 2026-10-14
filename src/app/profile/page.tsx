"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Eye, EyeOff, Check, Upload, Shield, Phone, Mail,
  Lock, ShoppingBag, Heart, User as UserIcon, AlertCircle,
  ShoppingCart, X, RefreshCw,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth, type User } from "@/context/AuthContext";
import { useWishlist, type WishlistItem } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { usePreferences } from "@/context/PreferencesContext";
import { api } from "@/lib/api";

type Tab = "perfil" | "seguridad" | "pedidos" | "wishlist";
const TAB_IDS: Tab[] = ["perfil", "seguridad", "pedidos", "wishlist"];

type UpdateProfile = ReturnType<typeof useAuth>["updateProfile"];

function ProfilePageInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, logout, updateProfile } = useAuth();
  const { items: wishItems, removeItem: removeWish } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { formatPrice, lang } = usePreferences();

  // La pestaña activa vive en la URL (?tab=pedidos): los enlaces del menú y el botón "atrás" funcionan.
  const tabParam = searchParams.get("tab");
  const tab: Tab = TAB_IDS.includes(tabParam as Tab) ? (tabParam as Tab) : "perfil";
  const setTab = (id: Tab) => router.replace(id === "perfil" ? "/profile" : `/profile?tab=${id}`, { scroll: false });

  useEffect(() => { if (!loading && !user) router.push("/login"); }, [user, loading, router]);

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <span className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}/>
    </div>
  );

  const TABS: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id:"perfil",    icon:<UserIcon size={15}/>,    label: lang === "ES" ? "Perfil de usuario" : "User profile" },
    { id:"seguridad", icon:<Shield size={15}/>,      label: lang === "ES" ? "Seguridad" : "Security"             },
    { id:"pedidos",   icon:<ShoppingBag size={15}/>, label: lang === "ES" ? "Mis pedidos" : "My orders"          },
    { id:"wishlist",  icon:<Heart size={15}/>,       label: lang === "ES" ? "Lista de deseos" : "Wishlist"       },
  ];

  return (
    <>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-8">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6 p-5 rounded-2xl"
            style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-2xl font-black text-[var(--on-primary)] flex-shrink-0"
              style={{ background:"var(--primary)" }}>
              {user.avatar
                // eslint-disable-next-line @next/next/no-img-element -- foto local en base64 (data URL)
                ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover"/>
                : user.username[0].toUpperCase()
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-black truncate" style={{ color:"var(--text)" }}>{user.username}</p>
              <p className="text-xs truncate" style={{ color:"var(--text-muted)" }}>{user.email}</p>
            </div>

            <button
              onClick={() => { logout(); router.push("/"); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-70"
              style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
              {lang === "ES" ? "🚪 Cerrar sesión" : "🚪 Sign out"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">

            {/* Sidebar */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
              {TABS.map((item, i, arr) => (
                <button key={item.id}
                  onClick={() => setTab(item.id)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-all"
                  style={{
                    background: tab===item.id ? "linear-gradient(135deg,rgba(124,104,214,0.08),rgba(206,116,58,0.06))" : "transparent",
                    borderBottom: i<arr.length-1 ? "1px solid var(--border)" : "none",
                    borderLeft: `2px solid ${tab===item.id ? "var(--primary)" : "transparent"}`,
                    color: tab===item.id ? "var(--text)" : "var(--text-muted)",
                  }}>
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <span style={{ color: tab===item.id ? "var(--primary)" : "var(--text-subtle)" }}>{item.icon}</span>
                    {item.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Contenido */}
            <div>
              {tab==="perfil"    && <TabPerfil user={user} updateProfile={updateProfile} loading={loading}/>}
              {tab==="seguridad" && <TabSeguridad user={user} updateProfile={updateProfile}/>}
              {tab==="pedidos"   && <TabPedidos/>}
              {tab==="wishlist"  && (
                <TabWishlist
                  items={wishItems}
                  removeWish={removeWish}
                  addToCart={addToCart}
                  formatPrice={formatPrice}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  );
}

// ══════════════════════════════════════════════════
// TAB PERFIL
// ══════════════════════════════════════════════════
function TabPerfil({ user, updateProfile, loading }: { user: User; updateProfile: UpdateProfile; loading: boolean }) {
  const { lang } = usePreferences();
  const ES = lang === "ES";
  const [username,   setUsername]   = useState(user.username);
  const [saved,      setSaved]      = useState(false);
  const [avatar,     setAvatar]     = useState<string | null>(user.avatar ?? null);
  const [avatarErr,  setAvatarErr]  = useState("");
  const [avatarSaved,setAvatarSaved]= useState(false);
  const [usernameErr, setUsernameErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Datos de compra (autorelleno del checkout) ──
  const [fullName, setFullName] = useState(user.fullName ?? "");
  const [phone,    setPhone]    = useState(user.phone ?? "");
  const [buyErr,   setBuyErr]   = useState("");
  const [buySaved, setBuySaved] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);

  async function handleSaveBuyData(ev: React.FormEvent) {
    ev.preventDefault();
    setBuyErr("");
    if (fullName.trim() && fullName.trim().length < 3) {
      setBuyErr(ES ? "El nombre completo debe tener al menos 3 caracteres." : "Full name must be at least 3 characters.");
      return;
    }
    setBuyLoading(true);
    try {
      await updateProfile({ fullName: fullName.trim(), phone: phone.trim() });
      setBuySaved(true);
      setTimeout(() => setBuySaved(false), 2500);
    } catch (e) {
      setBuyErr(e instanceof Error ? e.message : (ES ? "No se pudo guardar." : "Could not save."));
    } finally {
      setBuyLoading(false);
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2*1024*1024) {
      setAvatarErr(lang === "ES" ? "El tamaño de la imagen no debe exceder los 2 MB." : "Image size must not exceed 2 MB.");
      return;
    }
    setAvatarErr("");
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSaveAvatar() {
    try {
      await updateProfile({ avatar: avatar ?? undefined });
      setAvatarSaved(true);
      setTimeout(() => setAvatarSaved(false), 2500);
    } catch (e) {
      setAvatarErr(e instanceof Error ? e.message : (ES ? "No se pudo guardar la foto." : "Could not save the photo."));
    }
  }

  async function handleSaveUsername(ev: React.FormEvent) {
    ev.preventDefault();
    // Validate length
    if (username.trim().length < 3 || username.trim().length > 32) {
      setUsernameErr(lang === "ES" ? "El nombre de usuario debe tener entre 3 y 32 caracteres." : "Username must be between 3 and 32 characters.");
      return;
    }
    if (/[^a-zA-Z0-9_]/.test(username.trim())) {
      setUsernameErr(lang === "ES" ? "Solo letras, números y guiones bajos. Sin espacios ni caracteres especiales." : "Only letters, numbers, and underscores. No spaces or special characters.");
      return;
    }
    // El backend comprueba que el nombre no esté en uso.
    setUsernameErr("");
    try {
      await updateProfile({ username: username.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setUsernameErr(e instanceof Error ? e.message : (ES ? "No se pudo cambiar el nombre de usuario." : "Could not change the username."));
    }
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleString(lang === "ES" ? "es-ES" : "en-US", { dateStyle:"short", timeStyle:"medium" })
    : "—";

  return (
    <div className="space-y-5">

      {/* Avatar */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="px-6 py-4" style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "Perfil de usuario" : "User profile"}</p>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ background:"var(--primary)" }}>
                {avatar
                  // eslint-disable-next-line @next/next/no-img-element -- foto local en base64 (data URL)
                  ? <img src={avatar} alt="avatar" className="w-full h-full object-cover"/>
                  : <span className="text-3xl font-black text-[var(--on-primary)]">{user.username[0].toUpperCase()}</span>
                }
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold mb-2" style={{ color:"var(--text)" }}>{lang === "ES" ? "Tu foto" : "Your photo"}</p>
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[var(--on-primary)] transition-all hover:opacity-90"
                  style={{ background:"var(--primary)" }}>
                  <Upload size={13}/> {lang === "ES" ? "Subir" : "Upload"}
                </button>
                {avatar && (
                  <button onClick={handleSaveAvatar}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                    style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)" }}>
                    <Check size={13}/> {lang === "ES" ? "Guardar foto" : "Save photo"}
                  </button>
                )}
                {avatarSaved && (
                  <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
                    <Check size={12}/> {lang === "ES" ? "¡Guardado!" : "Saved!"}
                  </span>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
              <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
                {lang === "ES"
                  ? <>Configura tu avatar. Se mostrará en todo KidStore como identificación visual. El tamaño no debe exceder los <strong style={{ color:"var(--text)" }}>2 MB</strong>.</>
                  : <>Set up your avatar. It will be displayed across KidStore as your visual identity. Size must not exceed <strong style={{ color:"var(--text)" }}>2 MB</strong>.</>
                }
              </p>
              {avatarErr && <p className="text-xs mt-1.5 font-semibold" style={{ color:"#EF4444" }}>{avatarErr}</p>}
              {!avatar && <p className="text-xs mt-1.5" style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "Aún no has configurado una foto de perfil." : "You haven't set a profile photo yet."}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Username */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="px-6 py-4" style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "Tu nombre de usuario" : "Your username"}</p>
        </div>
        <form onSubmit={handleSaveUsername} className="p-6 space-y-3">
          <input type="text" value={username}
            onChange={e => { setUsername(e.target.value); setUsernameErr(""); }}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{ background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)" }}
            onFocus={e => (e.currentTarget.style.borderColor="var(--primary)")}
            onBlur={e  => (e.currentTarget.style.borderColor="var(--border)")}/>
          <p className="text-xs" style={{ color:"var(--text-subtle)" }}>
            {lang === "ES" ? "Nombre único en el sitio. Entre 3 y 32 caracteres. Sin espacios ni caracteres especiales." : "Unique name on the site. Between 3 and 32 characters. No spaces or special characters."}
          </p>
          {usernameErr && (
            <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color:"#EF4444" }}>
              <AlertCircle size={12}/> {usernameErr}
            </p>
          )}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[var(--on-primary)] hover:opacity-90 disabled:opacity-60"
              style={{ background:"var(--primary)", boxShadow:"0 4px 14px rgba(206,116,58,0.25)" }}>
              {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> : (lang === "ES" ? "Cambiar" : "Change")}
            </button>
            {saved && <span className="text-xs font-semibold text-green-400 flex items-center gap-1"><Check size={13}/> {lang === "ES" ? "¡Guardado!" : "Saved!"}</span>}
          </div>
        </form>
      </div>

      {/* Datos de compra — autorelleno del checkout */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="px-6 py-4" style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{ES ? "Datos de compra" : "Purchase details"}</p>
        </div>
        <form onSubmit={handleSaveBuyData} className="p-6 space-y-4">
          <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
            {ES
              ? "Se autorellenan al finalizar una compra para que sea más rápido. Puedes editarlos siempre que quieras."
              : "These auto-fill at checkout so it's faster. You can edit them anytime."}
          </p>

          {buyErr && (
            <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color:"#EF4444" }}>
              <AlertCircle size={12}/> {buyErr}
            </p>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color:"var(--text-subtle)" }}>
              {ES ? "Nombre completo" : "Full name"}
            </label>
            <input type="text" value={fullName} onChange={e => { setFullName(e.target.value); setBuyErr(""); }}
              placeholder={ES ? "Tu nombre y apellido" : "Your first and last name"}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)" }}
              onFocus={e => (e.currentTarget.style.borderColor="var(--primary)")}
              onBlur={e  => (e.currentTarget.style.borderColor="var(--border)")}/>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color:"var(--text-subtle)" }}>
              {ES ? "Correo electrónico" : "Email"}
            </label>
            <div className="w-full px-4 py-3 rounded-xl text-sm flex items-center justify-between gap-2"
              style={{ background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text-muted)" }}>
              <span className="truncate">{user.email}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ color:"#22C55E", background:"rgba(34,197,94,0.1)" }}>{ES ? "Verificado" : "Verified"}</span>
            </div>
            <p className="text-[11px] mt-1" style={{ color:"var(--text-subtle)" }}>
              {ES ? "Con este correo se creó tu cuenta. Para cambiarlo ve a Seguridad." : "Your account was created with this email. To change it, go to Security."}
            </p>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color:"var(--text-subtle)" }}>
              {ES ? "WhatsApp / Teléfono" : "WhatsApp / Phone"}
            </label>
            <input type="tel" value={phone} onChange={e => { setPhone(e.target.value.replace(/[^0-9+ ]/g,"")); setBuyErr(""); }}
              placeholder="+51 999 999 999"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)" }}
              onFocus={e => (e.currentTarget.style.borderColor="var(--primary)")}
              onBlur={e  => (e.currentTarget.style.borderColor="var(--border)")}/>
            <p className="text-[11px] mt-1" style={{ color:"var(--text-subtle)" }}>
              {ES ? "Te contactamos por aquí para coordinar la entrega." : "We contact you here to coordinate delivery."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={buyLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[var(--on-primary)] hover:opacity-90 disabled:opacity-60"
              style={{ background:"var(--primary)", boxShadow:"0 4px 14px rgba(206,116,58,0.25)" }}>
              {buyLoading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/> : (ES ? "Guardar" : "Save")}
            </button>
            {buySaved && <span className="text-xs font-semibold text-green-400 flex items-center gap-1"><Check size={13}/> {ES ? "¡Guardado!" : "Saved!"}</span>}
          </div>
        </form>
      </div>

      {/* Info cuenta */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="px-6 py-4" style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{ES ? "Información de la cuenta" : "Account information"}</p>
        </div>
        <div className="divide-y" style={{ borderColor:"var(--border)" }}>
          {([
            { label: ES ? "Correo electrónico" : "Email", value:user.email, badge:{ text: ES ? "Verificado" : "Verified", color:"#22C55E", bg:"rgba(34,197,94,0.1)" } },
            { label: ES ? "Número de teléfono" : "Phone number", value: user.phone || (ES ? "No configurado" : "Not configured") },
            { label: ES ? "ID de usuario" : "User ID",      value: String(user.id ?? "—") },
            { label: ES ? "Hora de unirse" : "Join date",     value:joinDate },
          ] as { label: string; value: string; badge?: { text: string; color: string; bg: string } }[]).map((row, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color:"var(--text-subtle)" }}>{row.label}</p>
                <p className="text-sm font-semibold flex items-center gap-2" style={{ color:"var(--text)" }}>
                  {row.value}
                  {row.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ color:row.badge.color, background:row.badge.bg }}>
                      {row.badge.text}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// TAB SEGURIDAD
// ══════════════════════════════════════════════════
function TabSeguridad({ user, updateProfile }: { user: User; updateProfile: UpdateProfile }) {
  const { lang } = usePreferences();
  const ES = lang === "ES";
  const { changePassword, requestEmailCode, verifyCode } = useAuth();
  // ── Contraseña ──
  const [currentPass, setCurrentPass] = useState("");
  const [newPass,     setNewPass]     = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [show,        setShow]        = useState(false);
  const [passError,   setPassError]   = useState("");
  const [passSaved,   setPassSaved]   = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  // ── Modal cambio de correo (con código real al correo nuevo) ──
  const [emailModal,  setEmailModal]  = useState(false);
  const [emailStep,   setEmailStep]   = useState<"input"|"verify">("input");
  const [newEmail,    setNewEmail]    = useState("");
  const [emailCode,   setEmailCode]   = useState("");
  const [emailErr,    setEmailErr]    = useState("");
  const [emailSaved,  setEmailSaved]  = useState(false);
  const [emailBusy,   setEmailBusy]   = useState(false);

  async function handleEmailSend() {
    if (!newEmail.trim() || !newEmail.includes("@")) {
      setEmailErr(ES ? "Ingresa un correo electrónico válido." : "Enter a valid email address.");
      return;
    }
    if (newEmail.trim().toLowerCase() === user.email.toLowerCase()) {
      setEmailErr(ES ? "El nuevo correo debe ser diferente al actual." : "The new email must be different from the current one.");
      return;
    }
    setEmailErr("");
    setEmailBusy(true);
    try {
      await requestEmailCode(newEmail.trim(), user.username, lang, "email-change");
      setEmailStep("verify");
      setEmailCode("");
    } catch (e) {
      setEmailErr(e instanceof Error ? e.message : (ES ? "No se pudo enviar el código." : "Could not send the code."));
    } finally {
      setEmailBusy(false);
    }
  }

  async function handleEmailVerify() {
    if (!emailCode.trim() || emailCode.length < 6) {
      setEmailErr(ES ? "Ingresa el código de verificación." : "Enter the verification code.");
      return;
    }
    setEmailBusy(true);
    setEmailErr("");
    try {
      await verifyCode(newEmail.trim(), emailCode.trim());
    } catch {
      setEmailErr(ES ? "Código incorrecto o expirado." : "Incorrect or expired code.");
      setEmailBusy(false);
      return;
    }
    try {
      await updateProfile({ newEmail: newEmail.trim() });
      setEmailSaved(true);
      setTimeout(() => {
        setEmailModal(false);
        setEmailStep("input");
        setNewEmail("");
        setEmailCode("");
        setEmailSaved(false);
      }, 1800);
    } catch (e) {
      setEmailErr(e instanceof Error ? e.message : (ES ? "No se pudo cambiar el correo." : "Could not change the email."));
    } finally {
      setEmailBusy(false);
    }
  }

  async function handleChangePassword(ev: React.FormEvent) {
    ev.preventDefault();
    setPassError("");

    // Validaciones
    if (!currentPass.trim()) { setPassError(lang === "ES" ? "Ingresa tu contraseña actual." : "Enter your current password."); return; }
    if (newPass.length < 8)  { setPassError(lang === "ES" ? "La nueva contraseña debe tener al menos 8 caracteres." : "New password must be at least 8 characters."); return; }
    if (newPass !== confirmPass) { setPassError(lang === "ES" ? "Las contraseñas no coinciden." : "Passwords don't match."); return; }

    setPassLoading(true);
    try {
      await changePassword(currentPass, newPass);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("actual es incorrecta")) {
        setPassError(lang === "ES" ? "La contraseña actual es incorrecta." : "Current password is incorrect.");
      } else {
        setPassError(msg || (lang === "ES" ? "Error al cambiar la contraseña." : "Error changing password."));
      }
      setPassLoading(false);
      return;
    }
    setPassLoading(false);
    setPassSaved(true);
    setCurrentPass(""); setNewPass(""); setConfirmPass("");
    setTimeout(() => setPassSaved(false), 3000);
  }

  return (
    <div className="space-y-5">

      {/* Aviso */}
      <div className="px-5 py-4 rounded-2xl flex items-start gap-3"
        style={{ background:"rgba(124,104,214,0.06)", border:"1px solid rgba(124,104,214,0.2)" }}>
        <Shield size={16} className="flex-shrink-0 mt-0.5" style={{ color:"#60A5FA" }}/>
        <div>
          <p className="text-sm font-bold mb-0.5" style={{ color:"var(--text)" }}>{lang === "ES" ? "Seguridad" : "Security"}</p>
          <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
            {lang === "ES" ? "Tu seguridad es nuestra prioridad. ¡Dedica un momento a configurar estos ajustes para proteger tu cuenta!" : "Your security is our priority. Take a moment to configure these settings to protect your account!"}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
          <div className="flex items-center gap-2">
            <Mail size={14} style={{ color:"#60A5FA" }}/>
            <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "Correo electrónico" : "Email"}</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ color:"#22C55E", background:"rgba(34,197,94,0.1)" }}>{lang === "ES" ? "Verificado" : "Verified"} ✓</span>
        </div>
        <div className="p-6">
          <p className="text-sm font-semibold mb-2" style={{ color:"var(--text)" }}>{user.email}</p>
          <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
            {lang === "ES" ? "Correo usado para recibir verificaciones y recordatorios de seguridad." : "Email used to receive verifications and security reminders."}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold" style={{ color:"#22C55E" }}>
              <Check size={13}/> {lang === "ES" ? "Dirección de correo electrónico verificada." : "Email address verified."}
            </div>
            <button onClick={() => { setEmailModal(true); setEmailStep("input"); setEmailErr(""); }}
              className="text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-70"
              style={{ color:"#60A5FA", background:"rgba(96,165,250,0.08)", border:"1px solid rgba(96,165,250,0.2)" }}>
              {lang === "ES" ? "Cambiar correo" : "Change email"}
            </button>
          </div>
        </div>
      </div>

      {/* Teléfono → se gestiona en "Datos de compra" de la pestaña Perfil */}
      <div className="rounded-2xl px-6 py-4 flex items-center gap-3"
        style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <Phone size={14} style={{ color:"var(--primary)", flexShrink:0 }}/>
        <p className="text-xs" style={{ color:"var(--text-muted)" }}>
          {ES
            ? <>Tu teléfono está en <strong style={{ color:"var(--text)" }}>Perfil → Datos de compra</strong>. Se usa para coordinar la entrega por WhatsApp.</>
            : <>Your phone lives in <strong style={{ color:"var(--text)" }}>Profile → Purchase details</strong>. It&apos;s used to coordinate delivery via WhatsApp.</>}
        </p>
      </div>

      {/* Contraseña */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="px-6 py-4 flex items-center gap-2"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
          <Lock size={14} style={{ color:"#AA91FF" }}/>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "Contraseña" : "Password"}</p>
        </div>
        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
            {lang === "ES" ? "Cambiar tu contraseña regularmente reduce el riesgo de robo. Se recomienda cambiarla cada trimestre o semestre." : "Changing your password regularly reduces the risk of theft. It is recommended to change it every quarter or semester."}
          </p>

          {passError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs"
              style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", color:"#FCA5A5" }}>
              <AlertCircle size={13} className="flex-shrink-0"/>{passError}
            </div>
          )}

          {[
            { label: lang === "ES" ? "Contraseña actual" : "Current password",    val:currentPass, set:setCurrentPass },
            { label: lang === "ES" ? "Nueva contraseña" : "New password",     val:newPass,     set:setNewPass     },
            { label: lang === "ES" ? "Confirmar contraseña" : "Confirm password", val:confirmPass, set:setConfirmPass },
          ].map(f => (
            <div key={f.label}>
              <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
                style={{ color:"var(--text-subtle)" }}>{f.label}</label>
              <div className="relative">
                <input type={show ? "text" : "password"} placeholder="••••••••" value={f.val}
                  onChange={e => { f.set(e.target.value); setPassError(""); }}
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                  style={{ background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)" }}
                  onFocus={e => (e.currentTarget.style.borderColor="var(--primary)")}
                  onBlur={e  => (e.currentTarget.style.borderColor="var(--border)")}/>
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                  style={{ color:"var(--text-subtle)" }}>
                  {show ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3 pt-1">
            <button type="submit" disabled={passLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[var(--on-primary)] hover:opacity-90 disabled:opacity-60"
              style={{ background:"var(--primary)", boxShadow:"0 4px 14px rgba(206,116,58,0.25)" }}>
              {passLoading
                ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                : (lang === "ES" ? "Cambiar contraseña" : "Change password")}
            </button>
            {passSaved && (
              <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
                <Check size={13}/> {lang === "ES" ? "¡Contraseña actualizada!" : "Password updated!"}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Modal cambio de correo */}
      {emailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)" }}
          onClick={() => setEmailModal(false)}>
          <div className="w-full max-w-sm rounded-2xl overflow-hidden"
            style={{ background:"var(--card)", border:"1px solid var(--border)" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
              <p className="text-sm font-bold" style={{ color:"var(--text)" }}>
                {emailStep==="input" ? (lang === "ES" ? "✉️ Cambiar correo electrónico" : "✉️ Change email") : (lang === "ES" ? "🔐 Verifica tu nuevo correo" : "🔐 Verify your new email")}
              </p>
              <button onClick={() => setEmailModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70"
                style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
                <X size={14}/>
              </button>
            </div>
            <div className="p-5 space-y-4">
              {emailStep==="input" ? (
                <>
                  <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                    {lang === "ES" ? "Ingresa tu nuevo correo electrónico. Te enviaremos un código de verificación." : "Enter your new email address. We will send you a verification code."}
                  </p>
                  <div className="px-3 py-2 rounded-xl text-xs"
                    style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
                    {lang === "ES" ? "Correo actual:" : "Current email:"} <strong style={{ color:"var(--text)" }}>{user.email}</strong>
                  </div>
                  {emailErr && (
                    <div className="text-xs px-3 py-2 rounded-xl"
                      style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#FCA5A5" }}>
                      {emailErr}
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
                      style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "Nuevo correo electrónico" : "New email"}</label>
                    <input type="email" placeholder="nuevo@correo.com" value={newEmail}
                      onChange={e => { setNewEmail(e.target.value); setEmailErr(""); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)" }}
                      onFocus={e => (e.currentTarget.style.borderColor="var(--primary)")}
                      onBlur={e  => (e.currentTarget.style.borderColor="var(--border)")}/>
                  </div>
                  <button onClick={handleEmailSend} disabled={emailBusy}
                    className="w-full py-3 rounded-xl text-sm font-bold text-[var(--on-primary)] hover:opacity-90 disabled:opacity-60"
                    style={{ background:"var(--primary)" }}>
                    {emailBusy ? (ES ? "Enviando…" : "Sending…") : (ES ? "Enviar código de verificación →" : "Send verification code →")}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                    {lang === "ES" ? "Código enviado a" : "Code sent to"} <strong style={{ color:"var(--text)" }}>{newEmail}</strong>.
                  </p>
                  <div className="px-3 py-2 rounded-xl text-xs"
                    style={{ background:"rgba(206,116,58,0.07)", border:"1px solid rgba(206,116,58,0.2)", color:"var(--text-muted)" }}>
                    {lang === "ES" ? "Revisa tu bandeja de entrada e ingresa el código de 6 dígitos." : "Check your inbox and enter the 6-digit code."}
                  </div>
                  {emailErr && (
                    <div className="text-xs px-3 py-2 rounded-xl"
                      style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#FCA5A5" }}>
                      {emailErr}
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
                      style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "Código de verificación" : "Verification code"}</label>
                    <input type="text" placeholder="123456" maxLength={6} value={emailCode}
                      onChange={e => { setEmailCode(e.target.value); setEmailErr(""); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none text-center tracking-[.3em] font-bold"
                      style={{ background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)" }}
                      onFocus={e => (e.currentTarget.style.borderColor="var(--primary)")}
                      onBlur={e  => (e.currentTarget.style.borderColor="var(--border)")}/>
                  </div>
                  {emailSaved ? (
                    <div className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-green-400">
                      <Check size={16}/> {lang === "ES" ? "¡Correo actualizado!" : "Email updated!"}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setEmailStep("input"); setEmailErr(""); }}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold hover:opacity-70"
                        style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
                        {lang === "ES" ? "← Volver" : "← Back"}
                      </button>
                      <button onClick={handleEmailVerify} disabled={emailBusy || emailCode.length < 6}
                        className="flex-1 py-3 rounded-xl text-sm font-bold text-[var(--on-primary)] hover:opacity-90 disabled:opacity-50"
                        style={{ background:"var(--primary)" }}>
                        {emailBusy ? (ES ? "Verificando…" : "Verifying…") : (ES ? "Verificar" : "Verify")}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ══════════════════════════════════════════════════
// TAB PEDIDOS — historial real desde el backend (GET /orders/me, con la sesión)
// ══════════════════════════════════════════════════
interface MyOrder {
  orderId:       number;
  total:         number;
  currency:      string;
  paymentMethod: string;
  status:        string;
  createdAt:     string;
  updatedAt?:    string;
  items: { id: string; name: string; price: number; quantity: number; image?: string }[];
}

// Estados que pone el administrador desde el panel.
const ORDER_STATUS: Record<string, { es: string; en: string; color: string; bg: string }> = {
  pending:    { es: "Pendiente",  en: "Pending",    color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  processing: { es: "Procesando", en: "Processing", color: "#60A5FA", bg: "rgba(96,165,250,0.1)" },
  delivered:  { es: "Entregado",  en: "Delivered",  color: "#22C55E", bg: "rgba(34,197,94,0.1)"  },
  cancelled:  { es: "Cancelado",  en: "Cancelled",  color: "#EF4444", bg: "rgba(239,68,68,0.1)"  },
};
const PAYMENT_LABEL: Record<string, string> = {
  yape: "Yape", plin: "Plin", transferencia: "Transferencia", paypal: "PayPal", binance: "Binance Pay", bizum: "Bizum",
};
const CURRENCY_SYMBOL: Record<string, string> = { PEN: "S/", USD: "$", EUR: "€" };

function TabPedidos() {
  const { lang } = usePreferences();
  const { logout } = useAuth();
  const ES = lang === "ES";
  const [orders,    setOrders]    = useState<MyOrder[]>([]);
  const [error,     setError]     = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [loadedKey, setLoadedKey] = useState(-1);
  const [activeTab, setActiveTab] = useState<"all" | keyof typeof ORDER_STATUS>("all");
  const [query,     setQuery]     = useState("");
  const loading = loadedKey !== reloadKey;

  useEffect(() => {
    let cancelled = false;
    api<{ success: boolean; orders: MyOrder[] }>("/orders/me").then(({ data, error: apiError, status }) => {
      if (cancelled) return;
      if (status === 401) { logout(); return; } // sesión caducada → vuelve al login
      if (apiError || !data) {
        setError(ES ? "No pudimos cargar tus pedidos. Inténtalo de nuevo." : "We couldn't load your orders. Please try again.");
      } else {
        setError("");
        setOrders(data.orders ?? []);
      }
      setLoadedKey(reloadKey);
    });
    return () => { cancelled = true; };
  }, [reloadKey, ES, logout]);

  const ORDER_TABS: { id: "all" | keyof typeof ORDER_STATUS; label: string }[] = [
    { id: "all", label: ES ? "Todos" : "All" },
    ...Object.entries(ORDER_STATUS).map(([id, st]) => ({ id, label: ES ? st.es : st.en })),
  ];
  const q = query.trim().toLowerCase();
  const filtered = orders.filter((o) =>
    (activeTab === "all" || o.status === activeTab) &&
    (!q || String(o.orderId).includes(q) || o.items.some((i) => i.name.toLowerCase().includes(q))),
  );
  const fmtDate = (d: string) =>
    new Date(d).toLocaleString(ES ? "es-PE" : "en-US", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
      <div className="px-6 py-4 flex items-center justify-between gap-3" style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
        <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{ES ? "🛍️ Mis pedidos" : "🛍️ My orders"}</p>
        <button onClick={() => setReloadKey((k) => k + 1)} disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-70 disabled:opacity-50"
          style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
          <RefreshCw size={12} className={loading ? "animate-spin" : ""}/> {ES ? "Actualizar" : "Refresh"}
        </button>
      </div>

      {/* Filtro por estado */}
      <div className="flex overflow-x-auto" style={{ borderBottom:"1px solid var(--border)", scrollbarWidth:"none" }}>
        {ORDER_TABS.map((ot) => (
          <button key={ot.id} onClick={() => setActiveTab(ot.id)}
            className="flex-shrink-0 px-4 py-3 text-xs font-semibold transition-all relative whitespace-nowrap"
            style={{ color: activeTab===ot.id ? "var(--primary)" : "var(--text-muted)" }}>
            {ot.label}
            {activeTab===ot.id && (
              <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                style={{ background:"var(--primary)" }}/>
            )}
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div className="p-4" style={{ borderBottom:"1px solid var(--border)" }}>
        <input type="search" placeholder={ES ? "Buscar por producto o número de pedido…" : "Search by item or order number…"}
          value={query} onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl text-xs outline-none"
          style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)" }}/>
      </div>

      <div className="p-4">
        {error && (
          <div className="mb-3 flex items-center gap-2 px-4 py-3 rounded-xl text-xs"
            style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", color:"#EF4444" }}>
            <AlertCircle size={13} className="flex-shrink-0"/>{error}
          </div>
        )}
        {loading && orders.length === 0 ? (
          <div className="py-12 flex justify-center">
            <span className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:"var(--primary)", borderTopColor:"transparent" }}/>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <ShoppingBag size={24} style={{ color:"var(--text-subtle)" }}/>
            </div>
            <p className="text-sm font-bold mb-1" style={{ color:"var(--text)" }}>
              {orders.length ? (ES ? "No hay pedidos con este filtro" : "No orders match this filter") : (ES ? "No tienes pedidos aún" : "You don't have any orders yet")}
            </p>
            <p className="text-xs mb-4" style={{ color:"var(--text-subtle)" }}>
              {orders.length ? (ES ? "Prueba con otro estado o búsqueda." : "Try another status or search.") : (ES ? "Cuando realices una compra con el correo de tu cuenta aparecerá aquí." : "Purchases made with your account email will appear here.")}
            </p>
            {!orders.length && (
              <Link href="/games"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[var(--on-primary)]"
                style={{ background:"var(--primary)" }}>
                {ES ? "Ver todos los juegos →" : "View all games →"}
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const st = ORDER_STATUS[order.status] ?? ORDER_STATUS.pending;
              const sym = CURRENCY_SYMBOL[order.currency] ?? order.currency;
              return (
                <div key={`${order.orderId}-${order.createdAt}`} className="rounded-xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
                  <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-2"
                    style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)" }}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-xs font-bold" style={{ color:"var(--text)" }}>{ES ? "Pedido" : "Order"} #{order.orderId}</span>
                      <span className="text-xs" style={{ color:"var(--text-subtle)" }}>{fmtDate(order.createdAt)}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ color:st.color, background:st.bg, border:`1px solid ${st.color}30` }}>
                      {ES ? st.es : st.en}
                    </span>
                  </div>
                  {order.items.map((item, i) => (
                    <div key={i} className="px-4 py-3 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                        {item.image ? <Image src={item.image} alt="" fill sizes="40px" className="object-contain p-1"/> : "🎮"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color:"var(--text)" }}>{item.name}</p>
                        <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>x{item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold flex-shrink-0" style={{ color:"var(--text-muted)" }}>
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                  <div className="px-4 py-3 flex items-center justify-between gap-3 text-xs" style={{ borderTop:"1px solid var(--border)" }}>
                    <span style={{ color:"var(--text-muted)" }}>{ES ? "Pago:" : "Payment:"} <strong style={{ color:"var(--text)" }}>{PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}</strong></span>
                    <span className="text-sm font-black" style={{ color:"var(--primary)" }}>{sym} {order.total.toFixed(2)}</span>
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

// ══════════════════════════════════════════════════
// TAB WISHLIST — conectada al WishlistContext real
// ══════════════════════════════════════════════════
function TabWishlist({ items, removeWish, addToCart, formatPrice }: {
  items: WishlistItem[];
  removeWish: (slug: string) => void;
  addToCart: ReturnType<typeof useCart>["addItem"];
  formatPrice: (pen: number) => string;
}) {
  const { lang } = usePreferences();
  const [added, setAdded] = useState<string[]>([]);

  function handleAddToCart(item: WishlistItem) {
    addToCart({
      slug: item.slug, name: item.name, img: item.img,
      price: item.price, priceOld: item.priceOld,
      region: item.region, format: item.format, tabLabel: item.tabLabel,
    });
    setAdded(prev => [...prev, item.slug]);
    setTimeout(() => setAdded(prev => prev.filter(s => s !== item.slug)), 2000);
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
        <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "❤️ Lista de deseos" : "❤️ Wishlist"}</p>
        {items.length > 0 && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background:"rgba(239,68,68,0.1)", color:"#EF4444", border:"1px solid rgba(239,68,68,0.2)" }}>
            {items.length} {items.length===1 ? (lang === "ES" ? "producto" : "product") : (lang === "ES" ? "productos" : "products")}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="p-10 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
            <Heart size={24} style={{ color:"var(--text-subtle)" }}/>
          </div>
          <p className="text-sm font-bold mb-1" style={{ color:"var(--text)" }}>{lang === "ES" ? "Tu lista de deseos está vacía" : "Your wishlist is empty"}</p>
          <p className="text-xs mb-4" style={{ color:"var(--text-subtle)" }}>
            {lang === "ES" ? "Guarda productos con ❤️ para encontrarlos fácilmente." : "Save products with ❤️ to find them easily."}
          </p>
          <Link href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[var(--on-primary)]"
            style={{ background:"var(--primary)" }}>
            {lang === "ES" ? "Explorar juegos →" : "Explore games →"}
          </Link>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor:"var(--border)" }}>
          {items.map((item) => {
            const disc = item.priceOld > item.price
              ? Math.round((1 - item.price / item.priceOld) * 100)
              : 0;
            const isAdded = added.includes(item.slug);
            return (
              <div key={item.slug} className="p-4 flex items-center gap-4">
                {/* Imagen */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background:"linear-gradient(135deg,rgba(124,104,214,0.1),rgba(206,116,58,0.1))" }}>
                  <Image src={item.img} alt={item.name} fill sizes="80px" className="object-contain p-1"/>
                  {disc > 0 && (
                    <span className="absolute top-0.5 left-0.5 text-[9px] font-black text-white px-1 py-0.5 rounded"
                      style={{ background:"#EF4444" }}>-{disc}%</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate" style={{ color:"var(--text)" }}>{item.name}</p>
                  {item.game && (
                    <p className="text-[10px] mt-0.5" style={{ color:"var(--text-subtle)" }}>{item.game}</p>
                  )}
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-black" style={{ color:"var(--primary)" }}>
                      {formatPrice(item.price)}
                    </span>
                    {disc > 0 && (
                      <span className="text-[10px] line-through" style={{ color:"var(--text-subtle)" }}>
                        {formatPrice(item.priceOld)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                    style={{
                      background: isAdded ? "rgba(34,197,94,0.1)" : "var(--surface)",
                      border: `1px solid ${isAdded ? "rgba(34,197,94,0.3)" : "var(--border)"}`,
                      color: isAdded ? "#22C55E" : "var(--text-muted)",
                    }}>
                    {isAdded ? <Check size={12}/> : <ShoppingCart size={12}/>}
                    {isAdded ? (lang === "ES" ? "¡Añadido!" : "Added!") : (lang === "ES" ? "Al carrito" : "Add to cart")}
                  </button>
                  <button
                    onClick={() => removeWish(item.slug)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
                    style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444" }}>
                    <X size={13}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════
export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background:"var(--bg)" }}>
        <span className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor:"var(--primary)", borderTopColor:"transparent" }}/>
      </div>
    }>
      <ProfilePageInner/>
    </Suspense>
  );
}
