"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { usePreferences } from "@/context/PreferencesContext";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { lang } = usePreferences();
  const isEN = lang === "EN";

  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("kidstore_reset_email");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      // No verified email — redirect back
      router.push("/login");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(isEN ? "Password must be at least 8 characters." : "La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError(isEN ? "Passwords don't match." : "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const { error: apiError } = await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, newPassword: password }),
      });

      if (apiError) {
        setError(apiError);
        setLoading(false);
        return;
      }

      sessionStorage.removeItem("kidstore_reset_email");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError(isEN ? "Error updating password." : "Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  const strength = password.length === 0 ? 0
    : password.length < 8 ? 1
    : /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) ? 3
    : /(?=.*[a-z])(?=.*\d)/.test(password) ? 2 : 1;
  const strengthColor = ["", "#EF4444", "#F59E0B", "#22C55E"][strength];
  const strengthLabel = isEN ? ["", "Weak", "Fair", "Strong"][strength] : ["", "Débil", "Regular", "Fuerte"][strength];

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #080C18 0%, #0F0A1E 50%, #06091A 100%)" }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-40 -top-40 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle,rgba(124,58,237,0.15),transparent 70%)" }}/>
        <div className="absolute -right-40 -bottom-40 w-96 h-96 rounded-full"
          style={{ background: "radial-gradient(circle,rgba(234,88,12,0.1),transparent 70%)" }}/>
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "32px 32px" }}/>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/"><Image src="/logo/imagotipo-kidstore.png" alt="KidStore" width={160} height={48} className="h-10 w-auto" style={{ filter: "brightness(0) invert(1)" }}/></Link>
        </div>

        {success ? (
          <div className="rounded-2xl p-8 text-center"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <CheckCircle size={32} style={{ color: "#22C55E" }}/>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">
              {isEN ? "Password updated!" : "¡Contraseña actualizada!"}
            </h1>
            <p className="text-sm text-white/50 mb-6">
              {isEN ? "Redirecting to login..." : "Redirigiendo al login..."}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>
            <div className="px-8 pt-8 pb-4 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}>
                <Lock size={24} style={{ color: "#A78BFA" }}/>
              </div>
              <h1 className="text-xl font-bold text-white mb-1">
                {isEN ? "Set new password" : "Nueva contraseña"}
              </h1>
              <p className="text-sm text-white/40">
                {isEN ? `Reset password for ${email}` : `Cambiar contraseña de ${email}`}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#FCA5A5" }}>
                  <AlertCircle size={14}/> {error}
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block text-white/40">
                  {isEN ? "New password" : "Nueva contraseña"}
                </label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}/>
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition">
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${(strength / 3) * 100}%`, background: strengthColor }}/>
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: strengthColor }}>{strengthLabel}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block text-white/40">
                  {isEN ? "Confirm password" : "Confirmar contraseña"}
                </label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={confirm}
                    onChange={e => { setConfirm(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}/>
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition">
                    {showConfirm ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                {confirm.length > 0 && password === confirm && (
                  <p className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color: "#22C55E" }}>
                    <CheckCircle size={10}/> {isEN ? "Passwords match" : "Las contraseñas coinciden"}
                  </p>
                )}
              </div>

              <button type="submit" disabled={loading || !password || !confirm}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}>
                {loading ? (
                  <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "white", borderTopColor: "transparent" }}/>
                ) : (
                  <>{isEN ? "Update password" : "Actualizar contraseña"} <ArrowRight size={15}/></>
                )}
              </button>

              <Link href="/" className="block text-center text-xs text-white/30 hover:text-white/50 transition mt-2">
                {isEN ? "← Back to store" : "← Volver a la tienda"}
              </Link>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
