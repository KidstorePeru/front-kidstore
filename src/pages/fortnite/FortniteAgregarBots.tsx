// src/pages/fortnite/FortniteAgregarBots.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryShell from "../../components/layout/CategoryShell";
import { useLang } from "../../context/LangContext";

const ACCOUNTS = [
  "KIDSTORE0001","KIDSTORE0002","KIDSTORE0003","KIDSTORE0004","KIDSTORE0005",
  "KIDSTORE0006","KIDSTORE0007","KIDSTORE0008","KIDSTORE0009","KIDSTORE0010",
  "KIDSTORE0011","KIDSTORE0012","KIDSTORE0013","KIDSTORE0014","KIDSTORE0015",
];

const FortniteAgregarBots = () => {
  const navigate            = useNavigate();
  const { t }               = useLang();
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const subtitle = (
    <>
      {t("fortnite", "botsSubtitle")}{" "}
      <span className="text-orange-400 font-black">{t("fortnite", "botsHours")}</span>{" "}
      {t("fortnite", "botsHoursHint")}
    </>
  );

  return (
    <CategoryShell title={t("fortnite", "botsTitle")} subtitle={subtitle}>

      {/* Breadcrumb */}
      <button
        onClick={() => navigate("/fortnite")}
        className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-bold mb-8 transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        {t("fortnite", "backHome")} / <span className="text-white">{t("fortnite", "botsTitle")}</span>
      </button>

      {/* Grid de cuentas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {ACCOUNTS.map((id) => (
          <div
            key={id}
            className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 flex flex-col items-center gap-3 hover:border-blue-500/40 transition"
          >
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#0f1a2e] border-2 border-blue-900/50 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={1.5} className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>

            {/* Epic ID */}
            <div className="text-center">
              <p className="text-white/30 text-[10px] uppercase tracking-widest">
                {t("fortnite", "botsEpicId")}
              </p>
              <p className="text-white font-black text-sm"
                style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}>
                {id}
              </p>
            </div>

            {/* Botón copiar */}
            <button
              onClick={() => handleCopy(id)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-blue-900/60 bg-blue-950/40 hover:bg-blue-900/50 text-blue-400 text-xs font-bold transition active:scale-95 cursor-pointer"
            >
              {copied === id ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  {t("fortnite", "botsCopied")}
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  {t("fortnite", "botsCopyId")}
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </CategoryShell>
  );
};

export default FortniteAgregarBots;
