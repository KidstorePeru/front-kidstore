// src/data/honorofkings.ts

export type HOKProductType = "token";

export interface HOKProduct {
  id:            string;
  slug:          string;
  name:          string;
  nameEN:        string;
  tokens:        number;
  bonus?:        number;
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
  productType:   HOKProductType;
}

export const TOKENS: HOKProduct[] = [
  { id:"hok1", name:"80 Tokens",     nameEN:"80 Tokens",     tokens:80,             priceOld:5.50,   price:4.99,   badge:"",           img:"/honor-of-kings/token-80.png",   description:"Para comprar skins básicas o accesorios del Salón del Héroe.",                 descriptionEN:"For buying basic skins or accessories from the Hall of Heroes.",            slug:"tokens-80",    format:"Digital", region:"Global", tab:"tokens", tabLabel:"Tokens", tabLabelEN:"Tokens", productType:"token" },
  { id:"hok2", name:"240 Tokens",    nameEN:"240 Tokens",    tokens:240,            priceOld:12.00,  price:11.99,  badge:"",           img:"/honor-of-kings/token-240.png",  description:"Ideal para skins de héroe de nivel medio o múltiples accesorios.",             descriptionEN:"Ideal for mid-tier hero skins or multiple accessories.",                    slug:"tokens-240",   format:"Digital", region:"Global", tab:"tokens", tabLabel:"Tokens", tabLabelEN:"Tokens", productType:"token" },
  { id:"hok3", name:"400 Tokens",    nameEN:"400 Tokens",    tokens:400,            priceOld:19.00,  price:19.00,  badge:"",           img:"/honor-of-kings/token-400.png",  description:"Para skins épicas o acumular para el siguiente evento especial.",              descriptionEN:"For epic skins or saving up for the next special event.",                   slug:"tokens-400",   format:"Digital", region:"Global", tab:"tokens", tabLabel:"Tokens", tabLabelEN:"Tokens", productType:"token" },
  { id:"hok4", name:"560 Tokens",    nameEN:"560 Tokens",    tokens:560,            priceOld:25.00,  price:25.00,  badge:"",           img:"/honor-of-kings/token-560.png",  description:"Perfecto para skins legendarias de tus héroes favoritos.",                    descriptionEN:"Perfect for legendary skins of your favorite heroes.",                      slug:"tokens-560",   format:"Digital", region:"Global", tab:"tokens", tabLabel:"Tokens", tabLabelEN:"Tokens", productType:"token" },
  { id:"hok5", name:"800 Tokens",    nameEN:"800 Tokens",    tokens:800,  bonus:30, priceOld:35.00,  price:35.00,  badge:"Popular",    img:"/honor-of-kings/token-800.png",  description:"El favorito de los jugadores. Incluye 30 Tokens de regalo extra.",            descriptionEN:"Players' favorite. Includes 30 bonus Tokens.",                             slug:"tokens-800",   format:"Digital", region:"Global", tab:"tokens", tabLabel:"Tokens", tabLabelEN:"Tokens", productType:"token" },
  { id:"hok6", name:"1.200 Tokens",  nameEN:"1,200 Tokens",  tokens:1200, bonus:45, priceOld:55.00,  price:55.00,  badge:"",           img:"/honor-of-kings/token-1200.png", description:"Gran cantidad con 45 Tokens de regalo. Para múltiples compras.",               descriptionEN:"Large amount with 45 bonus Tokens. For multiple purchases.",                slug:"tokens-1200",  format:"Digital", region:"Global", tab:"tokens", tabLabel:"Tokens", tabLabelEN:"Tokens", productType:"token" },
  { id:"hok7", name:"2.400 Tokens",  nameEN:"2,400 Tokens",  tokens:2400, bonus:108,priceOld:119.00, price:109.00, badge:"Oferta",     img:"/honor-of-kings/token-2400.png", description:"Incluye 108 Tokens adicionales. Ideal para eventos de temporada.",             descriptionEN:"Includes 108 additional Tokens. Ideal for seasonal events.",                slug:"tokens-2400",  format:"Digital", region:"Global", tab:"tokens", tabLabel:"Tokens", tabLabelEN:"Tokens", productType:"token" },
  { id:"hok8", name:"4.000 Tokens",  nameEN:"4,000 Tokens",  tokens:4000, bonus:180,priceOld:169.00, price:169.00, badge:"",           img:"/honor-of-kings/token-4000.png", description:"180 Tokens de regalo incluidos. Para jugadores de alto nivel.",               descriptionEN:"180 bonus Tokens included. For high-level players.",                       slug:"tokens-4000",  format:"Digital", region:"Global", tab:"tokens", tabLabel:"Tokens", tabLabelEN:"Tokens", productType:"token" },
  { id:"hok9", name:"8.000 Tokens",  nameEN:"8,000 Tokens",  tokens:8000, bonus:360,priceOld:339.00, price:335.00, badge:"Mejor valor", img:"/honor-of-kings/token-8000.png", description:"El mejor valor. 360 Tokens de regalo. Para coleccionistas y jugadores VIP.", descriptionEN:"Best value. 360 bonus Tokens. For collectors and VIP players.",             slug:"tokens-8000",  format:"Digital", region:"Global", tab:"tokens", tabLabel:"Tokens", tabLabelEN:"Tokens", productType:"token" },
];

export const ALL_HOK_PRODUCTS: HOKProduct[] = [...TOKENS];