import PokemonGoProductClient from "@/components/game/PokemonGoProductClient";
import { ALL_POKEMON_GO_PRODUCTS } from "@/data/pokemongo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_POKEMON_GO_PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = ALL_POKEMON_GO_PRODUCTS.find(p => p.slug === slug);
  return {
    title: product ? `${product.name} — Pokémon GO — KidStore` : "Pokémon GO — KidStore",
    description: product
      ? `Compra ${product.name} para Pokémon GO al mejor precio. Entrega en minutos.`
      : "PokéCoins al mejor precio.",
  };
}

export default async function PokemonGoProductPage({ params }: Props) {
  const { slug } = await params;
  return <PokemonGoProductClient slug={slug} />;
}
