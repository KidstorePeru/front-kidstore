import RobloxProductClient from "@/components/game/RobloxProductClient";
import { ALL_ROBLOX_PRODUCTS } from "@/data/roblox";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_ROBLOX_PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = ALL_ROBLOX_PRODUCTS.find(p => p.slug === slug);
  return {
    title: product ? `${product.name} — Roblox — KidStore` : "Roblox — KidStore",
    description: product
      ? `Compra ${product.name} para Roblox al mejor precio.`
      : "Robux al mejor precio.",
  };
}

export default async function RobloxProductPage({ params }: Props) {
  const { slug } = await params;
  return <RobloxProductClient slug={slug} />;
}
