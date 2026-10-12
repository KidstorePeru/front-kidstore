import { NextResponse } from "next/server";

// Llamadas del servidor de Next (route handlers) al backend de Railway. El navegador no habla
// con estas rutas del backend directamente: así las claves de administrador nunca salen del
// servidor.
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";
// Debe coincidir con ADMIN_SESSION_TOKEN del backend. Sin ella las rutas de admin se deniegan
// (nunca hay una clave por defecto).
const ADMIN_TOKEN = process.env.ADMIN_SESSION_TOKEN ?? "";

interface ProxyOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH";
  body?: unknown;
  /** Añade x-admin-key (solo tras validar la sesión de admin con assertAdmin). */
  admin?: boolean;
  /** Respuesta JSON que se devuelve si el backend falla (además de success: false). */
  fallback?: Record<string, unknown>;
  /** Estado HTTP de esa respuesta de reserva (por defecto, el del backend o 502). */
  fallbackStatus?: number;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

/** Reenvía la petición al backend y devuelve su JSON (o `fallback` si falla). */
export async function proxyToBackend(path: string, opts: ProxyOptions = {}): Promise<NextResponse> {
  const { method = "GET", body, admin = false, fallback = {}, fallbackStatus, headers = {}, timeoutMs = 15_000 } = opts;
  const tag = `[proxy ${method} ${path}]`;
  const fail = (status: number, error?: string) =>
    NextResponse.json({ success: false, ...fallback, ...(error ? { error } : {}) }, { status: fallbackStatus ?? status, headers });

  if (!BACKEND_URL) {
    console.error(tag, "NEXT_PUBLIC_API_URL no está configurada");
    return fail(500, "Backend no configurado.");
  }
  if (admin && !ADMIN_TOKEN) {
    console.error(tag, "ADMIN_SESSION_TOKEN no está configurada");
    return fail(500, "Panel de administración no configurado en el servidor.");
  }

  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      method,
      headers: {
        "x-api-key": API_KEY,
        ...(admin ? { "x-admin-key": ADMIN_TOKEN } : {}),
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      console.error(tag, "respuesta no JSON del backend:", res.status, text.slice(0, 300));
      return fail(502);
    }
    if (!res.ok) {
      console.error(tag, "error del backend:", res.status, text.slice(0, 300));
      const error = (data as { error?: string })?.error;
      return fail(res.status, typeof error === "string" ? error : undefined);
    }
    return NextResponse.json(data, { headers });
  } catch (err) {
    console.error(tag, "sin respuesta del backend:", err instanceof Error ? err.message : err);
    return fail(502, "No se pudo conectar con el servidor.");
  }
}

/** Lee el cuerpo JSON de la petición; null si no es JSON válido. */
export async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export const badRequest = () =>
  NextResponse.json({ success: false, error: "Solicitud no válida." }, { status: 400 });
