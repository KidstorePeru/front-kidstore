/**
 * Árbol del catálogo — juego → pestañas → productos.
 *
 * Fuente única para el panel `/admin` → "Visibilidad" (Fase 2) y para saber
 * qué claves de visibilidad son válidas. Los productos se derivan de los
 * catálogos reales de `@/data/*`; las pestañas se listan a mano porque algunas
 * no tienen productos en los datos (tienda en vivo de Fortnite, Game Pass de
 * Roblox — una calculadora, Paquetes vacíos, etc.).
 *
 * Los `id` de pestaña coinciden con los de cada `<Game>PageClient` (`TABS`).
 */

import { ALL_FORTNITE_PRODUCTS }      from "@/data/fortnite";
import { ALL_WILDRIFT_PRODUCTS }      from "@/data/wildrift";
import { ALL_MARVEL_RIVALS_PRODUCTS } from "@/data/marvelrivals";
import { ALL_POKEMON_GO_PRODUCTS }    from "@/data/pokemongo";
import { ALL_ROBLOX_PRODUCTS }        from "@/data/roblox";
import { ALL_GENSHIN_PRODUCTS }       from "@/data/genshinimpact";
import { ALL_ZZZ_PRODUCTS }           from "@/data/zenlesszonezero";
import { ALL_HSR_PRODUCTS }           from "@/data/honkaistarrail";
import { ALL_WW_PRODUCTS }            from "@/data/wutheringwaves";
import { ALL_HOK_PRODUCTS }           from "@/data/honorofkings";
import { ALL_TFT_PRODUCTS }           from "@/data/tft";
import { ALL_DISCORD_PRODUCTS }       from "@/data/discord";
import { ALL_ROCKET_LEAGUE_PRODUCTS } from "@/data/rocketleague";

export interface CatalogTab     { id: string; label: string; }
export interface CatalogProduct  { slug: string; name: string; tab: string; }
/** Sub-sección con clave de visibilidad propia (no es pestaña ni producto). */
export interface CatalogExtra    { key: string; label: string; }
export interface CatalogGame {
  slug: string;
  name: string;
  tabs: CatalogTab[];
  products: CatalogProduct[];
  extras?: CatalogExtra[];
}

interface RawP {
  slug: string; name?: string; nameEN?: string; amount?: string; tab?: string;
}
function prods(list: readonly RawP[], fallbackTab: string): CatalogProduct[] {
  return list.map(p => ({
    slug: p.slug,
    name: p.name ?? p.nameEN ?? p.amount ?? p.slug,
    tab:  p.tab ?? fallbackTab,
  }));
}

export const CATALOG: CatalogGame[] = [
  {
    slug: "fortnite", name: "Fortnite",
    tabs: [
      { id: "tienda",   label: "Tienda (en vivo)" },
      { id: "bots",     label: "Bots" },
      { id: "pavos",    label: "Pavos" },
      { id: "paquetes", label: "Paquetes" },
      { id: "pases",    label: "Pases" },
    ],
    products: prods(ALL_FORTNITE_PRODUCTS, "pavos"),
  },
  {
    slug: "wild-rift", name: "Wild Rift",
    tabs: [{ id: "cores", label: "Wild Cores" }, { id: "bundles", label: "Bundles" }],
    products: prods(ALL_WILDRIFT_PRODUCTS, "cores"),
  },
  {
    slug: "marvel-rivals", name: "Marvel Rivals",
    tabs: [{ id: "lattices", label: "Lattices" }],
    products: prods(ALL_MARVEL_RIVALS_PRODUCTS, "lattices"),
  },
  {
    slug: "pokemon-go", name: "Pokémon GO",
    tabs: [{ id: "coins", label: "PokéCoins" }, { id: "pases", label: "Pases" }],
    products: prods(ALL_POKEMON_GO_PRODUCTS, "coins"),
  },
  {
    slug: "roblox", name: "Roblox",
    tabs: [
      { id: "cuenta",   label: "Vía Cuenta" },
      { id: "plus",     label: "Roblox Plus" },
      { id: "grupo",    label: "Vía Grupo" },
      { id: "gamepass", label: "Game Pass (calculadora)" },
    ],
    products: prods(ALL_ROBLOX_PRODUCTS, "cuenta"),
  },
  {
    slug: "genshin-impact", name: "Genshin Impact",
    tabs: [{ id: "cristales", label: "Cristales de Génesis" }, { id: "bendicion", label: "Bendición Welkin" }],
    products: prods(ALL_GENSHIN_PRODUCTS, "cristales"),
  },
  {
    slug: "zenless-zone-zero", name: "Zenless Zone Zero",
    tabs: [{ id: "fotogramas", label: "Fotogramas" }, { id: "pases", label: "Pases" }],
    products: prods(ALL_ZZZ_PRODUCTS, "fotogramas"),
  },
  {
    slug: "honkai-star-rail", name: "Honkai: Star Rail",
    tabs: [{ id: "esquirla", label: "Esquirlas Oníricas" }, { id: "pases", label: "Pases" }],
    products: prods(ALL_HSR_PRODUCTS, "esquirla"),
  },
  {
    slug: "wuthering-waves", name: "Wuthering Waves",
    tabs: [{ id: "lunita", label: "Lunita" }, { id: "pases", label: "Pase Mensual" }],
    products: prods(ALL_WW_PRODUCTS, "lunita"),
  },
  {
    slug: "honor-of-kings", name: "Honor of Kings",
    tabs: [{ id: "tokens", label: "Tokens" }],
    products: prods(ALL_HOK_PRODUCTS, "tokens"),
  },
  {
    slug: "team-fight-tactics", name: "Teamfight Tactics",
    tabs: [{ id: "coins", label: "TFT Coins" }],
    products: prods(ALL_TFT_PRODUCTS, "coins"),
  },
  {
    slug: "discord", name: "Discord",
    tabs: [
      { id: "nitro",   label: "Nitro" },
      { id: "mejoras", label: "Mejoras de servidor" },
      { id: "tienda",  label: "Tienda" },
    ],
    products: prods(ALL_DISCORD_PRODUCTS, "nitro"),
  },
  {
    slug: "rocket-league", name: "Rocket League",
    tabs: [{ id: "creditos", label: "Créditos" }, { id: "paquetes", label: "Paquetes" }],
    products: prods(ALL_ROCKET_LEAGUE_PRODUCTS, "creditos"),
    extras: [{ key: "rocket-league:bulk-credits", label: "Selector de créditos a granel" }],
  },
];

export const catalogGame = (slug: string) => CATALOG.find(g => g.slug === slug);
