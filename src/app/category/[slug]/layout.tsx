import type { Metadata } from "next";
import { categories } from "@/data/categories";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return { title: "Categoría — KidStore" };
  return {
    title: `${cat.name} — KidStore`,
    description: `Recargas de juegos ${cat.name} al mejor precio en Perú. Entrega rápida y pago seguro.`,
  };
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default function CategoryLayout({ children }: Props) {
  return children;
}
