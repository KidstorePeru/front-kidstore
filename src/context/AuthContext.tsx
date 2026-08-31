"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

export interface User {
  id:        string | number;
  username:  string;
  email:     string;
  avatar?:   string;
  phone?:    string;
  createdAt?: string;
}

interface AuthContextType {
  user:           User | null;
  loading:        boolean;
  login:          (identifier: string, password: string) => Promise<void>;
  register:       (username: string, email: string, password: string) => Promise<void>;
  logout:         () => void;
  forgotPassword: (email: string) => Promise<void>;
  verifyCode:     (email: string, code: string) => Promise<{ username: string }>;
  updateProfile:  (data: Partial<User>) => Promise<void>;
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

  // ── Register ──
  async function register(username: string, email: string, password: string) {
    setLoading(true);
    try {
      const { data, error } = await api<{ success: boolean; user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });

      if (error || !data?.success) throw new Error(error ?? "Registration failed");

      setUser(data.user);
      saveSession(data.user);
    } finally {
      setLoading(false);
    }
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
  async function updateProfile(data: Partial<User>) {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await api("/auth/update-profile", {
        method: "PUT",
        body: JSON.stringify({
          email: user.email,
          username: data.username ?? user.username,
          phone: data.phone ?? user.phone,
        }),
      });

      if (error) throw new Error(error);

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
      forgotPassword, verifyCode, updateProfile, changePassword,
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
