"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { games } from "@/data";
import { useVisibility } from "@/context/VisibilityContext";
import { gameKey } from "@/config/visibility";

/**
 * Guarda de acceso directo por URL: si un juego está oculto desde el panel
 * `/admin`, cualquier ruta `/games/<slug>` o `/games/<slug>/<producto>`
 * redirige a `/games`. Las tarjetas ya se filtran en cada listado; esto cubre
 * el caso de entrar con el enlace directo.
 */
export default function GamesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { isVisible, loading } = useVisibility();

  useEffect(() => {
    if (loading) return;
    const match = pathname?.match(/^\/games\/([^/]+)/);
    const slug  = match?.[1];
    if (!slug) return;
    if (!games.some(g => g.slug === slug)) return; // no es un juego conocido
    if (!isVisible(gameKey(slug))) {
      router.replace("/games");
    }
  }, [pathname, isVisible, loading, router]);

  return <>{children}</>;
}
