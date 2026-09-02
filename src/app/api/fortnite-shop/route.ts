import { NextResponse } from "next/server";

// La tienda de Fortnite rota cada día a las 00:00 UTC. No se cachea en el
// servidor (un caché atascado hacía que se viera la tienda de ayer); el
// navegador puede quedarse la respuesta 10 min como mucho.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("language") ?? "es-419";

  try {
    const res = await fetch(`https://fortnite-api.com/v2/shop?language=${encodeURIComponent(lang)}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Fortnite API returned an error", status: res.status },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=1800",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch Fortnite shop", detail: message },
      { status: 502 },
    );
  }
}
