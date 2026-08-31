import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_KEY     = process.env.NEXT_PUBLIC_API_KEY ?? "";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!BACKEND_URL) {
      console.error("[proxy/orders] NEXT_PUBLIC_API_URL is not set");
      return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 });
    }

    const res = await fetch(`${BACKEND_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("[proxy/orders] Backend error:", res.status, text);
      return NextResponse.json(
        { success: false, error: text, status: res.status },
        { status: res.status },
      );
    }

    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json({ success: true });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[proxy/orders] Fetch error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
