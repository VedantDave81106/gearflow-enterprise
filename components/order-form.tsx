"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, OrderFormData } from "@/lib/validations/order-schema";
import { submitOrderMutation } from "@/app/actions/order-actions";
import { useCartStore, cartActions } from "@/lib/store/cart-store";
import { OrderMutationResponse } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

export function OrderForm() {
  const cartItems = useCartStore((s) => s.items, []);
  const discountCode = useCartStore((s) => s.discountCode, null);
  const [isPending, startTransition] = React.useTransition();
  const [lastResponse, setLastResponse] = React.useState<OrderMutationResponse | null>(null);

  const defaultValues: Partial<OrderFormData> = {
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    address: "42 Tech Avenue, Apt 3B",
    city: "San Francisco",
    postalCode: "94107",
    paymentMethod: "card",
    discountCode: discountCode || "",
    items: cartItems.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      quantity: i.quantity,
      unitPrice: i.product.price,
    })),
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues,
    mode: "onTouched",
  });

  // Keep items updated when user adds/removes items from cart
  React.useEffect(() => {
    if (cartItems.length > 0) {
      setValue(
        "items",
        cartItems.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
        { shouldValidate: true }
      );
    }
    if (discountCode) {
      setValue("discountCode", discountCode, { shouldValidate: true });
    }
  }, [cartItems, discountCode, setValue]);

  const watchedItems = watch("items") || [];

  const handleFillDemoData = () => {
    // If cart is empty, add a default product first
    if (cartItems.length === 0) {
      cartActions.addItem({
        id: "prod-headphones",
        name: "Wireless Noise-Cancelling Headphones",
        description: "High-fidelity audio with active noise cancellation",
        category: "audio",
        price: 2499,
        stock: 15,
        rating: 4.8,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      }, 1);
    }

    reset({
      fullName: "Priya Sharma",
      email: "priya.sharma@example.com",
      address: "15 Park Street, Suite 4A",
      city: "Bangalore",
      postalCode: "560001",
      paymentMethod: "upi",
      discountCode: "STUDENT10",
      items: [
        {
          productId: "prod-headphones",
          productName: "Wireless Noise-Cancelling Headphones",
          quantity: 1,
          unitPrice: 2499,
        },
      ],
    });
    toast.info("Filled demo customer details.");
  };

  const onSubmit = (formData: OrderFormData) => {
    startTransition(async () => {
      try {
        const response = await submitOrderMutation(formData);
        setLastResponse(response);

        if (response.success) {
          toast.success("Order Placed Successfully!");
          cartActions.clearCart();
        } else {
          toast.error(response.message);
        }
      } catch {
        toast.error("Failed to place order. Please try again.");
      }
    });
  };

  const totalAmount = watchedItems.reduce(
    (acc, it) => acc + (it.quantity || 1) * (it.unitPrice || 0),
    0
  );

  return (
    <div id="checkout-section" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Checkout &amp; Place Order (Part C)
          </h2>
          <p className="text-xs text-muted-foreground">
            Validated on the client with React Hook Form + Zod, and processed securely via Next.js Server Action (&apos;use server&apos;).
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFillDemoData}
          className="text-xs gap-1.5 h-8 self-start sm:self-auto"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Auto-fill Demo Details</span>
        </Button>
      </div>

      {/* Success Notification Card */}
      {lastResponse && lastResponse.success && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>{lastResponse.message}</span>
          </div>
          <div className="flex gap-4 text-muted-foreground">
            <span>Order ID: <strong className="font-mono text-foreground">{lastResponse.orderId}</strong></span>
            <span>Total Paid: <strong className="font-mono text-foreground">{formatCurrency(lastResponse.totalAmount || 0)}</strong></span>
            <span>Time: {lastResponse.timestamp}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {lastResponse && !lastResponse.success && (
        <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{lastResponse.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer & Shipping Form (2 cols) */}
          <Card className="lg:col-span-2 border">
            <CardHeader className="p-4 border-b bg-muted/15 pb-3">
              <CardTitle className="text-sm font-semibold">
                Customer &amp; Shipping Details
              </CardTitle>
              <CardDescription className="text-xs">
                Enter your shipping address and payment option.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="fullName" className="text-xs">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    error={!!errors.fullName}
                    className="h-8 text-xs"
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-destructive">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    error={!!errors.email}
                    className="h-8 text-xs"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="address" className="text-xs">Street Address *</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street, Apt 4"
                  error={!!errors.address}
                  className="h-8 text-xs"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-[11px] text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="city" className="text-xs">City *</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    error={!!errors.city}
                    className="h-8 text-xs"
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="text-[11px] text-destructive">{errors.city.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="postalCode" className="text-xs">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    placeholder="10001"
                    error={!!errors.postalCode}
                    className="h-8 text-xs"
                    {...register("postalCode")}
                  />
                  {errors.postalCode && (
                    <p className="text-[11px] text-destructive">{errors.postalCode.message}</p>
                  )}
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <Label htmlFor="paymentMethod" className="text-xs">Payment Method</Label>
                  <select
                    id="paymentMethod"
                    {...register("paymentMethod")}
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                  >
                    <option value="card">Credit / Debit Card</option>
                    <option value="upi">UPI / Instant Pay</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cart Summary & Submit (1 col) */}
          <Card className="border bg-muted/10 h-fit">
            <CardHeader className="p-4 border-b bg-muted/15 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <span>Order Summary ({watchedItems.length} items)</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-3 text-xs">
              {watchedItems.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Your cart is empty. Add products above to checkout.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {watchedItems.map((item, idx) => (
                    <div
                      key={item.productId || idx}
                      className="flex justify-between items-center py-1 border-b border-border/40 text-xs"
                    >
                      <span className="truncate pr-2 font-medium">{item.productName}</span>
                      <span className="font-mono text-muted-foreground whitespace-nowrap">
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t flex justify-between items-center font-bold text-sm">
                <span>Subtotal:</span>
                <span className="font-mono text-primary">{formatCurrency(totalAmount)}</span>
              </div>

              <Button
                type="submit"
                disabled={isPending || watchedItems.length === 0}
                className="w-full h-9 text-xs font-semibold gap-2 mt-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Place Order (Server Action)</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
