import ZenlessZoneZeroProductClient from "@/components/game/ZenlessZoneZeroProductClient";
import { ALL_ZZZ_PRODUCTS } from "@/data/zenlesszonezero";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_ZZZ_PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = ALL_ZZZ_PRODUCTS.find(p => p.slug === slug);
  return {
    title: product ? `${product.name} — Zenless Zone Zero — KidStore` : "Zenless Zone Zero — KidStore",
    description: product
      ? `Compra ${product.name} para Zenless Zone Zero al mejor precio. Entrega en 5-10 min.`
      : "Fotogramas para Zenless Zone Zero al mejor precio.",
  };
}

export default async function ZenlessZoneZeroProductPage({ params }: Props) {
  const { slug } = await params;
  return <ZenlessZoneZeroProductClient slug={slug} />;
}
