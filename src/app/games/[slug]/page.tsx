import { games } from "@/data";
import GamePageClient from "@/components/game/GamePageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Exclude fortnite — it has its own static route at /games/fortnite
  return games
    .filter((g) => g.slug !== "fortnite")
    .map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const game = games.find((g) => g.slug === slug);
  return {
    title: game ? `${game.name} — KidStore` : "Juego — KidStore",
    description: game
      ? `Recarga ${game.name} al mejor precio. Entrega instantánea.`
      : "Marketplace de recargas",
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  return <GamePageClient slug={slug} />;
}
