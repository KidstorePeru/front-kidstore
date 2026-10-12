// Datos de contacto y redes de KidStore: un solo sitio para cambiarlos en toda la web.
export const SITE_URL = "https://www.kidstoreperu.com";

/** WhatsApp de atención y pedidos (formato internacional, solo dígitos). */
export const WHATSAPP_NUMBER = "51983454837";
export const WHATSAPP_DISPLAY = "+51 983 454 837";

export const CONTACT_EMAIL = "contacto@kidstoreperu.com";

export const SOCIAL = {
  instagram: "https://www.instagram.com/kidstore.peru",
  tiktok:    "https://www.tiktok.com/@kidstore.peru",
  facebook:  "https://www.facebook.com/kidstore.gg",
  discord:   "https://discord.gg/KidStore",
} as const;

/** Enlace de WhatsApp con un mensaje ya escrito (opcional). */
export const whatsappLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
