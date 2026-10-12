// Genera src/components/game/fortnite-shop/sectionBackgrounds.generated.ts con un import por cada
// imagen de src/assets/secciones. Así, para añadir o cambiar el fondo de una sección basta con
// dejar la imagen en esa carpeta con el nombre de la sección ("Look del día.jpg"); las variantes
// "Look del día 2.jpg", "Look del día 3.png"… rotan cada día con la tienda.
// Se ejecuta solo antes de `npm run dev` y `npm run build` (predev / prebuild) o con `npm run fondos`.
import { existsSync, readdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src", "assets", "secciones");
const out = join(root, "src", "components", "game", "fortnite-shop", "sectionBackgrounds.generated.ts");

// En producción el optimizador de imágenes de Next (/_next/image) no encuentra los archivos cuyo
// nombre lleva tildes, eñes o apóstrofos ("Look del día.jpg", "Five Nights at Freddy's.jpg") y
// responde 400, así que el fondo no aparece. Se renombran a una versión sin esos caracteres
// ("Look del dia.jpg"); la tienda compara los nombres sin tildes ni signos, así que sigue
// encontrando la sección.
const safeName = (f) =>
  f
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ._()!-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
for (const f of readdirSync(dir)) {
  const safe = safeName(f);
  if (safe === f) continue;
  if (existsSync(join(dir, safe))) {
    console.warn(`[fondos] No se renombra "${f}": ya existe "${safe}".`);
    continue;
  }
  renameSync(join(dir, f), join(dir, safe));
  console.log(`[fondos] "${f}" → "${safe}"`);
}

// AVIF → WebP: Turbopack no sabe leer AVIF al compilar (avisa en cada build y no las optimiza).
// Se convierten una vez con sharp (viene con Next) a WebP de alta calidad y se borra el AVIF.
// Si sharp no está disponible se dejan como están (la web funciona igual).
const avifs = readdirSync(dir).filter((f) => /\.avif$/i.test(f));
if (avifs.length) {
  try {
    const { default: sharp } = await import("sharp");
    for (const f of avifs) {
      const webp = f.replace(/\.avif$/i, ".webp");
      if (existsSync(join(dir, webp))) {
        console.warn(`[fondos] No se convierte "${f}": ya existe "${webp}".`);
        continue;
      }
      await sharp(join(dir, f)).webp({ quality: 90 }).toFile(join(dir, webp));
      unlinkSync(join(dir, f));
      console.log(`[fondos] "${f}" → "${webp}"`);
    }
  } catch (err) {
    console.warn("[fondos] No se pudieron convertir los AVIF a WebP:", err?.message || err);
  }
}

const files = readdirSync(dir)
  .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, "es"));

const lines = [
  "// Generado por scripts/gen-section-backgrounds.mjs a partir de src/assets/secciones. No editar a mano.",
  'import type { StaticImageData } from "next/image";',
  ...files.map((f, i) => `import bg${i} from ${JSON.stringify(`@/assets/secciones/${f}`)};`),
  "",
  "export const LOCAL_BACKGROUNDS: { file: string; image: StaticImageData }[] = [",
  ...files.map((f, i) => `  { file: ${JSON.stringify(f)}, image: bg${i} },`),
  "];",
  "",
];
const next = lines.join("\n");

let prev = "";
try {
  prev = readFileSync(out, "utf8");
} catch {
  /* primera vez */
}
if (prev !== next) {
  writeFileSync(out, next, "utf8");
  console.log(`[fondos] ${files.length} fondos de sección → ${out.replace(root, ".")}`);
}
