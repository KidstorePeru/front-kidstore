"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// El login se valida en el servidor (/api/admin-login), que compara contra
// variables de entorno NO públicas y devuelve una cookie httpOnly firmada.
// La contraseña ya no viaja al navegador. Lo que guardamos en localStorage es
// solo para pintar la UI al instante; la cookie es la que realmente autoriza.

interface AdminUser {
  email: string;
  name:  string;
  role:  "owner" | "collaborator";
}

interface AdminAuthContextType {
  admin:       AdminUser | null;
  loading:     boolean;
  loginAdmin:  (email: string, password: string) => Promise<void>;
  logoutAdmin: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const ADMIN_SESSION_KEY = "kidstore_admin_session";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin,   setAdmin]   = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADMIN_SESSION_KEY);
      if (saved) setAdmin(JSON.parse(saved));
    } catch {}
    setLoading(false);
  }, []);

  async function loginAdmin(email: string, password: string) {
    let data: { success?: boolean; admin?: AdminUser; error?: string } = {};
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.admin) {
        throw new Error(data.error || "Credenciales incorrectas.");
      }
    } catch (e) {
      if (e instanceof Error) throw e;
      throw new Error("No se pudo iniciar sesión.");
    }
    setAdmin(data.admin);
    try { localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(data.admin)); } catch {}
  }

  function logoutAdmin() {
    setAdmin(null);
    try { localStorage.removeItem(ADMIN_SESSION_KEY); } catch {}
    fetch("/api/admin-logout", { method: "POST" }).catch(() => {});
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
