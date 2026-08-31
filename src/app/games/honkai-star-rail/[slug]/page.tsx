import HonkaiStarRailProductClient from "@/components/game/HonkaiStarRailProductClient";
import { ALL_HSR_PRODUCTS } from "@/data/honkaistarrail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_HSR_PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = ALL_HSR_PRODUCTS.find(p => p.slug === slug);
  return {
    title: product ? `${product.name} — Honkai: Star Rail — KidStore` : "Honkai: Star Rail — KidStore",
    description: product
      ? `Compra ${product.name} para Honkai: Star Rail al mejor precio. Entrega en 5-10 min.`
      : "Esquirlas Oníricas al mejor precio.",
  };
}

export default async function HonkaiStarRailProductPage({ params }: Props) {
  const { slug } = await params;
  return <HonkaiStarRailProductClient slug={slug} />;
}
