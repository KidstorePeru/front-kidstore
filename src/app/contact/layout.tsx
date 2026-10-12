import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto — KidStore",
  description: "Escríbenos por WhatsApp, Discord, Instagram, Facebook o TikTok. Atención de lunes a domingo.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
