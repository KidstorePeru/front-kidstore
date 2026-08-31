"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Shield, AlertCircle } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, loading } = useAdminAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError("");
    try {
      await loginAdmin(email, password);
      router.push("/admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al iniciar sesión.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#080C18" }}>

      {/* Fondo píxeles decorativos */}
      {[
        { w:8,  h:8,  bg:"#1D4ED8", op:.35, top:"10%", left:"6%"   },
        { w:6,  h:6,  bg:"#FF6B1A", op:.35, top:"15%", right:"10%" },
        { w:10, h:10, bg:"#7C3AED", op:.25, top:"8%",  right:"22%" },
        { w:5,  h:5,  bg:"#E53E3E", op:.3,  top:"28%", right:"5%"  },
        { w:7,  h:7,  bg:"#3B82F6", op:.2,  bottom:"20%", left:"8%" },
        { w:5,  h:5,  bg:"#A855F7", op:.25, bottom:"15%", right:"8%"},
      ].map((px, i) => (
        <div key={i} className="absolute pointer-events-none rounded-sm" style={{
          width: px.w, height: px.h, background: px.bg, opacity: px.op,
          ...("top" in px && { top: px.top }),
          ...("left" in px && { left: px.left }),
          ...("bottom" in px && { bottom: px.bottom }),
          ...("right" in px && { right: px.right }),
        }}/>
      ))}

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logo/imagotipo-kidstore.png"
            alt="KidStore"
            width={200}
            height={76}
            className="object-contain mb-4"
            style={{ filter: "brightness(0) invert(1)" }}
            priority
          />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ background: "rgba(234,88,12,0.12)", border: "1px solid rgba(234,88,12,0.3)" }}>
            <Shield size={14} style={{ color: "#F97316" }}/>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#F97316" }}>
              Panel de Administración
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>

          <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <h1 className="text-base font-black text-white">Acceso restringido</h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Solo para administradores autorizados</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5" }}>
                <AlertCircle size={13} className="flex-shrink-0"/>{error}
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block"
                style={{ color: "rgba(255,255,255,0.4)" }}>
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="admin@kidstoreperu.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all text-white"
                style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#EA580C")}
                onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest mb-1.5 block"
                style={{ color: "rgba(255,255,255,0.4)" }}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all text-white"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#EA580C")}
                  onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
                  style={{ color: "rgba(255,255,255,0.4)" }}>
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ background: "linear-gradient(135deg,#1E3A8A,#EA580C)", boxShadow: "0 4px 20px rgba(234,88,12,0.3)" }}>
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                : <><Shield size={15}/> Ingresar al panel</>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.2)" }}>
          KidStore Admin Panel · Acceso privado
        </p>
      </div>
    </div>
  );
}
