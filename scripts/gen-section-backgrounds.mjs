// Genera src/components/game/fortnite-shop/sectionBackgrounds.generated.ts con un import por cada
// imagen de src/assets/secciones. Así, para añadir o cambiar el fondo de una sección basta con
// dejar la imagen en esa carpeta con el nombre de la sección ("Look del día.jpg"); las variantes
// "Look del día 2.jpg", "Look del día 3.png"… rotan cada día con la tienda.
// Se ejecuta solo antes de `npm run dev` y `npm run build` (predev / prebuild) o con `npm run fondos`.
import { existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
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
    .replace(/[̀-ͯ]/g, "")
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
