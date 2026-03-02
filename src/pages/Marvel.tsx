import { motion } from "framer-motion";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";
import { usePriceConverter } from "../hooks/usePriceConverter";
import { useLang } from "../context/LangContext";

const products = [
  { id: "lat-100",   name: "100 LATTICE",   basePen: 3.9,   image: "/images/marvelrivals/100-lattices.png" },
  { id: "lat-500",   name: "500 LATTICE",   basePen: 18.9,  image: "/images/marvelrivals/500-lattices.png" },
  { id: "lat-1000",  name: "1000 LATTICE",  basePen: 35.9,  image: "/images/marvelrivals/1000-lattices.png" },
  { id: "lat-2180",  name: "2180 LATTICE",  basePen: 69.9,  image: "/images/marvelrivals/2180-lattices.png" },
  { id: "lat-5680",  name: "5680 LATTICE",  basePen: 168.9, image: "/images/marvelrivals/5680-lattices.png" },
  { id: "lat-11680", name: "11680 LATTICE", basePen: 333.9, image: "/images/marvelrivals/11680-lattices.png" },
];

const Marvel = () => {
  const { addToCart } = useCart();
  const { format, cartPrice, symbol } = usePriceConverter();
  const { t } = useLang();

  return (
    <CategoryShell title="Marvel Rivals" subtitle={t("marvel", "subtitle")}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.25 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="relative overflow-hidden rounded-xl mb-4 aspect-square bg-black/30 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <span className="text-gray-500 text-sm hidden w-full h-full items-center justify-center">
                {t("product", "imageHere")}
              </span>
            </div>

            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-blue-400 text-xl font-bold mb-4">
              {format(product.basePen)}
            </p>

            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: cartPrice(product.basePen),
                  image: product.image,
                })
              }
              className="w-full bg-blue-600 hover:bg-blue-500 transition rounded-xl py-2 font-semibold cursor-pointer"
            >
              {t("product", "addToCart")}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-right">
        {t("product", "pricesIn")} {symbol} · {t("product", "currencyNote")}
      </div>

      <div className="mt-10 text-sm text-gray-400 max-w-3xl space-y-1">
        <p>{t("marvel", "tip1")}</p>
        <p>{t("marvel", "tip2")}</p>
      </div>
    </CategoryShell>
  );
};

export default Marvel;
