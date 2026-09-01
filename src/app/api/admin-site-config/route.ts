import { NextResponse } from "next/server";

// Guarda overrides de visibilidad. El token de admin vive solo en el servidor.
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_KEY     = process.env.NEXT_PUBLIC_API_KEY ?? "";
// Debe coincidir con ADMIN_SESSION_TOKEN del backend. Si rotas el secreto en
// Railway, define esta misma variable en el entorno del front.
const ADMIN_TOKEN = process.env.ADMIN_SESSION_TOKEN ?? "kidstore-admin-secret-2025";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${BACKEND_URL}/admin/site-config`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": ADMIN_TOKEN,
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("[proxy/admin-site-config] Backend error:", res.status, text);
      return NextResponse.json({ success: false, error: text }, { status: res.status });
    }

    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json({ success: true });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[proxy/admin-site-config] Fetch error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
