"use client";

import {
  createContext, useContext, useState, useEffect,
  ReactNode, useCallback,
} from "react";

export type Lang     = "ES" | "EN";
export type Currency = "PEN" | "USD" | "EUR";
export type Theme    = "dark" | "light";

const SYMBOLS: Record<Currency, string> = {
  PEN: "S/",
  USD: "$",
  EUR: "€",
};

// Fallback si la API falla (1 PEN en otras monedas)
const FALLBACK: Record<Currency, number> = {
  PEN: 1,
  USD: 0.269,
  EUR: 0.247,
};

interface Preferences {
  lang:        Lang;
  currency:    Currency;
  theme:       Theme;
  setLang:     (l: Lang)     => void;
  setCurrency: (c: Currency) => void;
  setTheme:    (t: Theme)    => void;
  /**
   * formatPrice(penPrice)
   * Recibe un precio en PEN (S/) y lo convierte a la moneda seleccionada.
   * Usa el tipo de cambio diario de open.er-api.com
   * Ejemplo: formatPrice(14.99) → "S/ 14.99" | "$4.03" | "€3.70"
   */
  formatPrice: (penPrice: number) => string;
  /** Símbolo de la moneda activa: "S/" | "$" | "€" */
  currencySymbol: string;
  ratesReady:  boolean;
  /** Tipos de cambio actuales base PEN */
  rates: Record<Currency, number>;
}

const PreferencesContext = createContext<Preferences>({
  lang:           "ES",
  currency:       "PEN",
  theme:          "light",
  setLang:        () => {},
  setCurrency:    () => {},
  setTheme:       () => {},
  formatPrice:    (p) => `S/ ${p.toFixed(2)}`,
  currencySymbol: "S/",
  ratesReady:     false,
  rates:          { PEN: 1, USD: 0.269, EUR: 0.247 },
});

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [lang,       setLangRaw]     = useState<Lang>("ES");
  const [currency,   setCurrencyRaw] = useState<Currency>("PEN");
  const [theme,      setThemeRaw]    = useState<Theme>("light");
  const [rates,      setRates]       = useState<Record<Currency, number>>(FALLBACK);
  const [ratesReady, setRatesReady]  = useState(false);

  // Cargar preferencias guardadas al montar
  useEffect(() => {
    const savedLang     = localStorage.getItem("kidstore_lang")     as Lang     | null;
    const savedCurrency = localStorage.getItem("kidstore_currency") as Currency | null;
    const savedTheme    = localStorage.getItem("kidstore_theme")    as Theme    | null;
    if (savedLang     && ["ES","EN"].includes(savedLang))               setLangRaw(savedLang);
    if (savedCurrency && ["PEN","USD","EUR"].includes(savedCurrency))   setCurrencyRaw(savedCurrency);
    if (savedTheme    && ["light","dark"].includes(savedTheme))         setThemeRaw(savedTheme);
  }, []);

  // Wrappers que persisten en localStorage
  const setLang     = (l: Lang)     => { setLangRaw(l);     localStorage.setItem("kidstore_lang",     l); };
  const setCurrency = (c: Currency) => { setCurrencyRaw(c); localStorage.setItem("kidstore_currency", c); };
  const setTheme    = (t: Theme)    => { setThemeRaw(t);    localStorage.setItem("kidstore_theme",    t); };

  // Aplica tema e idioma al <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === "EN" ? "en" : "es";
  }, [lang]);

  // Tipo de cambio diario — base PEN
  useEffect(() => {
    const controller = new AbortController();
    fetch("https://open.er-api.com/v6/latest/PEN", { signal: controller.signal })
      .then(r => r.json())
      .then(d => {
        if (d?.rates) {
          setRates({ PEN: 1, USD: d.rates.USD ?? FALLBACK.USD, EUR: d.rates.EUR ?? FALLBACK.EUR });
        }
        setRatesReady(true);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setRatesReady(true);
      });
    return () => controller.abort();
  }, []);

  // Convierte PEN → moneda seleccionada
  const formatPrice = useCallback((penPrice: number): string => {
    const sym       = SYMBOLS[currency];
    const converted = penPrice * rates[currency];
    return `${sym} ${converted.toFixed(2)}`;
  }, [currency, rates]);

  const currencySymbol = SYMBOLS[currency];

  return (
    <PreferencesContext.Provider value={{
      lang, currency, theme,
      setLang, setCurrency, setTheme,
      formatPrice, currencySymbol, ratesReady, rates,
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export const usePreferences = () => useContext(PreferencesContext);
