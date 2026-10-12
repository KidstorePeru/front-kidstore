import { assertAdmin } from "@/lib/adminSession";
import { badRequest, proxyToBackend, readJson } from "@/lib/backend";

// Guarda la visibilidad de juegos / pestañas / productos desde el panel.
export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const unauth = assertAdmin(request);
  if (unauth) return unauth;
  const body = await readJson(request);
  if (!body) return badRequest();
  return proxyToBackend("/admin/site-config", { method: "PUT", body, admin: true });
}
