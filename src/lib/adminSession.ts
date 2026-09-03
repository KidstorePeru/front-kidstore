import crypto from "node:crypto";

// Sesión de administrador: cookie httpOnly firmada con HMAC-SHA256. Vive solo
// en el servidor (route handlers) — el navegador nunca ve el secreto ni puede
// forjar la cookie. Sustituye a la comprobación de contraseña en el cliente,
// que enviaba NEXT_PUBLIC_ADMIN_PASS dentro del bundle de JS a cada visitante.

export const ADMIN_COOKIE = "kidstore_admin";
const MAX_AGE_S = 8 * 60 * 60; // 8 h

// En Railway hay que definir ADMIN_AUTH_SECRET. Sin él usamos un valor fijo
// solo para desarrollo local (las sesiones no son seguras en ese caso).
const SECRET =
  process.env.ADMIN_AUTH_SECRET ||
  (process.env.NODE_ENV === "production"
    ? "" // en prod obligamos a configurarlo (firma vacía -> todo inválido)
    : "dev-only-insecure-admin-secret");

if (process.env.NODE_ENV === "production" && !process.env.ADMIN_AUTH_SECRET) {
  console.warn("[adminSession] ADMIN_AUTH_SECRET no configurado — el login de admin fallará.");
}

const b64url = (b: Buffer | string) =>
  Buffer.from(b).toString("base64url");

function sign(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
}

/** Genera el valor de la cookie de sesión para un admin ya autenticado. */
export function createAdminSession(email: string): { value: string; maxAge: number } {
  const body = JSON.stringify({ email, exp: Date.now() + MAX_AGE_S * 1000 });
  const payload = b64url(body);
  return { value: `${payload}.${sign(payload)}`, maxAge: MAX_AGE_S };
}

/** Devuelve el email del admin si la cookie es válida y no ha expirado; si no, null. */
export function readAdminSession(cookieHeader: string | null | undefined): string | null {
  if (!SECRET || !cookieHeader) return null;
  const raw = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ADMIN_COOKIE}=`))
    ?.slice(ADMIN_COOKIE.length + 1);
  if (!raw) return null;

  const [payload, mac] = raw.split(".");
  if (!payload || !mac) return null;

  const expected = sign(payload);
  if (
    mac.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))
  ) {
    return null;
  }

  try {
    const { email, exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof exp !== "number" || exp < Date.now()) return null;
    return typeof email === "string" ? email : null;
  } catch {
    return null;
  }
}

/** Guard para los proxies de admin. Lanza una Response 401 si no hay sesión. */
export function assertAdmin(req: Request): Response | null {
  return readAdminSession(req.headers.get("cookie"))
    ? null
    : Response.json({ success: false, error: "No autorizado." }, { status: 401 });
}
