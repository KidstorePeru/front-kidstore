// src/data/rocketleague.ts

export type RLProductType = "creditos" | "paquete";

export interface RocketLeagueProduct {
  id:            string;
  slug:          string;
  name:          string;
  nameEN:        string;
  amount?:       string;
  amountEN?:     string;
  subtitle?:     string;
  subtitleEN?:   string;
  badge:         string;
  img:           string;
  description:   string;
  descriptionEN: string;
  price:         number;
  priceOld:      number;
  format:        string;
  region:        string;
  needsTurkey:   boolean;
  tab:           string;
  tabLabel:      string;
  tabLabelEN:    string;
  productType:   RLProductType;
}

export interface BulkPrice {
  credits: number;
  price:   number;
  priceOld: number;
}

export const CREDITOS: RocketLeagueProduct[] = [
  {
    id: "rl1", slug: "creditos-500",
    name: "500 RL Créditos", nameEN: "500 RL Credits",
    amount: "500 Créditos", amountEN: "500 Credits",
    priceOld: 14.99, price: 11.90, badge: "",
    img: "/rocket-league/500credits.jpg",
    description: "Cantidad ideal para comprar un ítem del catálogo o accesorios básicos.",
    descriptionEN: "Ideal amount to buy a catalog item or basic accessories.",
    format: "Digital", region: "Turquía", needsTurkey: true,
    tab: "creditos", tabLabel: "Créditos", tabLabelEN: "Credits",
    productType: "creditos",
  },
  {
    id: "rl2", slug: "creditos-1100",
    name: "1.100 RL Créditos", nameEN: "1,100 RL Credits",
    amount: "1.100 Créditos", amountEN: "1,100 Credits",
    priceOld: 28.99, price: 23.90, badge: "Popular",
    img: "/rocket-league/1100credits.jpg",
    description: "El paquete más popular. Alcanza para un coche o decal de calidad media.",
    descriptionEN: "The most popular package. Enough for a mid-quality car or decal.",
    format: "Digital", region: "Turquía", needsTurkey: true,
    tab: "creditos", tabLabel: "Créditos", tabLabelEN: "Credits",
    productType: "creditos",
  },
  {
    id: "rl3", slug: "creditos-3000",
    name: "3.000 RL Créditos", nameEN: "3,000 RL Credits",
    amount: "3.000 Créditos", amountEN: "3,000 Credits",
    priceOld: 72.99, price: 55.90, badge: "Oferta",
    img: "/rocket-league/3000credtis.jpg",
    description: "Perfecto para comprar varios ítems o un coche legendario.",
    descriptionEN: "Perfect for buying multiple items or a legendary car.",
    format: "Digital", region: "Turquía", needsTurkey: true,
    tab: "creditos", tabLabel: "Créditos", tabLabelEN: "Credits",
    productType: "creditos",
  },
  {
    id: "rl4", slug: "creditos-6500",
    name: "6.500 RL Créditos", nameEN: "6,500 RL Credits",
    amount: "6.500 Créditos", amountEN: "6,500 Credits",
    priceOld: 142.99, price: 109.90, badge: "Mejor valor",
    img: "/rocket-league/6500credits.jpg",
    description: "El mejor precio por crédito. Para coleccionistas y jugadores frecuentes.",
    descriptionEN: "Best price per credit. For collectors and frequent players.",
    format: "Digital", region: "Turquía", needsTurkey: true,
    tab: "creditos", tabLabel: "Créditos", tabLabelEN: "Credits",
    productType: "creditos",
  },
];

// Bulk pricing table — used in the bulk selector component
export const BULK_PRICES: BulkPrice[] = [
  { credits: 50,   priceOld: 1.49,   price: 1.90  },
  { credits: 100,  priceOld: 2.97,   price: 2.90  },
  { credits: 150,  priceOld: 4.48,   price: 3.90  },
  { credits: 200,  priceOld: 5.98,   price: 4.90  },
  { credits: 250,  priceOld: 7.48,   price: 5.90  },
  { credits: 300,  priceOld: 8.98,   price: 7.90  },
  { credits: 350,  priceOld: 10.48,  price: 8.90  },
  { credits: 400,  priceOld: 11.99,  price: 9.90  },
  { credits: 450,  priceOld: 13.49,  price: 10.90 },
  { credits: 600,  priceOld: 17.79,  price: 13.90 },
  { credits: 700,  priceOld: 19.19,  price: 15.90 },
  { credits: 800,  priceOld: 21.99,  price: 17.90 },
  { credits: 900,  priceOld: 24.79,  price: 19.90 },
  { credits: 1000, priceOld: 26.19,  price: 20.90 },
  { credits: 1200, priceOld: 32.97,  price: 23.90 },
  { credits: 1400, priceOld: 38.95,  price: 23.90 },
  { credits: 1600, priceOld: 44.92,  price: 23.90 },
  { credits: 1800, priceOld: 52.89,  price: 23.90 },
  { credits: 2000, priceOld: 58.86,  price: 23.90 },
  { credits: 2100, priceOld: 60.85,  price: 23.90 },
  { credits: 2300, priceOld: 66.83,  price: 23.90 },
  { credits: 2400, priceOld: 70.81,  price: 23.90 },
  { credits: 2500, priceOld: 72.80,  price: 23.90 },
  { credits: 2800, priceOld: 80.76,  price: 23.90 },
  { credits: 2900, priceOld: 84.75,  price: 23.90 },
  { credits: 2950, priceOld: 86.74,  price: 23.90 },
  { credits: 3200, priceOld: 92.41,  price: 25.90 },
  { credits: 3500, priceOld: 99.77,  price: 33.90 },
  { credits: 3800, priceOld: 107.12, price: 41.90 },
  { credits: 3900, priceOld: 108.96, price: 43.90 },
];

export const PAQUETES: RocketLeagueProduct[] = [];

export const ALL_ROCKET_LEAGUE_PRODUCTS: RocketLeagueProduct[] = [...CREDITOS, ...PAQUETES];
