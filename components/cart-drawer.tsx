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
  Tag,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface CartDrawerProps {
  onProceedToCheckout?: () => void;
}

export function CartDrawer({ onProceedToCheckout }: CartDrawerProps) {
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
  const taxAmount = (subtotal - discountAmount) * 0.08;
  const finalTotal = subtotal - discountAmount + taxAmount;
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

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
    if (onProceedToCheckout) {
      onProceedToCheckout();
    } else {
      // Smooth scroll to checkout form anchor
      const el = document.getElementById("order-mutation-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => cartActions.setIsDrawerOpen(open)}
    >
      <DialogContent className="max-w-md w-full max-h-[90vh] flex flex-col p-0 overflow-hidden sm:rounded-2xl">
        <DialogHeader className="p-5 border-b bg-muted/20">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <DialogTitle className="text-lg font-bold">
              Provisioning Cart ({totalItems})
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Decoupled Zustand persistent store state slice.
          </DialogDescription>
        </DialogHeader>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">
                Your hardware cart is currently empty.
              </p>
              <p className="text-xs text-muted-foreground">
                Select server or networking hardware below to provision an order.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 p-3 rounded-xl border bg-card/60 hover:bg-muted/30 transition-colors"
              >
                <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 border bg-muted">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-semibold truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs font-mono text-primary font-medium">
                    {formatCurrency(item.product.price)}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() =>
                          cartActions.updateQuantity(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        className="p-1 hover:bg-accent rounded-l-md"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          cartActions.updateQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        className="p-1 hover:bg-accent rounded-r-md"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => cartActions.removeItem(item.product.id)}
                      className="ml-auto text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pricing Summary & Checkout Button */}
        {items.length > 0 && (
          <div className="p-5 border-t bg-muted/20 space-y-3">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Promo Code (NEXT15)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="pl-8 h-8 text-xs font-mono uppercase"
                />
              </div>
              <Button type="submit" size="sm" variant="outline" className="h-8 text-xs">
                Apply
              </Button>
            </form>

            {discountCode && (
              <div className="flex items-center justify-between text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-2 rounded-md">
                <span>Coupon Applied: {discountCode}</span>
                <button
                  onClick={() => cartActions.removeDiscount()}
                  className="underline hover:opacity-80"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount ({discountRate * 100}%)</span>
                  <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Est. Tax (8%)</span>
                <span className="font-mono">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1 border-t">
                <span>Total Amount</span>
                <span className="font-mono text-primary">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleProceed}
              className="w-full gap-2 font-semibold shadow-md"
            >
              <span>Proceed to Server Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Type-safe Server Action Payload Ready</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
