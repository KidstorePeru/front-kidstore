import { Game, Product } from "@/types";

import { ALL_FORTNITE_PRODUCTS }      from "./fortnite";
import { ALL_WILDRIFT_PRODUCTS }      from "./wildrift";
import { ALL_MARVEL_RIVALS_PRODUCTS } from "./marvelrivals";
import { ALL_POKEMON_GO_PRODUCTS }    from "./pokemongo";
import { ALL_ROBLOX_PRODUCTS }        from "./roblox";
import { ALL_GENSHIN_PRODUCTS }       from "./genshinimpact";
import { ALL_ZZZ_PRODUCTS }           from "./zenlesszonezero";
import { ALL_HSR_PRODUCTS }           from "./honkaistarrail";
import { ALL_WW_PRODUCTS }            from "./wutheringwaves";
import { ALL_HOK_PRODUCTS }           from "./honorofkings";
import { ALL_TFT_PRODUCTS }           from "./tft";
import { ALL_DISCORD_PRODUCTS }       from "./discord";
import { ALL_ROCKET_LEAGUE_PRODUCTS } from "./rocketleague";

/**
 * La fuente de verdad de cada juego es su catálogo propio en
 * `src/data/<juego>.ts`. Aquí solo derivamos un resumen ligero que usan las
 * tarjetas de juego (precio "desde", nº de opciones) y la sección de ofertas
 * (% de descuento). Así el catálogo del home nunca se desincroniza de los
 * precios reales.
 */
interface RawProduct {
  id:              string;
  name?:           string;
  nameEN?:         string;
  description?:    string;
  descriptionEN?:  string;
  amount?:         string;
  amountEN?:       string;
  badge?:          string;
  img?:            string;
  price?:          number;
  priceOld?:       number;
  priceCuenta?:    number;
  priceOldCuenta?: number;
  priceUID?:       number;
  priceOldUID?:    number;
}

function summarize(list: readonly RawProduct[]): Product[] {
  return list.map((p) => {
    const priceCandidates = [p.price, p.priceCuenta, p.priceUID].filter(
      (n): n is number => typeof n === "number" && n > 0,
    );
    const price    = priceCandidates.length ? Math.min(...priceCandidates) : 0;
    const priceOld = p.priceOld ?? p.priceOldCuenta ?? p.priceOldUID;
    const discount =
      priceOld && priceOld > price ? Math.round((1 - price / priceOld) * 100) : undefined;
    const label = p.name ?? p.amount ?? p.nameEN ?? p.id;
    return {
      id:            p.id,
      name:          label,
      nameEN:        p.nameEN ?? p.amountEN ?? label,
      description:   p.description ?? "",
      descriptionEN: p.descriptionEN ?? p.description ?? "",
      price,
      priceOld,
      currency:      "PEN",
      amount:        p.amount ?? label,
      amountEN:      p.amountEN ?? p.amount ?? label,
      badge:         p.badge || undefined,
      discount,
      image:         p.img,
    };
  });
}

export const games: Game[] = [
  {
    id: "1", name: "Fortnite", slug: "fortnite",
    image: "/games/fortnite.jpg", banner: "/games/fortnite.jpg",
    category: "battle-royale", tags: ["Battle Royale", "Popular"],
    popular: true, featured: true,
    products: summarize(ALL_FORTNITE_PRODUCTS),
  },
  {
    id: "2", name: "Wild Rift", slug: "wild-rift",
    image: "/games/wild-rift.jpg", banner: "/games/wild-rift.jpg",
    category: "moba", tags: ["MOBA", "Popular"],
    popular: true, featured: true,
    products: summarize(ALL_WILDRIFT_PRODUCTS),
  },
  {
    id: "3", name: "Marvel Rivals", slug: "marvel-rivals",
    image: "/games/marvel-rivals.jpg", banner: "/games/marvel-rivals.jpg",
    category: "shooter", tags: ["Shooter", "Nuevo"],
    popular: true, featured: true,
    offer: { label: "Oferta", labelEN: "Deal", description: "Descuento especial esta semana", descriptionEN: "Special discount this week" },
    products: summarize(ALL_MARVEL_RIVALS_PRODUCTS),
  },
  {
    id: "4", name: "Pokémon GO", slug: "pokemon-go",
    image: "/games/pokemon-go.jpg", banner: "/games/pokemon-go.jpg",
    category: "rpg", tags: ["RPG", "Popular"],
    popular: true,
    products: summarize(ALL_POKEMON_GO_PRODUCTS),
  },
  {
    id: "5", name: "Roblox", slug: "roblox",
    image: "/games/roblox.jpg", banner: "/games/roblox.jpg",
    category: "otros", tags: ["Popular"],
    popular: true,
    offer: { label: "Oferta", labelEN: "Deal", description: "Descuento en paquetes grandes", descriptionEN: "Discount on large packages" },
    products: summarize(ALL_ROBLOX_PRODUCTS),
  },
  {
    id: "6", name: "Genshin Impact", slug: "genshin-impact",
    image: "/games/genshin-impact.jpg", banner: "/games/genshin-impact.jpg",
    category: "rpg", tags: ["RPG", "Popular"],
    popular: true, featured: true,
    offer: { label: "Oferta", labelEN: "Deal", description: "Descuento en Cristales de Génesis", descriptionEN: "Discount on Genesis Crystals" },
    products: summarize(ALL_GENSHIN_PRODUCTS),
  },
  {
    id: "7", name: "Zenless Zone Zero", slug: "zenless-zone-zero",
    image: "/games/zenless-zone-zero.jpg", banner: "/games/zenless-zone-zero.jpg",
    category: "rpg", tags: ["RPG", "Nuevo"],
    popular: true,
    products: summarize(ALL_ZZZ_PRODUCTS),
  },
  {
    id: "8", name: "Honkai: Star Rail", slug: "honkai-star-rail",
    image: "/games/honkai-star-rail.jpg", banner: "/games/honkai-star-rail.jpg",
    category: "rpg", tags: ["RPG"],
    popular: false,
    products: summarize(ALL_HSR_PRODUCTS),
  },
  {
    id: "9", name: "Wuthering Waves", slug: "wuthering-waves",
    image: "/games/wuthering-waves.jpg", banner: "/games/wuthering-waves.jpg",
    category: "rpg", tags: ["RPG"],
    popular: false,
    products: summarize(ALL_WW_PRODUCTS),
  },
  {
    id: "10", name: "Honor of Kings", slug: "honor-of-kings",
    image: "/games/honor-of-kings.jpg", banner: "/games/honor-of-kings.jpg",
    category: "moba", tags: ["MOBA"],
    popular: false,
    products: summarize(ALL_HOK_PRODUCTS),
  },
  {
    id: "11", name: "Teamfight Tactics", slug: "team-fight-tactics",
    image: "/games/team-fight-tactics.jpg", banner: "/games/team-fight-tactics.jpg",
    category: "estrategia", tags: ["Estrategia"],
    popular: false,
    products: summarize(ALL_TFT_PRODUCTS),
  },
  {
    id: "12", name: "Discord", slug: "discord",
    image: "/games/discord.jpg", banner: "/games/discord.jpg",
    category: "suscripciones", tags: ["Suscripción"],
    popular: false,
    products: summarize(ALL_DISCORD_PRODUCTS),
  },
  {
    id: "13", name: "Rocket League", slug: "rocket-league",
    image: "/games/rocket-league.jpg", banner: "/games/rocket-league.jpg",
    category: "otros", tags: ["Popular"],
    popular: true,
    offer: { label: "Oferta", labelEN: "Deal", description: "Descuento en créditos", descriptionEN: "Discount on credits" },
    products: summarize(ALL_ROCKET_LEAGUE_PRODUCTS),
  },
];
