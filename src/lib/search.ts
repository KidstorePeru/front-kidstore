import type { Game } from "@/types";

/** Texto en minúsculas y sin tildes ("Pokémon" → "pokemon"). */
export const normalizeText = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

// Cómo busca la gente cada moneda aunque no salga así en el nombre del producto.
const KEYWORDS: Record<string, string> = {
  "fortnite":           "pavos vbucks v-bucks tienda skins club pase",
  "roblox":             "robux premium",
  "genshin-impact":     "cristales genesis primogemas welkin bendicion",
  "honkai-star-rail":   "hsr jade esquirlas oniricas expreso",
  "zenless-zone-zero":  "zzz monocromo fotogramas",
  "wuthering-waves":    "lunita astrita",
  "marvel-rivals":      "lattice",
  "wild-rift":          "lol league of legends wild cores",
  "pokemon-go":         "pokecoins pokemonedas entrada ticket area silvestre wild area",
  "honor-of-kings":     "hok tokens",
  "team-fight-tactics": "tft coins",
  "discord":            "nitro boost",
  "rocket-league":      "creditos credits",
};

/** ¿El juego coincide con la búsqueda? Busca en el nombre, sus productos y palabras clave. */
export function gameMatches(game: Game, query: string): boolean {
  const q = normalizeText(query);
  if (!q) return true;
  const haystack = normalizeText(
    [game.name, game.slug.replace(/-/g, " "), KEYWORDS[game.slug] ?? "", ...game.products.flatMap((p) => [p.name, p.nameEN ?? ""])].join(" "),
  );
  return q.split(/\s+/).every((word) => haystack.includes(word));
}
