import WutheringWavesProductClient from "@/components/game/WutheringWavesProductClient";
import { ALL_WW_PRODUCTS } from "@/data/wutheringwaves";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_WW_PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = ALL_WW_PRODUCTS.find(p => p.slug === slug);
  return {
    title: product ? `${product.name} — Wuthering Waves — KidStore` : "Wuthering Waves — KidStore",
    description: product
      ? `Compra ${product.name} para Wuthering Waves al mejor precio. Vía UID o Cuenta.`
      : "Lunita para Wuthering Waves al mejor precio.",
  };
}

export default async function WutheringWavesProductPage({ params }: Props) {
  const { slug } = await params;
  return <WutheringWavesProductClient slug={slug} />;
}
