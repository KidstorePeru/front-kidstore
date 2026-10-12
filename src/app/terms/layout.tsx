import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones — KidStore",
  description: "Condiciones de uso y de compra de KidStore.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
