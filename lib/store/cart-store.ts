import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useSyncExternalStore } from "react";
import { Product, CartItem } from "@/lib/types";

export interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountRate: number; // e.g., 0.15 for 15%
  isDrawerOpen: boolean;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (code: string) => { valid: boolean; rate: number; message: string };
  removeDiscount: () => void;
  setIsDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
}

export const useCartStoreBase = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      discountCode: null,
      discountRate: 0,
      isDrawerOpen: false,

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.product.id === product.id
          );
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity,
            };
            return { items: updated };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.product.id !== productId),
            };
          }
          return {
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [], discountCode: null, discountRate: 0 });
      },

      applyDiscount: (code: string) => {
        const normalized = code.trim().toUpperCase();
        if (normalized === "ENTERPRISE20") {
          set({ discountCode: "ENTERPRISE20", discountRate: 0.2 });
          return { valid: true, rate: 0.2, message: "Applied 20% Enterprise Discount!" };
        }
        if (normalized === "NEXT15") {
          set({ discountCode: "NEXT15", discountRate: 0.15 });
          return { valid: true, rate: 0.15, message: "Applied 15% Next.js Student Discount!" };
        }
        return { valid: false, rate: 0, message: "Invalid discount code. Try 'NEXT15' or 'ENTERPRISE20'" };
      },

      removeDiscount: () => {
        set({ discountCode: null, discountRate: 0 });
      },

      setIsDrawerOpen: (open: boolean) => {
        set({ isDrawerOpen: open });
      },

      toggleDrawer: () => {
        set((state) => ({ isDrawerOpen: !state.isDrawerOpen }));
      },
    }),
    {
      name: "gearflow-cart-storage",
      storage: createJSONStorage(() => localStorage),
      // Skip automatic rehydration on server to prevent SSR hydration mismatch
      skipHydration: true,
    }
  )
);

/**
 * Hydration-safe selector hook for Zustand with SSR
 * Guarantees that during server render and initial client hydration,
 * initial fallback state is returned, preventing React error #418 / #423.
 */
export function useCartStore<T>(
  selector: (state: CartState) => T,
  fallback?: T
): T {
  const storeValue = useCartStoreBase(selector);

  // Sync external store to detect if client has rehydrated
  const isHydrated = useSyncExternalStore(
    (callback) => {
      const unsubHydrate = useCartStoreBase.persist.onFinishHydration(callback);
      return () => unsubHydrate();
    },
    () => useCartStoreBase.persist.hasHydrated(),
    () => false
  );

  // If not yet hydrated and fallback is given, return fallback
  if (!isHydrated && fallback !== undefined) {
    return fallback;
  }

  return storeValue;
}

// Re-export base store for direct actions where selector is not needed
export const cartActions = {
  addItem: (product: Product, quantity?: number) =>
    useCartStoreBase.getState().addItem(product, quantity),
  removeItem: (productId: string) =>
    useCartStoreBase.getState().removeItem(productId),
  updateQuantity: (productId: string, quantity: number) =>
    useCartStoreBase.getState().updateQuantity(productId, quantity),
  clearCart: () => useCartStoreBase.getState().clearCart(),
  applyDiscount: (code: string) =>
    useCartStoreBase.getState().applyDiscount(code),
  removeDiscount: () => useCartStoreBase.getState().removeDiscount(),
  setIsDrawerOpen: (open: boolean) =>
    useCartStoreBase.getState().setIsDrawerOpen(open),
  toggleDrawer: () => useCartStoreBase.getState().toggleDrawer(),
};
