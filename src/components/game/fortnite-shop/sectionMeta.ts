// Datos de sección que la tienda oficial muestra pero fortnite-api.com no trae:
// el fondo de cada sección y algunos subtítulos.
// Fondo: imagen propia en src/assets/secciones (por nombre de sección, con rotación diaria de las
// variantes "Nombre 2", "Nombre 3"…) → textura oficial conocida (por id) → textura por defecto.
import type { StaticImageData } from "next/image";
import { LOCAL_BACKGROUNDS } from "./sectionBackgrounds.generated";

const CDN = "https://cdn2.unrealengine.com/";

// Texturas oficiales observadas en la tienda (id de sección en minúsculas). Solo se usan si no hay
// imagen propia para la sección.
const OFFICIAL: Record<string, string> = {
  madisonbeer: "sk-MistTycoon_SectionBG-cbd22aec.png",
  persona5: "sk-BG_Section-9ff91c07.png",
  bestsellers: "sk-Bestsellers_SectionBG-e1b29339.png",
  peak: "sk-Billboard_Season42_SectionBG_PastelPurple-8c54085b.png",
  vv092826: "sk-Billboard_VictoryVibes_SectionBG-edae1985.png",
  kingdomhearts: "sk-Billboard_SpireTrend_SectionBG-a456ea12.png",
  khnightmare: "sk-Billboard_SpireTrend2_SectionBG-885a3b73.png",
  residentevil: "sk-Billboard_Season42_SectionBG_Midnight-d2bc012f.png",
  ironmouse2: "sk-Billboard_FeelUnion_BGScreen-78f80281.png",
  kpop2newest: "sk-ArrowRoot_SectionBG-1caa52f3.png",
  fnd092826: "sk-Billboard_Ten_SectionBG-48c33842.png",
  cyberfncs: "sk-Billboard_FNCSS_PJ_BG-16dd23e3.png",
  ns092226: "sk-Billboard_Rafael_SectionBG-28e9a92f.jpg",
  br092826: "sk-Default_BG_0012_OG-Rays-621aca70.png",
  mtvvma: "sk-MusicNotes_SectionBG-387c0d78.png",
  rabbitday: "sk-Billboard_PromDutch_SectionBG-e773d091.png",
  walkingdead1: "billboard-staticrewind-shopbg-1920x1074-2a080d26a7de.png",
  resonant: "sk-Billboard_Season42_SectionBG_DarkRed-145cc263.png",
  suja: "sk-Billboard_Winterfest_SectionBG-bae1228d.png",
  takumirxt1: "sk-Billboard_Ravioli_SectionBG-84db1311.png",
  dominusgt: "sk-Drof_SectionBG-73c65b99.png",
};

const DEFAULT_BACKGROUND = `${CDN}default-sparks-sectionbg-v1-1920x1080-9b27879ce008.jpg`;

export type SectionBackground = string | StaticImageData;

// Clave de comparación: sin acentos, mayúsculas ni signos ("Resident Evil (!)" = "Resident Evil").
const keyOf = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

// Índice de las imágenes propias: clave del nombre → variantes ordenadas (1 = sin número).
// "Look del día 3.png" es la variante 3 de "Look del día"; "Nick Eh 30.jpg" se busca también
// por su nombre completo, así que una sección que termina en número no se confunde.
const LOCAL = new Map<string, { n: number; image: StaticImageData }[]>();
function addLocal(key: string, n: number, image: StaticImageData) {
  const list = LOCAL.get(key) ?? [];
  list.push({ n, image });
  LOCAL.set(key, list);
}
for (const { file, image } of LOCAL_BACKGROUNDS) {
  const name = file.replace(/\.[^.]+$/, "").trim();
  addLocal(keyOf(name), 1, image);
  const m = name.match(/^(.*\S)\s+(\d+)$/);
  if (m) addLocal(keyOf(m[1]), Number(m[2]), image);
}
for (const list of LOCAL.values()) list.sort((a, b) => a.n - b.n);

// names: nombre de la sección en el idioma actual y en español (las imágenes van con el nombre
// en español). day: número de día de la tienda (rota a las 00:00 UTC), elige la variante del día.
export function sectionBackground(id: string, names: (string | null | undefined)[], day: number): SectionBackground {
  for (const name of names) {
    const list = name ? LOCAL.get(keyOf(name)) : undefined;
    if (list?.length) return list[day % list.length].image;
  }
  const official = OFFICIAL[id.toLowerCase()];
  if (official) return CDN + official;
  return DEFAULT_BACKGROUND;
}

export const backgroundSrc = (bg: SectionBackground) => (typeof bg === "string" ? bg : bg.src);

// Subtítulos observados en la tienda oficial (solo existen en español).
const SUBTITLES: Record<string, string> = {
  br092826: "Estilo máximo desbloqueado.",
  mtvvma: "Donde brillan los nombres más importantes de la música",
};

export function sectionSubtitle(id: string, apiLang: string): string | null {
  return apiLang.startsWith("es") ? SUBTITLES[id.toLowerCase()] ?? null : null;
}
