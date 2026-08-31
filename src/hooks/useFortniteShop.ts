"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = "https://fortnite-api.com/v2/shop";
const MAX_CACHE_ENTRIES = 10;
const cache = new Map<string, FortniteShopData>();

export interface FortniteBRItem {
  id: string;
  name: string;
  description?: string;
  type?: { value: string; displayValue: string };
  rarity?: { value: string; displayValue: string };
  series?: { value: string };
  set?: { text: string };
  images?: { icon?: string; featured?: string; smallIcon?: string };
  added?: string;
}

export interface FortniteTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  releaseYear?: number;
  images?: { coverArt?: string };
}

export interface FortniteEntry {
  offerId: string;
  finalPrice: number;
  regularPrice: number;
  tileSize: string;
  sortPriority?: number;
  giftable?: boolean;
  outDate?: string;
  banner?: { value: string; intensity: string; backendValue: string };
  layout?: { id: string; name: string; rank: number };
  bundle?: { name: string; info: string; image: string };
  brItems?: FortniteBRItem[];
  tracks?: FortniteTrack[];
}

export interface FortniteShopData {
  hash: string;
  date: string;
  entries: FortniteEntry[];
}

export function useFortniteShop(lang = "es-419") {
  const [data, setData] = useState<FortniteShopData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (l: string) => {
    setLoading(true);
    setError(null);

    if (cache.has(l)) {
      setData(cache.get(l)!);
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`${API_BASE}?language=${l}`, {
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.status !== 200) throw new Error(`API status ${json.status}`);
      if (cache.size >= MAX_CACHE_ENTRIES) {
        const oldest = cache.keys().next().value;
        if (oldest !== undefined) cache.delete(oldest);
      }
      cache.set(l, json.data);
      setData(json.data);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") setError(err.message);
      else if (!(err instanceof Error)) setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(lang);
    return () => abortRef.current?.abort();
  }, [lang, load]);

  return { data, loading, error, reload: () => load(lang) };
}