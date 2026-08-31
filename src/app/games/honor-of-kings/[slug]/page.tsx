import HonorOfKingsProductClient from "@/components/game/HonorOfKingsProductClient";
import { ALL_HOK_PRODUCTS } from "@/data/honorofkings";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_HOK_PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = ALL_HOK_PRODUCTS.find(p => p.slug === slug);
  return {
    title: product ? `${product.name} — Honor of Kings — KidStore` : "Honor of Kings — KidStore",
    description: product
      ? `Compra ${product.name} para Honor of Kings al mejor precio.${product.bonus ? ` Incluye ${product.bonus} Tokens de regalo.` : ""}`
      : "Tokens para Honor of Kings al mejor precio.",
  };
}

export default async function HonorOfKingsProductPage({ params }: Props) {
  const { slug } = await params;
  return <HonorOfKingsProductClient slug={slug} />;
}
