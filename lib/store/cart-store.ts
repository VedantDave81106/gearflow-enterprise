import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useSyncExternalStore } from "react";
import { Product, CartItem } from "@/lib/types";

export interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountRate: number; // e.g. 0.1 for 10%
  isDrawerOpen: boolean;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (code: string) => { valid: boolean; message: string };
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
          const index = state.items.findIndex(
            (i) => i.product.id === product.id
          );
          if (index > -1) {
            const updated = [...state.items];
            updated[index] = {
              ...updated[index],
              quantity: updated[index].quantity + quantity,
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
        if (code.trim().toUpperCase() === "STUDENT10") {
          set({ discountCode: "STUDENT10", discountRate: 0.1 });
          return { valid: true, message: "Applied 10% Student Discount!" };
        }
        return { valid: false, message: "Invalid promo code. Try 'STUDENT10'" };
      },

      setIsDrawerOpen: (open: boolean) => {
        set({ isDrawerOpen: open });
      },

      toggleDrawer: () => {
        set((state) => ({ isDrawerOpen: !state.isDrawerOpen }));
      },
    }),
    {
      name: "next-gadgets-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

/**
 * Hydration-safe hook for Zustand with Next.js SSR.
 * Prevents hydration errors by returning fallback state on the server.
 */
export function useCartStore<T>(
  selector: (state: CartState) => T,
  fallback?: T
): T {
  const storeValue = useCartStoreBase(selector);

  const isHydrated = useSyncExternalStore(
    (callback) => {
      const unsub = useCartStoreBase.persist.onFinishHydration(callback);
      return () => unsub();
    },
    () => useCartStoreBase.persist.hasHydrated(),
    () => false
  );

  if (!isHydrated && fallback !== undefined) {
    return fallback;
  }

  return storeValue;
}

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
  setIsDrawerOpen: (open: boolean) =>
    useCartStoreBase.getState().setIsDrawerOpen(open),
  toggleDrawer: () => useCartStoreBase.getState().toggleDrawer(),
};
