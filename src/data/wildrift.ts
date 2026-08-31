// src/data/wildrift.ts

export type WRProductType = "wild-cores" | "bundle";

export interface WildRiftProduct {
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
  tab:           string;
  tabLabel:      string;
  tabLabelEN:    string;
  productType:   WRProductType;
}

export const WILD_CORES: WildRiftProduct[] = [
  { id:"wc1", name:"425 Wild Cores",    nameEN:"425 Wild Cores",    priceOld:15.90,  price:14.99,  badge:"",           img:"/wildrift/425-wc.png",    description:"Ideal para desbloquear 1 skin básica o varios accesorios.",             descriptionEN:"Ideal for unlocking 1 basic skin or several accessories.",          slug:"wild-cores-425",   format:"Digital", region:"LAN / LAS", tab:"cores", tabLabel:"Wild Cores", tabLabelEN:"Wild Cores", productType:"wild-cores" },
  { id:"wc2", name:"1.000 Wild Cores",  nameEN:"1,000 Wild Cores",  priceOld:35.00,  price:27.99,  badge:"Popular",    img:"/wildrift/1000-wc.png",   description:"El paquete más popular. Alcanza para una skin de calidad media.",       descriptionEN:"The most popular package. Enough for a mid-quality skin.",          slug:"wild-cores-1000",  format:"Digital", region:"LAN / LAS", tab:"cores", tabLabel:"Wild Cores", tabLabelEN:"Wild Cores", productType:"wild-cores" },
  { id:"wc3", name:"1.850 Wild Cores",  nameEN:"1,850 Wild Cores",  priceOld:63.90,  price:47.99,  badge:"Oferta",     img:"/wildrift/1850-wc.png",   description:"Perfecto para skins épicas o varios cosméticos de temporada.",         descriptionEN:"Perfect for epic skins or several seasonal cosmetics.",             slug:"wild-cores-1850",  format:"Digital", region:"LAN / LAS", tab:"cores", tabLabel:"Wild Cores", tabLabelEN:"Wild Cores", productType:"wild-cores" },
  { id:"wc4", name:"3.275 Wild Cores",  nameEN:"3,275 Wild Cores",  priceOld:110.90, price:82.99,  badge:"",           img:"/wildrift/3275-wc.png",   description:"Para jugadores frecuentes que quieren varios skins de alto nivel.",    descriptionEN:"For frequent players who want several high-tier skins.",            slug:"wild-cores-3275",  format:"Digital", region:"LAN / LAS", tab:"cores", tabLabel:"Wild Cores", tabLabelEN:"Wild Cores", productType:"wild-cores" },
  { id:"wc5", name:"4.800 Wild Cores",  nameEN:"4,800 Wild Cores",  priceOld:159.90, price:112.99, badge:"",           img:"/wildrift/4800-wc.png",   description:"Gran cantidad de Wild Cores para múltiples compras en la tienda.",    descriptionEN:"Large amount of Wild Cores for multiple store purchases.",          slug:"wild-cores-4800",  format:"Digital", region:"LAN / LAS", tab:"cores", tabLabel:"Wild Cores", tabLabelEN:"Wild Cores", productType:"wild-cores" },
  { id:"wc6", name:"10.000 Wild Cores", nameEN:"10,000 Wild Cores", priceOld:314.90, price:219.99, badge:"Mejor valor", img:"/wildrift/10000-wc.png",  description:"El mejor precio por Wild Core. Para coleccionistas y jugadores VIP.", descriptionEN:"Best price per Wild Core. For collectors and VIP players.",         slug:"wild-cores-10000", format:"Digital", region:"LAN / LAS", tab:"cores", tabLabel:"Wild Cores", tabLabelEN:"Wild Cores", productType:"wild-cores" },
];

export const BUNDLES: WildRiftProduct[] = [
  { id:"wb1", name:"Regalo de Estelacornio", nameEN:"Starhorn Gift",    amount:"Paquete exclusivo", amountEN:"Exclusive bundle", priceOld:15.90,  price:14.90,  badge:"Popular", img:"/wildrift/regalo-de-estelacornio.png", description:"Paquete especial con skin, accesorios y Wild Cores exclusivos.",       descriptionEN:"Special bundle with exclusive skin, accessories and Wild Cores.",   slug:"regalo-estelacornio", format:"Digital", region:"LAN / LAS", tab:"bundles", tabLabel:"Paquetes", tabLabelEN:"Bundles", productType:"bundle" },
  { id:"wb2", name:"Bendición Celestial",    nameEN:"Celestial Blessing", amount:"Paquete premium",  amountEN:"Premium bundle",  priceOld:110.90, price:82.99,  badge:"",        img:"/wildrift/bendicion-celestial.png",    description:"Contenido celestial exclusivo con skin épica y cosméticos únicos.",   descriptionEN:"Exclusive celestial content with epic skin and unique cosmetics.",  slug:"bendicion-celestial", format:"Digital", region:"LAN / LAS", tab:"bundles", tabLabel:"Paquetes", tabLabelEN:"Bundles", productType:"bundle" },
];

export const ALL_WILDRIFT_PRODUCTS: WildRiftProduct[] = [...WILD_CORES, ...BUNDLES];