import { proxyToBackend } from "@/lib/backend";

// Visibilidad de la tienda (lo que el admin ocultó). Si el backend no responde se devuelve una
// configuración vacía con 200: la tienda sigue funcionando con los valores por defecto.
export const dynamic = "force-dynamic";

export async function GET() {
  return proxyToBackend("/site-config", {
    timeoutMs: 10_000,
    fallback: { config: {} },
    fallbackStatus: 200,
    headers: { "Cache-Control": "public, max-age=30" },
  });
}
