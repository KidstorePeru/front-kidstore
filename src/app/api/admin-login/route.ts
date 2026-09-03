import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { ADMIN_COOKIE, createAdminSession } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

// Credenciales solo del servidor. Se aceptan las variables nuevas y, de forma
// transitoria, las antiguas NEXT_PUBLIC_* para no romper el acceso mientras se
// renombran en Railway. Conviene quitar el fallback NEXT_PUBLIC_* una vez hecho.
const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL ||
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
  ""
).trim().toLowerCase();
const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASS || "";

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function POST(request: Request) {
  let email = "";
  let password = "";
  try {
    const body = await request.json();
    email = String(body?.email ?? "").trim().toLowerCase();
    password = String(body?.password ?? "");
  } catch {
    return NextResponse.json({ success: false, error: "Solicitud inválida." }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ success: false, error: "Correo y contraseña son requeridos." }, { status: 400 });
  }

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("[admin-login] ADMIN_EMAIL / ADMIN_PASSWORD no configurados.");
    return NextResponse.json({ success: false, error: "Login no configurado en el servidor." }, { status: 500 });
  }

  const ok = safeEqual(email, ADMIN_EMAIL) && safeEqual(password, ADMIN_PASSWORD);
  if (!ok) {
    return NextResponse.json({ success: false, error: "Credenciales incorrectas." }, { status: 401 });
  }

  const { value, maxAge } = createAdminSession(ADMIN_EMAIL);
  const res = NextResponse.json({
    success: true,
    admin: { email: ADMIN_EMAIL, name: "Administrador", role: "owner" },
  });
  res.cookies.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}
