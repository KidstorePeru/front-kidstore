import { motion } from "framer-motion";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";
import { usePriceConverter } from "../hooks/usePriceConverter";
import { useLang } from "../context/LangContext";

const products = [
  { id: "pk-100",   name: "100 PokéCoins",   basePen: 2.9,   image: "/images/pokemongo/coins/100-coins.png"    },
  { id: "pk-550",   name: "550 PokéCoins",   basePen: 9.9,   image: "/images/pokemongo/coins/550-coins.png"    },
  { id: "pk-1200",  name: "1200 PokéCoins",  basePen: 17.9,  image: "/images/pokemongo/coins/1200-coins.png"   },
  { id: "pk-2500",  name: "2500 PokéCoins",  basePen: 33.9,  image: "/images/pokemongo/coins/2500-coins.png"   },
  { id: "pk-5200",  name: "5200 PokéCoins",  basePen: 68.9,  image: "/images/pokemongo/coins/5200-coins.png"   },
  { id: "pk-14500", name: "14500 PokéCoins", basePen: 171.9, image: "/images/pokemongo/coins/14500-coins.png"  },
  { id: "pk-pack",  name: "Caja Iniciación 📦", basePen: 5.9, image: "/images/pokemongo/pack/iniciacion.png" },
  { id: "pk-pass",  name: "🎫 Pase de GO Deluxe: Marzo", basePen: 18.9, image: "/images/pokemongo/pases/pase-de-go-deluxe-30-aniversario.png" },
  { id: "pk-kalos", name: "🎟️ Pase de GO Deluxe: Celebración del 30.° aniversario de Pokémon", basePen: 18.9, image: "/images/pokemongo/images/pase-de-go-deluxe-marzo.png" },
];

const Pokemon = () => {
  const { addToCart } = useCart();
  const { format, cartPrice, symbol } = usePriceConverter();
  const { t } = useLang();

  return (
    <CategoryShell title="Pokémon GO" subtitle={t("pokemon", "subtitle")}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }} transition={{ duration: 0.25 }}
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
            <p className="text-blue-400 text-xl font-bold mb-4">{format(product.basePen)}</p>
            <button
              onClick={() => addToCart({ id: product.id, name: product.name, price: cartPrice(product.basePen), image: product.image })}
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
        <p>{t("pokemon", "delivery")}</p>
        <p>{t("pokemon", "disclaimer")}</p>
      </div>
    </CategoryShell>
  );
};

export default Pokemon;
