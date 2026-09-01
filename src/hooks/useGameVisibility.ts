"use client";

import { useVisibility } from "@/context/VisibilityContext";
import { tabKey, productKey } from "@/config/visibility";

/**
 * Helpers de visibilidad acotados a un juego. Reactivo a los overrides que el
 * admin guarda desde `/admin` → "Visibilidad".
 *
 *   const vis = useGameVisibility("genshin-impact");
 *   const tabs     = vis.filterTabs(TABS);
 *   const products = vis.filterProducts(CRISTALES);
 */
export function useGameVisibility(gameSlug: string) {
  const { isVisible } = useVisibility();

  return {
    tabVisible:     (tabId: string)     => isVisible(tabKey(gameSlug, tabId)),
    productVisible: (productSlug: string) => isVisible(productKey(gameSlug, productSlug)),
    filterTabs:     <T extends { id: string }>(tabs: T[])   => tabs.filter(t => isVisible(tabKey(gameSlug, t.id))),
    filterProducts: <T extends { slug: string }>(list: T[]) => list.filter(p => isVisible(productKey(gameSlug, p.slug))),
  };
}
