// src/data/tft.ts

export type TFTProductType = "tft-coins";

export interface TFTProduct {
  id:            string;
  slug:          string;
  name:          string;
  nameEN:        string;
  amount:        string;
  amountEN:      string;
  bonus:         string;
  bonusEN:       string;
  subtitle:      string;
  subtitleEN:    string;
  badge:         string;
  img:           string;
  description:   string;
  descriptionEN: string;
  price:         number;
  priceOld:      number;
  format:        string;
  region:        string;
  tab:           string;
  tabLabel:      string;
  tabLabelEN:    string;
  productType:   TFTProductType;
}

export const TFT_COINS: TFTProduct[] = [
  {
    id:"tft1", slug:"tft-coins-575",
    name:"575 TFT Coins",       nameEN:"575 TFT Coins",
    amount:"575 TFT Coins",     amountEN:"575 TFT Coins",
    bonus:"+0 adicionales",     bonusEN:"+0 additional",
    subtitle:"575 TFT Coins + 0 adicionales",    subtitleEN:"575 TFT Coins + 0 additional",
    badge:"", img:"/team-fight-tactics/575-tft-coins.png",
    description:"Paquete básico de TFT Coins para comprar Little Legends, tableros y cosméticos en Teamfight Tactics.",
    descriptionEN:"Basic TFT Coins package to buy Little Legends, boards, and cosmetics in Teamfight Tactics.",
    price:17.90, priceOld:20.90, format:"Digital", region:"Global",
    tab:"coins", tabLabel:"TFT Coins", tabLabelEN:"TFT Coins", productType:"tft-coins",
  },
  {
    id:"tft2", slug:"tft-coins-1380",
    name:"1.380 TFT Coins",     nameEN:"1,380 TFT Coins",
    amount:"1.275 TFT Coins",   amountEN:"1,275 TFT Coins",
    bonus:"+105 adicionales",   bonusEN:"+105 additional",
    subtitle:"1.275 TFT Coins + 105 TFT Coins adicionales",    subtitleEN:"1,275 TFT Coins + 105 additional TFT Coins",
    badge:"Popular", img:"/team-fight-tactics/1380-tft-coins.png",
    description:"Paquete popular con TFT Coins adicionales de bonificación. Ideal para Little Legends o tableros épicos.",
    descriptionEN:"Popular package with bonus TFT Coins. Ideal for Little Legends or epic boards.",
    price:33.90, priceOld:39.90, format:"Digital", region:"Global",
    tab:"coins", tabLabel:"TFT Coins", tabLabelEN:"TFT Coins", productType:"tft-coins",
  },
  {
    id:"tft3", slug:"tft-coins-2800",
    name:"2.800 TFT Coins",     nameEN:"2,800 TFT Coins",
    amount:"2.525 TFT Coins",   amountEN:"2,525 TFT Coins",
    bonus:"+275 adicionales",   bonusEN:"+275 additional",
    subtitle:"2.525 TFT Coins + 275 TFT Coins adicionales",    subtitleEN:"2,525 TFT Coins + 275 additional TFT Coins",
    badge:"Oferta", img:"/team-fight-tactics/2800-tft-coins.png",
    description:"Perfecto para desbloquear varios Little Legends o un tablero legendario.",
    descriptionEN:"Perfect for unlocking several Little Legends or a legendary board.",
    price:66.90, priceOld:79.90, format:"Digital", region:"Global",
    tab:"coins", tabLabel:"TFT Coins", tabLabelEN:"TFT Coins", productType:"tft-coins",
  },
  {
    id:"tft4", slug:"tft-coins-4500",
    name:"4.500 TFT Coins",     nameEN:"4,500 TFT Coins",
    amount:"4.025 TFT Coins",   amountEN:"4,025 TFT Coins",
    bonus:"+475 adicionales",   bonusEN:"+475 additional",
    subtitle:"4.025 TFT Coins + 475 TFT Coins adicionales",    subtitleEN:"4,025 TFT Coins + 475 additional TFT Coins",
    badge:"", img:"/team-fight-tactics/4500-tft-coins.png",
    description:"Gran paquete para coleccionistas que quieren múltiples cosméticos de TFT.",
    descriptionEN:"Large package for collectors who want multiple TFT cosmetics.",
    price:104.90, priceOld:124.90, format:"Digital", region:"Global",
    tab:"coins", tabLabel:"TFT Coins", tabLabelEN:"TFT Coins", productType:"tft-coins",
  },
  {
    id:"tft5", slug:"tft-coins-6500",
    name:"6.500 TFT Coins",     nameEN:"6,500 TFT Coins",
    amount:"5.750 TFT Coins",   amountEN:"5,750 TFT Coins",
    bonus:"+750 adicionales",   bonusEN:"+750 additional",
    subtitle:"5.750 TFT Coins + 750 TFT Coins adicionales",    subtitleEN:"5,750 TFT Coins + 750 additional TFT Coins",
    badge:"", img:"/team-fight-tactics/6500-tft-coins.png",
    description:"Para jugadores dedicados que quieren la mayor variedad de contenido cosmético.",
    descriptionEN:"For dedicated players who want the widest variety of cosmetic content.",
    price:145.90, priceOld:174.90, format:"Digital", region:"Global",
    tab:"coins", tabLabel:"TFT Coins", tabLabelEN:"TFT Coins", productType:"tft-coins",
  },
  {
    id:"tft6", slug:"tft-coins-13500",
    name:"13.500 TFT Coins",    nameEN:"13,500 TFT Coins",
    amount:"11.525 TFT Coins",  amountEN:"11,525 TFT Coins",
    bonus:"+1.975 adicionales", bonusEN:"+1,975 additional",
    subtitle:"11.525 TFT Coins + 1.975 TFT Coins adicionales", subtitleEN:"11,525 TFT Coins + 1,975 additional TFT Coins",
    badge:"Mejor valor", img:"/team-fight-tactics/13500-tft-coins.png",
    description:"El mejor precio por TFT Coin. Para coleccionistas VIP que quieren todo el contenido disponible.",
    descriptionEN:"Best price per TFT Coin. For VIP collectors who want all available content.",
    price:283.90, priceOld:339.90, format:"Digital", region:"Global",
    tab:"coins", tabLabel:"TFT Coins", tabLabelEN:"TFT Coins", productType:"tft-coins",
  },
];

export const ALL_TFT_PRODUCTS: TFTProduct[] = [...TFT_COINS];