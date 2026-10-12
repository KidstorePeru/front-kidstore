import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { games } from "@/data";
import { categories } from "@/data/categories";
import { ALL_DISCORD_PRODUCTS } from "@/data/discord";
import { ALL_FORTNITE_PRODUCTS } from "@/data/fortnite";
import { ALL_GENSHIN_PRODUCTS } from "@/data/genshinimpact";
import { ALL_HSR_PRODUCTS } from "@/data/honkaistarrail";
import { ALL_HOK_PRODUCTS } from "@/data/honorofkings";
import { ALL_MARVEL_RIVALS_PRODUCTS } from "@/data/marvelrivals";
import { ALL_POKEMON_GO_PRODUCTS } from "@/data/pokemongo";
import { ALL_ROBLOX_PRODUCTS } from "@/data/roblox";
import { ALL_ROCKET_LEAGUE_PRODUCTS } from "@/data/rocketleague";
import { ALL_TFT_PRODUCTS } from "@/data/tft";
import { ALL_WILDRIFT_PRODUCTS } from "@/data/wildrift";
import { ALL_WW_PRODUCTS } from "@/data/wutheringwaves";
import { ALL_ZZZ_PRODUCTS } from "@/data/zenlesszonezero";

// Páginas de producto por juego: las mismas listas que usan sus generateStaticParams.
const PRODUCTS: Record<string, { slug: string }[]> = {
  "discord":            ALL_DISCORD_PRODUCTS,
  "fortnite":           ALL_FORTNITE_PRODUCTS,
  "genshin-impact":     ALL_GENSHIN_PRODUCTS,
  "honkai-star-rail":   ALL_HSR_PRODUCTS,
  "honor-of-kings":     ALL_HOK_PRODUCTS,
  "marvel-rivals":      ALL_MARVEL_RIVALS_PRODUCTS,
  "pokemon-go":         ALL_POKEMON_GO_PRODUCTS,
  "roblox":             ALL_ROBLOX_PRODUCTS,
  "rocket-league":      ALL_ROCKET_LEAGUE_PRODUCTS,
  "team-fight-tactics": ALL_TFT_PRODUCTS,
  "wild-rift":          ALL_WILDRIFT_PRODUCTS,
  "wuthering-waves":    ALL_WW_PRODUCTS,
  "zenless-zone-zero":  ALL_ZZZ_PRODUCTS,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${SITE_URL}${path}`;
  const pages: MetadataRoute.Sitemap = [
    { url: url("/"),      changeFrequency: "daily",  priority: 1 },
    { url: url("/games"), changeFrequency: "daily",  priority: 0.9 },
    // La tienda de Fortnite cambia cada día.
    { url: url("/games/fortnite?tab=tienda"), changeFrequency: "daily", priority: 0.9 },
    ...["/faq", "/contact", "/terms", "/privacy", "/refunds"].map((p) => ({
      url: url(p), changeFrequency: "monthly" as const, priority: 0.4,
    })),
    ...categories.map((c) => ({ url: url(`/category/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
  for (const g of games) {
    pages.push({ url: url(`/games/${g.slug}`), changeFrequency: "weekly", priority: 0.8 });
    for (const p of PRODUCTS[g.slug] ?? []) {
      pages.push({ url: url(`/games/${g.slug}/${p.slug}`), changeFrequency: "weekly", priority: 0.7 });
    }
  }
  return pages;
}
