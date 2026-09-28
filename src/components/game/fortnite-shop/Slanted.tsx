import { Fragment } from "react";

// Texto inclinado 12,2° como la cursiva oficial. Se inclina palabra a palabra (no el bloque
// entero) para que, si el título ocupa varias líneas, cada línea quede alineada a la izquierda
// igual que con una cursiva real.
export default function Slanted({ text }: { text: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="fns-w">{w}</span>
        </Fragment>
      ))}
    </>
  );
}
