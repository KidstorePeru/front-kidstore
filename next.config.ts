import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acceder al dev server desde otros dispositivos de la red local
  // (móvil, otra PC) sin el warning de "Cross origin request".
  allowedDevOrigins: ["192.168.1.11", "192.168.1.*"],
  // Productos que cambiaron de monto o nombre (oct 2026): los enlaces viejos siguen funcionando.
  async redirects() {
    return [
      ["fortnite/pavos-1000", "fortnite/pavos-800"], ["fortnite/pavos-2800", "fortnite/pavos-2400"],
      ["fortnite/pavos-5000", "fortnite/pavos-4500"], ["fortnite/pavos-13500", "fortnite/pavos-12500"],
      ["pokemon-go/pokecoins-1200", "pokemon-go/pokecoins-1300"], ["pokemon-go/pokecoins-2500", "pokemon-go/pokecoins-2700"],
      ["pokemon-go/pokecoins-5200", "pokemon-go/pokecoins-5600"], ["pokemon-go/pokecoins-14500", "pokemon-go/pokecoins-15500"],
      ["pokemon-go/pase-go-deluxe-julio-plus", "pokemon-go/pase-go-deluxe-plus"],
    ].map(([from, to]) => ({ source: `/games/${from}`, destination: `/games/${to}`, permanent: true }));
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "fortnite-api.com",
      },
      {
        // Portadas de las pistas de improvisación (cdn.fortnite-api.com) que llegan al carrito/checkout.
        protocol: "https",
        hostname: "**.fortnite-api.com",
      },
    ],
  },
};

export default nextConfig;