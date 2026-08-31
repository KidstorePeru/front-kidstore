import TFTProductClient from "@/components/game/TFTProductClient";
import { ALL_TFT_PRODUCTS } from "@/data/tft";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_TFT_PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = ALL_TFT_PRODUCTS.find(p => p.slug === slug);
  return {
    title: product
      ? `${product.name} — Teamfight Tactics — KidStore`
      : "Teamfight Tactics — KidStore",
    description: product
      ? `Compra ${product.name} para Teamfight Tactics al mejor precio. Servicio Global. Entrega en 5-10 minutos.`
      : "TFT Coins al mejor precio.",
  };
}

export default async function TFTProductPage({ params }: Props) {
  const { slug } = await params;
  return <TFTProductClient slug={slug} />;
}
