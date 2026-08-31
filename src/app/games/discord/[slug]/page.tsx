import DiscordProductClient from "@/components/game/DiscordProductClient";
import { ALL_DISCORD_PRODUCTS } from "@/data/discord";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_DISCORD_PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = ALL_DISCORD_PRODUCTS.find(p => p.slug === slug);
  return {
    title: product
      ? `${product.name} — Discord — KidStore`
      : "Discord — KidStore",
    description: product
      ? `Compra ${product.name} al mejor precio. Servicio Global. Entrega en ${product.deliveryTime ?? "1h - 12h"}.`
      : "Discord Nitro y mejoras al mejor precio.",
  };
}

export default async function DiscordProductPage({ params }: Props) {
  const { slug } = await params;
  return <DiscordProductClient slug={slug} />;
}
