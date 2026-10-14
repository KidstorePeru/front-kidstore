import { assertAdmin } from "@/lib/adminSession";
import { badRequest, proxyToBackend, readJson } from "@/lib/backend";

// Temporada de la web (Halloween…) desde el panel: estado y modo Automática / Encendida / Apagada.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauth = assertAdmin(request);
  if (unauth) return unauth;
  return proxyToBackend("/admin/season", { admin: true, headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  const unauth = assertAdmin(request);
  if (unauth) return unauth;
  const body = await readJson(request);
  if (!body) return badRequest();
  return proxyToBackend("/admin/season", { method: "PUT", body, admin: true });
}
