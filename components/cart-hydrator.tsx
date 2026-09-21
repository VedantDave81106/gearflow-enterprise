"use client";

import * as React from "react";
import { useCartStoreBase } from "@/lib/store/cart-store";

/**
 * Initializes client-side Zustand hydration once mounted.
 * This guarantees zero SSR hydration mismatch warnings while maintaining persistence.
 */
export function CartHydrator() {
  React.useEffect(() => {
    useCartStoreBase.persist.rehydrate();
  }, []);

  return null;
}
