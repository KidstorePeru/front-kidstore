import FortniteProductClient from "@/components/game/FortniteProductClient";
import { ALL_FORTNITE_PRODUCTS } from "@/data/fortnite";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_FORTNITE_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = ALL_FORTNITE_PRODUCTS.find((p) => p.slug === slug);
  const name = product?.name ?? product?.amount ?? "Producto";
  return {
    title: `${name} — Fortnite — KidStore`,
    description: `Compra ${name} al mejor precio. Entrega instantánea y pago seguro.`,
  };
}

export default async function FortniteProductPage({ params }: Props) {
  const { slug } = await params;
  return <FortniteProductClient slug={slug} />;
}
