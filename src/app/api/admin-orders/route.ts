import { NextResponse } from "next/server";

// Force dynamic — never cache this route, always hit the backend
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BACKEND_URL  = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_KEY      = process.env.NEXT_PUBLIC_API_KEY ?? "";
const ADMIN_TOKEN  = "kidstore-admin-secret-2025";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/admin/orders`, {
      headers: {
        "x-admin-key": ADMIN_TOKEN,
        "x-api-key": API_KEY,
      },
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("[proxy/admin-orders] Backend error:", res.status, text);
      return NextResponse.json(
        { success: false, orders: [] },
        { status: res.status, headers: { "Cache-Control": "no-store" } },
      );
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      });
    } catch {
      console.error("[proxy/admin-orders] Invalid JSON from backend:", text);
      return NextResponse.json({ success: false, orders: [] }, { status: 502 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[proxy/admin-orders] Fetch error:", message);
    return NextResponse.json({ success: false, orders: [] }, { status: 502 });
  }
}
