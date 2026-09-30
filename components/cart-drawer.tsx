"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore, cartActions } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen, false);
  const items = useCartStore((s) => s.items, []);
  const discountCode = useCartStore((s) => s.discountCode, null);
  const discountRate = useCartStore((s) => s.discountRate, 0);

  const [promoInput, setPromoInput] = React.useState("");

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const discountAmount = subtotal * discountRate;
  const finalTotal = subtotal - discountAmount;
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = cartActions.applyDiscount(promoInput);
    if (res.valid) {
      toast.success(res.message);
      setPromoInput("");
    } else {
      toast.error(res.message);
    }
  };

  const handleProceed = () => {
    cartActions.setIsDrawerOpen(false);
    const checkoutEl = document.getElementById("checkout-section");
    if (checkoutEl) {
      checkoutEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => cartActions.setIsDrawerOpen(open)}
    >
      <DialogContent className="max-w-md w-full max-h-[90vh] flex flex-col p-0 overflow-hidden sm:rounded-xl">
        <DialogHeader className="p-4 border-b bg-muted/20">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            <DialogTitle className="text-base font-bold">
              Shopping Cart ({totalCount} items)
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Persistent client state managed via Zustand (saved in localStorage).
          </DialogDescription>
        </DialogHeader>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <ShoppingCart className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="text-xs font-medium text-muted-foreground">
                Your cart is currently empty.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-2.5 rounded-lg border bg-card items-center justify-between"
              >
                <div className="relative h-12 w-12 rounded overflow-hidden shrink-0 border bg-muted">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-xs font-semibold truncate text-foreground">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(item.product.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border rounded-md">
                  <button
                    type="button"
                    onClick={() =>
                      cartActions.updateQuantity(
                        item.product.id,
                        item.quantity - 1
                      )
                    }
                    className="p-1 hover:bg-muted text-muted-foreground"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-2 text-xs font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      cartActions.updateQuantity(
                        item.product.id,
                        item.quantity + 1
                      )
                    }
                    className="p-1 hover:bg-muted text-muted-foreground"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => cartActions.removeItem(item.product.id)}
                  className="p-1.5 text-muted-foreground hover:text-destructive"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-muted/15 space-y-3">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <Input
                placeholder="Discount code (STUDENT10)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="h-8 text-xs font-mono uppercase"
              />
              <Button type="submit" size="sm" variant="outline" className="h-8 text-xs">
                Apply
              </Button>
            </form>

            {discountCode && (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded flex justify-between items-center">
                <span>Applied: {discountCode} (10% off)</span>
                <span className="font-mono">-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm font-bold pt-1 border-t">
              <span>Total:</span>
              <span className="text-base text-primary font-mono">
                {formatCurrency(finalTotal)}
              </span>
            </div>

            <Button onClick={handleProceed} className="w-full h-9 text-xs gap-1.5 font-semibold">
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
