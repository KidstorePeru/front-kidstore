import MarvelRivalsProductClient from "@/components/game/MarvelRivalsProductClient";
import { ALL_MARVEL_RIVALS_PRODUCTS } from "@/data/marvelrivals";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_MARVEL_RIVALS_PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = ALL_MARVEL_RIVALS_PRODUCTS.find(p => p.slug === slug);
  return {
    title: product ? `${product.name} — Marvel Rivals — KidStore` : "Marvel Rivals — KidStore",
    description: product
      ? `Compra ${product.name} para Marvel Rivals al mejor precio. Entrega en minutos.`
      : "Marvel Rivals Lattices al mejor precio.",
  };
}

export default async function MarvelRivalsProductPage({ params }: Props) {
  const { slug } = await params;
  return <MarvelRivalsProductClient slug={slug} />;
}
