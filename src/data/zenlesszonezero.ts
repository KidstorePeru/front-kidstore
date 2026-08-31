// src/data/zenlesszonezero.ts

export type ZZZProductType = "fotogramas" | "pase";

export interface ZZZProduct {
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
  productType:   ZZZProductType;
  bonus?:        string;
  bonusEN?:      string;
}

export const FOTOGRAMAS: ZZZProduct[] = [
  { id:"zzz1", name:"60 Fotogramas",    nameEN:"60 Monochrome",    amount:"60 + 60 (primera compra)",       amountEN:"60 + 60 (first purchase)",       priceOld:5.90,   price:3.99,   badge:"",           img:"/zenless-zone-zero/fotograma-60.png",    description:"Para un intento en el Signal Search o acumular Polychromes.",                     descriptionEN:"For one pull in Signal Search or to accumulate Polychromes.",                   slug:"fotogramas-60",    format:"Digital", region:"Global", tab:"fotogramas", tabLabel:"Fotogramas", tabLabelEN:"Monochrome", productType:"fotogramas", bonus:"60 extra en primera compra",     bonusEN:"60 extra on first purchase"     },
  { id:"zzz2", name:"300 Fotogramas",   nameEN:"300 Monochrome",   amount:"300 + 300 (primera compra)",     amountEN:"300 + 300 (first purchase)",     priceOld:19.90,  price:14.99,  badge:"Popular",    img:"/zenless-zone-zero/fotograma-300.png",   description:"Para hacer varios intentos en el Signal Search de agentes.",                      descriptionEN:"For several pulls in the Agent Signal Search.",                                 slug:"fotogramas-300",   format:"Digital", region:"Global", tab:"fotogramas", tabLabel:"Fotogramas", tabLabelEN:"Monochrome", productType:"fotogramas", bonus:"300 extra en primera compra",    bonusEN:"300 extra on first purchase"    },
  { id:"zzz3", name:"980 Fotogramas",   nameEN:"980 Monochrome",   amount:"980 + 980 (primera compra)",     amountEN:"980 + 980 (first purchase)",     priceOld:59.90,  price:39.99,  badge:"Oferta",     img:"/zenless-zone-zero/fotograma-980.png",   description:"Paquete más popular. Más de 6 intentos garantizados en Signal Search.",           descriptionEN:"Most popular package. Over 6 guaranteed pulls in Signal Search.",               slug:"fotogramas-980",   format:"Digital", region:"Global", tab:"fotogramas", tabLabel:"Fotogramas", tabLabelEN:"Monochrome", productType:"fotogramas", bonus:"980 extra en primera compra",    bonusEN:"980 extra on first purchase"    },
  { id:"zzz4", name:"1.980 Fotogramas", nameEN:"1,980 Monochrome", amount:"1.980 + 1.980 (primera compra)", amountEN:"1,980 + 1,980 (first purchase)", priceOld:119.90, price:84.99,  badge:"",           img:"/zenless-zone-zero/fotograma-1980.png",  description:"Gran cantidad para múltiples intentos y conseguir agentes S-Rank.",               descriptionEN:"Large amount for multiple pulls and obtaining S-Rank agents.",                  slug:"fotogramas-1980",  format:"Digital", region:"Global", tab:"fotogramas", tabLabel:"Fotogramas", tabLabelEN:"Monochrome", productType:"fotogramas", bonus:"1.980 extra en primera compra",  bonusEN:"1,980 extra on first purchase"  },
  { id:"zzz5", name:"3.280 Fotogramas", nameEN:"3,280 Monochrome", amount:"3.280 + 3.280 (primera compra)", amountEN:"3,280 + 3,280 (first purchase)", priceOld:199.90, price:138.99, badge:"",           img:"/zenless-zone-zero/fotograma-3280.png",  description:"Para jugadores avanzados que buscan agentes S-Rank específicos.",                 descriptionEN:"For advanced players seeking specific S-Rank agents.",                          slug:"fotogramas-3280",  format:"Digital", region:"Global", tab:"fotogramas", tabLabel:"Fotogramas", tabLabelEN:"Monochrome", productType:"fotogramas", bonus:"3.280 extra en primera compra",  bonusEN:"3,280 extra on first purchase"  },
  { id:"zzz6", name:"6.480 Fotogramas", nameEN:"6,480 Monochrome", amount:"6.480 + 6.480 (primera compra)", amountEN:"6,480 + 6,480 (first purchase)", priceOld:399.90, price:269.99, badge:"Mejor valor", img:"/zenless-zone-zero/fotograma-6480.png",  description:"El mejor precio por Fotograma. Para coleccionistas y jugadores VIP.",             descriptionEN:"Best price per Monochrome. For collectors and VIP players.",                    slug:"fotogramas-6480",  format:"Digital", region:"Global", tab:"fotogramas", tabLabel:"Fotogramas", tabLabelEN:"Monochrome", productType:"fotogramas", bonus:"6.480 extra en primera compra",  bonusEN:"6,480 extra on first purchase"  },
];

export const PASES: ZZZProduct[] = [
  { id:"zzp1", name:"Inter-Knot Membership", nameEN:"Inter-Knot Membership", subtitle:"30 días · 300 Polychromes + 150 diarios", subtitleEN:"30 days · 300 Polychromes + 150 daily", priceOld:19.90, price:14.99, badge:"Popular", img:"/zenless-zone-zero/inter-knot-membership.png", description:"La suscripción más rentable de ZZZ. Recibes 300 Polychromes al activar y 150 adicionales cada día.", descriptionEN:"The most cost-effective ZZZ subscription. Receive 300 Polychromes on activation and 150 additional each day.", slug:"inter-knot-membership", format:"Digital", region:"Global", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"pase" },
];

export const ALL_ZZZ_PRODUCTS: ZZZProduct[] = [...FOTOGRAMAS, ...PASES];