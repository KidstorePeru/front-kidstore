import WildRiftProductClient from "@/components/game/WildRiftProductClient";
import { ALL_WILDRIFT_PRODUCTS } from "@/data/wildrift";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_WILDRIFT_PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = ALL_WILDRIFT_PRODUCTS.find(p => p.slug === slug);
  return {
    title: product ? `${product.name} — Wild Rift — KidStore` : "Wild Rift — KidStore",
    description: product
      ? `Compra ${product.name} para Wild Rift al mejor precio. Entrega en 5-10 minutos.`
      : "Wild Rift recargas al mejor precio.",
  };
}

export default async function WildRiftProductPage({ params }: Props) {
  const { slug } = await params;
  return <WildRiftProductClient slug={slug} />;
}
