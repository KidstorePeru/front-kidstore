"use client";

import {
  createContext, useContext, useState, useCallback, useMemo,
  useEffect, ReactNode,
} from "react";

// ── Types ──────────────────────────────────────────────────────
export interface CartItem {
  slug:        string;
  name:        string;
  img:         string;
  price:       number;
  priceOld:    number;
  region:      string;
  format:      string;
  quantity:    number;
  tabLabel:    string;
  // Datos del formulario del cliente (guardados al añadir al carrito)
  orderData?:  OrderData;
}

export interface OrderData {
  user?:       string;   // usuario / correo / teléfono
  pass?:       string;   // contraseña
  gameName?:   string;   // nombre en el juego / Epic ID
  platform?:   string;   // medio de acceso (epic, xbox, etc.)
  months?:     number;   // meses (solo club-xbox)
}

interface CartContextType {
  items:       CartItem[];
  totalItems:  number;
  totalPrice:  number;
  addItem:     (item: Omit<CartItem, "quantity">) => void;
  removeItem:  (slug: string) => void;
  updateQty:   (slug: string, qty: number) => void;
  clearCart:   () => void;
  isInCart:    (slug: string) => boolean;
}

// ── Helpers ────────────────────────────────────────────────────
const CART_KEY = "kidstore_cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch { /* silent */ }
}

// ── Context ────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Cargar desde localStorage al montar
  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  // Guardar en localStorage cada vez que cambia
  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems(prev => {
      const existing = prev.find(i => i.slug === newItem.slug);
      if (existing) {
        return prev.map(i =>
          i.slug === newItem.slug
            ? { ...i, quantity: i.quantity + 1, orderData: newItem.orderData ?? i.orderData }
            : i
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems(prev => prev.filter(i => i.slug !== slug));
  }, []);

  const updateQty = useCallback((slug: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.slug !== slug));
    } else {
      setItems(prev => prev.map(i => i.slug === slug ? { ...i, quantity: qty } : i));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const cartSlugs  = useMemo(() => new Set(items.map(i => i.slug)), [items]);
  const isInCart   = useCallback((slug: string) => cartSlugs.has(slug), [cartSlugs]);
  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{
      items, totalItems, totalPrice,
      addItem, removeItem, updateQty, clearCart, isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
