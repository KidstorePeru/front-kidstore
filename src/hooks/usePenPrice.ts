"use client";

/**
 * usePenPrice
 * -----------
 * Hook for components whose base prices are in PEN (S/).
 * Delegates to PreferencesContext to avoid duplicate API calls.
 *
 * Usage:
 *   const { fmt, sym } = usePenPrice();
 *   fmt(14.99)  →  "S/ 14.99" | "$4.03" | "€3.70"
 */

import { usePreferences } from "@/context/PreferencesContext";

export function usePenPrice() {
  const { currency, formatPrice, currencySymbol } = usePreferences();

  return { fmt: formatPrice, sym: currencySymbol, currency };
}
