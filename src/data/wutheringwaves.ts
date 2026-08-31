// src/data/wutheringwaves.ts

export type WWProductType = "lunita" | "pase";
export type WWMethod = "cuenta" | "uid";

export interface WWProduct {
  id:             string;
  slug:           string;
  name:           string;
  nameEN:         string;
  amount?:        string;
  amountEN?:      string;
  subtitle?:      string;
  subtitleEN?:    string;
  badge:          string;
  img:            string;
  description:    string;
  descriptionEN:  string;
  priceCuenta:    number;
  priceOldCuenta: number;
  priceUID:       number;
  priceOldUID:    number;
  format:         string;
  region:         string;
  tab:            string;
  tabLabel:       string;
  tabLabelEN:     string;
  productType:    WWProductType;
  bonus?:         string;
  bonusEN?:       string;
}

export const LUNITA: WWProduct[] = [
  { id:"ww1", name:"60 Lunita",     nameEN:"60 Lunite",     amount:"60 + 60 (primera compra)",       amountEN:"60 + 60 (first purchase)",       priceCuenta:4.99,   priceOldCuenta:5.99,   priceUID:4.99,    priceOldUID:5.99,   badge:"",           img:"/wuthering-waves/lunita-60.png",   description:"Para un intento en la Convocatoria o acumular Astrita.",                      descriptionEN:"For one Convene pull or to accumulate Astrite.",                            slug:"lunita-60",   format:"Digital", region:"Global", tab:"lunita", tabLabel:"Lunita", tabLabelEN:"Lunite", productType:"lunita", bonus:"60 extra en primera compra",     bonusEN:"60 extra on first purchase"     },
  { id:"ww2", name:"300 Lunita",    nameEN:"300 Lunite",    amount:"300 + 300 (primera compra)",     amountEN:"300 + 300 (first purchase)",     priceCuenta:18.90,  priceOldCuenta:22.90,  priceUID:19.99,   priceOldUID:22.90,  badge:"Popular",    img:"/wuthering-waves/lunita-300.png",  description:"Para hacer varios intentos de Convocatoria y conseguir resonadores.",        descriptionEN:"For several Convene pulls and obtaining Resonators.",                       slug:"lunita-300",  format:"Digital", region:"Global", tab:"lunita", tabLabel:"Lunita", tabLabelEN:"Lunite", productType:"lunita", bonus:"300 extra en primera compra",    bonusEN:"300 extra on first purchase"    },
  { id:"ww3", name:"980 Lunita",    nameEN:"980 Lunite",    amount:"980 + 980 (primera compra)",     amountEN:"980 + 980 (first purchase)",     priceCuenta:45.90,  priceOldCuenta:69.90,  priceUID:49.90,   priceOldUID:69.90,  badge:"Oferta",     img:"/wuthering-waves/lunita-980.png",  description:"Paquete más popular. Más de 6 intentos de Convocatoria garantizados.",       descriptionEN:"Most popular package. Over 6 guaranteed Convene pulls.",                    slug:"lunita-980",  format:"Digital", region:"Global", tab:"lunita", tabLabel:"Lunita", tabLabelEN:"Lunite", productType:"lunita", bonus:"980 extra en primera compra",    bonusEN:"980 extra on first purchase"    },
  { id:"ww4", name:"1.980 Lunita",  nameEN:"1,980 Lunite",  amount:"1.980 + 1.980 (primera compra)", amountEN:"1,980 + 1,980 (first purchase)", priceCuenta:89.90,  priceOldCuenta:129.90, priceUID:108.90,  priceOldUID:129.90, badge:"",           img:"/wuthering-waves/lunita-1980.png", description:"Gran cantidad para múltiples intentos y conseguir resonadores 5★.",          descriptionEN:"Large amount for multiple pulls and obtaining 5★ Resonators.",              slug:"lunita-1980", format:"Digital", region:"Global", tab:"lunita", tabLabel:"Lunita", tabLabelEN:"Lunite", productType:"lunita", bonus:"1.980 extra en primera compra",  bonusEN:"1,980 extra on first purchase"  },
  { id:"ww5", name:"3.280 Lunita",  nameEN:"3,280 Lunite",  amount:"3.280 + 3.280 (primera compra)", amountEN:"3,280 + 3,280 (first purchase)", priceCuenta:144.90, priceOldCuenta:229.90, priceUID:174.90,  priceOldUID:229.90, badge:"",           img:"/wuthering-waves/lunita-3280.png", description:"Para jugadores avanzados buscando resonadores 5★ específicos.",             descriptionEN:"For advanced players seeking specific 5★ Resonators.",                     slug:"lunita-3280", format:"Digital", region:"Global", tab:"lunita", tabLabel:"Lunita", tabLabelEN:"Lunite", productType:"lunita", bonus:"3.280 extra en primera compra",  bonusEN:"3,280 extra on first purchase"  },
  { id:"ww6", name:"6.480 Lunita",  nameEN:"6,480 Lunite",  amount:"6.480 + 6.480 (primera compra)", amountEN:"6,480 + 6,480 (first purchase)", priceCuenta:279.90, priceOldCuenta:449.90, priceUID:338.90,  priceOldUID:449.90, badge:"Mejor valor", img:"/wuthering-waves/lunita-6480.png", description:"El mejor precio por Lunita. Para coleccionistas y jugadores VIP.",           descriptionEN:"Best price per Lunite. For collectors and VIP players.",                   slug:"lunita-6480", format:"Digital", region:"Global", tab:"lunita", tabLabel:"Lunita", tabLabelEN:"Lunite", productType:"lunita", bonus:"6.480 extra en primera compra",  bonusEN:"6,480 extra on first purchase"  },
];

export const PASES: WWProduct[] = [
  { id:"wwp1", name:"Suscripción Mensual", nameEN:"Monthly Subscription", subtitle:"30 días · Lunita + Astrita diaria", subtitleEN:"30 days · Lunite + daily Astrite", priceCuenta:18.99, priceOldCuenta:22.90, priceUID:19.99, priceOldUID:22.90, badge:"Popular", img:"/wuthering-waves/suscripcion.lunita.png", description:"La suscripción más rentable de WW. Lunita al activar y Astrita diaria durante 30 días.", descriptionEN:"The most cost-effective WW subscription. Lunite on activation and daily Astrite for 30 days.", slug:"pase-mensual", format:"Digital", region:"Global", tab:"pases", tabLabel:"Pase Mensual", tabLabelEN:"Monthly Pass", productType:"pase" },
];

export const ALL_WW_PRODUCTS: WWProduct[] = [...LUNITA, ...PASES];

export const WW_PLATFORMS = [
  { id:"kuro",     label:"Kuro",     color:"#7B61FF" },
  { id:"email",    label:"Email",    color:"#6B7280" },
  { id:"facebook", label:"Facebook", color:"#1877F2" },
  { id:"gmail",    label:"Gmail",    color:"#EA4335" },
];