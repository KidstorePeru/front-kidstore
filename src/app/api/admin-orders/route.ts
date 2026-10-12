import { assertAdmin } from "@/lib/adminSession";
import { proxyToBackend } from "@/lib/backend";

// Pedidos para el panel de administración (siempre datos frescos).
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauth = assertAdmin(request);
  if (unauth) return unauth;
  return proxyToBackend("/admin/orders", {
    admin: true,
    fallback: { orders: [] },
    headers: { "Cache-Control": "no-store" },
  });
}
