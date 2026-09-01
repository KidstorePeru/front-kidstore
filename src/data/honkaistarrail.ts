// src/data/honkaistarrail.ts

export type HSRProductType = "esquirla" | "pase";

export interface HSRProduct {
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
  productType:   HSRProductType;
  /** Doble por primera recarga (mismo importe que el paquete). */
  bonus?:        string;
  bonusEN?:      string;
  /** Bonus que se recibe en CADA compra después de la primera recarga doble. */
  recurringBonus?:   string;
  recurringBonusEN?: string;
}

// Método: ACCESO A CUENTA (usuario/correo + Trailblazer + servidor). La
// contraseña se coordina por WhatsApp — nunca se pide en la web.
export const ESQUIRLAS: HSRProduct[] = [
  { id:"hsr1", name:"60 Esquirlas Oníricas",    nameEN:"60 Oneiric Shards",    amount:"60 + 60 (primera recarga)",       amountEN:"60 + 60 (first recharge)",       priceOld:4.50,   price:3.50,   badge:"",            img:"/honkai-star-rail/esquirla-onirica-60.png",    description:"Para un intento en el Warp o acumular Jades Estelares.",                       descriptionEN:"For one Warp pull or to accumulate Stellar Jade.",                             slug:"esquirla-60",    format:"Digital", region:"Global", tab:"esquirla", tabLabel:"Esquirla Onírica", tabLabelEN:"Oneiric Shard", productType:"esquirla", bonus:"60 extra en primera recarga",     bonusEN:"60 extra on first recharge"     },
  { id:"hsr2", name:"300 Esquirlas Oníricas",   nameEN:"300 Oneiric Shards",   amount:"300 + 300 (primera recarga)",     amountEN:"300 + 300 (first recharge)",     priceOld:22.99,  price:17.99,  badge:"Popular",     img:"/honkai-star-rail/esquirla-onirica-300.png",   description:"Para hacer varios intentos Warp y conseguir personajes 4★.",                    descriptionEN:"For several Warp pulls and obtaining 4★ characters.",                          slug:"esquirla-300",   format:"Digital", region:"Global", tab:"esquirla", tabLabel:"Esquirla Onírica", tabLabelEN:"Oneiric Shard", productType:"esquirla", bonus:"300 extra en primera recarga",    bonusEN:"300 extra on first recharge",    recurringBonus:"+30 en cada recarga",   recurringBonusEN:"+30 on every recharge"   },
  { id:"hsr3", name:"980 Esquirlas Oníricas",   nameEN:"980 Oneiric Shards",   amount:"980 + 980 (primera recarga)",     amountEN:"980 + 980 (first recharge)",     priceOld:62.99,  price:48.99,  badge:"Oferta",      img:"/honkai-star-rail/esquirla-onirica-980.png",   description:"Paquete más popular. Más de 6 intentos Warp garantizados.",                     descriptionEN:"Most popular package. Over 6 guaranteed Warp pulls.",                          slug:"esquirla-980",   format:"Digital", region:"Global", tab:"esquirla", tabLabel:"Esquirla Onírica", tabLabelEN:"Oneiric Shard", productType:"esquirla", bonus:"980 extra en primera recarga",    bonusEN:"980 extra on first recharge",    recurringBonus:"+110 en cada recarga",  recurringBonusEN:"+110 on every recharge"  },
  { id:"hsr4", name:"1.980 Esquirlas Oníricas", nameEN:"1,980 Oneiric Shards", amount:"1.980 + 1.980 (primera recarga)", amountEN:"1,980 + 1,980 (first recharge)", priceOld:121.99, price:94.99,  badge:"",            img:"/honkai-star-rail/esquirla-onirica-1980.png",  description:"Gran cantidad para múltiples intentos y conseguir personajes 5★.",              descriptionEN:"Large amount for multiple pulls and obtaining 5★ characters.",                  slug:"esquirla-1980",  format:"Digital", region:"Global", tab:"esquirla", tabLabel:"Esquirla Onírica", tabLabelEN:"Oneiric Shard", productType:"esquirla", bonus:"1.980 extra en primera recarga",  bonusEN:"1,980 extra on first recharge",  recurringBonus:"+260 en cada recarga",  recurringBonusEN:"+260 on every recharge"  },
  { id:"hsr5", name:"3.280 Esquirlas Oníricas", nameEN:"3,280 Oneiric Shards", amount:"3.280 + 3.280 (primera recarga)", amountEN:"3,280 + 3,280 (first recharge)", priceOld:199.99, price:158.99, badge:"",            img:"/honkai-star-rail/esquirla-onirica-3280.png",  description:"Para jugadores avanzados que buscan personajes 5★ específicos.",                descriptionEN:"For advanced players seeking specific 5★ characters.",                         slug:"esquirla-3280",  format:"Digital", region:"Global", tab:"esquirla", tabLabel:"Esquirla Onírica", tabLabelEN:"Oneiric Shard", productType:"esquirla", bonus:"3.280 extra en primera recarga",  bonusEN:"3,280 extra on first recharge",  recurringBonus:"+600 en cada recarga",  recurringBonusEN:"+600 on every recharge"  },
  { id:"hsr6", name:"6.480 Esquirlas Oníricas", nameEN:"6,480 Oneiric Shards", amount:"6.480 + 6.480 (primera recarga)", amountEN:"6,480 + 6,480 (first recharge)", priceOld:399.99, price:318.99, badge:"Mejor valor", img:"/honkai-star-rail/esquirla-onirica-6480.png",  description:"El mejor precio por Esquirla. Para coleccionistas y jugadores VIP.",            descriptionEN:"Best price per Shard. For collectors and VIP players.",                        slug:"esquirla-6480",  format:"Digital", region:"Global", tab:"esquirla", tabLabel:"Esquirla Onírica", tabLabelEN:"Oneiric Shard", productType:"esquirla", bonus:"6.480 extra en primera recarga",  bonusEN:"6,480 extra on first recharge",  recurringBonus:"+1.600 en cada recarga", recurringBonusEN:"+1,600 on every recharge" },
];

export const PASES: HSRProduct[] = [
  { id:"hsrp1", name:"Pase de Suministros del Expreso", nameEN:"Express Supply Pass", subtitle:"30 días · 300 Jades + 90 diarios", subtitleEN:"30 days · 300 Jade + 90 daily", priceOld:22.99, price:17.99, badge:"Popular", img:"/honkai-star-rail/pase-de-suministros-del-expresoo.png", description:"La suscripción más rentable de HSR. Recibe 300 Jades Estelares al activar y 90 adicionales cada día durante 30 días.", descriptionEN:"The most cost-effective HSR subscription. Receive 300 Stellar Jade on activation and 90 additional each day for 30 days.", slug:"pase-expreso", format:"Digital", region:"Global", tab:"pases", tabLabel:"Pase del Expreso", tabLabelEN:"Express Pass", productType:"pase" },
];

export const ALL_HSR_PRODUCTS: HSRProduct[] = [...ESQUIRLAS, ...PASES];
