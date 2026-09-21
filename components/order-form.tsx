"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema, OrderFormData } from "@/lib/validations/order-schema";
import { submitOrderMutation } from "@/app/actions/order-actions";
import { useCartStore, cartActions } from "@/lib/store/cart-store";
import { OrderMutationResponse } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Server,
  Truck,
  Building2,
} from "lucide-react";
import { toast } from "sonner";

export function OrderForm() {
  const cartItems = useCartStore((s) => s.items, []);
  const discountCode = useCartStore((s) => s.discountCode, null);
  const [isPending, startTransition] = React.useTransition();
  const [lastResponse, setLastResponse] = React.useState<OrderMutationResponse | null>(null);
  const [optimisticStatus, setOptimisticStatus] = React.useState<string | null>(null);

  const defaultValues: Partial<OrderFormData> = {
    organizationName: "Acme Cloud Infrastructure Ltd",
    contactEmail: "devops@acme-cloud.io",
    contactPhone: "+1 555-019-2834",
    street: "742 Innovation Way, Suite 400",
    city: "San Francisco",
    state: "CA",
    postalCode: "94107",
    country: "United States",
    priority: "expedited",
    paymentMethod: "corporate-po",
    discountCode: discountCode || "ENTERPRISE20",
    notes: "Please deliver directly to Rack Bay D-12 datacenter entrance.",
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

  // Keep form items synchronized when cart items change
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
    // If cart is empty, add a default server to cart first
    if (cartItems.length === 0) {
      cartActions.addItem({
        id: "hw-edge-server-1u",
        name: "Apex 1U Edge Rack Server",
        description: "64-Core AMD EPYC 9004, 256GB ECC DDR5",
        category: "compute",
        price: 3499.0,
        stock: 14,
        rating: 4.9,
        features: ["AMD EPYC", "256GB DDR5"],
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
      }, 2);
    }

    reset({
      organizationName: "NovaGrid Quantum Labs",
      contactEmail: "operations@novagrid.ai",
      contactPhone: "+1 415-555-8920",
      street: "100 Silicon Blvd, Suite 2100",
      city: "San Jose",
      state: "CA",
      postalCode: "95113",
      country: "United States",
      priority: "critical-mission",
      paymentMethod: "corporate-po",
      discountCode: "ENTERPRISE20",
      notes: "Emergency compute upgrade for cluster node group B.",
      items: [
        {
          productId: "hw-edge-server-1u",
          productName: "Apex 1U Edge Rack Server",
          quantity: 2,
          unitPrice: 3499.0,
        },
      ],
    });
    toast.info("Populated demo enterprise requisition form.");
  };

  const onSubmit = (formData: OrderFormData) => {
    setOptimisticStatus("Verifying hardware availability with datacenter inventory...");

    startTransition(async () => {
      try {
        const response = await submitOrderMutation(formData);
        setLastResponse(response);
        setOptimisticStatus(null);

        if (response.success) {
          toast.success("Order Mutation Succeeded!", {
            description: `Registered as ${response.orderId}`,
          });
          // Clear Zustand client store on confirmed purchase
          cartActions.clearCart();
        } else {
          toast.error("Mutation Rejected by Server", {
            description: response.message,
          });
        }
      } catch {
        setOptimisticStatus(null);
        toast.error("Server Action Failed", {
          description: "An unexpected network or server error occurred.",
        });
      }
    });
  };

  return (
    <div id="order-mutation-form" className="space-y-6">
      <Card className="border-border/60 shadow-lg bg-card/90">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl tracking-tight">
                  Type-Safe Hardware Provisioning & Mutation
                </CardTitle>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-500">
                  CO2 Server Action
                </Badge>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Validated end-to-end with shared Zod schema + React Hook Form + Next.js &apos;use server&apos;.
              </CardDescription>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFillDemoData}
              className="text-xs gap-1.5 self-start sm:self-auto"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Fill Demo Enterprise Data</span>
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="p-6 space-y-6">
            {/* Optimistic Status Banner */}
            {optimisticStatus && (
              <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs flex items-center gap-2 animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>{optimisticStatus}</span>
              </div>
            )}

            {/* Success Confirmation Card */}
            {lastResponse && lastResponse.success && (
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-3 animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Provisioning Dispatch Registered Successfully!</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-background/80 border">
                    <span className="text-muted-foreground block">Order ID</span>
                    <span className="font-mono font-bold">{lastResponse.orderId}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background/80 border">
                    <span className="text-muted-foreground block">Tracking ID</span>
                    <span className="font-mono font-bold">{lastResponse.trackingNumber}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-background/80 border">
                    <span className="text-muted-foreground block">Server-Verified Amount</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(lastResponse.totalAmount || 0)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Timestamp: {lastResponse.timestamp} • Next.js cache revalidated via `revalidatePath(&apos;/&apos;)`.
                </p>
              </div>
            )}

            {/* Error Notification */}
            {lastResponse && !lastResponse.success && (
              <div className="p-3.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block">{lastResponse.message}</span>
                  {lastResponse.errors && (
                    <ul className="list-disc list-inside space-y-0.5 opacity-90">
                      {Object.entries(lastResponse.errors).map(([field, msgs]) => (
                        <li key={field}>
                          <span className="font-mono">{field}</span>: {msgs.join(", ")}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Org Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>Enterprise Entity Information</span>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="organizationName">
                    Organization / Entity Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="organizationName"
                    placeholder="e.g. Nexus Cyber Systems Inc"
                    error={!!errors.organizationName}
                    aria-invalid={!!errors.organizationName}
                    aria-describedby="org-error"
                    {...register("organizationName")}
                  />
                  {errors.organizationName && (
                    <p id="org-error" className="text-[11px] text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.organizationName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contactEmail">
                    Enterprise DevOps Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="infrastructure@company.com"
                    error={!!errors.contactEmail}
                    aria-invalid={!!errors.contactEmail}
                    aria-describedby="email-error"
                    {...register("contactEmail")}
                  />
                  {errors.contactEmail && (
                    <p id="email-error" className="text-[11px] text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.contactEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contactPhone">
                    Direct POC Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contactPhone"
                    placeholder="+1 555-019-2834"
                    error={!!errors.contactPhone}
                    aria-invalid={!!errors.contactPhone}
                    aria-describedby="phone-error"
                    {...register("contactPhone")}
                  />
                  {errors.contactPhone && (
                    <p id="phone-error" className="text-[11px] text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.contactPhone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">
                  <Truck className="h-3.5 w-3.5" />
                  <span>Datacenter Delivery Logistics</span>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="street">
                    Datacenter Street Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="street"
                    placeholder="Building 4, Dock 2B, 100 Technology Pkwy"
                    error={!!errors.street}
                    aria-invalid={!!errors.street}
                    aria-describedby="street-error"
                    {...register("street")}
                  />
                  {errors.street && (
                    <p id="street-error" className="text-[11px] text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="Ashburn"
                      error={!!errors.city}
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="text-[11px] text-destructive">{errors.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state">
                      State / Region <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="state"
                      placeholder="VA"
                      error={!!errors.state}
                      {...register("state")}
                    />
                    {errors.state && (
                      <p className="text-[11px] text-destructive">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="postalCode">
                      Postal Code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="postalCode"
                      placeholder="20147"
                      error={!!errors.postalCode}
                      {...register("postalCode")}
                    />
                    {errors.postalCode && (
                      <p className="text-[11px] text-destructive">{errors.postalCode.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="country">
                      Country <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="country"
                      placeholder="United States"
                      error={!!errors.country}
                      {...register("country")}
                    />
                    {errors.country && (
                      <p className="text-[11px] text-destructive">{errors.country.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Priority, Payment, and Promo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t">
              <div className="space-y-1.5">
                <Label htmlFor="priority">Provisioning SLA Priority</Label>
                <select
                  id="priority"
                  {...register("priority")}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="standard" className="dark:bg-zinc-900">Standard Freight (5-7 Days)</option>
                  <option value="expedited" className="dark:bg-zinc-900">Expedited Air (2-3 Days)</option>
                  <option value="critical-mission" className="dark:bg-zinc-900">Mission Critical (Next Day 08:00)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                  id="paymentMethod"
                  {...register("paymentMethod")}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="corporate-po" className="dark:bg-zinc-900">Net 30 Corporate PO</option>
                  <option value="wire-transfer" className="dark:bg-zinc-900">Fedwire / SWIFT Transfer</option>
                  <option value="credit-card" className="dark:bg-zinc-900">Commercial Credit Card</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="discountCode">Validation Promo Code</Label>
                <Input
                  id="discountCode"
                  placeholder="NEXT15 or ENTERPRISE20"
                  className="h-9 text-xs font-mono uppercase"
                  error={!!errors.discountCode}
                  {...register("discountCode")}
                />
                {errors.discountCode && (
                  <p className="text-[11px] text-destructive">{errors.discountCode.message}</p>
                )}
              </div>
            </div>

            {/* Items Summary in Form */}
            <div className="rounded-lg border bg-muted/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-primary" />
                  <span>Payload Allocation Items ({watchedItems.length})</span>
                </span>
                {watchedItems.length === 0 && (
                  <span className="text-xs text-destructive font-medium">
                    Cart is empty. Add hardware from catalog or click &apos;Fill Demo Enterprise Data&apos;.
                  </span>
                )}
              </div>

              {watchedItems.length > 0 ? (
                <div className="space-y-1.5">
                  {watchedItems.map((item, idx) => (
                    <div
                      key={item.productId || idx}
                      className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-background/80 border"
                    >
                      <span className="font-medium truncate max-w-xs">{item.productName}</span>
                      <span className="font-mono text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.unitPrice)} ={" "}
                        <strong className="text-foreground">{formatCurrency(item.quantity * item.unitPrice)}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No items configured. Form submission will be blocked by shared Zod min(1) constraint.
                </p>
              )}
              {errors.items && (
                <p className="text-xs text-destructive font-medium">{errors.items.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row items-center justify-between gap-4 border-t bg-muted/10">
            <p className="text-xs text-muted-foreground">
              Direct Server Action dispatch with zero intermediate API routes or boilerplate.
            </p>

            <Button
              type="submit"
              disabled={isPending || watchedItems.length === 0}
              className="w-full sm:w-auto gap-2 font-semibold shadow-md min-w-[200px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Executing Server Action...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Dispatch Hardware Mutation</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
