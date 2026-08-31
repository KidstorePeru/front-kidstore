// src/data/marvelrivals.ts

export interface MarvelRivalsProduct {
  id:            string;
  slug:          string;
  name:          string;
  nameEN:        string;
  amount:        string;
  badge:         string;
  img:           string;
  description:   string;
  descriptionEN: string;
  price:         number;
  priceOld:      number;
  format:        string;
  region:        string;
}

export const LATTICES: MarvelRivalsProduct[] = [
  { id:"mr1", name:"100 Lattices",    nameEN:"100 Lattices",    amount:"100 Lattices",    priceOld:5.90,   price:4.90,   badge:"",           img:"/marvel-rivals/100-lattices.png",   description:"Ideal para comprar accesorios o sprays en la tienda.",                   descriptionEN:"Ideal for buying accessories or sprays in the store.",             slug:"lattices-100",   format:"Digital", region:"Global" },
  { id:"mr2", name:"500 Lattices",    nameEN:"500 Lattices",    amount:"500 Lattices",    priceOld:21.90,  price:18.90,  badge:"Popular",    img:"/marvel-rivals/500-lattices.png",   description:"Perfecto para una skin básica o varios cosméticos.",                      descriptionEN:"Perfect for a basic skin or several cosmetics.",                    slug:"lattices-500",   format:"Digital", region:"Global" },
  { id:"mr3", name:"1.000 Lattices",  nameEN:"1,000 Lattices",  amount:"1.000 Lattices",  priceOld:42.90,  price:35.90,  badge:"Oferta",     img:"/marvel-rivals/1000-lattices.png",  description:"Alcanza para una skin épica o múltiples accesorios.",                    descriptionEN:"Enough for an epic skin or multiple accessories.",                  slug:"lattices-1000",  format:"Digital", region:"Global" },
  { id:"mr4", name:"2.180 Lattices",  nameEN:"2,180 Lattices",  amount:"2.180 Lattices",  priceOld:70.90,  price:69.90,  badge:"",           img:"/marvel-rivals/2180-lattices.png",  description:"Gran cantidad para skins de héroes y pases de temporada.",               descriptionEN:"Large amount for hero skins and season passes.",                    slug:"lattices-2180",  format:"Digital", region:"Global" },
  { id:"mr5", name:"5.680 Lattices",  nameEN:"5,680 Lattices",  amount:"5.680 Lattices",  priceOld:171.90, price:168.90, badge:"",           img:"/marvel-rivals/5680-lattices.png",  description:"Para coleccionistas y jugadores frecuentes.",                             descriptionEN:"For collectors and frequent players.",                             slug:"lattices-5680",  format:"Digital", region:"Global" },
  { id:"mr6", name:"11.680 Lattices", nameEN:"11,680 Lattices", amount:"11.680 Lattices", priceOld:343.90, price:333.90, badge:"Mejor valor", img:"/marvel-rivals/11680-lattices.png", description:"El mejor precio por Lattice. Máximo contenido disponible.",              descriptionEN:"Best price per Lattice. Maximum available content.",               slug:"lattices-11680", format:"Digital", region:"Global" },
];

export const ALL_MARVEL_RIVALS_PRODUCTS: MarvelRivalsProduct[] = [...LATTICES];