"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Eye, EyeOff, Check, Upload, Shield, Phone, Mail,
  Lock, ShoppingBag, Heart, User, Clock, AlertCircle,
  ShoppingCart, X,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { usePreferences } from "@/context/PreferencesContext";

type Tab = "perfil" | "seguridad" | "pedidos" | "transacciones" | "wishlist";

// ── Helpers: fetch orders/transactions from localStorage ──
function getOrders(userId: string) {
  try {
    const all = JSON.parse(localStorage.getItem("kidstore_orders") ?? "[]");
    return all.filter((o: any) => String(o.userId) === String(userId));
  } catch { return []; }
}
function getTransactions(userId: string) {
  try {
    const all = JSON.parse(localStorage.getItem("kidstore_transactions") ?? "[]");
    return all.filter((t: any) => String(t.userId) === String(userId));
  } catch { return []; }
}

function ProfilePageInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, logout, updateProfile, changePassword } = useAuth();
  const { items: wishItems, toggle: toggleWish, removeItem: removeWish } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { formatPrice, lang } = usePreferences();

  const tabParam = searchParams.get("tab") as Tab | null;
  const [tab, setTab] = useState<Tab>(tabParam ?? "perfil");

  useEffect(() => { if (tabParam) setTab(tabParam); }, [tabParam]);
  useEffect(() => { if (!loading && !user) router.push("/login"); }, [user, loading, router]);

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <span className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "#EA580C", borderTopColor: "transparent" }}/>
    </div>
  );

  const TABS = [
    { id:"perfil",        icon:<User size={15}/>,        label: lang === "ES" ? "Perfil de usuario" : "User profile" },
    { id:"seguridad",     icon:<Shield size={15}/>,      label: lang === "ES" ? "Seguridad" : "Security"             },
    { id:"pedidos",       icon:<ShoppingBag size={15}/>, label: lang === "ES" ? "Mis pedidos" : "My orders"          },
    { id:"transacciones", icon:<Clock size={15}/>,       label: lang === "ES" ? "Historial" : "History"              },
    { id:"wishlist",      icon:<Heart size={15}/>,       label: lang === "ES" ? "Lista de deseos" : "Wishlist"       },
  ];

  return (
    <>
      <Navbar/>
      <main style={{ background:"var(--bg)", minHeight:"100vh" }}>
        <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-8">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6 p-5 rounded-2xl"
            style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
              style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)" }}>
              {user.avatar
                ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover"/>
                : user.username[0].toUpperCase()
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-black truncate" style={{ color:"var(--text)" }}>{user.username}</p>
              <p className="text-xs truncate" style={{ color:"var(--text-muted)" }}>{user.email}</p>
            </div>

            <button
              onClick={async () => { await logout(); router.push("/"); }}
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
                  onClick={() => setTab(item.id as Tab)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-all"
                  style={{
                    background: tab===item.id ? "linear-gradient(135deg,rgba(30,58,138,0.08),rgba(234,88,12,0.06))" : "transparent",
                    borderBottom: i<arr.length-1 ? "1px solid var(--border)" : "none",
                    borderLeft: `2px solid ${tab===item.id ? "#EA580C" : "transparent"}`,
                    color: tab===item.id ? "var(--text)" : "var(--text-muted)",
                  }}>
                  <div className="flex items-center gap-2.5 text-xs font-semibold">
                    <span style={{ color: tab===item.id ? "#EA580C" : "var(--text-subtle)" }}>{item.icon}</span>
                    {item.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Contenido */}
            <div>
              {tab==="perfil"        && <TabPerfil user={user} updateProfile={updateProfile} loading={loading}/>}
              {tab==="seguridad"     && <TabSeguridad user={user} updateProfile={updateProfile}/>}
              {tab==="pedidos"       && <TabPedidos userId={String(user.id)}/>}
              {tab==="transacciones" && <TabTransacciones userId={String(user.id)}/>}
              {tab==="wishlist"      && (
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
function TabPerfil({ user, updateProfile, loading }: any) {
  const { lang } = usePreferences();
  const [username,   setUsername]   = useState(user.username);
  const [saved,      setSaved]      = useState(false);
  const [avatar,     setAvatar]     = useState<string | null>(user.avatar ?? null);
  const [avatarErr,  setAvatarErr]  = useState("");
  const [avatarSaved,setAvatarSaved]= useState(false);
  const [usernameErr, setUsernameErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

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
    await updateProfile({ avatar: avatar ?? undefined });
    setAvatarSaved(true);
    setTimeout(() => setAvatarSaved(false), 2500);
  }

  async function handleSaveUsername(ev: React.FormEvent) {
    ev.preventDefault();
    // Validate length
    if (username.trim().length < 6 || username.trim().length > 32) {
      setUsernameErr(lang === "ES" ? "El nombre de usuario debe tener entre 6 y 32 caracteres." : "Username must be between 6 and 32 characters.");
      return;
    }
    if (/[^a-zA-Z0-9_]/.test(username.trim())) {
      setUsernameErr(lang === "ES" ? "Solo letras, números y guiones bajos. Sin espacios ni caracteres especiales." : "Only letters, numbers, and underscores. No spaces or special characters.");
      return;
    }
    // Username uniqueness is validated by the backend on update
    setUsernameErr("");
    await updateProfile({ username: username.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
                style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)" }}>
                {avatar
                  ? <img src={avatar} alt="avatar" className="w-full h-full object-cover"/>
                  : <span className="text-3xl font-black text-white">{user.username[0].toUpperCase()}</span>
                }
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold mb-2" style={{ color:"var(--text)" }}>{lang === "ES" ? "Tu foto" : "Your photo"}</p>
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                  style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)" }}>
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
            onFocus={e => (e.currentTarget.style.borderColor="#1E3A8A")}
            onBlur={e  => (e.currentTarget.style.borderColor="var(--border)")}/>
          <p className="text-xs" style={{ color:"var(--text-subtle)" }}>
            {lang === "ES" ? "Nombre único en el sitio. Entre 6 y 32 caracteres. Sin espacios ni caracteres especiales." : "Unique name on the site. Between 6 and 32 characters. No spaces or special characters."}
          </p>
          {usernameErr && (
            <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color:"#EF4444" }}>
              <AlertCircle size={12}/> {usernameErr}
            </p>
          )}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
              style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)", boxShadow:"0 4px 14px rgba(234,88,12,0.25)" }}>
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : (lang === "ES" ? "Cambiar" : "Change")}
            </button>
            {saved && <span className="text-xs font-semibold text-green-400 flex items-center gap-1"><Check size={13}/> {lang === "ES" ? "¡Guardado!" : "Saved!"}</span>}
          </div>
        </form>
      </div>

      {/* Info cuenta */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="px-6 py-4" style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "Información de la cuenta" : "Account information"}</p>
        </div>
        <div className="divide-y" style={{ borderColor:"var(--border)" }}>
          {[
            { label: lang === "ES" ? "Correo electrónico" : "Email", value:user.email, badge:{ text: lang === "ES" ? "Verificado" : "Verified", color:"#22C55E", bg:"rgba(34,197,94,0.1)" } },
            { label: lang === "ES" ? "Número de teléfono" : "Phone number", value:user.phone ?? null, action: lang === "ES" ? "Agregar" : "Add" },
            { label: lang === "ES" ? "ID de usuario" : "User ID",      value:user.id ?? "—" },
            { label: lang === "ES" ? "Hora de unirse" : "Join date",     value:joinDate },
          ].map((row, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color:"var(--text-subtle)" }}>{row.label}</p>
                {row.value
                  ? <p className="text-sm font-semibold flex items-center gap-2" style={{ color:"var(--text)" }}>
                      {row.value}
                      {(row as any).badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ color:(row as any).badge.color, background:(row as any).badge.bg }}>
                          {(row as any).badge.text}
                        </span>
                      )}
                    </p>
                  : <p className="text-xs" style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "No configurado" : "Not configured"}</p>
                }
              </div>
              {(row as any).action && (
                <button className="text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-70"
                  style={{ color:"#1E3A8A", background:"rgba(30,58,138,0.08)", border:"1px solid rgba(30,58,138,0.2)" }}>
                  {(row as any).action}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Country codes ─────────────────────────────────────────────
const COUNTRY_CODES = [
  { code:"+51",  flag:"🇵🇪", name:"Perú"          },
  { code:"+54",  flag:"🇦🇷", name:"Argentina"      },
  { code:"+56",  flag:"🇨🇱", name:"Chile"          },
  { code:"+57",  flag:"🇨🇴", name:"Colombia"       },
  { code:"+52",  flag:"🇲🇽", name:"México"         },
  { code:"+58",  flag:"🇻🇪", name:"Venezuela"      },
  { code:"+34",  flag:"🇪🇸", name:"España"         },
  { code:"+1",   flag:"🇺🇸", name:"USA/Canada"     },
  { code:"+44",  flag:"🇬🇧", name:"Reino Unido"    },
  { code:"+55",  flag:"🇧🇷", name:"Brasil"         },
  { code:"+593", flag:"🇪🇨", name:"Ecuador"        },
  { code:"+591", flag:"🇧🇴", name:"Bolivia"        },
  { code:"+595", flag:"🇵🇾", name:"Paraguay"       },
  { code:"+598", flag:"🇺🇾", name:"Uruguay"        },
  { code:"+507", flag:"🇵🇦", name:"Panamá"         },
  { code:"+506", flag:"🇨🇷", name:"Costa Rica"     },
  { code:"+502", flag:"🇬🇹", name:"Guatemala"      },
  { code:"+503", flag:"🇸🇻", name:"El Salvador"    },
  { code:"+504", flag:"🇭🇳", name:"Honduras"       },
  { code:"+505", flag:"🇳🇮", name:"Nicaragua"      },
  { code:"+49",  flag:"🇩🇪", name:"Alemania"       },
  { code:"+33",  flag:"🇫🇷", name:"Francia"        },
  { code:"+39",  flag:"🇮🇹", name:"Italia"         },
  { code:"+81",  flag:"🇯🇵", name:"Japón"          },
  { code:"+82",  flag:"🇰🇷", name:"Corea del Sur"  },
  { code:"+86",  flag:"🇨🇳", name:"China"          },
  { code:"+91",  flag:"🇮🇳", name:"India"          },
  { code:"+61",  flag:"🇦🇺", name:"Australia"      },
];

// ══════════════════════════════════════════════════
// TAB SEGURIDAD
// ══════════════════════════════════════════════════
function TabSeguridad({ user, updateProfile }: any) {
  const { lang } = usePreferences();
  const { changePassword } = useAuth();
  // ── Contraseña ──
  const [currentPass, setCurrentPass] = useState("");
  const [newPass,     setNewPass]     = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [show,        setShow]        = useState(false);
  const [passError,   setPassError]   = useState("");
  const [passSaved,   setPassSaved]   = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  // ── Modal teléfono ──
  const [phoneModal,  setPhoneModal]  = useState(false);
  const [phoneCountry, setPhoneCountry] = useState("+51");
  const [phoneStep,   setPhoneStep]   = useState<"input"|"verify">("input");
  const [phoneNum,    setPhoneNum]    = useState("");
  const [phoneCode,   setPhoneCode]   = useState("");
  const [phoneErr,    setPhoneErr]    = useState("");
  const [phoneSaved,  setPhoneSaved]  = useState(false);
  // Email change modal
  const [emailModal,  setEmailModal]  = useState(false);
  const [emailStep,   setEmailStep]   = useState<"input"|"verify">("input");
  const [newEmail,    setNewEmail]    = useState("");
  const [emailCode,   setEmailCode]   = useState("");
  const [emailErr,    setEmailErr]    = useState("");
  const [emailSaved,  setEmailSaved]  = useState(false);

  function handleEmailSend() {
    if (!newEmail.trim() || !newEmail.includes("@")) {
      setEmailErr(lang === "ES" ? "Ingresa un correo electrónico válido." : "Enter a valid email address.");
      return;
    }
    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      setEmailErr(lang === "ES" ? "El nuevo correo debe ser diferente al actual." : "The new email must be different from the current one.");
      return;
    }
    setEmailErr("");
    setEmailStep("verify");
  }

  async function handleEmailVerify() {
    if (!emailCode.trim() || emailCode.length < 6) {
      setEmailErr(lang === "ES" ? "Ingresa el código de verificación." : "Enter the verification code.");
      return;
    }
    await updateProfile({ email: newEmail });
    setEmailSaved(true);
    setTimeout(() => {
      setEmailModal(false);
      setEmailStep("input");
      setNewEmail("");
      setEmailCode("");
      setEmailSaved(false);
    }, 2000);
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
      if (msg.includes("incorrecta") || msg.includes("incorrect")) {
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

  function handlePhoneSend() {
    if (!phoneNum.trim() || phoneNum.replace(/\s/g,"").length < 6) {
      setPhoneErr(lang === "ES" ? "Ingresa un número válido." : "Enter a valid number.");
      return;
    }
    setPhoneErr("");
    setPhoneStep("verify");
  }

  async function handlePhoneVerify() {
    if (!phoneCode.trim() || phoneCode.length < 6) {
      setPhoneErr(lang === "ES" ? "Ingresa el código de verificación." : "Enter the verification code.");
      return;
    }
    await updateProfile({ phone: `${phoneCountry} ${phoneNum}` });
    setPhoneSaved(true);
    setTimeout(() => { setPhoneModal(false); setPhoneStep("input"); setPhoneNum(""); setPhoneCode(""); setPhoneSaved(false); }, 2000);
  }

  return (
    <div className="space-y-5">

      {/* Aviso */}
      <div className="px-5 py-4 rounded-2xl flex items-start gap-3"
        style={{ background:"rgba(30,58,138,0.06)", border:"1px solid rgba(30,58,138,0.2)" }}>
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

      {/* Teléfono */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="px-6 py-4 flex items-center gap-2"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
          <Phone size={14} style={{ color:"#F97316" }}/>
          <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "Teléfono móvil" : "Mobile phone"}</p>
        </div>
        <div className="p-6">
          {user.phone ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color:"var(--text)" }}>{user.phone}</p>
                <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color:"#22C55E" }}>
                  <Check size={12}/> {lang === "ES" ? "Número verificado" : "Number verified"}
                </p>
              </div>
              <button onClick={() => { setPhoneModal(true); setPhoneStep("input"); }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg hover:opacity-70"
                style={{ color:"#F97316", background:"rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.2)" }}>
                {lang === "ES" ? "Cambiar" : "Change"}
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs leading-relaxed mb-4" style={{ color:"var(--text-muted)" }}>
                {lang === "ES" ? "Vincula tu número para prevenir robo de cuenta y recibir códigos de verificación." : "Link your number to prevent account theft and receive verification codes."}
              </p>
              <div className="px-4 py-3 rounded-xl mb-4 text-xs"
                style={{ background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.2)", color:"var(--text-muted)" }}>
                {lang === "ES" ? "⚠️ Aún no has vinculado un número de teléfono." : "⚠️ You haven't linked a phone number yet."}
              </div>
              <button onClick={() => { setPhoneModal(true); setPhoneStep("input"); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:opacity-90"
                style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)" }}>
                <Phone size={13}/> {lang === "ES" ? "Verificar número de teléfono" : "Verify phone number"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Contraseña */}
      <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
        <div className="px-6 py-4 flex items-center gap-2"
          style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
          <Lock size={14} style={{ color:"#A78BFA" }}/>
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
                  onFocus={e => (e.currentTarget.style.borderColor="#1E3A8A")}
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 disabled:opacity-60"
              style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)", boxShadow:"0 4px 14px rgba(234,88,12,0.25)" }}>
              {passLoading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
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
                      onFocus={e => (e.currentTarget.style.borderColor="#1E3A8A")}
                      onBlur={e  => (e.currentTarget.style.borderColor="var(--border)")}/>
                  </div>
                  <button onClick={handleEmailSend}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90"
                    style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)" }}>
                    {lang === "ES" ? "Enviar código de verificación →" : "Send verification code →"}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                    {lang === "ES" ? "Código enviado a" : "Code sent to"} <strong style={{ color:"var(--text)" }}>{newEmail}</strong>.
                  </p>
                  <div className="px-3 py-2 rounded-xl text-xs"
                    style={{ background:"rgba(234,88,12,0.07)", border:"1px solid rgba(234,88,12,0.2)", color:"var(--text-muted)" }}>
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
                      onFocus={e => (e.currentTarget.style.borderColor="#1E3A8A")}
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
                      <button onClick={handleEmailVerify}
                        className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90"
                        style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)" }}>
                        {lang === "ES" ? "Verificar" : "Verify"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal teléfono */}
      {phoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)" }}
          onClick={() => setPhoneModal(false)}>
          <div className="w-full max-w-sm rounded-2xl overflow-hidden"
            style={{ background:"var(--card)", border:"1px solid var(--border)" }}
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
              <p className="text-sm font-bold" style={{ color:"var(--text)" }}>
                {phoneStep==="input" ? (lang === "ES" ? "📱 Verificar número de teléfono" : "📱 Verify phone number") : (lang === "ES" ? "🔐 Introduce el código" : "🔐 Enter the code")}
              </p>
              <button onClick={() => setPhoneModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70"
                style={{ background:"var(--card)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
                <X size={14}/>
              </button>
            </div>

            <div className="p-5 space-y-4">
              {phoneStep==="input" ? (
                <>
                  <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                    {lang === "ES" ? "Ingresa tu número de teléfono. Te enviaremos un código de verificación por SMS." : "Enter your phone number. We will send you a verification code via SMS."}
                  </p>
                  {phoneErr && (
                    <div className="text-xs px-3 py-2 rounded-xl"
                      style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#FCA5A5" }}>
                      {phoneErr}
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
                      style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "Número de teléfono" : "Phone number"}</label>
                    <div className="flex gap-2">
                    <select
                      value={phoneCountry}
                      onChange={e => setPhoneCountry(e.target.value)}
                      className="px-2 py-3 rounded-xl text-xs outline-none flex-shrink-0"
                      style={{ background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)", width:"110px" }}>
                      {COUNTRY_CODES.map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                    <input type="tel" placeholder="999 999 999" value={phoneNum}
                      onChange={e => { setPhoneNum(e.target.value.replace(/[^0-9 ]/g,"")); setPhoneErr(""); }}
                      className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)" }}
                      onFocus={e => (e.currentTarget.style.borderColor="#1E3A8A")}
                      onBlur={e  => (e.currentTarget.style.borderColor="var(--border)")}/>
                  </div>
                  </div>
                  <button onClick={handlePhoneSend}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90"
                    style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)" }}>
                    {lang === "ES" ? "Enviar código →" : "Send code →"}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                    {lang === "ES" ? "Código enviado a" : "Code sent to"} <strong style={{ color:"var(--text)" }}>{phoneNum}</strong>.
                    {lang === "ES" ? " Ingresa el código de 6 dígitos." : " Enter the 6-digit code."}
                  </p>
                  <div className="px-3 py-2 rounded-xl text-xs"
                    style={{ background:"rgba(234,88,12,0.07)", border:"1px solid rgba(234,88,12,0.2)", color:"var(--text-muted)" }}>
                    {lang === "ES" ? "Revisa tu teléfono e ingresa el código de 6 dígitos." : "Check your phone and enter the 6-digit code."}
                  </div>
                  {phoneErr && (
                    <div className="text-xs px-3 py-2 rounded-xl"
                      style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"#FCA5A5" }}>
                      {phoneErr}
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
                      style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "Código de verificación" : "Verification code"}</label>
                    <input type="text" placeholder="123456" maxLength={6} value={phoneCode}
                      onChange={e => { setPhoneCode(e.target.value); setPhoneErr(""); }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none text-center tracking-[.3em] font-bold"
                      style={{ background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)" }}
                      onFocus={e => (e.currentTarget.style.borderColor="#1E3A8A")}
                      onBlur={e  => (e.currentTarget.style.borderColor="var(--border)")}/>
                  </div>
                  {phoneSaved ? (
                    <div className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-green-400">
                      <Check size={16}/> {lang === "ES" ? "¡Número verificado!" : "Number verified!"}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setPhoneStep("input"); setPhoneErr(""); }}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold hover:opacity-70"
                        style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-muted)" }}>
                        {lang === "ES" ? "← Volver" : "← Back"}
                      </button>
                      <button onClick={handlePhoneVerify}
                        className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90"
                        style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)" }}>
                        {lang === "ES" ? "Verificar" : "Verify"}
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
// TAB PEDIDOS — datos reales de localStorage
// ══════════════════════════════════════════════════
// ORDER_TABS defined inside component to access lang

function TabPedidos({ userId }: { userId: string }) {
  const { lang } = usePreferences();
  const ORDER_TABS = [
    { id:"todos",      label: lang === "ES" ? "Todos los pedidos" : "All orders" },
    { id:"pendiente",  label: lang === "ES" ? "Pendiente" : "Pending"            },
    { id:"procesando", label: lang === "ES" ? "Procesando" : "Processing"        },
    { id:"reembolso",  label: lang === "ES" ? "Reembolso" : "Refund"             },
    { id:"cancelado",  label: lang === "ES" ? "Cancelado" : "Cancelled"          },
  ];
  const [activeTab, setActiveTab] = useState("todos");
  const [search,    setSearch]    = useState("");
  const [query,     setQuery]     = useState("");
  const [orders] = useState<any[]>(() => getOrders(userId));

  const filtered = orders.filter((o: any) => {
    const matchTab =
      activeTab==="todos" ||
      o.status?.toLowerCase() === activeTab;
    const matchSearch =
      !query ||
      o.id?.toLowerCase().includes(query.toLowerCase()) ||
      o.items?.some((i: any) => i.name?.toLowerCase().includes(query.toLowerCase()));
    return matchTab && matchSearch;
  });

  const STATUS_COLOR: Record<string, { color: string; bg: string }> = {
    pendiente:  { color:"#F59E0B", bg:"rgba(245,158,11,0.1)"  },
    procesando: { color:"#60A5FA", bg:"rgba(96,165,250,0.1)"  },
    completado: { color:"#22C55E", bg:"rgba(34,197,94,0.1)"   },
    reembolso:  { color:"#F97316", bg:"rgba(249,115,22,0.1)"  },
    cancelado:  { color:"#EF4444", bg:"rgba(239,68,68,0.1)"   },
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
      <div className="px-6 py-4" style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
        <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "🛍️ Mis pedidos" : "🛍️ My orders"}</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex overflow-x-auto" style={{ borderBottom:"1px solid var(--border)", scrollbarWidth:"none" }}>
        {ORDER_TABS.map(ot => (
          <button key={ot.id} onClick={() => setActiveTab(ot.id)}
            className="flex-shrink-0 px-4 py-3 text-xs font-semibold transition-all relative whitespace-nowrap"
            style={{ color: activeTab===ot.id ? "#EA580C" : "var(--text-muted)" }}>
            {ot.label}
            {activeTab===ot.id && (
              <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                style={{ background:"linear-gradient(90deg,#1E3A8A,#EA580C)" }}/>
            )}
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div className="p-4 flex items-center gap-2" style={{ borderBottom:"1px solid var(--border)" }}>
        <input type="text" placeholder={lang === "ES" ? "Nombre del artículo, ID de pedido..." : "Item name, order ID..."}
          value={search} onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key==="Enter") setQuery(search); }}
          className="flex-1 px-3 py-2.5 rounded-xl text-xs outline-none"
          style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text)" }}/>
        <button
          onClick={() => setQuery(search)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:opacity-90"
          style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)" }}>
          {lang === "ES" ? "Buscar" : "Search"}
        </button>
      </div>

      {/* Lista */}
      <div className="p-4">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
              <ShoppingBag size={24} style={{ color:"var(--text-subtle)" }}/>
            </div>
            <p className="text-sm font-bold mb-1" style={{ color:"var(--text)" }}>
              {query ? (lang === "ES" ? "Sin resultados para tu búsqueda" : "No results for your search") : (lang === "ES" ? "No tienes pedidos aún" : "You don't have any orders yet")}
            </p>
            <p className="text-xs mb-4" style={{ color:"var(--text-subtle)" }}>
              {query ? (lang === "ES" ? "Intenta con otro término." : "Try a different term.") : (lang === "ES" ? "Cuando realices una compra aparecerá aquí." : "When you make a purchase it will appear here.")}
            </p>
            {!query && (
              <Link href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)" }}>
                {lang === "ES" ? "Ver todos los juegos →" : "View all games →"}
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order: any) => {
              const sc = STATUS_COLOR[order.status] ?? STATUS_COLOR.pendiente;
              return (
                <div key={order.id} className="rounded-xl overflow-hidden"
                  style={{ border:"1px solid var(--border)" }}>
                  <div className="px-4 py-3 flex items-center justify-between"
                    style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)" }}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color:"var(--text-muted)" }}>{lang === "ES" ? "Pedido" : "Order"}</span>
                      <span className="text-xs font-bold" style={{ color:"var(--text)" }}>#{order.id}</span>
                      <span className="text-xs" style={{ color:"var(--text-subtle)" }}>
                        {new Date(order.createdAt).toLocaleString(lang === "ES" ? "es-ES" : "en-US", { dateStyle:"short", timeStyle:"short" })}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ color:sc.color, background:sc.bg, border:`1px solid ${sc.color}30` }}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </div>
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="px-4 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>
                        🎮
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color:"var(--text)" }}>{item.name}</p>
                        <p className="text-[10px]" style={{ color:"var(--text-muted)" }}>x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-black flex-shrink-0" style={{ color:"#EA580C" }}>
                        {item.total}
                      </p>
                    </div>
                  ))}
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
// TAB HISTORIAL — datos reales de localStorage
// ══════════════════════════════════════════════════
// DATE_FILTERS and STATUS_FILTERS defined inside component to access lang

function TabTransacciones({ userId }: { userId: string }) {
  const { lang } = usePreferences();
  const DATE_FILTERS = [
    { id:"30d", label: lang === "ES" ? "Últimos 30 días" : "Last 30 days" },
    { id:"3m",  label: lang === "ES" ? "3 meses" : "3 months" },
    { id:"6m",  label: lang === "ES" ? "6 meses" : "6 months" },
    { id:"1y",  label: lang === "ES" ? "1 año" : "1 year" },
    { id:"all", label: lang === "ES" ? "Todos los tiempos" : "All time" },
  ];
  const STATUS_FILTERS = [
    { id:"Todo",                  label: lang === "ES" ? "Todo" : "All" },
    { id:"Pendiente",             label: lang === "ES" ? "Pendiente" : "Pending" },
    { id:"Reintegrado",           label: lang === "ES" ? "Reintegrado" : "Refunded" },
    { id:"Terminado",             label: lang === "ES" ? "Terminado" : "Completed" },
    { id:"Cancelación del retiro",label: lang === "ES" ? "Cancelación del retiro" : "Withdrawal cancelled" },
    { id:"Retirada exitosa",      label: lang === "ES" ? "Retirada exitosa" : "Successful withdrawal" },
  ];
  const [dateFilter,   setDateFilter]   = useState("30d");
  const [statusFilter, setStatusFilter] = useState("Todo");
  const [transactions] = useState<any[]>(() => getTransactions(userId));

  // Filtrar por fecha
  const now = Date.now();
  const MS: Record<string, number> = {
    "30d": 30*24*3600*1000,
    "3m":  90*24*3600*1000,
    "6m": 180*24*3600*1000,
    "1y": 365*24*3600*1000,
  };
  const filtered = transactions.filter((tx: any) => {
    const inDate = !MS[dateFilter] || (now - new Date(tx.date).getTime()) <= MS[dateFilter];
    const inStatus = statusFilter==="Todo" || tx.status===statusFilter;
    return inDate && inStatus;
  });

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"var(--card)", border:"1px solid var(--border)" }}>
      <div className="px-6 py-4" style={{ borderBottom:"1px solid var(--border)", background:"var(--surface)" }}>
        <p className="text-sm font-bold" style={{ color:"var(--text)" }}>{lang === "ES" ? "📊 Historial de transacciones" : "📊 Transaction history"}</p>
      </div>
      <div className="p-5 space-y-4">

        {/* Filtros */}
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "Fecha" : "Date"}</p>
            <div className="flex flex-wrap gap-2">
              {DATE_FILTERS.map(f => (
                <button key={f.id} onClick={() => setDateFilter(f.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: dateFilter===f.id ? "rgba(234,88,12,0.1)" : "var(--surface)",
                    border: `1px solid ${dateFilter===f.id ? "rgba(234,88,12,0.3)" : "var(--border)"}`,
                    color: dateFilter===f.id ? "#EA580C" : "var(--text-muted)",
                  }}>{f.label}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color:"var(--text-subtle)" }}>{lang === "ES" ? "Estado" : "Status"}</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map(f => (
                <button key={f.id} onClick={() => setStatusFilter(f.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: statusFilter===f.id ? "rgba(30,58,138,0.1)" : "var(--surface)",
                    border: `1px solid ${statusFilter===f.id ? "rgba(30,58,138,0.3)" : "var(--border)"}`,
                    color: statusFilter===f.id ? "#60A5FA" : "var(--text-muted)",
                  }}>{f.label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="rounded-xl overflow-hidden" style={{ border:"1px solid var(--border)" }}>
          <div className="grid grid-cols-5 px-4 py-3 text-[10px] font-bold uppercase tracking-wider"
            style={{ background:"var(--surface)", borderBottom:"1px solid var(--border)", color:"var(--text-subtle)" }}>
            <span>{lang === "ES" ? "Fecha" : "Date"}</span>
            <span className="col-span-2">{lang === "ES" ? "Elemento / Acción" : "Item / Action"}</span>
            <span>{lang === "ES" ? "Entrada / Salida" : "In / Out"}</span>
            <span>{lang === "ES" ? "Estado" : "Status"}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-xs" style={{ color:"var(--text-subtle)" }}>
                {lang === "ES" ? "No hay transacciones en el período seleccionado." : "No transactions in the selected period."}
              </p>
            </div>
          ) : filtered.map((tx: any, i: number) => (
            <div key={i} className="grid grid-cols-5 px-4 py-3 text-xs"
              style={{ borderBottom: i<filtered.length-1 ? "1px solid var(--border)" : "none", color:"var(--text-muted)" }}>
              <span>{new Date(tx.date).toLocaleDateString(lang === "ES" ? "es-ES" : "en-US")}</span>
              <span className="col-span-2 truncate" style={{ color:"var(--text)" }}>{tx.description}</span>
              <span style={{ color: tx.type==="in" ? "#22C55E" : "#EF4444" }}>
                {tx.type==="in" ? "+" : "-"}{tx.amount}
              </span>
              <span>{tx.status}</span>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between text-xs" style={{ color:"var(--text-muted)" }}>
          <button className="px-3 py-1.5 rounded-lg hover:opacity-70"
            style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>{lang === "ES" ? "← Anterior" : "← Previous"}</button>
          <span>{lang === "ES" ? "Página 1 / 1" : "Page 1 / 1"}</span>
          <button className="px-3 py-1.5 rounded-lg hover:opacity-70"
            style={{ background:"var(--surface)", border:"1px solid var(--border)" }}>{lang === "ES" ? "Siguiente →" : "Next →"}</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// TAB WISHLIST — conectada al WishlistContext real
// ══════════════════════════════════════════════════
function TabWishlist({ items, removeWish, addToCart, formatPrice }: any) {
  const { lang } = usePreferences();
  const [added, setAdded] = useState<string[]>([]);

  function handleAddToCart(item: any) {
    addToCart({
      slug: item.slug, name: item.name, img: item.img,
      price: item.price, priceOld: item.priceOld,
      region: item.region, format: item.format,
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)" }}>
            {lang === "ES" ? "Explorar juegos →" : "Explore games →"}
          </Link>
        </div>
      ) : (
        <div className="divide-y" style={{ borderColor:"var(--border)" }}>
          {items.map((item: any) => {
            const disc = item.priceOld > item.price
              ? Math.round((1 - item.price / item.priceOld) * 100)
              : 0;
            const isAdded = added.includes(item.slug);
            return (
              <div key={item.slug} className="p-4 flex items-center gap-4">
                {/* Imagen */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background:"linear-gradient(135deg,rgba(30,58,138,0.1),rgba(234,88,12,0.1))" }}>
                  <Image src={item.img} alt={item.name} fill className="object-contain p-1"/>
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
                    <span className="text-sm font-black" style={{ color:"#EA580C" }}>
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
          style={{ borderColor:"#EA580C", borderTopColor:"transparent" }}/>
      </div>
    }>
      <ProfilePageInner/>
    </Suspense>
  );
}
