import { Suspense } from "react";
import AllGamesClient from "@/components/game/AllGamesClient";

export const metadata = {
  title: "Todos los juegos — KidStore",
  description:
    "Explora el catálogo completo de recargas de KidStore: Fortnite, Roblox, Genshin Impact, " +
    "Wild Rift, Marvel Rivals y más. Entrega instantánea y pago seguro.",
};

export default function AllGamesPage() {
  // AllGamesClient lee los filtros de la URL (useSearchParams).
  return (
    <Suspense>
      <AllGamesClient />
    </Suspense>
  );
}
