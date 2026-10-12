import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad — KidStore",
  description: "Cómo KidStore protege y usa tus datos personales.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
