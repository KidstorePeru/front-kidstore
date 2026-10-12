import { assertAdmin } from "@/lib/adminSession";
import { badRequest, proxyToBackend, readJson } from "@/lib/backend";

// Cambia el estado de un pedido desde el panel (el cliente lo ve en su historial).
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const unauth = assertAdmin(request);
  if (unauth) return unauth;
  const body = await readJson(request);
  if (!body) return badRequest();
  return proxyToBackend("/admin/orders/status", { method: "PATCH", body, admin: true });
}
