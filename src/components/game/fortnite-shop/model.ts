// Convierte las entradas de fortnite-api.com en la estructura de la tienda oficial:
//   secciones (layout.rank DESC, empate layout.index ASC)
//   → grupos (número final de layoutId DESC; cada grupo es una fila propia)
//   → ofertas (sortPriority DESC; empate: orden de la API)
import type { OfferKind, ShopText } from "./i18n";
import { sectionBackground, sectionSubtitle, type SectionBackground } from "./sectionMeta";

/* ── Tipos de la API (solo los campos que se usan) ─────────────────── */

interface ApiImageSet { icon?: string; smallIcon?: string; featured?: string; small?: string; large?: string }
interface ApiVariant { options?: { name?: string; image?: string }[] }
interface ApiItem {
  id: string;
  name?: string;
  description?: string;
  type?: { value?: string; displayValue?: string };
  rarity?: { displayValue?: string };
  series?: { value?: string };
  set?: { text?: string };
  images?: ApiImageSet;
  variants?: ApiVariant[];
}
interface ApiTrack {
  title?: string;
  artist?: string;
  album?: string;
  releaseYear?: number;
  bpm?: number;
  duration?: number;
  albumArt?: string;
}
export interface ApiEntry {
  offerId: string;
  devName?: string;
  regularPrice?: number;
  finalPrice: number;
  tileSize?: string;
  sortPriority?: number;
  layoutId?: string;
  inDate?: string;
  outDate?: string;
  giftable?: boolean;
  banner?: { value?: string; backendValue?: string };
  offerTag?: { text?: string };
  colors?: { color1?: string; color2?: string; color3?: string; textBackgroundColor?: string };
  layout?: { id: string; name?: string; category?: string; index?: number; rank?: number; displayType?: string };
  bundle?: { name?: string; info?: string; image?: string };
  newDisplayAsset?: { renderImages?: { productTag?: string; image?: string }[] };
  brItems?: ApiItem[];
  tracks?: ApiTrack[];
  cars?: ApiItem[];
  instruments?: ApiItem[];
  legoKits?: ApiItem[];
}

/* ── Modelo de la tienda ───────────────────────────────────────────── */

export type ImagePreset =
  | "default" | "outfit-wide" | "bundle" | "tool" | "half" | "kicks" | "standard" | "full" | "square";

export interface Offer {
  id: string;
  order: number;
  sortPriority: number;
  title: string;
  subtitle: string | null;
  kind: OfferKind;
  isBundle: boolean;
  preset: ImagePreset;
  cols: 1 | 2 | 3 | 4;
  images: string[];
  colors: { gradient: string; text: string; accent: string };
  price: { final: number; regular: number; formattedFinal: string; formattedRegular: string };
  // Pastilla sobre el nombre: descuento (blanca) o banner como "¡NUEVO!" (amarilla).
  pill: { text: string; tone: "white" | "yellow" } | null;
  features: string[];
  offerTag: string | null;
  outDate?: string;
  description: string | null;
  typeLabel: string | null;
  rarityLabel: string | null;
  setText: string | null;
  track: { artist?: string; album?: string; year?: number; bpm?: number; duration?: number } | null;
  variants: { name: string; image: string }[];
  included: { id: string; name: string; type?: string; image?: string }[];
  searchText: string;
}

export interface ShopGroup { id: number; displayType: string; offers: Offer[] }
export interface ShopSection {
  id: string;
  domId: string;
  name: string;
  rank: number;
  index: number;
  category: string | null;
  background: SectionBackground;
  subtitle: string | null;
  groups: ShopGroup[];
}
export interface ShopCategory { id: string; label: string; category: string | null; sectionIds: string[] }
export interface ShopModel { sections: ShopSection[]; categories: ShopCategory[] }

const SIZE_COLS: Record<string, 1 | 2 | 3 | 4> = { Size_1_x_1: 1, Size_2_x_1: 2, Size_3_x_1: 3, Size_4_x_1: 4 };

// date: fecha de la tienda (data.date, medianoche UTC) → elige la variante de fondo del día.
// namesEs: nombres de sección en español por id (para encontrar las imágenes propias en inglés).
export function buildShop(
  entries: ApiEntry[],
  t: ShopText,
  { date, namesEs }: { date?: string | null; namesEs?: Record<string, string> | null } = {},
): ShopModel {
  const nf = new Intl.NumberFormat(t.locale);
  const day = Math.floor((Date.parse(date ?? "") || Date.now()) / 86_400_000);
  const sections = new Map<string, Omit<ShopSection, "groups"> & { groups: Map<number, ShopGroup> }>();

  entries.forEach((entry, order) => {
    // Las entradas sin layout (p. ej. "alc.0") no se muestran en la tienda oficial.
    if (!entry.layout) return;
    const offer = toOffer(entry, order, t, nf);
    if (!offer) return;

    const { layout } = entry;
    let section = sections.get(layout.id);
    if (!section) {
      const name = layout.name?.trim() || layout.id;
      section = {
        id: layout.id,
        domId: `fns-${layout.id.toLowerCase()}`,
        name,
        rank: layout.rank ?? 0,
        index: layout.index ?? 0,
        category: layout.category?.trim() || null,
        background: sectionBackground(layout.id, [name, namesEs?.[layout.id]], day),
        subtitle: sectionSubtitle(layout.id, t.apiLang),
        groups: new Map(),
      };
      sections.set(layout.id, section);
    }

    const groupId = Number(entry.layoutId?.split(".").pop()) || 0;
    let group = section.groups.get(groupId);
    if (!group) {
      group = { id: groupId, displayType: layout.displayType || "tileGrid", offers: [] };
      section.groups.set(groupId, group);
    }
    group.offers.push(offer);
  });

  const sorted: ShopSection[] = [...sections.values()]
    .sort((a, b) => b.rank - a.rank || a.index - b.index)
    .map((section) => ({
      ...section,
      groups: [...section.groups.values()]
        .sort((a, b) => b.id - a.id)
        .map((group) => ({
          ...group,
          offers: group.offers.sort((a, b) => b.sortPriority - a.sortPriority || a.order - b.order),
        })),
    }));

  return { sections: sorted, categories: buildCategories(sorted) };
}

// Menú lateral: secciones consecutivas con la misma layout.category se agrupan (p. ej. "Calienta los motores").
function buildCategories(sections: ShopSection[]): ShopCategory[] {
  const categories: ShopCategory[] = [];
  for (const section of sections) {
    const last = categories[categories.length - 1];
    if (section.category && last?.category === section.category) {
      last.sectionIds.push(section.domId);
    } else {
      categories.push({
        id: section.domId,
        label: section.category || section.name,
        category: section.category,
        sectionIds: [section.domId],
      });
    }
  }
  return categories;
}

// Búsqueda (sin acentos) y filtro por tipo; elimina grupos y secciones vacíos.
export function filterShop(shop: ShopModel, query: string, types: Set<OfferKind>): ShopModel {
  const q = normalize(query);
  if (!q && types.size === 0) return shop;
  const sections = shop.sections
    .map((section) => {
      const sectionMatch = q && normalize(section.name).includes(q);
      const groups = section.groups
        .map((group) => ({
          ...group,
          offers: group.offers.filter(
            (o) => (!q || sectionMatch || o.searchText.includes(q)) && (types.size === 0 || types.has(o.kind)),
          ),
        }))
        .filter((g) => g.offers.length);
      return { ...section, groups };
    })
    .filter((s) => s.groups.length);
  const visible = new Set(sections.map((s) => s.domId));
  const categories = shop.categories
    .map((c) => ({ ...c, sectionIds: c.sectionIds.filter((id) => visible.has(id)) }))
    .filter((c) => c.sectionIds.length);
  return { sections, categories };
}

function normalize(s: string | null | undefined): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/* ── Oferta individual ─────────────────────────────────────────────── */

const TYPE_KIND: Record<string, OfferKind> = {
  emote: "emote",
  pickaxe: "pickaxe",
  backpack: "backpack",
  glider: "glider",
  wrap: "wrap",
  shoe: "shoe",
  sidekick: "sidekick",
};

function toOffer(entry: ApiEntry, order: number, t: ShopText, nf: Intl.NumberFormat): Offer | null {
  const br = entry.brItems ?? [];
  const car = entry.cars?.[0];
  const instrument = entry.instruments?.[0];
  // Solo es "pista" si la oferta no trae nada más (los lotes de artistas también incluyen pistas).
  const track = !entry.bundle && !br.length && !car && !instrument ? entry.tracks?.[0] ?? null : null;
  const outfit = br.find((i) => i.type?.value === "outfit");
  const main = outfit ?? br[0] ?? car ?? instrument ?? entry.legoKits?.[0];

  const title = entry.bundle?.name || track?.title || main?.name || nameFromDevName(entry.devName);
  if (!title) return null;

  const kind: OfferKind = track
    ? "jamtrack"
    : car
      ? "car"
      : entry.bundle
        ? "bundle"
        : outfit
          ? "outfit"
          : instrument && !br.length
            ? "instrument"
            : TYPE_KIND[br[0]?.type?.value ?? ""] || "other";

  const cols = SIZE_COLS[entry.tileSize ?? ""] ?? 1;
  const images = offerImages(entry, track, car, instrument, main);
  if (!images.length) return null;

  const regular = entry.regularPrice ?? entry.finalPrice;
  const final = entry.finalPrice;

  // Como la oficial: el descuento va en pastilla blanca y el resto de banners ("Nuevo",
  // "Personalizable", "Reacciona a la música"…) en pastilla amarilla con signos de exclamación.
  let pill: Offer["pill"] = null;
  const banner = entry.banner?.value?.replace(/^[¡!\s]+|[!\s]+$/g, "");
  if (banner) {
    pill =
      entry.banner?.backendValue === "AmountOff"
        ? { text: regular > final ? t.amountOff(nf.format(regular - final)) : banner, tone: "white" }
        : { text: t.bannerText(banner), tone: "yellow" };
  }
  const features: string[] = [];
  if (br.some((i) => i.variants?.some((v) => (v.options?.length ?? 0) > 1))) features.push(t.selectableStyles);

  const included = [
    ...br.map((i) => ({
      id: i.id,
      name: i.name ?? "",
      type: i.type?.displayValue,
      image: i.images?.icon || i.images?.smallIcon || i.images?.featured,
    })),
    ...(entry.cars ?? []).map((c) => ({
      id: c.id,
      name: c.name ?? "",
      type: c.type?.displayValue,
      image: c.images?.small || c.images?.large,
    })),
    ...(entry.instruments ?? []).map((i) => ({
      id: i.id,
      name: i.name ?? "",
      type: i.type?.displayValue,
      image: i.images?.small || i.images?.large,
    })),
  ];

  return {
    id: entry.offerId,
    order,
    sortPriority: entry.sortPriority ?? 0,
    title,
    subtitle: track?.artist || null,
    kind,
    isBundle: kind === "bundle" || br.length > 1 || (entry.cars?.length ?? 0) > 1,
    preset: imagePreset(kind, cols, br.length),
    cols,
    images,
    colors: offerColors(entry.colors),
    price: { final, regular, formattedFinal: nf.format(final), formattedRegular: nf.format(regular) },
    pill,
    features,
    offerTag: entry.offerTag?.text ? stripMarkup(entry.offerTag.text) : null,
    outDate: entry.outDate,
    description: track || entry.bundle ? null : main?.description || null,
    typeLabel: offerTypeLabel(entry, track, outfit, main, t),
    rarityLabel: main?.series?.value || main?.rarity?.displayValue || null,
    setText: main?.set?.text || null,
    track: track
      ? { artist: track.artist, album: track.album, year: track.releaseYear, bpm: track.bpm, duration: track.duration }
      : null,
    variants: collectVariants(br),
    included,
    searchText: normalize([title, track?.artist, ...included.map((i) => i.name)].join(" ")),
  };
}

// Tipo que muestra la oficial en la franja de la tarjeta (comprobado contra fortnite.com):
// lote → "Lote" (los de vehículo: "Carrocería [y bonificación]"); atuendo + 1 objeto →
// "Atuendo y bonificación"; atuendo + 2 o más → "Paquete y bonificación"; varios objetos sin
// atuendo → "Paquete"; un solo objeto → su tipo ("Pico", "Gesto", "Mochila retro"…).
function offerTypeLabel(
  entry: ApiEntry,
  track: ApiTrack | null,
  outfit: ApiItem | undefined,
  main: ApiItem | undefined,
  t: ShopText,
): string | null {
  if (track) return t.jamTrack;
  const br = entry.brItems ?? [];
  const cars = entry.cars ?? [];
  if (entry.bundle) {
    if (cars.length && !br.length) {
      const hasBody = cars.some((c) => c.type?.value === "body");
      return hasBody && cars.length > 1 ? t.carBodyBonus : t.carBody;
    }
    return t.bundle;
  }
  const count = br.length + cars.length + (entry.instruments?.length ?? 0) + (entry.legoKits?.length ?? 0);
  if (outfit) return count === 1 ? outfit.type?.displayValue || null : count === 2 ? t.outfitBonus : t.packBonus;
  if (count > 1) return t.pack;
  return t.typeNames[main?.type?.value ?? ""] || main?.type?.displayValue || null;
}

// Presets de posición de imagen de la tienda oficial (ver fortnite-shop.css).
function imagePreset(kind: OfferKind, cols: number, brCount: number): ImagePreset {
  if (kind === "jamtrack") return "square";
  if (kind === "car") return cols >= 2 ? "full" : "standard";
  if (kind === "bundle" || (kind === "outfit" && brCount > 1)) return "bundle";
  if (kind === "outfit") return cols > 1 ? "outfit-wide" : "default";
  if (kind === "pickaxe" || kind === "instrument") return "tool";
  if (kind === "backpack" || kind === "glider") return "half";
  if (kind === "shoe") return "kicks";
  return "standard";
}

function offerImages(
  entry: ApiEntry,
  track: ApiTrack | null,
  car: ApiItem | undefined,
  instrument: ApiItem | undefined,
  main: ApiItem | undefined,
): string[] {
  if (track?.albumArt) return [track.albumArt];
  const renders = entry.newDisplayAsset?.renderImages ?? [];
  const brRenders = renders.filter((r) => r.productTag === "Product.BR");
  const list = (brRenders.length ? brRenders : renders).map((r) => r.image).filter((u): u is string => !!u);
  if (list.length) return [...new Set(list)];
  const fallback =
    entry.bundle?.image || main?.images?.featured || main?.images?.icon || car?.images?.large || instrument?.images?.large;
  return fallback ? [fallback] : [];
}

function hex(c?: string): string | null {
  return c && c.length >= 6 ? `#${c.slice(0, 6)}` : null;
}

// La tienda oficial pinta el fondo con color1 → color2 → color3; en fortnite-api color2/color3 vienen invertidos.
function offerColors(colors: ApiEntry["colors"] = {}) {
  const stops = [hex(colors.color1), hex(colors.color3), hex(colors.color2)].filter((s): s is string => !!s);
  if (!stops.length) stops.push("#3d8fe0", "#1f6cc4", "#0f4d99");
  if (stops.length === 1) stops.push(stops[0]);
  return {
    gradient: `linear-gradient(${stops.join(", ")})`,
    text: hex(colors.textBackgroundColor) || stops[stops.length - 1],
    accent: stops[0],
  };
}

function collectVariants(brItems: ApiItem[]) {
  const out: { name: string; image: string }[] = [];
  for (const item of brItems) {
    for (const channel of item.variants ?? []) {
      for (const opt of channel.options ?? []) {
        if (opt.image) out.push({ name: opt.name ?? "", image: opt.image });
      }
    }
  }
  return out.slice(0, 24);
}

function nameFromDevName(devName?: string): string | null {
  const m = devName?.match(/\[VIRTUAL\]\d+ x (.+?)(?:,| for )/);
  const name = m?.[1]?.trim();
  return name && name !== "Blank" && !name.startsWith("TBD") ? name : null;
}

function stripMarkup(text: string): string {
  return text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}
