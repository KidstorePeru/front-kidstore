import { NextResponse } from "next/server";

// Overrides de visibilidad de la tienda. Se consulta en cada carga de la web.
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_KEY     = process.env.NEXT_PUBLIC_API_KEY ?? "";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/site-config`, {
      headers: { "x-api-key": API_KEY },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("[proxy/site-config] Backend error:", res.status, text);
      return NextResponse.json(
        { success: false, config: {} },
        { status: 200, headers: { "Cache-Control": "public, max-age=15" } },
      );
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(
        { success: true, config: data?.config ?? {} },
        { headers: { "Cache-Control": "public, max-age=30" } },
      );
    } catch {
      console.error("[proxy/site-config] Invalid JSON from backend:", text);
      return NextResponse.json({ success: false, config: {} }, { status: 200 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[proxy/site-config] Fetch error:", message);
    // La tienda debe seguir funcionando aunque el backend esté caído.
    return NextResponse.json({ success: false, config: {} }, { status: 200 });
  }
}
