// Datos de sección que la tienda oficial muestra pero fortnite-api.com no trae:
// el fondo fijo de cada sección y algunos subtítulos.
// Fondo: textura oficial conocida (por id) → imagen local en /fortnite/secciones (por nombre) → textura por defecto.

const CDN = "https://cdn2.unrealengine.com/";

// Texturas oficiales observadas en la tienda (id de sección en minúsculas). Cambian con cada rotación:
// si una sección nueva no está aquí se busca una imagen local y, si no, se usa la de por defecto.
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

// Imágenes locales en public/fortnite/secciones (nombre de sección tal como lo muestra la tienda).
const LOCAL: Record<string, string> = {
  "Madison Beer": "Madison Beer.jpg",
  "Casillero de Suja": "Casillero de Suja.avif",
  FNCS: "FNCS.jpg",
  "Pistas de improvisación": "Pistas de improvisación.avif",
  "Lúcete en el escenario principal": "Lúcete en el escenario principal.webp",
  "Las guerreras k-pop": "Las guerreras k-pop.jpg",
  "No te preocupes": "No te preocupes.avif",
  "CONTROL Resonant": "CONTROL Resonant.jpg",
  Disney: "Disney.jpg",
  "Kingdom Hearts": "Kingdom Hearts.jpg",
  "Persona 5 Royal": "Persona 5 Royal.jpg",
  "Resident Evil (!)": "Resident Evil (!).jpg",
  "The Walking Dead": "The Walking Dead.jpg",
  PEAK: "PEAK.jpg",
  Ironmouse: "Ironmouse.jpg",
  "Escuadrón saltarín": "Escuadrón saltarín.webp",
  "Pasos con estilo": "Pasos con estilo.jpg",
  "Accesorios de vehículos": "Accesorios de vehículos.jpg",
  "Dominus GT": "Dominus GT.jpg",
  "Takumi Rx-T": "Takumi Rx-T.jpg",
  "LO MÁS VENDIDO DE HOY": "LO MÁS VENDIDO DE HOY.jpg",
  "Look del día": "Look del día.jpg",
  Portada: "Portada.jpg",
};

const DEFAULT_BACKGROUND = `${CDN}default-sparks-sectionbg-v1-1920x1080-9b27879ce008.jpg`;

export function sectionBackground(id: string, name: string): string {
  const official = OFFICIAL[id.toLowerCase()];
  if (official) return CDN + official;
  const local = LOCAL[name.trim()];
  if (local) return "/fortnite/secciones/" + encodeURIComponent(local);
  return DEFAULT_BACKGROUND;
}

// Subtítulos observados en la tienda oficial (solo existen en español).
const SUBTITLES: Record<string, string> = {
  br092826: "Estilo máximo desbloqueado.",
  mtvvma: "Donde brillan los nombres más importantes de la música",
};

export function sectionSubtitle(id: string, apiLang: string): string | null {
  return apiLang.startsWith("es") ? SUBTITLES[id.toLowerCase()] ?? null : null;
}
