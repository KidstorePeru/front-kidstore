"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ── Admin credentials — validated via env vars (never expose in client bundle) ──
// In production, replace with server-side auth (JWT / session)
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
const ADMIN_PASS  = process.env.NEXT_PUBLIC_ADMIN_PASS  ?? "";

const ADMINS = [
  { email: ADMIN_EMAIL, password: ADMIN_PASS, name: "Administrador", role: "owner" as const },
];

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
    await new Promise(r => setTimeout(r, 600)); // simulate network
    const found = ADMINS.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!found) throw new Error("Credenciales incorrectas.");
    const { password: _, ...safeAdmin } = found;
    setAdmin(safeAdmin);
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(safeAdmin));
  }

  function logoutAdmin() {
    setAdmin(null);
    localStorage.removeItem(ADMIN_SESSION_KEY);
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
