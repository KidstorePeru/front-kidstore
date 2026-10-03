// Genera src/components/game/fortnite-shop/sectionBackgrounds.generated.ts con un import por cada
// imagen de src/assets/secciones. Así, para añadir o cambiar el fondo de una sección basta con
// dejar la imagen en esa carpeta con el nombre de la sección ("Look del día.jpg"); las variantes
// "Look del día 2.jpg", "Look del día 3.png"… rotan cada día con la tienda.
// Se ejecuta solo antes de `npm run dev` y `npm run build` (predev / prebuild) o con `npm run fondos`.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src", "assets", "secciones");
const out = join(root, "src", "components", "game", "fortnite-shop", "sectionBackgrounds.generated.ts");

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
