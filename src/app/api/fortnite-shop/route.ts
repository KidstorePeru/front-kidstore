import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("language") ?? "es-419";

  try {
    const res = await fetch(`https://fortnite-api.com/v2/shop?language=${lang}`, {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Fortnite API returned an error", status: res.status },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch Fortnite shop", detail: message },
      { status: 502 },
    );
  }
}