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
  tab:            string;
  tabLabel:       string;
  tabLabelEN:     string;
  productType:    ProductType;
  monthOptions?:  ClubXboxOption[];
}

export const PAVOS: FortniteProduct[] = [
  { id:"vt1", amount:"800 V-Bucks",    amountEN:"800 V-Bucks",  priceOld:26.32, price:20.90, badge:"",           img:"/fortnite/vbucks-1000.png",   description:"Ideal para comprar 1 outfit básico o varios gestos en la tienda.",       descriptionEN:"Ideal for buying 1 basic outfit or several emotes in the store.",     slug:"pavos-800",   format:"Digital", region:"Global", needsTurkey:false, tab:"pavos", tabLabel:"Recarga de Pavos", tabLabelEN:"V-Bucks Recharge", productType:"pavos" },
  { id:"vt2", amount:"2.400 V-Bucks",  amountEN:"2,400 V-Bucks",  priceOld:63.92, price:52.90, badge:"Popular",    img:"/fortnite/vbucks-2800.png",   description:"El paquete más popular. Alcanza para outfits de temporada y accesorios.", descriptionEN:"The most popular package. Enough for seasonal outfits and accessories.", slug:"pavos-2400",  format:"Digital", region:"Global", needsTurkey:false, tab:"pavos", tabLabel:"Recarga de Pavos", tabLabelEN:"V-Bucks Recharge", productType:"pavos" },
  { id:"vt3", amount:"4.500 V-Bucks",  amountEN:"4,500 V-Bucks",  priceOld:103.92,price:76.90, badge:"Oferta",     img:"/fortnite/vbucks-5000.png",   description:"Perfecto para el Pase de Batalla + varios cosméticos extra.",            descriptionEN:"Perfect for the Battle Pass + several extra cosmetics.",             slug:"pavos-4500",  format:"Digital", region:"Global", needsTurkey:false, tab:"pavos", tabLabel:"Recarga de Pavos", tabLabelEN:"V-Bucks Recharge", productType:"pavos" },
  { id:"vt4", amount:"12.500 V-Bucks", amountEN:"12,500 V-Bucks", priceOld:263.92,price:179.90,badge:"Mejor valor", img:"/fortnite/vbucks-13500.png",  description:"El mejor precio por V-Buck. Para coleccionistas y jugadores frecuentes.", descriptionEN:"Best price per V-Buck. For collectors and frequent players.",         slug:"pavos-12500", format:"Digital", region:"Global", needsTurkey:false, tab:"pavos", tabLabel:"Recarga de Pavos", tabLabelEN:"V-Bucks Recharge", productType:"pavos" },
];

export const PAQUETES: FortniteProduct[] = [
  { id:"pk10", name:"Pack de Día del Juicio",  nameEN:"Final Reckoning Pack",  amount:"3 trajes LEGO® + 3 accesorios mochileros", amountEN:"3 LEGO® Outfits + 3 Back Blings", priceOld:47.75, price:37.90, badge:"Nuevo", img:"/fortnite/paquete-dia-del-juicio.webp", description:"Aterroriza a tus enemigos con los trajes de una de las leyendas más oscuras de la isla: ¡El Día del Juicio! Incluye el terrible traje de Catrina (con estilo de LEGO®) y el accesorio mochilero Luto lumbar; el espeluznante traje de Willow (con estilo de LEGO®) y el accesorio mochilero Muñequita; y el ominoso traje de Luz negra (con estilo de LEGO®) y el accesorio mochilero Alas índigo.", descriptionEN:"Terrify your enemies with the outfits of one of the island's darkest legends: the Final Reckoning! Includes the terrifying Catrina Outfit (with LEGO® Style) and the Mourning Glory Back Bling; the eerie Willow Outfit (with LEGO® Style) and the Dolly Back Bling; and the ominous Blacklight Outfit (with LEGO® Style) and the Indigo Wings Back Bling.", slug:"pack-dia-del-juicio",  format:"Digital", region:"Global", needsTurkey:false, tab:"paquetes", tabLabel:"Paquetes", tabLabelEN:"Bundles", productType:"paquete" },
  { id:"pk11", name:"Pack de Leyendas de Anime",  nameEN:"Anime Legends Pack",  amount:"3 trajes LEGO® + 3 mochilas + 3 picos + gesto", amountEN:"3 LEGO® Outfits + 3 Back Blings + 3 Pickaxes + Emote", priceOld:56.57, price:44.90, badge:"Nuevo", img:"/fortnite/paquete-leyendas-de-anime.webp", description:"Reinventa la realidad con Leyendas de anime. Prepárate para el próximo encuentro y reúne tu equipamiento: traje y estilo de Midas equipamiento dorado (con estilo LEGO®), accesorio mochilero Choque dorado y pico Katana de 24 quilates; traje de Rox Rebote (con estilo LEGO®), accesorio mochilero Baya giratoria y pico Filo de fuego; traje de Penny lista (con estilo LEGO®), accesorio mochilero Pequeña bolsa negra y pico Filo destellante; y el gesto Kartcito. Reactivo: ¡Toque dorado! Con el traje de Midas equipamiento dorado, se aplica un envoltorio dorado a cualquier arma equipada.", descriptionEN:"Reinvent reality with the Anime Legends. Get ready for the next encounter and gather your gear: the Golden Gear Midas Outfit and style (with LEGO® Style), the Golden Crash Back Bling and the 24 Karat Katana Pickaxe; the Ricochet Rox Outfit (with LEGO® Style), the Whirlberry Back Bling and the Blazeberry Blade Pickaxe; the Ready Penny Outfit (with LEGO® Style), the Little Black Bag Back Bling and the Glimmering Edge Pickaxe; and the Lil' Kart Emote. Reactive: Golden Touch! With the Golden Gear Midas Outfit, a golden wrap is applied to any equipped weapon.", slug:"pack-leyendas-de-anime",  format:"Digital", region:"Global", needsTurkey:false, tab:"paquetes", tabLabel:"Paquetes", tabLabelEN:"Bundles", productType:"paquete" },
  { id:"pk12", name:"Pack de Misiones de Conejita Momia",  nameEN:"Bunny Mummy Quest Pack",  amount:"Traje LEGO® + Mochila + Pico + Envoltorio + hasta 800 paVos", amountEN:"LEGO® Outfit + Back Bling + Pickaxe + Wrap + up to 800 V-Bucks", priceOld:26.33, price:20.90, badge:"Nuevo", img:"/fortnite/paquete-conejita-momia.webp", description:"Una conejita ha vuelto del más allá y viene con ganas de ajustar cuentas... Completa misiones para conseguir paVos con el pack de misiones de Conejita momia. Incluye el traje de Conejita embalsamada (con estilo LEGO®), el accesorio mochilero Conejita momia portátil, el pico Palo de selfi momificado, el envoltorio Conejita vendada y el lote de misiones de Conejita momia: ¡consigue hasta 800 paVos al completar las misiones correspondientes!", descriptionEN:"A bunny is back from the beyond and ready to settle the score... Complete quests to earn V-Bucks with the Bunny Mummy Quest Pack. Includes the Bunnybone Outfit (with LEGO® Style), the Bunnybone-To-Go Back Bling, the Mummified Selfie Stick Pickaxe, the Bandaged Bunny Wrap and the Bunny Mummy quest pack: earn up to 800 V-Bucks by completing the corresponding quests!", slug:"pack-misiones-conejita-momia",  format:"Digital", region:"Global", needsTurkey:false, tab:"paquetes", tabLabel:"Paquetes", tabLabelEN:"Bundles", productType:"paquete" },
  { id:"pk5", name:"Paquete de Inicio Operación Brillante",  nameEN:"Operation Brite Starter Pack",  amount:"Outfit + Mochila + Lote de decoración (13 objetos)", amountEN:"Outfit + Back Bling + Decoration Pack (13 items)", priceOld:14.99, price:11.90, badge:"",                   img:"/fortnite/operation-brite.png",   description:"Acoge a Bombardera brillante. Incluye traje, accesorio mochilero y un lote de decoración con 13 objetos para LEGO® Fortnite.",                                                                     descriptionEN:"Welcome Bright Bomber. Includes outfit, back bling and a decoration pack with 13 items for LEGO® Fortnite.",                                                                          slug:"operation-brite-starter-pack",  format:"Digital", region:"Global", needsTurkey:false, tab:"paquetes", tabLabel:"Paquetes", tabLabelEN:"Bundles", productType:"paquete" },
  { id:"pk9", name:"Paquete Ruptura de la computadora central",  nameEN:"Mainframe Break Pack",  amount:"Atuendo LEGO® + Mochila + Pico + Papel + 800 paVos", amountEN:"LEGO® Outfit + Back Bling + Pickaxe + Wrap + 800 V-Bucks", priceOld:26.32, price:20.90, badge:"",                   img:"/fortnite/paquete-ruptura-central.webp",   description:"Zoe Clash y Sargento Shiba están muy dispuestos a cambiar los protocolos a su favor. ¡Asegúrate de que estén en tu bando con el paquete Ruptura de la computadora central! Incluye 800 monedas V, el atuendo Zoe Clash (con estilo LEGO®), la mochila retro Sargento Shiba, el pico Bip y Bop y el papel Locura de calcomanía.",                                                                     descriptionEN:"Zoe Clash & Sgt. Shiba are more than willing to change the protocols in their favor. Make sure they are on your side with the Mainframe Break Pack! Includes 800 V-Bucks, the Zoe Clash Outfit (with LEGO® Style), the Sgt. Shiba Back Bling, the Beep & Boop Pickaxe and the Sticker 'Em Up Wrap.",                                                                          slug:"mainframe-break-pack",  format:"Digital", region:"Global", needsTurkey:false, tab:"paquetes", tabLabel:"Paquetes", tabLabelEN:"Bundles", productType:"paquete" },
];

export const CLUB: FortniteProduct[] = [
  { id:"c1", name:"Club de Fortnite", nameEN:"Fortnite Crew", subtitle:"Región Turquía", subtitleEN:"Turkey Region", priceOld:39.00, price:19.90, badge:"", img:"/fortnite/club.png", description:"Activación directa en tu cuenta Epic con región TRY.", descriptionEN:"Direct activation on your Epic account with TRY region.", slug:"club-turquia", format:"Digital", region:"Turquía", needsTurkey:true, tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"club-turquia" },
  { id:"c2", name:"Club de Fortnite", nameEN:"Fortnite Crew", subtitle:"Activación Vía Xbox", subtitleEN:"Xbox Activation", priceOld:39.90, price:19.90, badge:"", img:"/fortnite/club.png", description:"Activación mensual a través de una cuenta Xbox vinculada a Epic Games.", descriptionEN:"Monthly activation through an Xbox account linked to Epic Games.", slug:"club-xbox", format:"Digital", region:"Global", needsTurkey:false, tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"club-xbox",
    monthOptions:[
      { months:1, label:"1 Mes",   labelEN:"1 Month",   price:19.90, priceOld:39.90, badge:"" },
      { months:3, label:"3 Meses", labelEN:"3 Months",  price:39.99, priceOld:119.70, badge:"Popular" },
      { months:6, label:"6 Meses", labelEN:"6 Months",  price:59.99, priceOld:239.40, badge:"Mejor valor" },
    ],
  },
];

export const BATTLE_PASSES: FortniteProduct[] = [
  { id:"bp1", name:"Pase de Batalla", nameEN:"Battle Pass",    subtitle:"Temporada actual — 950 V-Bucks",     subtitleEN:"Current season — 950 V-Bucks",     priceOld:26.32, price:20.90, badge:"Popular", img:"/fortnite/battle-pass.jpg", description:"Más de 100 recompensas durante la temporada.",                                        descriptionEN:"Over 100 rewards throughout the season.",                                           slug:"pase-batalla", format:"Digital", region:"Global", needsTurkey:false, tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"battle-pass" },
  { id:"bp2", name:"Pase OG",         nameEN:"OG Pass",        subtitle:"Fortnite OG — 950 V-Bucks",          subtitleEN:"Fortnite OG — 950 V-Bucks",          priceOld:26.32, price:20.90, badge:"",        img:"/fortnite/og-pass.jpg",     description:"Revive la época dorada de Fortnite con cosméticos del modo OG.",                       descriptionEN:"Relive the golden era of Fortnite with OG mode cosmetics.",                         slug:"pase-og",      format:"Digital", region:"Global", needsTurkey:false, tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"battle-pass" },
  { id:"bp3", name:"Pase Musical",    nameEN:"Festival Pass",  subtitle:"Fortnite Festival — 950 V-Bucks",    subtitleEN:"Fortnite Festival — 950 V-Bucks",    priceOld:44.90, price:34.90, badge:"",        img:"/fortnite/music-pass.jpg",  description:"Desbloquea instrumentos, outfits y recompensas del modo Festival.",                    descriptionEN:"Unlock instruments, outfits and Festival mode rewards.",                            slug:"pase-musical", format:"Digital", region:"Global", needsTurkey:false, tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"battle-pass" },
  { id:"bp4", name:"Pase de LEGO",    nameEN:"LEGO Pass",      subtitle:"LEGO Fortnite — 950 V-Bucks",        subtitleEN:"LEGO Fortnite — 950 V-Bucks",        priceOld:44.90, price:34.90, badge:"",        img:"/fortnite/lego-pass.jpg",   description:"Cosméticos exclusivos para el modo de construcción LEGO Fortnite.",                  descriptionEN:"Exclusive cosmetics for LEGO Fortnite building mode.",                              slug:"pase-lego",    format:"Digital", region:"Global", needsTurkey:false, tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"battle-pass" },
];

export const ALL_FORTNITE_PRODUCTS: FortniteProduct[] = [...PAVOS, ...PAQUETES, ...CLUB, ...BATTLE_PASSES];
