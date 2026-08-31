// src/data/genshinimpact.ts

export type GenshinProductType = "cristales" | "bendicion";

export interface GenshinProduct {
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
  productType:   GenshinProductType;
  bonus?:        string;
  bonusEN?:      string;
}

export const CRISTALES: GenshinProduct[] = [
  { id:"gc1", name:"60 Cristales de Génesis",    nameEN:"60 Genesis Crystals",    amount:"60 + 60 (primera compra)",       amountEN:"60 + 60 (first purchase)",       priceOld:5.90,   price:4.99,   badge:"",           img:"/genshin-impact/cristales-genesis-60.png",    description:"Ideal para hacer un intento en el Banner actual.",                                       descriptionEN:"Ideal for one pull on the current Banner.",                                        slug:"cristales-60",    format:"Digital", region:"Global", tab:"cristales", tabLabel:"Cristales de Génesis", tabLabelEN:"Genesis Crystals", productType:"cristales", bonus:"60 extra en primera compra",     bonusEN:"60 extra on first purchase"     },
  { id:"gc2", name:"300 Cristales de Génesis",   nameEN:"300 Genesis Crystals",   amount:"300 + 300 (primera compra)",     amountEN:"300 + 300 (first purchase)",     priceOld:17.90,  price:14.99,  badge:"Popular",    img:"/genshin-impact/cristales-genesis-300.png",   description:"Para convertir en Gemas del Destino y hacer varios intentos.",                           descriptionEN:"To convert into Intertwined Fate and make several pulls.",                         slug:"cristales-300",   format:"Digital", region:"Global", tab:"cristales", tabLabel:"Cristales de Génesis", tabLabelEN:"Genesis Crystals", productType:"cristales", bonus:"300 extra en primera compra",    bonusEN:"300 extra on first purchase"    },
  { id:"gc3", name:"980 Cristales de Génesis",   nameEN:"980 Genesis Crystals",   amount:"980 + 980 (primera compra)",     amountEN:"980 + 980 (first purchase)",     priceOld:54.90,  price:38.99,  badge:"Oferta",     img:"/genshin-impact/cristales-genesis-980.png",   description:"Paquete más popular. Equivale a más de 6 intentos garantizados.",                        descriptionEN:"Most popular package. Equivalent to over 6 guaranteed pulls.",                     slug:"cristales-980",   format:"Digital", region:"Global", tab:"cristales", tabLabel:"Cristales de Génesis", tabLabelEN:"Genesis Crystals", productType:"cristales", bonus:"980 extra en primera compra",    bonusEN:"980 extra on first purchase"    },
  { id:"gc4", name:"1.980 Cristales de Génesis", nameEN:"1,980 Genesis Crystals", amount:"1.980 + 1.980 (primera compra)", amountEN:"1,980 + 1,980 (first purchase)", priceOld:109.90, price:76.99,  badge:"",           img:"/genshin-impact/cristales-genesis-1980.png",  description:"Gran cantidad para múltiples intentos en el Banner de personajes.",                      descriptionEN:"Large amount for multiple pulls on the character Banner.",                         slug:"cristales-1980",  format:"Digital", region:"Global", tab:"cristales", tabLabel:"Cristales de Génesis", tabLabelEN:"Genesis Crystals", productType:"cristales", bonus:"1.980 extra en primera compra",  bonusEN:"1,980 extra on first purchase"  },
  { id:"gc5", name:"3.280 Cristales de Génesis", nameEN:"3,280 Genesis Crystals", amount:"3.280 + 3.280 (primera compra)", amountEN:"3,280 + 3,280 (first purchase)", priceOld:189.90, price:119.99, badge:"",           img:"/genshin-impact/cristales-genesis-3280.png",  description:"Para jugadores avanzados que quieren asegurar personajes 5★.",                           descriptionEN:"For advanced players who want to secure 5★ characters.",                          slug:"cristales-3280",  format:"Digital", region:"Global", tab:"cristales", tabLabel:"Cristales de Génesis", tabLabelEN:"Genesis Crystals", productType:"cristales", bonus:"3.280 extra en primera compra",  bonusEN:"3,280 extra on first purchase"  },
  { id:"gc6", name:"6.480 Cristales de Génesis", nameEN:"6,480 Genesis Crystals", amount:"6.480 + 6.480 (primera compra)", amountEN:"6,480 + 6,480 (first purchase)", priceOld:379.90, price:239.99, badge:"Mejor valor", img:"/genshin-impact/cristales-genesis-6480.png",  description:"El mejor precio por cristal. Para coleccionistas y jugadores VIP.",                      descriptionEN:"Best price per crystal. For collectors and VIP players.",                         slug:"cristales-6480",  format:"Digital", region:"Global", tab:"cristales", tabLabel:"Cristales de Génesis", tabLabelEN:"Genesis Crystals", productType:"cristales", bonus:"6.480 extra en primera compra",  bonusEN:"6,480 extra on first purchase"  },
];

export const BENDICION: GenshinProduct[] = [
  { id:"gb1", name:"Bendición de la Luna Welkin", nameEN:"Welkin Moon Blessing", subtitle:"90 días · 2.700 Gemas del Destino + 90 Primo diarios", subtitleEN:"90 days · 2,700 Intertwined Fate + 90 daily Primogems", priceOld:17.90, price:16.99, badge:"Popular", img:"/genshin-impact/bendicion-lunar.png", description:"La suscripción más rentable. Recibes 90 Primogemmas gratis cada día que inicies sesión, más 2.700 Gemas del Destino al activar.", descriptionEN:"The most cost-effective subscription. Receive 90 free Primogems every day you log in, plus 2,700 Intertwined Fate on activation.", slug:"bendicion-welkin", format:"Digital", region:"Global", tab:"bendicion", tabLabel:"Bendición Welkin", tabLabelEN:"Welkin Blessing", productType:"bendicion" },
];

export const ALL_GENSHIN_PRODUCTS: GenshinProduct[] = [...CRISTALES, ...BENDICION];