import type { Metadata } from "next";
import "./globals.css";

import { PreferencesProvider } from "@/context/PreferencesContext";
import { VisibilityProvider } from "@/context/VisibilityContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";
import { AuthModalProvider } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kidstoreperu.com"),
  title: "KidStore — Recarga tus juegos favoritos al mejor precio",
  description:
    "Recarga V-Bucks, Robux, Cristales Génesis, Wild Cores y más al mejor precio de Perú. " +
    "Entrega instantánea y pago 100% seguro con Yape, Plin, BCP, PayPal y Binance.",
  keywords: [
    "recarga juegos", "V-Bucks", "Robux", "Cristales Génesis", "Wild Rift",
    "Fortnite Perú", "recargas gaming", "KidStore", "gift cards Perú",
  ],
  applicationName: "KidStore",
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "KidStore",
    title: "KidStore — Recarga tus juegos favoritos al mejor precio",
    description:
      "Recargas de juegos con entrega instantánea y pago seguro. V-Bucks, Robux, Cristales Génesis y más.",
    url: "https://www.kidstoreperu.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "KidStore — Recarga tus juegos favoritos",
    description:
      "Recargas de juegos con entrega instantánea y pago seguro en Perú.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="light" suppressHydrationWarning>
      <body>
        <PreferencesProvider>
          <VisibilityProvider>
            <AuthProvider>
              <WishlistProvider>
                <CartProvider>
                  <AuthModalProvider>{children}</AuthModalProvider>
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </VisibilityProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
