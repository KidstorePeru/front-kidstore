"use client";
import { useState, useEffect } from "react";
import { usePreferences } from "@/context/PreferencesContext";

// Precio fijo base: 100 V-Bucks = S/ 1.50 PEN
const PEN_PER_100_VBUCKS = 1.30;

export function useFortniteExchangeRate() {
  const { currency, rates } = usePreferences();

  // Tasa de conversión activa (desde PreferencesContext que ya tiene la API)
  const activeRate = rates[currency] ?? 1;

  /** V-Bucks → precio en la moneda activa (para mostrar en tienda) */
  function vbucksToSoles(vbucks: number): string {
    const pen = (vbucks / 100) * PEN_PER_100_VBUCKS;
    return (pen * activeRate).toFixed(2);
  }

  /** V-Bucks → precio en PEN (para guardar en carrito — base siempre PEN) */
  function vbucksToPen(vbucks: number): number {
    return (vbucks / 100) * PEN_PER_100_VBUCKS;
  }

  /** Símbolo de la moneda activa */
  function currencySymbol(): string {
    if (currency === "USD") return "$";
    if (currency === "EUR") return "€";
    return "S/";
  }

  /** Nota referencial dinámica */
  const sym = currencySymbol();
  const baseInActiveCurrency = (PEN_PER_100_VBUCKS * activeRate).toFixed(2);
  const referentialNote = `100 Pavos = ${sym} ${baseInActiveCurrency} · Precio base`;

  return { vbucksToSoles, vbucksToPen, currencySymbol, referentialNote };
}
