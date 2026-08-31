// src/data/roblox.ts

export type RobloxProductType = "cuenta" | "grupo" | "gamepass";

export interface RobloxProduct {
  id:             string;
  slug:           string;
  name:           string;
  nameEN:         string;
  robux:          number;
  bonusRobux?:    number;
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

const IMG = "/roblox/robux.png";

export const VIA_CUENTA: RobloxProduct[] = [
  { id:"rc1", name:"80 Robux",      nameEN:"80 Robux",      robux:80,              priceOld:9.90,  price:6.90,  badge:"",           img:IMG, description:"Ideal para accesorios básicos o ítems del Avatar Shop.",                          descriptionEN:"Ideal for basic accessories or Avatar Shop items.",                          slug:"cuenta-80-robux",   format:"Digital", region:"Global", tab:"cuenta", tabLabel:"Vía Cuenta", tabLabelEN:"Via Account", productType:"cuenta", deliveryTime:"10 min – 7 horas", deliveryTimeEN:"10 min – 7 hours" },
  { id:"rc2", name:"400 Robux",     nameEN:"400 Robux",     robux:400, bonusRobux:500,  priceOld:24.90, price:18.90, badge:"Popular",    img:IMG, description:"Recibes 500 Robux con bonus. Para skins y accesorios.",                         descriptionEN:"Receive 500 Robux with bonus. For skins and accessories.",                   slug:"cuenta-400-robux",  format:"Digital", region:"Global", tab:"cuenta", tabLabel:"Vía Cuenta", tabLabelEN:"Via Account", productType:"cuenta", deliveryTime:"10 min – 7 horas", deliveryTimeEN:"10 min – 7 hours" },
  { id:"rc3", name:"800 Robux",     nameEN:"800 Robux",     robux:800, bonusRobux:1000, priceOld:49.90, price:37.90, badge:"Oferta",     img:IMG, description:"Recibes 1.000 Robux con bonus. Gran cantidad para múltiples compras.",           descriptionEN:"Receive 1,000 Robux with bonus. Large amount for multiple purchases.",       slug:"cuenta-800-robux",  format:"Digital", region:"Global", tab:"cuenta", tabLabel:"Vía Cuenta", tabLabelEN:"Via Account", productType:"cuenta", deliveryTime:"10 min – 7 horas", deliveryTimeEN:"10 min – 7 hours" },
  { id:"rc4", name:"1.700 Robux",   nameEN:"1,700 Robux",   robux:1700, bonusRobux:2000,priceOld:99.90, price:75.90, badge:"Mejor valor", img:IMG, description:"Recibes 2.000 Robux con bonus. El paquete de mayor valor.",                     descriptionEN:"Receive 2,000 Robux with bonus. The best value package.",                    slug:"cuenta-1700-robux", format:"Digital", region:"Global", tab:"cuenta", tabLabel:"Vía Cuenta", tabLabelEN:"Via Account", productType:"cuenta", deliveryTime:"10 min – 7 horas", deliveryTimeEN:"10 min – 7 hours" },
];

export const GRUPOS = {
  grupo1: { name:"Meunghi", url:"https://www.roblox.com/es/communities/16519134/meunghi#!/about" },
  grupo2: { name:"m00shi",  url:"https://www.roblox.com/es/communities/16164042/m00shi#!/about" },
};

export const VIA_GRUPO: RobloxProduct[] = [
  { id:"rg1", name:"1.000 Robux", nameEN:"1,000 Robux", robux:1000, priceOld:34.90, price:24.99, badge:"", img:IMG, description:"Robux vía grupo. Requiere mínimo 14 días en el grupo antes de comprar.", descriptionEN:"Robux via group. Requires a minimum of 14 days in the group before purchasing.", slug:"grupo-1000-robux", format:"Digital", region:"Global", tab:"grupo", tabLabel:"Vía Grupo", tabLabelEN:"Via Group", productType:"grupo", deliveryTime:"Inmediato (cumpliendo 14 días)", deliveryTimeEN:"Immediate (with 14-day requirement met)" },
];

export const GAMEPASS_PRICE_PER_1000 = 24.99;
export const GAMEPASS_MIN_ROBUX      = 1000;
export const GAMEPASS_TAX_RATE       = 0.30;
export const GAMEPASS_STEP           = 10;

export function calcGamePassPrice(robux: number): number {
  return Math.ceil((robux / 1000) * GAMEPASS_PRICE_PER_1000 * 100) / 100;
}

export function calcRobuxAfterTax(robux: number): number {
  return Math.floor(robux * (1 - GAMEPASS_TAX_RATE));
}

export const ALL_ROBLOX_PRODUCTS: RobloxProduct[] = [...VIA_CUENTA, ...VIA_GRUPO];