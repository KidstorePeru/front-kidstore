import { VBuckIcon } from "./Icons";
import type { Offer } from "./model";
import type { ShopText } from "./i18n";

// Precio en monedas V como la tienda oficial y, al lado, el equivalente en la moneda de KidStore.
export default function Price({
  price,
  t,
  local,
  className = "",
}: {
  price: Offer["price"];
  t: ShopText;
  local?: string;
  className?: string;
}) {
  const discounted = price.regular > price.final;
  return (
    <div className={`fns-price ${className}`}>
      <span className="fns-sr-only">{discounted ? t.vbucksDiscount : t.vbucksPrice}</span>
      <span className="fns-price__current">
        <VBuckIcon className="fns-price__icon" />
        {price.formattedFinal}
      </span>
      {discounted && (
        <>
          <span className="fns-sr-only">{t.vbucksOriginal}</span>
          <s className="fns-price__original">{price.formattedRegular}</s>
        </>
      )}
      {local && <span className="fns-price__local">{local}</span>}
    </div>
  );
}
