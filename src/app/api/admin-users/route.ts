import { assertAdmin } from "@/lib/adminSession";
import { proxyToBackend } from "@/lib/backend";

// Usuarios registrados para el panel de administración.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauth = assertAdmin(request);
  if (unauth) return unauth;
  return proxyToBackend("/admin/users", {
    admin: true,
    fallback: { users: [] },
    headers: { "Cache-Control": "no-store" },
  });
}
