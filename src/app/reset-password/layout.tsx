import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nueva contraseña — KidStore",
  description: "Crea una nueva contraseña para tu cuenta de KidStore.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
