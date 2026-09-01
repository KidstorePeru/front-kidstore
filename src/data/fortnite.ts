// src/data/fortnite.ts

export type ProductType = "pavos" | "paquete" | "club-turquia" | "club-xbox" | "battle-pass";

export interface ClubXboxOption {
  months:   number;
  label:    string;
  labelEN:  string;
  price:    number;
  priceOld: number;
  badge:    string;
}

export interface FortniteProduct {
  id:             string;
  slug:           string;
  name?:          string;
  nameEN?:        string;
  amount?:        string;
  amountEN?:      string;
  subtitle?:      string;
  subtitleEN?:    string;
  badge:          string;
  img:            string;
  description:    string;
  descriptionEN:  string;
  price:          number;
  priceOld:       number;
  format:         string;
  region:         string;
  needsTurkey:    boolean;
  referenceImg:   string;
  tab:            string;
  tabLabel:       string;
  tabLabelEN:     string;
  productType:    ProductType;
  monthOptions?:  ClubXboxOption[];
}

export const PAVOS: FortniteProduct[] = [
  { id:"vt1", amount:"1.000 V-Bucks",  amountEN:"1,000 V-Bucks",  priceOld:26.32, price:20.90, badge:"",           img:"/fortnite/vbucks-1000.png",   description:"Ideal para comprar 1 outfit básico o varios gestos en la tienda.",       descriptionEN:"Ideal for buying 1 basic outfit or several emotes in the store.",     slug:"pavos-1000",  format:"Digital", region:"Turquía", needsTurkey:true, referenceImg:"",  tab:"pavos", tabLabel:"Recarga de Pavos", tabLabelEN:"V-Bucks Recharge", productType:"pavos" },
  { id:"vt2", amount:"2.800 V-Bucks",  amountEN:"2,800 V-Bucks",  priceOld:63.92, price:52.90, badge:"Popular",    img:"/fortnite/vbucks-2800.png",   description:"El paquete más popular. Alcanza para outfits de temporada y accesorios.", descriptionEN:"The most popular package. Enough for seasonal outfits and accessories.", slug:"pavos-2800",  format:"Digital", region:"Turquía", needsTurkey:true, referenceImg:"",  tab:"pavos", tabLabel:"Recarga de Pavos", tabLabelEN:"V-Bucks Recharge", productType:"pavos" },
  { id:"vt3", amount:"5.000 V-Bucks",  amountEN:"5,000 V-Bucks",  priceOld:103.92,price:76.90, badge:"Oferta",     img:"/fortnite/vbucks-5000.png",   description:"Perfecto para el Pase de Batalla + varios cosméticos extra.",            descriptionEN:"Perfect for the Battle Pass + several extra cosmetics.",             slug:"pavos-5000",  format:"Digital", region:"Turquía", needsTurkey:true, referenceImg:"",  tab:"pavos", tabLabel:"Recarga de Pavos", tabLabelEN:"V-Bucks Recharge", productType:"pavos" },
  { id:"vt4", amount:"13.500 V-Bucks", amountEN:"13,500 V-Bucks", priceOld:263.92,price:179.90,badge:"Mejor valor", img:"/fortnite/vbucks-13500.png",  description:"El mejor precio por V-Buck. Para coleccionistas y jugadores frecuentes.", descriptionEN:"Best price per V-Buck. For collectors and frequent players.",         slug:"pavos-13500", format:"Digital", region:"Turquía", needsTurkey:true, referenceImg:"",  tab:"pavos", tabLabel:"Recarga de Pavos", tabLabelEN:"V-Bucks Recharge", productType:"pavos" },
];

export const PAQUETES: FortniteProduct[] = [
  { id:"pk5", name:"Paquete de Inicio Operación Brillante",  nameEN:"Operation Brite Starter Pack",  amount:"Outfit + Mochila + Lote de decoración (13 objetos)", amountEN:"Outfit + Back Bling + Decoration Pack (13 items)", priceOld:14.99, price:11.90, badge:"",                   img:"/fortnite/operation-brite.png",   description:"Acoge a Bombardera brillante. Incluye traje, accesorio mochilero y un lote de decoración con 13 objetos para LEGO® Fortnite.",                                                                     descriptionEN:"Welcome Bright Bomber. Includes outfit, back bling and a decoration pack with 13 items for LEGO® Fortnite.",                                                                          slug:"operation-brite-starter-pack",  format:"Digital", region:"Turquía", needsTurkey:true, referenceImg:"",  tab:"paquetes", tabLabel:"Paquetes", tabLabelEN:"Bundles", productType:"paquete" },
  { id:"pk6", name:"Pack de As",  nameEN:"Ace Pack",  amount:"Traje + Accesorio mochilero + 800 paVos", amountEN:"Outfit + Back Bling + 800 V-Bucks", priceOld:26.32, price:19.90, badge:"",                   img:"/fortnite/packdeas.webp",   description:"Estás en racha. Reparte las cartas, fija las apuestas y sal con la tuya. Incluye traje, accesorio mochilero y 800 paVos.",                                                                     descriptionEN:"You're on a roll. Deal the cards, set the stakes, and get your way. Includes outfit, back bling and 800 V-Bucks.",                                                                          slug:"ace-pack",  format:"Digital", region:"Turquía", needsTurkey:true, referenceImg:"",  tab:"paquetes", tabLabel:"Paquetes", tabLabelEN:"Bundles", productType:"paquete" },
  { id:"pk7", name:"Pack de Leyendas de menta",  nameEN:"Mint Legends Pack",  amount:"3 Trajes + 3 Mochilas + 3 Picos + Envoltorio + 1000 paVos", amountEN:"3 Outfits + 3 Back Blings + 3 Pickaxes + Wrap + 1000 V-Bucks", priceOld:83.04, price:59.90, badge:"",                   img:"/fortnite/paqueteminty.webp",   description:"Que la cosa siga fresca y a tope. Incluye 3 trajes, 3 accesorios mochileros, 3 picos, un envoltorio y 1000 paVos.",                                                                     descriptionEN:"Keep things cool and on top. Includes 3 outfits, 3 back blings, 3 pickaxes, a wrap and 1000 V-Bucks.",                                                                          slug:"mint-legends-pack",  format:"Digital", region:"Turquía", needsTurkey:true, referenceImg:"",  tab:"paquetes", tabLabel:"Paquetes", tabLabelEN:"Bundles", productType:"paquete" },
  { id:"pk8", name:"Paquete de Leyendas veraniegas",  nameEN:"Summer Legends Pack",  amount:"3 Trajes + 3 Mochilas", amountEN:"3 Outfits + 3 Back Blings", priceOld:56.68, price:41.90, badge:"",                   img:"/fortnite/paqueteverano.webp",   description:"Coge un cóctel, ponte crema y unas gafas de sol, porque es momento de relajarse. Incluye 3 trajes y 3 accesorios mochileros.",                                                                     descriptionEN:"Grab a cocktail, slather on the sunscreen and your sunglasses, because it's time to relax. Includes 3 outfits and 3 back blings.",                                                                          slug:"summer-legends-pack",  format:"Digital", region:"Turquía", needsTurkey:true, referenceImg:"",  tab:"paquetes", tabLabel:"Paquetes", tabLabelEN:"Bundles", productType:"paquete" },
];

export const CLUB: FortniteProduct[] = [
  { id:"c1", name:"Club de Fortnite", nameEN:"Fortnite Crew", subtitle:"Región Turquía", subtitleEN:"Turkey Region", priceOld:39.00, price:19.90, badge:"", img:"/fortnite/club.png", description:"Activación directa en tu cuenta Epic con región TRY.", descriptionEN:"Direct activation on your Epic account with TRY region.", slug:"club-turquia", format:"Digital", region:"Turquía", needsTurkey:true, referenceImg:"", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"club-turquia" },
  { id:"c2", name:"Club de Fortnite", nameEN:"Fortnite Crew", subtitle:"Activación Vía Xbox", subtitleEN:"Xbox Activation", priceOld:39.90, price:17.99, badge:"", img:"/fortnite/club.png", description:"Activación mensual a través de una cuenta Xbox vinculada a Epic Games.", descriptionEN:"Monthly activation through an Xbox account linked to Epic Games.", slug:"club-xbox", format:"Digital", region:"Global", needsTurkey:false, referenceImg:"", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"club-xbox",
    monthOptions:[
      { months:1, label:"1 Mes",   labelEN:"1 Month",   price:17.99, priceOld:39.90, badge:"" },
      { months:3, label:"3 Meses", labelEN:"3 Months",  price:39.99, priceOld:119.70, badge:"Popular" },
      { months:6, label:"6 Meses", labelEN:"6 Months",  price:59.99, priceOld:239.40, badge:"Mejor valor" },
    ],
  },
];

export const BATTLE_PASSES: FortniteProduct[] = [
  { id:"bp1", name:"Pase de Batalla", nameEN:"Battle Pass",    subtitle:"Temporada actual — 950 V-Bucks",     subtitleEN:"Current season — 950 V-Bucks",     priceOld:26.32, price:20.90, badge:"Popular", img:"/fortnite/battle-pass.jpg", description:"Más de 100 recompensas durante la temporada.",                                        descriptionEN:"Over 100 rewards throughout the season.",                                           slug:"pase-batalla", format:"Digital", region:"Global", needsTurkey:false, referenceImg:"", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"battle-pass" },
  { id:"bp2", name:"Pase OG",         nameEN:"OG Pass",        subtitle:"Fortnite OG — 950 V-Bucks",          subtitleEN:"Fortnite OG — 950 V-Bucks",          priceOld:26.32, price:20.90, badge:"",        img:"/fortnite/og-pass.jpg",     description:"Revive la época dorada de Fortnite con cosméticos del modo OG.",                       descriptionEN:"Relive the golden era of Fortnite with OG mode cosmetics.",                         slug:"pase-og",      format:"Digital", region:"Global", needsTurkey:false, referenceImg:"", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"battle-pass" },
  { id:"bp3", name:"Pase Musical",    nameEN:"Festival Pass",  subtitle:"Fortnite Festival — 950 V-Bucks",    subtitleEN:"Fortnite Festival — 950 V-Bucks",    priceOld:44.90, price:34.90, badge:"",        img:"/fortnite/music-pass.jpg",  description:"Desbloquea instrumentos, outfits y recompensas del modo Festival.",                    descriptionEN:"Unlock instruments, outfits and Festival mode rewards.",                            slug:"pase-musical", format:"Digital", region:"Global", needsTurkey:false, referenceImg:"", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"battle-pass" },
  { id:"bp4", name:"Pase de LEGO",    nameEN:"LEGO Pass",      subtitle:"LEGO Fortnite — 950 V-Bucks",        subtitleEN:"LEGO Fortnite — 950 V-Bucks",        priceOld:44.90, price:34.90, badge:"",        img:"/fortnite/lego-pass.jpg",   description:"Cosméticos exclusivos para el modo de construcción LEGO Fortnite.",                  descriptionEN:"Exclusive cosmetics for LEGO Fortnite building mode.",                              slug:"pase-lego",    format:"Digital", region:"Global", needsTurkey:false, referenceImg:"", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"battle-pass" },
];

export const ALL_FORTNITE_PRODUCTS: FortniteProduct[] = [...PAVOS, ...PAQUETES, ...CLUB, ...BATTLE_PASSES];
