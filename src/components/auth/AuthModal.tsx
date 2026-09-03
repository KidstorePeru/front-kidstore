"use client";

import {
  createContext, useContext, useState, useEffect, useRef,
  ReactNode, useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  X, Eye, EyeOff, ArrowRight, AlertCircle,
  Zap, Shield, MessageCircle, Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useT } from "@/i18n";
import { usePreferences } from "@/context/PreferencesContext";
import { games } from "@/data";

// ══════════════════════════════════════════════
// Context — useAuthModal() disponible en toda la app
// ══════════════════════════════════════════════
export type ModalView = "login" | "register" | "forgot" | null;

interface AuthModalCtxType {
  openModal:  (view?: ModalView) => void;
  closeModal: () => void;
  view:       ModalView;
}

const AuthModalCtx = createContext<AuthModalCtxType>({
  openModal:  () => {},
  closeModal: () => {},
  view:       null,
});

export function useAuthModal() {
  return useContext(AuthModalCtx);
}

// ══════════════════════════════════════════════
// Provider — envuelve toda la app en el layout
// ══════════════════════════════════════════════
export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ModalView>(null);
  const pathname = usePathname();
  const router   = useRouter();

  // Auto-open cuando se navega directamente a /login /register /forgot-password
  useEffect(() => {
    if (pathname === "/login")           { setView("login");    return; }
    if (pathname === "/register")        { setView("register"); return; }
    if (pathname === "/forgot-password") { setView("forgot");   return; }
  }, [pathname]);

  const openModal  = useCallback((v: ModalView = "login") => setView(v), []);
  const closeModal = useCallback(() => {
    setView(null);
    // Si llegó por URL directa, vuelve al home
    if (["/login", "/register", "/forgot-password"].includes(pathname)) {
      router.push("/");
    }
  }, [pathname, router]);

  return (
    <AuthModalCtx.Provider value={{ openModal, closeModal, view }}>
      {children}
      {view && <AuthModal view={view} onChange={setView} onClose={closeModal} />}
    </AuthModalCtx.Provider>
  );
}

// ══════════════════════════════════════════════
// Píxeles decorativos del panel izquierdo
// ══════════════════════════════════════════════
interface Pixel { w:number; h:number; bg:string; op:number; top?:string; left?:string; bottom?:string; right?:string; }
const PIXELS: Pixel[] = [
  { w:8,  h:8,  bg:"#1D4ED8", op:.4,  top:"9%",    left:"6%"    },
  { w:5,  h:5,  bg:"#60A5FA", op:.3,  top:"16%",   left:"20%"   },
  { w:10, h:10, bg:"#1E3A8A", op:.18, top:"22%",   left:"3%"    },
  { w:8,  h:8,  bg:"#FF6B1A", op:.4,  top:"11%",   right:"9%"   },
  { w:6,  h:6,  bg:"#E53E3E", op:.35, top:"26%",   right:"4%"   },
  { w:10, h:10, bg:"#7C3AED", op:.22, top:"7%",    right:"22%"  },
  { w:5,  h:5,  bg:"#F97316", op:.3,  top:"32%",   right:"15%"  },
  { w:7,  h:7,  bg:"#3B82F6", op:.18, bottom:"25%",left:"8%"    },
  { w:5,  h:5,  bg:"#A855F7", op:.22, bottom:"17%",right:"7%"   },
  { w:4,  h:4,  bg:"#FCD34D", op:.18, top:"40%",   right:"30%"  },
];

// ══════════════════════════════════════════════
// El modal en sí
// ══════════════════════════════════════════════
function AuthModal({
  view, onChange, onClose,
}: {
  view:     NonNullable<ModalView>;
  onChange: (v: ModalView) => void;
  onClose:  () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const router     = useRouter();
  const { login, register, checkAvailability, requestEmailCode, forgotPassword, verifyCode, loading } = useAuth();
  const { lang }   = usePreferences();
  const t          = useT();
  const isEN       = lang === "EN";
  const gameCount  = games.length;

  // Bloquea scroll del body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  // ── Estados login ──
  const [identifier, setIdentifier] = useState("");
  const [loginPass,  setLoginPass]  = useState("");
  const [showLogin,  setShowLogin]  = useState(false);
  const [loginErr,   setLoginErr]   = useState("");
  const [loginErrs,  setLoginErrs]  = useState<Record<string, boolean>>({});

  // ── Estados register ──
  const [username,   setUsername]   = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regEmail,   setRegEmail]   = useState("");
  const [regPass,    setRegPass]    = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showReg,    setShowReg]    = useState(false);
  const [regErr,     setRegErr]     = useState("");
  const [regErrs,    setRegErrs]    = useState<Record<string, boolean>>({});
  const [regTaken,   setRegTaken]   = useState<{ username?: boolean; email?: boolean }>({});
  const [regStep,    setRegStep]    = useState<"form" | "verify">("form");
  const [regCode,    setRegCode]    = useState("");
  const [regSending, setRegSending] = useState(false);
  const [regResendIn, setRegResendIn] = useState(0);

  // Cuenta atrás para reenviar el código
  useEffect(() => {
    if (regResendIn <= 0) return;
    const id = setInterval(() => setRegResendIn(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [regResendIn]);

  // ── Estados forgot ──
  const [forgotEmail,   setForgotEmail]   = useState("");
  const [forgotErr,     setForgotErr]     = useState("");
  const [forgotSent,    setForgotSent]    = useState(false);
  const [forgotInvalid, setForgotInvalid] = useState(false);
  const [forgotCode,    setForgotCode]    = useState("");
  const [forgotVerified, setForgotVerified] = useState(false);

  // Password strength
  const strength = [
    regPass.length >= 8,
    /[A-Z]/.test(regPass),
    /[0-9]/.test(regPass),
    /[^A-Za-z0-9]/.test(regPass),
  ];
  const score = strength.filter(Boolean).length;
  const strengthColor = ["#EF4444","#F59E0B","#3B82F6","#22C55E"][score - 1] ?? "var(--border)";
  const strengthLabel = [t.auth.strengthWeak, t.auth.strengthFair, t.auth.strengthGood, t.auth.strengthStrong][score - 1] ?? "";

  // ── Handlers ──
  async function handleLogin(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Record<string, boolean> = {};
    if (!identifier.trim() || identifier.trim().length < 3) e.id = true;
    if (!loginPass.trim()) e.pass = true;
    setLoginErrs(e);
    if (Object.keys(e).length) return;
    setLoginErr("");
    try {
      await login(identifier, loginPass);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setLoginErr(msg || t.auth.invalidCredentials);
    }
  }

  // Paso 1: valida, comprueba disponibilidad y envía el código al correo
  async function handleRegister(ev: React.FormEvent) {
    ev.preventDefault();
    const e: Record<string, boolean> = {};
    if (!username.trim() || username.trim().length < 3) e.username = true;
    if (/[^a-zA-Z0-9_]/.test(username.trim()))          e.username = true;
    if (!regEmail.trim() || !regEmail.includes("@"))    e.email    = true;
    if (regPass.length < 8)                             e.password = true;
    if (regPass !== regConfirm)                         e.confirm  = true;
    setRegErrs(e);
    setRegTaken({});
    if (Object.keys(e).length) return;
    setRegErr("");
    setRegSending(true);
    try {
      // ¿usuario o correo ya registrados? — se avisa antes de gastar un código.
      // Best-effort: si la comprobación falla (backend viejo / caído) seguimos;
      // el registro igual rechaza duplicados (23505).
      try {
        const avail = await checkAvailability(username.trim(), regEmail.trim());
        if (avail.usernameTaken || avail.emailTaken) {
          setRegTaken({ username: avail.usernameTaken, email: avail.emailTaken });
          setRegErr(
            avail.usernameTaken && avail.emailTaken ? t.auth.bothInUse
            : avail.usernameTaken ? t.auth.usernameInUse
            : t.auth.emailInUse,
          );
          return;
        }
      } catch { /* no se pudo comprobar → seguimos */ }

      await requestEmailCode(regEmail.trim(), username.trim(), lang, "register");
      setRegStep("verify");
      setRegCode("");
      setRegResendIn(60);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setRegErr(msg || (isEN ? "Could not send the code. Try again." : "No se pudo enviar el código. Intenta de nuevo."));
    } finally {
      setRegSending(false);
    }
  }

  // Paso 2: verifica el código y crea la cuenta
  async function handleVerifyRegister(ev: React.FormEvent) {
    ev.preventDefault();
    setRegErr("");
    try {
      await verifyCode(regEmail.trim(), regCode.trim());
    } catch {
      setRegErr(t.auth.codeWrong);
      return;
    }
    try {
      await register(username.trim(), regEmail.trim(), regPass, regFullName.trim() || undefined);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("ya existe") || msg.includes("already") || msg.includes("en uso")) {
        setRegErr(isEN ? "Username or email already exists." : "El usuario o correo ya existe.");
        setRegStep("form");
      } else {
        setRegErr(msg || t.auth.registerError);
      }
    }
  }

  async function handleResendRegisterCode() {
    if (regResendIn > 0 || regSending) return;
    setRegErr("");
    setRegSending(true);
    try {
      await requestEmailCode(regEmail.trim(), username.trim(), lang, "register");
      setRegResendIn(60);
    } catch {
      setRegErr(isEN ? "Could not resend the code." : "No se pudo reenviar el código.");
    } finally {
      setRegSending(false);
    }
  }

  async function handleForgot(ev: React.FormEvent) {
    ev.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes("@")) {
      setForgotInvalid(true); return;
    }
    setForgotErr(""); setForgotInvalid(false);
    try {
      await forgotPassword(forgotEmail);
      setForgotSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setForgotErr(msg || t.auth.forgotError);
    }
  }

  async function handleVerifyForgot(ev: React.FormEvent) {
    ev.preventDefault();
    setForgotErr("");
    try {
      await verifyCode(forgotEmail, forgotCode);
      setForgotVerified(true);
      // Store email for reset page, then redirect
      sessionStorage.setItem("kidstore_reset_email", forgotEmail);
      onClose();
      router.push("/reset-password");
    } catch {
      setForgotErr(isEN ? "Incorrect or expired code." : "Código incorrecto o expirado.");
    }
  }

  // ── Input style helper ──
  const inp = (err?: boolean): React.CSSProperties => ({
    background:  "var(--surface)",
    border:      `1.5px solid ${err ? "#EF4444" : "var(--border)"}`,
    color:       "var(--text)",
    outline:     "none",
    transition:  "border-color .15s",
  });

  const isRegister = view === "register";

  // ── Panel izquierdo copy ──
  const gradOrange = "linear-gradient(135deg,#FCA5A5 0%,#F97316 45%,#FCD34D 100%)";
  const gradBlue   = "linear-gradient(135deg,#60A5FA 0%,#F97316 55%,#FCD34D 100%)";
  const gradStyle  = (g: string) => ({ background:g, WebkitBackgroundClip:"text" as const, WebkitTextFillColor:"transparent", backgroundClip:"text" as const });

  const leftCopy = {
    login: {
      badge:    <><span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"/> {isEN ? "Instant delivery" : "Entrega instantánea"}</>,
      badgeCls: "rgba(249,115,22,0.1)", badgeBdr: "rgba(249,115,22,0.2)", badgeColor: "#FB923C",
      title:    isEN
        ? <>Recharge your<br/>games<br/><span style={gradStyle(gradOrange)}>at the best price</span></>
        : <>Recarga tus<br/>juegos<br/><span style={gradStyle(gradOrange)}>al mejor precio</span></>,
    },
    register: {
      badge:    <><span className="w-1.5 h-1.5 rounded-full bg-green-400"/> {isEN ? "Free registration" : "Registro gratuito"}</>,
      badgeCls: "rgba(74,222,128,0.1)", badgeBdr: "rgba(74,222,128,0.2)", badgeColor: "#4ADE80",
      title:    isEN
        ? <>Join<br/><span style={gradStyle(gradBlue)}>KidStore</span><br/>today</>
        : <>Únete a<br/><span style={gradStyle(gradBlue)}>KidStore</span><br/>hoy</>,
    },
    forgot: {
      badge:    <>{isEN ? "📧 Recover your access" : "📧 Recupera tu acceso"}</>,
      badgeCls: "rgba(234,88,12,0.1)", badgeBdr: "rgba(234,88,12,0.2)", badgeColor: "#F97316",
      title:    isEN
        ? <>Recover<br/>your access<br/><span style={gradStyle(gradOrange)}>easily</span></>
        : <>Recupera<br/>tu acceso<br/><span style={gradStyle(gradOrange)}>fácilmente</span></>,
    },
  }[view];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,0.72)", backdropFilter:"blur(14px)", WebkitBackdropFilter:"blur(14px)" }}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <style>{`@keyframes _modalIn{from{opacity:0;transform:scale(.96) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

      <div
        className="w-full flex rounded-2xl overflow-hidden shadow-2xl relative"
        style={{
          maxWidth:   isRegister ? 860 : 800,
          maxHeight:  "96vh",
          border:     "1px solid var(--border)",
          animation:  "_modalIn .22s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* ── Botón cerrar ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70 hover:scale-110"
          style={{ background:"rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.18)", color:"white" }}
          aria-label="Close"
        >
          <X size={16}/>
        </button>

        {/* ══ PANEL IZQUIERDO ══ */}
        <div
          className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden flex-shrink-0"
          style={{ width: isRegister ? 370 : 420, background:"#080C18" }}
        >
          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:[
            "repeating-linear-gradient(0deg,rgba(30,58,138,0.05) 0,rgba(30,58,138,0.05) 1px,transparent 1px,transparent 36px)",
            "repeating-linear-gradient(90deg,rgba(30,58,138,0.05) 0,rgba(30,58,138,0.05) 1px,transparent 1px,transparent 36px)",
          ].join(",")}}/>
          {/* Glows */}
          <div className="absolute pointer-events-none" style={{ top:"-70px",right:"-50px",width:"280px",height:"280px",background:"radial-gradient(circle,rgba(234,88,12,0.14),transparent 65%)",borderRadius:"50%"}}/>
          <div className="absolute pointer-events-none" style={{ bottom:"-50px",left:"-25px",width:"220px",height:"220px",background:"radial-gradient(circle,rgba(30,58,138,0.18),transparent 65%)",borderRadius:"50%"}}/>
          {/* Pixels */}
          {PIXELS.map((px, i) => (
            <div key={i} className="absolute pointer-events-none rounded-sm" style={{
              width:px.w, height:px.h, background:px.bg, opacity:px.op,
              top:px.top, left:px.left,
              bottom:px.bottom, right:px.right,
            }}/>
          ))}

          {/* Logo */}
          <div className="relative z-10">
            <Image src="/logo/imagotipo-kidstore.png" alt="KidStore"
              width={180} height={68} className="object-contain"
              style={{ filter:"brightness(0) invert(1)" }} priority/>
          </div>

          {/* Copy */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{ background:leftCopy.badgeCls, border:`1px solid ${leftCopy.badgeBdr}`, color:leftCopy.badgeColor }}>
              {leftCopy.badge}
            </div>
            <h2 className="text-3xl font-black text-white leading-tight" style={{ letterSpacing:"-.02em" }}>
              {leftCopy.title}
            </h2>
            <p className="text-sm" style={{ color:"rgba(255,255,255,0.3)" }}>
              {isEN ? "V-Bucks, Robux, Nitro, TFT Coins and more." : "V-Bucks, Robux, Nitro, TFT Coins y más."}
            </p>
          </div>

          {/* Trust chips */}
          <div className="relative z-10 space-y-2">
            {[
              { icon:<Zap size={13}/>,           color:"#F97316", bg:"rgba(249,115,22,0.1)",  bdr:"rgba(249,115,22,0.2)",  text: isEN ? "Guaranteed delivery in minutes" : "Entrega garantizada en minutos" },
              { icon:<Shield size={13}/>,         color:"#60A5FA", bg:"rgba(96,165,250,0.1)",  bdr:"rgba(96,165,250,0.2)",  text: isEN ? "100% secure payment with SSL"  : "Pago 100% seguro con SSL" },
              { icon:<MessageCircle size={13}/>,  color:"#A78BFA", bg:"rgba(167,139,250,0.1)", bdr:"rgba(167,139,250,0.2)", text: isEN ? "Real support via WhatsApp"     : "Soporte real por WhatsApp" },
              { icon:<span className="text-xs font-black">{gameCount}</span>, color:"#4ADE80", bg:"rgba(74,222,128,0.1)", bdr:"rgba(74,222,128,0.2)", text: isEN ? "games available" : "juegos disponibles" },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl"
                style={{ background:c.bg, border:`1px solid ${c.bdr}` }}>
                <span style={{ color:c.color, flexShrink:0 }}>{c.icon}</span>
                <span className="text-xs" style={{ color:"rgba(255,255,255,0.45)" }}>{c.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ PANEL DERECHO ══ */}
        <div className="flex-1 flex flex-col justify-center overflow-y-auto px-7 py-8 lg:px-9"
          style={{ background:"var(--card)" }}>
          <div className="max-w-[360px] mx-auto w-full">

            {/* Logo mobile */}
            <div className="flex justify-center mb-6 lg:hidden">
              <Image src="/logo/imagotipo-kidstore.png" alt="KidStore"
                width={150} height={56} className="object-contain"/>
            </div>

            {/* ── LOGIN ── */}
            {view === "login" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-black mb-1" style={{ color:"var(--text)", letterSpacing:"-.02em" }}>
                    {t.auth.welcomeBack}
                  </h2>
                  <p className="text-sm" style={{ color:"var(--text-muted)" }}>{t.auth.loginSubtitle}</p>
                </div>

                {loginErr && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                    style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", color:"#FCA5A5" }}>
                    <AlertCircle size={13} className="flex-shrink-0"/>{loginErr}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
                      style={{ color: loginErrs.id ? "#EF4444" : "var(--text-subtle)" }}>
                      {t.auth.emailOrUsername}
                    </label>
                    <input type="text" placeholder={isEN ? "your@email.com or Username" : "tu@correo.com o TuUsuario"}
                      value={identifier} onChange={e => { setIdentifier(e.target.value); setLoginErrs(p => ({...p, id:false})); }}
                      className="w-full px-4 py-3 rounded-xl text-sm"
                      style={inp(loginErrs.id)}
                      onFocus={e  => (e.currentTarget.style.borderColor = loginErrs.id ? "#EF4444" : "#1E3A8A")}
                      onBlur={e   => (e.currentTarget.style.borderColor = loginErrs.id ? "#EF4444" : "var(--border)")}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: loginErrs.pass ? "#EF4444" : "var(--text-subtle)" }}>
                        {t.auth.password}
                      </label>
                      <button type="button" onClick={() => onChange("forgot")}
                        className="text-[11px] font-semibold hover:opacity-70 transition-opacity"
                        style={{ color:"#1E3A8A" }}>
                        {t.auth.forgotPassword}
                      </button>
                    </div>
                    <div className="relative">
                      <input type={showLogin ? "text" : "password"} placeholder="••••••••"
                        value={loginPass} onChange={e => { setLoginPass(e.target.value); setLoginErrs(p => ({...p, pass:false})); }}
                        className="w-full px-4 py-3 pr-11 rounded-xl text-sm"
                        style={inp(loginErrs.pass)}
                        onFocus={e => (e.currentTarget.style.borderColor = loginErrs.pass ? "#EF4444" : "#1E3A8A")}
                        onBlur={e  => (e.currentTarget.style.borderColor = loginErrs.pass ? "#EF4444" : "var(--border)")}
                      />
                      <button type="button" onClick={() => setShowLogin(!showLogin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                        style={{ color:"var(--text-subtle)" }}>
                        {showLogin ? <EyeOff size={16}/> : <Eye size={16}/>}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[.99] disabled:opacity-60"
                    style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)", boxShadow:"0 4px 20px rgba(234,88,12,0.3)" }}>
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      : <>{t.auth.loginBtn} <ArrowRight size={15}/></>}
                  </button>
                </form>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background:"var(--border)" }}/>
                  <span className="text-[11px]" style={{ color:"var(--text-subtle)" }}>{isEN ? "First time here?" : "¿Primera vez aquí?"}</span>
                  <div className="flex-1 h-px" style={{ background:"var(--border)" }}/>
                </div>
                <button onClick={() => onChange("register")}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                  style={{ border:"1.5px solid var(--border)", background:"var(--surface)", color:"var(--text)" }}>
                  {t.auth.createAccount} →
                </button>
              </div>
            )}

            {/* ── REGISTER ── */}
            {view === "register" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-black mb-1" style={{ color:"var(--text)", letterSpacing:"-.02em" }}>
                    {t.auth.createAccountTitle}
                  </h2>
                  <p className="text-sm" style={{ color:"var(--text-muted)" }}>{t.auth.registerSubtitle}</p>
                </div>

                {regErr && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                    style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", color:"#FCA5A5" }}>
                    <AlertCircle size={13} className="flex-shrink-0"/>{regErr}
                  </div>
                )}

                {regStep === "verify" ? (
                  <form onSubmit={handleVerifyRegister} className="space-y-4 py-1">
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                        style={{ background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.2)" }}>
                        <Shield size={24} style={{ color:"var(--brand-light)" }}/>
                      </div>
                      <h2 className="text-lg font-black mb-1" style={{ color:"var(--text)" }}>{t.auth.verifyEmailTitle}</h2>
                      <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                        {t.auth.verifyEmailDesc} <strong style={{ color:"var(--text)" }}>{regEmail}</strong>
                      </p>
                    </div>
                    <input type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={regCode}
                      onChange={e => { setRegCode(e.target.value.replace(/\D/g, "")); setRegErr(""); }}
                      className="w-full px-4 py-4 rounded-xl text-2xl font-black text-center tracking-[0.4em] outline-none"
                      style={{ background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)" }}/>
                    <button type="submit" disabled={regCode.length < 6 || loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)", boxShadow:"0 4px 16px rgba(234,88,12,0.25)" }}>
                      {loading
                        ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                        : <>{t.auth.verifyAndCreate} <ArrowRight size={15}/></>}
                    </button>
                    <div className="flex items-center justify-between text-xs">
                      <button type="button" onClick={() => { setRegStep("form"); setRegErr(""); }}
                        className="font-semibold hover:opacity-70" style={{ color:"var(--text-muted)" }}>
                        ← {t.auth.back}
                      </button>
                      <span style={{ color:"var(--text-subtle)" }}>
                        {t.auth.didntGetCode}{" "}
                        {regResendIn > 0
                          ? <span>{t.auth.resendIn} {regResendIn}s</span>
                          : <button type="button" onClick={handleResendRegisterCode} disabled={regSending}
                              className="font-semibold" style={{ color:"var(--brand-light)" }}>{t.auth.resend}</button>}
                      </span>
                    </div>
                  </form>
                ) : (
                <>
                <form onSubmit={handleRegister} className="space-y-3.5">
                  {/* Username */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
                      style={{ color: (regErrs.username || regTaken.username) ? "#EF4444" : "var(--text-subtle)" }}>
                      {t.auth.username}
                      {regTaken.username
                        ? <span className="normal-case font-normal ml-1 opacity-70">{t.auth.takenShort}</span>
                        : regErrs.username && <span className="normal-case font-normal ml-1 opacity-70">{t.auth.usernameMin}</span>}
                    </label>
                    <input type="text" placeholder={isEN ? "YourUsername" : "TuNombreDeUsuario"}
                      value={username} onChange={e => { setUsername(e.target.value); setRegErrs(p => ({...p, username:false})); setRegTaken(p => ({...p, username:false})); setRegErr(""); }}
                      className="w-full px-4 py-3 rounded-xl text-sm"
                      style={inp(regErrs.username || regTaken.username)}
                      onFocus={e => (e.currentTarget.style.borderColor = (regErrs.username || regTaken.username) ? "#EF4444" : "#1E3A8A")}
                      onBlur={e  => (e.currentTarget.style.borderColor = (regErrs.username || regTaken.username) ? "#EF4444" : "var(--border)")}
                    />
                  </div>
                  {/* Nombre completo (opcional) */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color:"var(--text-subtle)" }}>
                      {t.auth.fullName} <span className="normal-case font-normal opacity-70">— {t.auth.optional}</span>
                    </label>
                    <input type="text" placeholder={t.auth.fullNamePlaceholder}
                      value={regFullName} onChange={e => setRegFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm" style={inp(false)}
                      onFocus={e => (e.currentTarget.style.borderColor = "#1E3A8A")}
                      onBlur={e  => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
                      style={{ color: (regErrs.email || regTaken.email) ? "#EF4444" : "var(--text-subtle)" }}>
                      {t.auth.email}
                      {regTaken.email
                        ? <span className="normal-case font-normal ml-1 opacity-70">{t.auth.takenShort}</span>
                        : regErrs.email && <span className="normal-case font-normal ml-1 opacity-70">{t.auth.required}</span>}
                    </label>
                    <input type="email" placeholder={isEN ? "your@email.com" : "tu@correo.com"}
                      value={regEmail} onChange={e => { setRegEmail(e.target.value); setRegErrs(p => ({...p, email:false})); setRegTaken(p => ({...p, email:false})); setRegErr(""); }}
                      className="w-full px-4 py-3 rounded-xl text-sm"
                      style={inp(regErrs.email || regTaken.email)}
                      onFocus={e => (e.currentTarget.style.borderColor = (regErrs.email || regTaken.email) ? "#EF4444" : "#1E3A8A")}
                      onBlur={e  => (e.currentTarget.style.borderColor = (regErrs.email || regTaken.email) ? "#EF4444" : "var(--border)")}
                    />
                  </div>
                  {/* Password */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
                      style={{ color: regErrs.password ? "#EF4444" : "var(--text-subtle)" }}>
                      {t.auth.password}
                      {regErrs.password && <span className="normal-case font-normal ml-1 opacity-70">{t.auth.passwordMin}</span>}
                    </label>
                    <div className="relative">
                      <input type={showReg ? "text" : "password"} placeholder="••••••••"
                        value={regPass} onChange={e => { setRegPass(e.target.value); setRegErrs(p => ({...p, password:false})); }}
                        className="w-full px-4 py-3 pr-11 rounded-xl text-sm"
                        style={inp(regErrs.password)}
                        onFocus={e => (e.currentTarget.style.borderColor = regErrs.password ? "#EF4444" : "#1E3A8A")}
                        onBlur={e  => (e.currentTarget.style.borderColor = regErrs.password ? "#EF4444" : "var(--border)")}
                      />
                      <button type="button" onClick={() => setShowReg(!showReg)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                        style={{ color:"var(--text-subtle)" }}>
                        {showReg ? <EyeOff size={16}/> : <Eye size={16}/>}
                      </button>
                    </div>
                    {regPass.length > 0 && (
                      <div className="mt-1.5 space-y-1">
                        <div className="flex gap-1">
                          {[0,1,2,3].map(i => (
                            <div key={i} className="h-1 flex-1 rounded-full transition-all"
                              style={{ background: i < score ? strengthColor : "var(--border)" }}/>
                          ))}
                        </div>
                        <p className="text-[10px] font-semibold" style={{ color:strengthColor }}>{strengthLabel}</p>
                      </div>
                    )}
                  </div>
                  {/* Confirm */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
                      style={{ color: regErrs.confirm ? "#EF4444" : "var(--text-subtle)" }}>
                      {t.auth.confirmPassword}
                      {regErrs.confirm && <span className="normal-case font-normal ml-1 opacity-70">{t.auth.passwordMismatch}</span>}
                    </label>
                    <input type={showReg ? "text" : "password"} placeholder="••••••••"
                      value={regConfirm} onChange={e => { setRegConfirm(e.target.value); setRegErrs(p => ({...p, confirm:false})); }}
                      className="w-full px-4 py-3 rounded-xl text-sm"
                      style={inp(regErrs.confirm)}
                      onFocus={e => (e.currentTarget.style.borderColor = regErrs.confirm ? "#EF4444" : "#1E3A8A")}
                      onBlur={e  => (e.currentTarget.style.borderColor = regErrs.confirm ? "#EF4444" : "var(--border)")}
                    />
                  </div>

                  <button type="submit" disabled={regSending}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)", boxShadow:"0 4px 20px rgba(234,88,12,0.3)" }}>
                    {regSending
                      ? <>{t.auth.sendingCode} <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/></>
                      : <>{t.auth.continueBtn} <ArrowRight size={15}/></>}
                  </button>
                  <p className="text-[10px] text-center" style={{ color:"var(--text-subtle)" }}>
                    {isEN ? "We'll email you a 6-digit code to confirm your account." : "Te enviaremos un código de 6 dígitos por correo para confirmar tu cuenta."}
                  </p>
                </form>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px" style={{ background:"var(--border)" }}/>
                  <span className="text-[11px]" style={{ color:"var(--text-subtle)" }}>{t.auth.haveAccount}</span>
                  <div className="flex-1 h-px" style={{ background:"var(--border)" }}/>
                </div>
                <button onClick={() => onChange("login")}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-80"
                  style={{ border:"1.5px solid var(--border)", background:"var(--surface)", color:"var(--text)" }}>
                  {t.auth.loginLink} →
                </button>
                </>
                )}
              </div>
            )}

            {/* ── FORGOT ── */}
            {view === "forgot" && (
              <div className="space-y-5">
                {forgotSent ? (
                  <form onSubmit={handleVerifyForgot} className="space-y-5 py-2">
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                        style={{ background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.2)" }}>
                        <Shield size={24} style={{ color:"var(--brand-light)" }}/>
                      </div>
                      <h2 className="text-lg font-black mb-1" style={{ color:"var(--text)" }}>
                        {isEN ? "Enter verification code" : "Ingresa el código de verificación"}
                      </h2>
                      <p className="text-xs" style={{ color:"var(--text-muted)" }}>
                        {isEN ? "We sent a 6-digit code to" : "Enviamos un código de 6 dígitos a"}{" "}
                        <strong style={{ color:"var(--text)" }}>{forgotEmail}</strong>
                      </p>
                    </div>

                    {forgotErr && (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                        style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", color:"#FCA5A5" }}>
                        <AlertCircle size={13} className="flex-shrink-0"/>{forgotErr}
                      </div>
                    )}

                    <input type="text" maxLength={6} placeholder="000000" value={forgotCode}
                      onChange={e => { setForgotCode(e.target.value.replace(/\D/g, "")); setForgotErr(""); }}
                      className="w-full px-4 py-4 rounded-xl text-2xl font-black text-center tracking-[0.4em] outline-none"
                      style={{ background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:12, color:"var(--text)", outline:"none" }}/>

                    <button type="submit" disabled={forgotCode.length < 6 || loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)", boxShadow:"0 4px 16px rgba(234,88,12,0.25)" }}>
                      {isEN ? "Verify code" : "Verificar código"} →
                    </button>

                    <p className="text-center text-xs" style={{ color:"var(--text-subtle)" }}>
                      {isEN ? "Didn't receive it? " : "¿No llegó? "}
                      <button type="button" onClick={() => { setForgotSent(false); setForgotCode(""); }}
                        className="font-semibold" style={{ color:"var(--brand-light)" }}>
                        {isEN ? "Resend" : "Reenviar"}
                      </button>
                    </p>
                  </form>
                ) : (
                  <>
                    <div>
                      <h2 className="text-2xl font-black mb-1" style={{ color:"var(--text)", letterSpacing:"-.02em" }}>
                        {t.auth.forgotTitle}
                      </h2>
                      <p className="text-sm" style={{ color:"var(--text-muted)" }}>{t.auth.forgotDesc}</p>
                    </div>

                    {forgotErr && (
                      <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                        style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", color:"#FCA5A5" }}>
                        <AlertCircle size={13} className="flex-shrink-0"/>{forgotErr}
                      </div>
                    )}

                    <form onSubmit={handleForgot} className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block"
                          style={{ color: forgotInvalid ? "#EF4444" : "var(--text-subtle)" }}>
                          {t.auth.email}
                          {forgotInvalid && <span className="normal-case font-normal ml-1 opacity-70">{t.auth.required}</span>}
                        </label>
                        <input type="email" placeholder={isEN ? "your@email.com" : "tu@correo.com"}
                          value={forgotEmail} onChange={e => { setForgotEmail(e.target.value); setForgotInvalid(false); }}
                          className="w-full px-4 py-3 rounded-xl text-sm"
                          style={inp(forgotInvalid)}
                          onFocus={e => (e.currentTarget.style.borderColor = forgotInvalid ? "#EF4444" : "#1E3A8A")}
                          onBlur={e  => (e.currentTarget.style.borderColor = forgotInvalid ? "#EF4444" : "var(--border)")}
                        />
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                        style={{ background:"linear-gradient(135deg,#1E3A8A,#EA580C)", boxShadow:"0 4px 20px rgba(234,88,12,0.3)" }}>
                        {loading
                          ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                          : <>{t.auth.sendResetLink} <ArrowRight size={15}/></>}
                      </button>
                    </form>

                    <button onClick={() => onChange("login")}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                      style={{ border:"1.5px solid var(--border)", background:"var(--surface)", color:"var(--text-muted)" }}>
                      ← {t.auth.backToLogin}
                    </button>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
