// src/data/pokemongo.ts

export type PGOProductType = "pokecoins" | "pase" | "entrada";

export interface PokemonGoProduct {
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
  productType:   PGOProductType;
}

export const POKECOINS: PokemonGoProduct[] = [
  { id:"pg1", name:"100 Pokémonedas",     nameEN:"100 PokéCoins",     amount:"100 Pokémonedas",                    amountEN:"100 PokéCoins",                      priceOld:3.90,   price:2.90,   badge:"",           img:"/pokemon-go/100-coins.png",   description:"Para comprar 1 artículo básico como un módulo cebo o mejora pequeña.",    descriptionEN:"For buying 1 basic item such as a lure module or small upgrade.",   slug:"pokecoins-100",   format:"Digital", region:"Global", tab:"coins", tabLabel:"Pokémonedas", tabLabelEN:"PokéCoins", productType:"pokecoins" },
  { id:"pg2", name:"550 Pokémonedas",     nameEN:"550 PokéCoins",     amount:"550 Pokémonedas",                    amountEN:"550 PokéCoins",                      priceOld:9.90,   price:9.90,   badge:"Popular",    img:"/pokemon-go/550-coins.png",   description:"Perfecto para pases de incursión o múltiples artículos.",               descriptionEN:"Perfect for raid passes or multiple items.",                        slug:"pokecoins-550",   format:"Digital", region:"Global", tab:"coins", tabLabel:"Pokémonedas", tabLabelEN:"PokéCoins", productType:"pokecoins" },
  { id:"pg3", name:"1.300 Pokémonedas",   nameEN:"1,300 PokéCoins",   amount:"1.300 + 100 Pokémonedas de bono",    amountEN:"1,300 + 100 bonus PokéCoins",        priceOld:17.90,  price:16.90,  badge:"Oferta",     img:"/pokemon-go/1200-coins.png",  description:"Ideal para ampliar almacenamiento y comprar varios artículos. Incluye 100 Pokémonedas de bono.",          descriptionEN:"Ideal for expanding storage and buying several items. Includes 100 bonus PokéCoins.",             slug:"pokecoins-1300",  format:"Digital", region:"Global", tab:"coins", tabLabel:"Pokémonedas", tabLabelEN:"PokéCoins", productType:"pokecoins" },
  { id:"pg4", name:"2.700 Pokémonedas",   nameEN:"2,700 PokéCoins",   amount:"2.700 + 200 Pokémonedas de bono",    amountEN:"2,700 + 200 bonus PokéCoins",        priceOld:33.90,  price:28.90,  badge:"",           img:"/pokemon-go/2500-coins.png",  description:"Para entrenadores activos con múltiples necesidades en la tienda. Incluye 200 Pokémonedas de bono.",      descriptionEN:"For active trainers with multiple store needs. Includes 200 bonus PokéCoins.",                    slug:"pokecoins-2700",  format:"Digital", region:"Global", tab:"coins", tabLabel:"Pokémonedas", tabLabelEN:"PokéCoins", productType:"pokecoins" },
  { id:"pg5", name:"5.600 Pokémonedas",   nameEN:"5,600 PokéCoins",   amount:"5.600 + 400 Pokémonedas de bono",    amountEN:"5,600 + 400 bonus PokéCoins",        priceOld:68.90,  price:54.90,  badge:"",           img:"/pokemon-go/5200-coins.png",  description:"Gran cantidad para incursiones remotas y mejoras masivas. Incluye 400 Pokémonedas de bono.",             descriptionEN:"Large amount for remote raids and mass upgrades. Includes 400 bonus PokéCoins.",                  slug:"pokecoins-5600",  format:"Digital", region:"Global", tab:"coins", tabLabel:"Pokémonedas", tabLabelEN:"PokéCoins", productType:"pokecoins" },
  { id:"pg6", name:"15.500 Pokémonedas",  nameEN:"15,500 PokéCoins",  amount:"15.500 + 1.000 Pokémonedas de bono", amountEN:"15,500 + 1,000 bonus PokéCoins",     priceOld:171.90, price:139.90, badge:"Mejor valor", img:"/pokemon-go/14500-coins.png", description:"El mejor precio por Pokémoneda. Para coleccionistas y jugadores VIP. Incluye 1.000 Pokémonedas de bono.",   descriptionEN:"Best price per PokéCoin. For collectors and VIP players. Includes 1,000 bonus PokéCoins.",          slug:"pokecoins-15500", format:"Digital", region:"Global", tab:"coins", tabLabel:"Pokémonedas", tabLabelEN:"PokéCoins", productType:"pokecoins" },
];

export const PASES: PokemonGoProduct[] = [
  { id:"ps1", name:"Pase de GO Deluxe",                          nameEN:"GO Deluxe Pass",                        subtitle:"Pase especial de temporada",         subtitleEN:"Special seasonal pass",         priceOld:15.50, price:14.90, badge:"Popular", img:"/pokemon-go/godeluxejuliooo.png",                              description:"Obtén recompensas adicionales con cada rango.",                          descriptionEN:"Get additional rewards with each rank.",                             slug:"pase-go-deluxe",       format:"Digital", region:"Global", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"pase" },
  { id:"ps2", name:"Pase de GO Deluxe + 10 niveles",             nameEN:"GO Deluxe Pass + 10 levels",            subtitle:"Pase especial de temporada",         subtitleEN:"Special seasonal pass",         priceOld:18.90, price:17.90, badge:"",        img:"/pokemon-go/godeluxejuliooo+.png",       description:"Obtén recompensas adicionales con cada rango y avanza 10 niveles al instante.",  descriptionEN:"Get additional rewards with each rank and instantly progress 10 levels.",  slug:"pase-go-deluxe-plus",  format:"Digital", region:"Global", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"pase" },
  { id:"ps5", name:"Iniciación",                                nameEN:"Starter Pack",                         subtitle:"Pase para nuevos entrenadores",      subtitleEN:"Pass for new trainers",        priceOld:5.90,  price:5.90,  badge:"",        img:"/pokemon-go/iniciacion.png",            description:"Paquete de inicio con artículos esenciales para nuevos entrenadores.", descriptionEN:"Starter pack with essential items for new trainers.",        slug:"pase-iniciacion",            format:"Digital", region:"Global", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"pase" },
];

export const ENTRADAS: PokemonGoProduct[] = [
  { id:"en1", name:"Área Silvestre de Pokémon GO 2026", nameEN:"Pokémon GO Wild Area 2026", subtitle:"Entrada · Global", subtitleEN:"Ticket · Global", priceOld:21.90, price:21.90, badge:"Nuevo", img:"/pokemon-go/area-silvestre-2026.png", description:"Entrada para el evento Área Silvestre de Pokémon GO 2026 (Global). La activamos en tu cuenta para que disfrutes del evento desde cualquier parte del mundo.", descriptionEN:"Ticket for the Pokémon GO Wild Area 2026 event (Global). We activate it on your account so you can enjoy the event from anywhere in the world.", slug:"entrada-area-silvestre-2026", format:"Digital", region:"Global", tab:"entradas", tabLabel:"Entradas", tabLabelEN:"Tickets", productType:"entrada" },
];

export const ALL_POKEMON_GO_PRODUCTS: PokemonGoProduct[] = [...POKECOINS, ...PASES, ...ENTRADAS];
