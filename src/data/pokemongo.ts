// src/data/pokemongo.ts

export type PGOProductType = "pokecoins" | "pase";

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
  { id:"pg1", name:"100 PokéCoins",     nameEN:"100 PokéCoins",     amount:"100 PokéCoins",     amountEN:"100 PokéCoins",     priceOld:3.90,   price:2.90,   badge:"",           img:"/pokemon-go/100-coins.png",   description:"Para comprar 1 artículo básico como un módulo cebo o mejora pequeña.",    descriptionEN:"For buying 1 basic item such as a lure module or small upgrade.",   slug:"pokecoins-100",   format:"Digital", region:"Global", tab:"coins", tabLabel:"PokéCoins", tabLabelEN:"PokéCoins", productType:"pokecoins" },
  { id:"pg2", name:"550 PokéCoins",     nameEN:"550 PokéCoins",     amount:"550 PokéCoins",     amountEN:"550 PokéCoins",     priceOld:9.90,   price:9.90,   badge:"Popular",    img:"/pokemon-go/550-coins.png",   description:"Perfecto para pases de incursión o múltiples artículos.",               descriptionEN:"Perfect for raid passes or multiple items.",                        slug:"pokecoins-550",   format:"Digital", region:"Global", tab:"coins", tabLabel:"PokéCoins", tabLabelEN:"PokéCoins", productType:"pokecoins" },
  { id:"pg3", name:"1.200 PokéCoins",   nameEN:"1,200 PokéCoins",   amount:"1.200 PokéCoins",   amountEN:"1,200 PokéCoins",   priceOld:18.90,  price:17.90,  badge:"Oferta",     img:"/pokemon-go/1200-coins.png",  description:"Ideal para ampliar almacenamiento y comprar varios artículos.",          descriptionEN:"Ideal for expanding storage and buying several items.",             slug:"pokecoins-1200",  format:"Digital", region:"Global", tab:"coins", tabLabel:"PokéCoins", tabLabelEN:"PokéCoins", productType:"pokecoins" },
  { id:"pg4", name:"2.500 PokéCoins",   nameEN:"2,500 PokéCoins",   amount:"2.500 PokéCoins",   amountEN:"2,500 PokéCoins",   priceOld:37.90,  price:33.90,  badge:"",           img:"/pokemon-go/2500-coins.png",  description:"Para entrenadores activos con múltiples necesidades en la tienda.",      descriptionEN:"For active trainers with multiple store needs.",                    slug:"pokecoins-2500",  format:"Digital", region:"Global", tab:"coins", tabLabel:"PokéCoins", tabLabelEN:"PokéCoins", productType:"pokecoins" },
  { id:"pg5", name:"5.200 PokéCoins",   nameEN:"5,200 PokéCoins",   amount:"5.200 PokéCoins",   amountEN:"5,200 PokéCoins",   priceOld:76.90,  price:68.90,  badge:"",           img:"/pokemon-go/5200-coins.png",  description:"Gran cantidad para incursiones remotas y mejoras masivas.",             descriptionEN:"Large amount for remote raids and mass upgrades.",                  slug:"pokecoins-5200",  format:"Digital", region:"Global", tab:"coins", tabLabel:"PokéCoins", tabLabelEN:"PokéCoins", productType:"pokecoins" },
  { id:"pg6", name:"14.500 PokéCoins",  nameEN:"14,500 PokéCoins",  amount:"14.500 PokéCoins",  amountEN:"14,500 PokéCoins",  priceOld:191.90, price:171.90, badge:"Mejor valor", img:"/pokemon-go/14500-coins.png", description:"El mejor precio por PokéCoin. Para coleccionistas y jugadores VIP.",   descriptionEN:"Best price per PokéCoin. For collectors and VIP players.",          slug:"pokecoins-14500", format:"Digital", region:"Global", tab:"coins", tabLabel:"PokéCoins", tabLabelEN:"PokéCoins", productType:"pokecoins" },
];

export const PASES: PokemonGoProduct[] = [
  { id:"ps1", name:"Pase de GO Deluxe: Julio",                  nameEN:"GO Deluxe Pass: July",                  subtitle:"Pase especial de temporada",         subtitleEN:"Special seasonal pass",         priceOld:15.50, price:14.90, badge:"Popular", img:"/pokemon-go/godeluxejuliooo.png",                              description:"Obtén recompensas adicionales con cada rango.",                          descriptionEN:"Get additional rewards with each rank.",                             slug:"pase-go-deluxe",       format:"Digital", region:"Global", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"pase" },
  { id:"ps2", name:"Pase de GO Deluxe: Julio +",                    nameEN:"GO Deluxe Pass: July +",                    subtitle:"Pase especial de temporada",            subtitleEN:"Special seasonal pass",            priceOld:18.90, price:17.90, badge:"",        img:"/pokemon-go/godeluxejuliooo+.png",                                description:"Obtén recompensas adicionales con cada rango y avanza 10 rangos.",                    descriptionEN:"Get additional rewards with each rank and progress 10 ranks.",               slug:"pase-go-tour",         format:"Digital", region:"Global", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"pase" },
  { id:"ps4", name:"Pase de GO Deluxe: Sendero de Leyendas",                    nameEN:"GO Deluxe Pass: Path of Legends",                    subtitle:"Pase especial de temporada",            subtitleEN:"Special seasonal pass",            priceOld:37.90, price:34.90, badge:"",        img:"/pokemon-go/godesenderodeleyendas.png",                                description:"Obtén recompensas adicionales con cada rango.",                    descriptionEN:"Get additional rewards with each rank.",               slug:"pase-go-tour",         format:"Digital", region:"Global", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"pase" },
  { id:"ps5", name:"Pase de GO Deluxe: Sendero de Leyendas +",                    nameEN:"GO Deluxe Pass: Path of Legends +",                    subtitle:"Pase especial de temporada",            subtitleEN:"Special seasonal pass",            priceOld:47.90, price:42.90, badge:"",        img:"/pokemon-go/godesenderodeleyendas+.png",                                description:"Obtén recompensas adicionales con cada rango y avanza 10 rangos.",                    descriptionEN:"Get additional rewards with each rank and progress 10 ranks.",               slug:"pase-go-tour",         format:"Digital", region:"Global", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"pase" },
  { id:"ps3", name:"Iniciación",                 nameEN:"Starter Pack",               subtitle:"Pase para nuevos entrenadores",      subtitleEN:"Pass for new trainers",         priceOld:5.90, price:5.90, badge:"",        img:"/pokemon-go/iniciacion.png",                            description:"Paquete de inicio con artículos esenciales para nuevos entrenadores.",                      descriptionEN:"Starter pack with essential items for new trainers.",                                    slug:"pase-iniciacion",      format:"Digital", region:"Global", tab:"pases", tabLabel:"Pases", tabLabelEN:"Passes", productType:"pase" },
];

export const ALL_POKEMON_GO_PRODUCTS: PokemonGoProduct[] = [...POKECOINS, ...PASES];
