import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/adminSession";

// Lista de usuarios registrados (tabla users del backend). El x-admin-key vive
// solo en el servidor.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_KEY     = process.env.NEXT_PUBLIC_API_KEY ?? "";
const ADMIN_TOKEN = process.env.ADMIN_SESSION_TOKEN ?? "kidstore-admin-secret-2025";

export async function GET(request: Request) {
  const unauth = assertAdmin(request);
  if (unauth) return unauth;
  try {
    const res = await fetch(`${BACKEND_URL}/admin/users`, {
      headers: { "x-admin-key": ADMIN_TOKEN, "x-api-key": API_KEY },
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("[proxy/admin-users] Backend error:", res.status, text);
      return NextResponse.json({ success: false, users: [] }, { status: res.status });
    }

    try {
      return NextResponse.json(JSON.parse(text), {
        headers: { "Cache-Control": "no-store" },
      });
    } catch {
      return NextResponse.json({ success: false, users: [] }, { status: 502 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[proxy/admin-users] Fetch error:", message);
    return NextResponse.json({ success: false, users: [] }, { status: 502 });
  }
}
