import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas frecuentes — KidStore",
  description: "Resolvemos tus dudas sobre entregas, métodos de pago, seguridad y reembolsos de tus recargas de juegos.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
