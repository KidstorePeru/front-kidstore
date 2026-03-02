// src/pages/fortnite/FortnitePaseBatalla.tsx
import { useLang } from "../../context/LangContext";
import FortniteProductLayout from "./FortniteProductLayout";
import type { FnProduct } from "./FortniteProductLayout";

const FortnitePaseBatalla = () => {
  const { t } = useLang();

  const PASES: FnProduct[] = [
    { id: "club-try",    name: t("fortnite", "bpClubTry"),   desc: "", pricePEN: 19.90, image: "/images/fortnite/pases/club.png"     },
    { id: "club-xbox-1", name: t("fortnite", "bpClubXbox1"), desc: "", pricePEN: 14.90, image: "/images/fortnite/pases/club.png"     },
    { id: "club-xbox-2", name: t("fortnite", "bpClubXbox2"), desc: "", pricePEN: 29.90, image: "/images/fortnite/pases/club.png"     },
    { id: "club-xbox-3", name: t("fortnite", "bpClubXbox3"), desc: "", pricePEN: 49.90, image: "/images/fortnite/pases/club.png"     },
    { id: "battle-pass", name: t("fortnite", "bpBattlePass"),desc: "", pricePEN: 22.90, image: "/images/fortnite/pases/battle-pass.jpg" },
    { id: "og-pass",     name: t("fortnite", "bpOGPass"),    desc: "", pricePEN: 22.90, image: "/images/fortnite/pases/og-pass.jpg"     },
    { id: "music-pass",  name: t("fortnite", "bpMusicPass"), desc: "", pricePEN: 29.90, image: "/images/fortnite/pases/music-pass.jpg"  },
    { id: "lego-pass",   name: t("fortnite", "bpLegoPass"),  desc: "", pricePEN: 29.90, image: "/images/fortnite/pases/lego-pass.jpg"   },
  ];

  const infoBox = (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
      <h3 className="text-white font-black text-lg" style={{ fontFamily: "BurbankBig" }}>
        {t("fortnite", "bpInfoTitle")}
      </h3>
      <div className="space-y-2">
        <p className="text-white font-bold text-sm">{t("fortnite", "bpClubTitle")}</p>
        <p className="text-white/60 text-sm leading-relaxed">{t("fortnite", "bpClubDesc")}</p>
      </div>
      <div className="space-y-2 border-t border-white/10 pt-4">
        <p className="text-white font-bold text-sm">{t("fortnite", "bpBattleTitle")}</p>
        <p className="text-white/60 text-sm leading-relaxed">{t("fortnite", "bpBattleDesc")}</p>
      </div>
      <div className="space-y-2 border-t border-white/10 pt-4">
        <p className="text-white font-bold text-sm">{t("fortnite", "bpSpecialTitle")}</p>
        <p className="text-white/60 text-sm leading-relaxed">{t("fortnite", "bpSpecialDesc")}</p>
      </div>
      <div className="space-y-1 text-sm text-white/60 border-t border-white/10 pt-4">
        <p>{t("fortnite", "bpInfoActivation")}</p>
        <p>{t("fortnite", "bpInfoSafe")}</p>
      </div>
    </div>
  );

  return (
    <FortniteProductLayout
      title={t("fortnite", "bpTitle")}
      info=""
      products={PASES}
      infoBox={infoBox}
      variant="pase"
    />
  );
};

export default FortnitePaseBatalla;
