import HomePageClient from "@/components/home/HomePageClient";

export const metadata = {
  title: "KidStore — Recarga tus juegos favoritos al mejor precio",
  description:
    "Recarga V-Bucks, Robux, Cristales Génesis, Wild Cores y más al mejor precio de Perú. " +
    "Entrega instantánea y pago 100% seguro.",
};

export default function HomePage() {
  return <HomePageClient />;
}
