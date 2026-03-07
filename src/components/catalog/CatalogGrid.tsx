import CategoryCard from "./CategoryCard";

const categories = [
  { name: "Fortnite",         image: "/images/fortnite.jpg",  slug: "fortnite",          visible: true  },
  { name: "Wild Rift",        image: "/images/wildrift.jpg",  slug: "wild-rift",         visible: true },
  { name: "Marvel Rivals",    image: "/images/marvel.jpg",    slug: "marvel-rivals",     visible: true },
  { name: "Pokémon GO",       image: "/images/pokemon.jpg",   slug: "pokemon-go",        visible: true },
  { name: "Roblox",           image: "/images/roblox.jpg",    slug: "roblox",            visible: false },
  { name: "Genshin Impact",   image: "/images/genshin.jpg",   slug: "genshin-impact",    visible: false },
  { name: "Zenless Zone Zero",image: "/images/zzz.jpg",       slug: "zenless-zone-zero", visible: false },
  { name: "Honkai Star Rail",  image: "/images/honkai.jpg",   slug: "honkai-star-rail",  visible: false },
  { name: "Wuthering Waves",  image: "/images/wuwa.jpg",      slug: "wuthering-waves",   visible: false },
  { name: "Honor of Kings",   image: "/images/honor.jpg",     slug: "honor-of-kings",    visible: false },
  { name: "Discord",          image: "/images/discord.jpg",   slug: "discord",           visible: false },
];

const SHOW_COMING_SOON = true;

const CatalogGrid = () => {
  const visible = categories.filter(cat => cat.visible);
  const hidden  = categories.filter(cat => !cat.visible);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {visible.map((cat) => (
          <CategoryCard
            key={cat.slug}
            name={cat.name}
            image={cat.image}
            slug={cat.slug}
          />
        ))}

        {/* Banner Próximamente */}
        {SHOW_COMING_SOON && hidden.length > 0 && (
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-3 rounded-2xl border border-dashed border-white/20 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
            <span className="text-4xl">🚀</span>
            <p
              className="text-white font-black text-xl uppercase tracking-widest"
              style={{ fontFamily: "'BurbankBig','Arial Black',sans-serif" }}
            >
              Próximamente
            </p>
            <p className="text-white/40 text-sm max-w-xs">
              Estamos trabajando para traerte más juegos. ¡Vuelve pronto!
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {hidden.map(cat => (
                <span
                  key={cat.slug}
                  className="text-xs text-white/80 bg-white/10 border border-white/10 rounded-full px-3 py-1"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogGrid;
