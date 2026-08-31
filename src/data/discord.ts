// src/data/discord.ts

export type DiscordProductType = "nitro" | "mejoras" | "tienda";
export type DiscordDeliveryMethod = "account" | "key";

export interface DiscordProduct {
  id:              string;
  slug:            string;
  name:            string;
  nameEN:          string;
  subtitle?:       string;
  subtitleEN?:     string;
  badge:           string;
  img:             string;
  description:     string;
  descriptionEN:   string;
  warning?:        string;
  warningEN?:      string;
  notice?:         string;
  noticeEN?:       string;
  price:           number;
  priceOld:        number;
  format:          string;
  region:          string;
  tab:             string;
  tabLabel:        string;
  tabLabelEN:      string;
  productType:     DiscordProductType;
  deliveryTime?:   string;
  deliveryTimeEN?: string;
  deliveryMethod:  DiscordDeliveryMethod;
  platform:        string;
  type:            string;
  typeEN:          string;
  activationTime:  string;
  activationTimeEN:string;
  needsBackupCodes?: boolean;
  isTrialProduct?:   boolean;
}

export const NITRO: DiscordProduct[] = [
  {
    id:"dn1", slug:"discord-nitro-boost-mensual",
    name:"Discord Nitro Boost Mensual",    nameEN:"Discord Nitro Boost Monthly",
    subtitle:"Suscripción mensual con acceso a todas las funciones premium", subtitleEN:"Monthly subscription with access to all premium features",
    badge:"Popular", img:"/discord/nitroboost1month.png",
    description:"Obtén Discord Nitro por 1 mes. Incluye emojis animados, avatar animado, mayor límite de carga de archivos, calidad de video mejorada y más.",
    descriptionEN:"Get Discord Nitro for 1 month. Includes animated emojis, animated avatar, higher file upload limit, improved video quality and more.",
    price:18.00, priceOld:23.99, format:"Digital", region:"Global",
    tab:"nitro", tabLabel:"Nitro", tabLabelEN:"Nitro",
    productType:"nitro", deliveryTime:"1h - 12h", deliveryTimeEN:"1h - 12h",
    deliveryMethod:"account", platform:"Discord Boost",
    type:"Suscripción mensual", typeEN:"Monthly subscription",
    activationTime:"1h - 12h", activationTimeEN:"1h - 12h",
    needsBackupCodes:true,
  },
  {
    id:"dn3", slug:"discord-nitro-boost-1-ano",
    name:"Discord Nitro Boost 1 Año",  nameEN:"Discord Nitro Boost 1 Year",
    subtitle:"Suscripción anual con acceso a todas las funciones premium", subtitleEN:"Annual subscription with access to all premium features",
    badge:"Mejor valor", img:"/discord/nitroboost1year.png",
    description:"Obtén Discord Nitro por 1 año completo. La opción más económica para disfrutar de todas las funciones premium sin interrupciones.",
    descriptionEN:"Get Discord Nitro for a full year. The most economical option to enjoy all premium features without interruptions.",
    price:160.00, priceOld:360.00, format:"Digital", region:"Global",
    tab:"nitro", tabLabel:"Nitro", tabLabelEN:"Nitro",
    productType:"nitro", deliveryTime:"1h - 12h", deliveryTimeEN:"1h - 12h",
    deliveryMethod:"account", platform:"Discord Boost",
    type:"Suscripción anual", typeEN:"Annual subscription",
    activationTime:"1h - 12h", activationTimeEN:"1h - 12h",
    needsBackupCodes:true,
  },
  {
    id:"dn2", slug:"discord-nitro-boost-3-meses",
    name:"Discord Nitro Boost 3 Meses", nameEN:"Discord Nitro Boost 3 Months",
    subtitle:"Versión de prueba — Solo para cuentas nuevas", subtitleEN:"Trial version — New accounts only",
    badge:"Oferta", img:"/discord/nitroboost3months.png",
    description:"Discord Nitro por 3 meses a precio especial. Disfruta de todas las funciones premium durante 3 meses completos.",
    descriptionEN:"Discord Nitro for 3 months at a special price. Enjoy all premium features for 3 full months.",
    price:9.99, priceOld:49.99, format:"Digital", region:"Global",
    tab:"nitro", tabLabel:"Nitro", tabLabelEN:"Nitro",
    productType:"nitro", deliveryTime:"1h - 12h", deliveryTimeEN:"1h - 12h",
    deliveryMethod:"key", platform:"Discord Boost",
    type:"Suscripción 3 meses (prueba)", typeEN:"3-month subscription (trial)",
    activationTime:"Inmediata tras recibir el código", activationTimeEN:"Immediate upon receiving the code",
    isTrialProduct:true,
  },
];

export const MEJORAS: DiscordProduct[] = [
  {
    id:"dm1", slug:"discord-mejoras-x14-1-mes",
    name:"Mejoras x14 — 1 Mes",  nameEN:"Boosts x14 — 1 Month",
    subtitle:"14 Server Boosts por 1 mes para tu servidor", subtitleEN:"14 Server Boosts for 1 month for your server",
    badge:"Popular", img:"/discord/mejorasx141month.png",
    description:"Impulsa tu servidor de Discord con 14 mejoras durante 1 mes. Desbloquea el nivel 3 del servidor con todas sus ventajas.",
    descriptionEN:"Boost your Discord server with 14 boosts for 1 month. Unlock server level 3 with all its perks.",
    price:29.90, priceOld:99.99, format:"Digital", region:"Global",
    tab:"mejoras", tabLabel:"Mejoras", tabLabelEN:"Boosts",
    productType:"mejoras", deliveryTime:"1h - 12h", deliveryTimeEN:"1h - 12h",
    deliveryMethod:"account", platform:"Discord",
    type:"Server Boost x14 — 1 mes", typeEN:"Server Boost x14 — 1 month",
    activationTime:"1h - 12h", activationTimeEN:"1h - 12h",
  },
  {
    id:"dm2", slug:"discord-mejoras-x14-3-meses",
    name:"Mejoras x14 — 3 Meses", nameEN:"Boosts x14 — 3 Months",
    subtitle:"14 Server Boosts por 3 meses para tu servidor", subtitleEN:"14 Server Boosts for 3 months for your server",
    badge:"Mejor valor", img:"/discord/mejorasx143months.png",
    description:"Impulsa tu servidor de Discord con 14 mejoras durante 3 meses. La mejor relación calidad-precio para mantener tu servidor en nivel 3.",
    descriptionEN:"Boost your Discord server with 14 boosts for 3 months. The best value for maintaining your server at level 3.",
    price:49.90, priceOld:199.99, format:"Digital", region:"Global",
    tab:"mejoras", tabLabel:"Mejoras", tabLabelEN:"Boosts",
    productType:"mejoras", deliveryTime:"1h - 12h", deliveryTimeEN:"1h - 12h",
    deliveryMethod:"account", platform:"Discord",
    type:"Server Boost x14 — 3 meses", typeEN:"Server Boost x14 — 3 months",
    activationTime:"1h - 12h", activationTimeEN:"1h - 12h",
  },
];

export const TIENDA: DiscordProduct[] = [];
export const ALL_DISCORD_PRODUCTS: DiscordProduct[] = [...NITRO, ...MEJORAS, ...TIENDA];