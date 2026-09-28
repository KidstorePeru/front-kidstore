import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acceder al dev server desde otros dispositivos de la red local
  // (móvil, otra PC) sin el warning de "Cross origin request".
  allowedDevOrigins: ["192.168.1.11", "192.168.1.*"],
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