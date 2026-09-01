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
  /** Doble por primera recarga (mismo importe que el paquete). */
  bonus?:        string;
  bonusEN?:      string;
  /** Bonus que se recibe en CADA compra después de la primera recarga doble. */
  recurringBonus?:   string;
  recurringBonusEN?: string;
}

// Método: ACCESO A CUENTA (usuario/correo + Agente + servidor). La contraseña
// se coordina por WhatsApp — nunca se pide en la web.
export const FOTOGRAMAS: ZZZProduct[] = [
  { id:"zzz1", name:"60 Fotogramas",    nameEN:"60 Monochrome",    amount:"60 + 60 (primera recarga)",       amountEN:"60 + 60 (first recharge)",       priceOld:4.50,   price:3.50,   badge:"",            img:"/zenless-zone-zero/fotograma-60.png",   description:"Para un intento en el Signal Search o acumular Polychromes.",                     descriptionEN:"For one pull in Signal Search or to accumulate Polychromes.",                   slug:"fotogramas-60",    format:"Digital", region:"Global", tab:"fotogramas", tabLabel:"Fotogramas", tabLabelEN:"Monochrome", productType:"fotogramas", bonus:"60 extra en primera recarga",     bonusEN:"60 extra on first recharge"     },
  { id:"zzz2", name:"300 Fotogramas",   nameEN:"300 Monochrome",   amount:"300 + 300 (primera recarga)",     amountEN:"300 + 300 (first recharge)",     priceOld:22.99,  price:17.99,  badge:"Popular",     img:"/zenless-zone-zero/fotograma-300.png",  description:"Para hacer varios intentos en el Signal Search de Agentes.",                      descriptionEN:"For several pulls in the Agent Signal Search.",                                 slug:"fotogramas-300",   format:"Digital", region:"Global", tab:"fotogramas", tabLabel:"Fotogramas", tabLabelEN:"Monochrome", productType:"fotogramas", bonus:"300 extra en primera recarga",    bonusEN:"300 extra on first recharge",    recurringBonus:"+30 en cada recarga",   recurringBonusEN:"+30 on every recharge"   },
  { id:"zzz3", name:"980 Fotogramas",   nameEN:"980 Monochrome",   amount:"980 + 980 (primera recarga)",     amountEN:"980 + 980 (first recharge)",     priceOld:62.99,  price:48.99,  badge:"Oferta",      img:"/zenless-zone-zero/fotograma-980.png",  description:"Paquete más popular. Más de 6 intentos garantizados en Signal Search.",           descriptionEN:"Most popular package. Over 6 guaranteed pulls in Signal Search.",               slug:"fotogramas-980",   format:"Digital", region:"Global", tab:"fotogramas", tabLabel:"Fotogramas", tabLabelEN:"Monochrome", productType:"fotogramas", bonus:"980 extra en primera recarga",    bonusEN:"980 extra on first recharge",    recurringBonus:"+110 en cada recarga",  recurringBonusEN:"+110 on every recharge"  },
  { id:"zzz4", name:"1.980 Fotogramas", nameEN:"1,980 Monochrome", amount:"1.980 + 1.980 (primera recarga)", amountEN:"1,980 + 1,980 (first recharge)", priceOld:121.99, price:94.99,  badge:"",            img:"/zenless-zone-zero/fotograma-1980.png", description:"Gran cantidad para múltiples intentos y conseguir Agentes S-Rank.",               descriptionEN:"Large amount for multiple pulls and obtaining S-Rank agents.",                  slug:"fotogramas-1980",  format:"Digital", region:"Global", tab:"fotogramas", tabLabel:"Fotogramas", tabLabelEN:"Monochrome", productType:"fotogramas", bonus:"1.980 extra en primera recarga",  bonusEN:"1,980 extra on first recharge",  recurringBonus:"+260 en cada recarga",  recurringBonusEN:"+260 on every recharge"  },
  { id:"zzz5", name:"3.280 Fotogramas", nameEN:"3,280 Monochrome", amount:"3.280 + 3.280 (primera recarga)", amountEN:"3,280 + 3,280 (first recharge)", priceOld:199.99, price:158.99, badge:"",            img:"/zenless-zone-zero/fotograma-3280.png", description:"Para jugadores avanzados que buscan Agentes S-Rank específicos.",                 descriptionEN:"For advanced players seeking specific S-Rank agents.",                          slug:"fotogramas-3280",  format:"Digital", region:"Global", tab:"fotogramas", tabLabel:"Fotogramas", tabLabelEN:"Monochrome", productType:"fotogramas", bonus:"3.280 extra en primera recarga",  bonusEN:"3,280 extra on first recharge",  recurringBonus:"+600 en cada recarga",  recurringBonusEN:"+600 on every recharge"  },
  { id:"zzz6", name:"6.480 Fotogramas", nameEN:"6,480 Monochrome", amount:"6.480 + 6.480 (primera recarga)", amountEN:"6,480 + 6,480 (first recharge)", priceOld:399.99, price:318.99, badge:"Mejor valor", img:"/zenless-zone-zero/fotograma-6480.png", description:"El mejor precio por Fotograma. Para coleccionistas y jugadores VIP.",             descriptionEN:"Best price per Monochrome. For collectors and VIP players.",                    slug:"fotogramas-6480",  format:"Digital", region:"Global", tab:"fotogramas", tabLabel:"Fotogramas", tabLabelEN:"Monochrome", productType:"fotogramas", bonus:"6.480 extra en primera recarga",  bonusEN:"6,480 extra on first recharge",  recurringBonus:"+1.600 en cada recarga", recurringBonusEN:"+1,600 on every recharge" },
];

export const PASES: ZZZProduct[] = [
  { id:"zzp1", name:"Inter-Knot Membership", nameEN:"Inter-Knot Membership", subtitle:"30 días · 300 Polychromes + 150 diarios", subtitleEN:"30 days · 300 Polychromes + 150 daily", priceOld:22.99, price:17.99, badge:"Popular", img:"/zenless-zone-zero/inter-knot-membership.png", description:"La suscripción más rentable de ZZZ. Recibes 300 Polychromes al activar y 150 adicionales cada día.", descriptionEN:"The most cost-effective ZZZ subscription. Receive 300 Polychromes on activation and 150 additional each day.", slug:"inter-knot-membership", format:"Digital", region:"Global", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"pase" },
];

export const ALL_ZZZ_PRODUCTS: ZZZProduct[] = [...FOTOGRAMAS, ...PASES];
