import RocketLeagueProductClient from "@/components/game/RocketLeagueProductClient";
import { ALL_ROCKET_LEAGUE_PRODUCTS } from "@/data/rocketleague";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_ROCKET_LEAGUE_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = ALL_ROCKET_LEAGUE_PRODUCTS.find((p) => p.slug === slug);
  const name = product?.name ?? product?.amount ?? "Producto";
  return {
    title: `${name} — Rocket League — KidStore`,
    description: `Compra ${name} al mejor precio. Entrega instantánea y pago seguro.`,
  };
}

export default async function RocketLeagueProductPage({ params }: Props) {
  const { slug } = await params;
  return <RocketLeagueProductClient slug={slug} />;
}
