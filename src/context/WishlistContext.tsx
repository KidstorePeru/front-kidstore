"use client";

import {
  createContext, useContext, useState, useCallback, useMemo,
  useEffect, ReactNode,
} from "react";

export interface WishlistItem {
  slug:     string;
  name:     string;
  img:      string;
  price:    number;
  priceOld: number;
  region:   string;
  format:   string;
  tabLabel: string;
  game:     string;   // e.g. "Fortnite"
  gameSlug: string;   // e.g. "fortnite"
}

interface WishlistContextType {
  items:      WishlistItem[];
  addItem:    (item: WishlistItem) => void;
  removeItem: (slug: string) => void;
  toggle:     (item: WishlistItem) => void;
  isWished:   (slug: string) => boolean;
  clearAll:   () => void;
}

const WISH_KEY = "kidstore_wishlist";

function load(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISH_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch { return []; }
}

function save(items: WishlistItem[]) {
  try { localStorage.setItem(WISH_KEY, JSON.stringify(items)); } catch { /* silent */ }
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems]       = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setItems(load()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) save(items); }, [items, hydrated]);

  const addItem    = useCallback((item: WishlistItem) => {
    setItems(prev => prev.some(i => i.slug === item.slug) ? prev : [...prev, item]);
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems(prev => prev.filter(i => i.slug !== slug));
  }, []);

  const toggle = useCallback((item: WishlistItem) => {
    setItems(prev =>
      prev.some(i => i.slug === item.slug)
        ? prev.filter(i => i.slug !== item.slug)
        : [...prev, item]
    );
  }, []);

  const wishSlugs = useMemo(() => new Set(items.map(i => i.slug)), [items]);
  const isWished  = useCallback((slug: string) => wishSlugs.has(slug), [wishSlugs]);
  const clearAll = useCallback(() => setItems([]), []);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggle, isWished, clearAll }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
