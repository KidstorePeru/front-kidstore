// src/data/roblox.ts

export type RobloxProductType = "cuenta" | "grupo" | "gamepass" | "plus";

export interface RobloxProduct {
  id:             string;
  slug:           string;
  name:           string;
  nameEN:         string;
  robux:          number;
  /** Solo para productType "plus": Robux mensuales del plan (0 = Plus base). */
  plusTier?:      number;
  badge:          string;
  img:            string;
  description:    string;
  descriptionEN:  string;
  price:          number;
  priceOld:       number;
  format:         string;
  region:         string;
  tab:            string;
  tabLabel:       string;
  tabLabelEN:     string;
  productType:    RobloxProductType;
  deliveryTime?:  string;
  deliveryTimeEN?:string;
}

const IMG      = "/roblox/robux.png";
const DT_ES    = "10 min – 7 horas";
const DT_EN    = "10 min – 7 hours";
const PLUS_DT_ES = "Activación en 10 min – 2 horas";
const PLUS_DT_EN = "Activation in 10 min – 2 hours";

// ── VÍA CUENTA — solo Robux (Roblox Plus tiene su propia pestaña) ──
export const VIA_CUENTA: RobloxProduct[] = [
  { id:"rc1", slug:"cuenta-80-robux",    name:"80 Robux",        nameEN:"80 Robux",        robux:80,    badge:"",            img:IMG,
    description:"Ideal para accesorios básicos o ítems del Avatar Shop.",
    descriptionEN:"Ideal for basic accessories or Avatar Shop items.",
    price:6.90,   priceOld:9.90,   format:"Digital", region:"Global", tab:"cuenta", tabLabel:"Vía Cuenta", tabLabelEN:"Via Account", productType:"cuenta", deliveryTime:DT_ES, deliveryTimeEN:DT_EN },
  { id:"rc2", slug:"cuenta-500-robux",   name:"400-500 Robux",   nameEN:"400-500 Robux",   robux:500,   badge:"",            img:IMG,
    description:"Recibes hasta 500 Robux. Ideal para skins y accesorios del Avatar Shop.",
    descriptionEN:"Get up to 500 Robux. Great for skins and Avatar Shop accessories.",
    price:18.90,  priceOld:24.90,  format:"Digital", region:"Global", tab:"cuenta", tabLabel:"Vía Cuenta", tabLabelEN:"Via Account", productType:"cuenta", deliveryTime:DT_ES, deliveryTimeEN:DT_EN },
  { id:"rc3", slug:"cuenta-1000-robux",  name:"800-1000 Robux",  nameEN:"800-1000 Robux",  robux:1000,  badge:"Popular",     img:IMG,
    description:"Recibes hasta 1.000 Robux. Buena cantidad para varias compras.",
    descriptionEN:"Get up to 1,000 Robux. A solid amount for multiple purchases.",
    price:37.90,  priceOld:49.90,  format:"Digital", region:"Global", tab:"cuenta", tabLabel:"Vía Cuenta", tabLabelEN:"Via Account", productType:"cuenta", deliveryTime:DT_ES, deliveryTimeEN:DT_EN },
  { id:"rc4", slug:"cuenta-2000-robux",  name:"1700-2000 Robux", nameEN:"1700-2000 Robux", robux:2000,  badge:"",            img:IMG,
    description:"Recibes hasta 2.000 Robux. Para varias skins o un ítem premium.",
    descriptionEN:"Get up to 2,000 Robux. For several skins or one premium item.",
    price:75.90,  priceOld:99.90,  format:"Digital", region:"Global", tab:"cuenta", tabLabel:"Vía Cuenta", tabLabelEN:"Via Account", productType:"cuenta", deliveryTime:DT_ES, deliveryTimeEN:DT_EN },
  { id:"rc5", slug:"cuenta-5000-robux",  name:"4500-5000 Robux", nameEN:"4500-5000 Robux", robux:5000,  badge:"Oferta",      img:IMG,
    description:"Recibes hasta 5.000 Robux. Para coleccionistas y compras grandes.",
    descriptionEN:"Get up to 5,000 Robux. For collectors and large purchases.",
    price:189.90, priceOld:249.90, format:"Digital", region:"Global", tab:"cuenta", tabLabel:"Vía Cuenta", tabLabelEN:"Via Account", productType:"cuenta", deliveryTime:DT_ES, deliveryTimeEN:DT_EN },
  { id:"rc6", slug:"cuenta-10000-robux", name:"10000 Robux",     nameEN:"10000 Robux",     robux:10000, badge:"Mejor valor", img:IMG,
    description:"Recibes 10.000 Robux. El paquete de mayor valor por Robux.",
    descriptionEN:"Get 10,000 Robux. The best value per Robux.",
    price:369.90, priceOld:489.90, format:"Digital", region:"Global", tab:"cuenta", tabLabel:"Vía Cuenta", tabLabelEN:"Via Account", productType:"cuenta", deliveryTime:DT_ES, deliveryTimeEN:DT_EN },
];

// ── ROBLOX PLUS — pestaña propia (suscripción Premium aplicada a tu cuenta) ──
export const ROBLOX_PLUS: RobloxProduct[] = [
  { id:"rp0", slug:"roblox-plus",      name:"Roblox Plus",             nameEN:"Roblox Plus",             robux:0, plusTier:0,    badge:"Nuevo",   img:IMG,
    description:"Suscripción Roblox Plus: 10 % de descuento en objetos, servidores privados gratis y envío de Robux gratis.",
    descriptionEN:"Roblox Plus subscription: 10% off items, free private servers and free Robux sending.",
    price:24.99, priceOld:32.99, format:"Digital", region:"Global", tab:"plus", tabLabel:"Roblox Plus", tabLabelEN:"Roblox Plus", productType:"plus", deliveryTime:PLUS_DT_ES, deliveryTimeEN:PLUS_DT_EN },
  { id:"rp1", slug:"roblox-plus-500",  name:"Roblox Plus + 500 Robux",  nameEN:"Roblox Plus + 500 Robux",  robux:0, plusTier:500,  badge:"",        img:IMG,
    description:"Todo lo de Roblox Plus más 500 Robux o más al mes.",
    descriptionEN:"Everything in Roblox Plus plus 500 Robux or more per month.",
    price:44.99, priceOld:58.99, format:"Digital", region:"Global", tab:"plus", tabLabel:"Roblox Plus", tabLabelEN:"Roblox Plus", productType:"plus", deliveryTime:PLUS_DT_ES, deliveryTimeEN:PLUS_DT_EN },
  { id:"rp2", slug:"roblox-plus-1000", name:"Roblox Plus + 1000 Robux", nameEN:"Roblox Plus + 1000 Robux", robux:0, plusTier:1000, badge:"Popular", img:IMG,
    description:"Todo lo de Roblox Plus más 1000 Robux o más al mes.",
    descriptionEN:"Everything in Roblox Plus plus 1000 Robux or more per month.",
    price:58.99, priceOld:76.99, format:"Digital", region:"Global", tab:"plus", tabLabel:"Roblox Plus", tabLabelEN:"Roblox Plus", productType:"plus", deliveryTime:PLUS_DT_ES, deliveryTimeEN:PLUS_DT_EN },
  { id:"rp3", slug:"roblox-plus-2000", name:"Roblox Plus + 2000 Robux", nameEN:"Roblox Plus + 2000 Robux", robux:0, plusTier:2000, badge:"",        img:IMG,
    description:"Todo lo de Roblox Plus más 2000 Robux o más al mes.",
    descriptionEN:"Everything in Roblox Plus plus 2000 Robux or more per month.",
    price:94.99, priceOld:123.99, format:"Digital", region:"Global", tab:"plus", tabLabel:"Roblox Plus", tabLabelEN:"Roblox Plus", productType:"plus", deliveryTime:PLUS_DT_ES, deliveryTimeEN:PLUS_DT_EN },
];

// ── Roblox Plus — contenido ────────────────────────────────────
export const PLUS_BASE_BENEFITS = {
  es: [
    "10 % de descuento en objetos dentro del juego, avatares y más",
    "Servidores privados gratis",
    "Enviar Robux gratis",
  ],
  en: [
    "10% off in-game items, avatars and more",
    "Free private servers",
    "Send Robux for free",
  ],
};

/** Beneficios cortos que se muestran en la tarjeta / cabecera del producto Plus. */
export function plusTierBenefits(tier: number, lang: "es" | "en"): string[] {
  if (!tier) return PLUS_BASE_BENEFITS[lang];
  return lang === "en"
    ? ["Everything in Plus", `${tier.toLocaleString()} Robux or more per month`]
    : ["Todo en Plus", `${tier.toLocaleString()} Robux o más al mes`];
}

export const PLUS_WHY_JOIN = {
  es: [
    { title: "10 % de descuento en objetos dentro del juego, avatares y más", desc: "Obtén más con tus Robux, a partir de ahora" },
    { title: "20 % de descuento en estos artículos después de 2 meses",       desc: "Duplica tu descuento y asegúralo" },
    { title: "Servidores privados gratuitos e ilimitados",                    desc: "Elige con quién juegas" },
    { title: "Enviar Robux gratis",                                           desc: "Es posible que requiera aprobación parental" },
    { title: "Intercambia y revende objetos limitados",                       desc: "Crea tu colección de avatares raros" },
    { title: "Publica juegos y objetos de avatar",                            desc: "Llega a millones de jugadores en el Mercado" },
  ],
  en: [
    { title: "10% off in-game items, avatars and more", desc: "Get more from your Robux, starting now" },
    { title: "20% off these items after 2 months",      desc: "Double your discount and lock it in" },
    { title: "Free unlimited private servers",          desc: "Choose who you play with" },
    { title: "Send Robux for free",                     desc: "May require parental approval" },
    { title: "Trade and resell limited items",          desc: "Build your collection of rare avatars" },
    { title: "Publish games and avatar items",          desc: "Reach millions of players on the Marketplace" },
  ],
};

// ── VÍA GRUPO ──────────────────────────────────────────────────
export const GRUPOS = {
  grupo1: { name:"meunghi", url:"https://www.roblox.com/es/communities/16519134/meunghi#!/about" },
  grupo2: { name:"m00shi",  url:"https://www.roblox.com/es/communities/16164042/m00shi#!/about" },
  grupo3: { name:"mimbu",   url:"https://www.roblox.com/es/communities/684765714/mimbu#!/about" },
};

/** Precio por cada 1.000 Robux comprados vía grupo. */
export const GRUPO_PRICE_PER_1000 = 26.99;

export const VIA_GRUPO: RobloxProduct[] = [
  { id:"rg1", slug:"grupo-1000-robux", name:"1.000 Robux", nameEN:"1,000 Robux", robux:1000, badge:"", img:IMG,
    description:"Robux vía grupo. Requiere mínimo 14 días en el grupo antes de comprar.",
    descriptionEN:"Robux via group. Requires a minimum of 14 days in the group before purchasing.",
    price:26.99, priceOld:34.90, format:"Digital", region:"Global", tab:"grupo", tabLabel:"Vía Grupo", tabLabelEN:"Via Group", productType:"grupo",
    deliveryTime:"Inmediato (cumpliendo 14 días)", deliveryTimeEN:"Immediate (with 14-day requirement met)" },
];

// ── GAME PASS (pestaña oculta desde config/visibility.ts — código intacto) ──
export const GAMEPASS_PRICE_PER_1000 = 26.99;
export const GAMEPASS_MIN_ROBUX      = 1000;
export const GAMEPASS_TAX_RATE       = 0.30;
export const GAMEPASS_STEP           = 10;

export function calcGamePassPrice(robux: number): number {
  return Math.ceil((robux / 1000) * GAMEPASS_PRICE_PER_1000 * 100) / 100;
}

export function calcRobuxAfterTax(robux: number): number {
  return Math.floor(robux * (1 - GAMEPASS_TAX_RATE));
}

export const ALL_ROBLOX_PRODUCTS: RobloxProduct[] = [...VIA_CUENTA, ...ROBLOX_PLUS, ...VIA_GRUPO];
