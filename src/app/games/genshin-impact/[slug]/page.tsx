import GenshinImpactProductClient from "@/components/game/GenshinImpactProductClient";
import { ALL_GENSHIN_PRODUCTS } from "@/data/genshinimpact";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_GENSHIN_PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = ALL_GENSHIN_PRODUCTS.find(p => p.slug === slug);
  return {
    title: product ? `${product.name} — Genshin Impact — KidStore` : "Genshin Impact — KidStore",
    description: product
      ? `Compra ${product.name} para Genshin Impact al mejor precio. Entrega en 5-10 min.`
      : "Cristales de Génesis al mejor precio.",
  };
}

export default async function GenshinImpactProductPage({ params }: Props) {
  const { slug } = await params;
  return <GenshinImpactProductClient slug={slug} />;
}
