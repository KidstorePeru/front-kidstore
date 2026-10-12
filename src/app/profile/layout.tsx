import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi cuenta — KidStore",
  description: "Tu perfil, pedidos y lista de deseos en KidStore.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
