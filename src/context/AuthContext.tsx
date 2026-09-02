"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

export interface User {
  id:        string | number;
  username:  string;
  email:     string;
  fullName?: string;
  avatar?:   string;
  phone?:    string;
  createdAt?: string;
}

interface AuthContextType {
  user:           User | null;
  loading:        boolean;
  login:          (identifier: string, password: string) => Promise<void>;
  register:       (username: string, email: string, password: string, fullName?: string) => Promise<void>;
  logout:         () => void;
  requestEmailCode: (email: string, username?: string, lang?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyCode:     (email: string, code: string) => Promise<{ username: string }>;
  updateProfile:  (data: Partial<User> & { newEmail?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_KEY = "kidstore_session";

function getSession(): User | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null"); } catch { return null; }
}
function saveSession(user: User | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const saved = getSession();
    if (saved) setUser(saved);
    setLoading(false);
  }, []);

  // ── Login ──
  async function login(identifier: string, password: string) {
    setLoading(true);
    try {
      const { data, error } = await api<{ success: boolean; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password }),
      });

      if (error || !data?.success) throw new Error(error ?? "Login failed");

      setUser(data.user);
      saveSession(data.user);
    } finally {
      setLoading(false);
    }
  }

  // ── Register (después de verificar el correo con código) ──
  async function register(username: string, email: string, password: string, fullName?: string) {
    setLoading(true);
    try {
      const { data, error } = await api<{ success: boolean; user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password, fullName }),
      });

      if (error || !data?.success) throw new Error(error ?? "Registration failed");

      setUser(data.user);
      saveSession(data.user);
    } finally {
      setLoading(false);
    }
  }

  // ── Enviar código de verificación al correo (registro / cambio de correo) ──
  async function requestEmailCode(email: string, username?: string, lang?: string) {
    const { error } = await api("/send-verification", {
      method: "POST",
      body: JSON.stringify({ email, username: username || email.split("@")[0], lang }),
    });
    if (error) throw new Error(error);
  }

  // ── Logout ──
  function logout() {
    setUser(null);
    saveSession(null);
  }

  // ── Forgot password (send verification code) ──
  async function forgotPassword(email: string) {
    setLoading(true);
    try {
      const { error } = await api("/send-verification", {
        method: "POST",
        body: JSON.stringify({ email, username: email.split("@")[0] }),
      });

      if (error) throw new Error(error);
    } finally {
      setLoading(false);
    }
  }

  // ── Verify OTP code ──
  async function verifyCode(email: string, code: string): Promise<{ username: string }> {
    const { data, error } = await api<{ success: boolean; username: string }>("/verify-code", {
      method: "POST",
      body: JSON.stringify({ email, code }),
    });

    if (error || !data?.success) throw new Error(error ?? "Invalid code");
    return { username: data.username };
  }

  // ── Change password ──
  async function changePassword(currentPassword: string, newPassword: string) {
    if (!user) throw new Error("Not logged in");
    setLoading(true);
    try {
      const { error } = await api("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          username: user.username,
          currentPassword,
          newPassword,
        }),
      });

      if (error) throw new Error(error);
    } finally {
      setLoading(false);
    }
  }

  // ── Update profile ──
  // `avatar` es solo local (no hay columna en el backend). `newEmail` cambia el
  // correo de la cuenta y requiere haber verificado ese correo con un código.
  async function updateProfile(data: Partial<User> & { newEmail?: string }) {
    if (!user) return;
    setLoading(true);
    try {
      const body: Record<string, unknown> = { email: user.email };
      if (data.username !== undefined) body.username = data.username;
      if (data.phone    !== undefined) body.phone    = data.phone;
      if (data.fullName !== undefined) body.fullName = data.fullName;
      if (data.newEmail) body.newEmail = data.newEmail;

      // Si solo se cambia el avatar (local), no llamamos al backend.
      const touchesBackend = Object.keys(body).length > 1;
      if (touchesBackend) {
        const { data: res, error } = await api<{ user?: User }>("/auth/update-profile", {
          method: "PUT",
          body: JSON.stringify(body),
        });
        if (error) throw new Error(error);
        // El backend devuelve el usuario actualizado (incl. email nuevo).
        const merged = { ...user, ...data, ...(res?.user ?? {}) };
        delete (merged as { newEmail?: string }).newEmail;
        setUser(merged);
        saveSession(merged);
        return;
      }

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      saveSession(updatedUser);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, logout,
      requestEmailCode, forgotPassword, verifyCode, updateProfile, changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
