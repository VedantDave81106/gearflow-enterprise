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
  ShieldCheck,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";

export function OrderForm() {
  const cartItems = useCartStore((s) => s.items, []);
  const discountCode = useCartStore((s) => s.discountCode, null);
  const [isPending, startTransition] = React.useTransition();
  const [lastResponse, setLastResponse] = React.useState<OrderMutationResponse | null>(null);
  const [optimisticStatus, setOptimisticStatus] = React.useState<string | null>(null);

  const defaultValues: Partial<OrderFormData> = {
    organizationName: "Nexus Cloud Infrastructure Ltd",
    contactEmail: "devops@nexus-cloud.io",
    contactPhone: "+1 555-019-2834",
    street: "Datacenter Bay D-12, 100 Technology Pkwy",
    city: "Ashburn",
    state: "VA",
    postalCode: "20147",
    country: "United States",
    priority: "expedited",
    paymentMethod: "corporate-po",
    discountCode: discountCode || "ENTERPRISE20",
    notes: "Direct deployment to Server Rack Bay D-12 with 10GbE fiber patch cords.",
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
    if (cartItems.length === 0) {
      cartActions.addItem({
        id: "hw-edge-server-1u",
        name: "Apex 1U Edge Rack Server",
        description: "64-Core AMD EPYC 9004, 256GB ECC DDR5",
        category: "compute",
        price: 3499.0,
        stock: 14,
        rating: 4.9,
        features: ["AMD EPYC 9004", "256GB DDR5 ECC"],
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
        sku: "GF-1U-EPYC9004",
      }, 2);
    }

    reset({
      organizationName: "Vanguard Quant Systems Inc",
      contactEmail: "infra@vanguard-systems.io",
      contactPhone: "+1 415-555-8920",
      street: "Ashburn DC-1, Hall B, Cabinet 14",
      city: "Ashburn",
      state: "VA",
      postalCode: "20147",
      country: "United States",
      priority: "critical-mission",
      paymentMethod: "corporate-po",
      discountCode: "ENTERPRISE20",
      notes: "Emergency cluster expansion node deployment for high-frequency algorithmic execution tier.",
      items: [
        {
          productId: "hw-edge-server-1u",
          productName: "Apex 1U Edge Rack Server",
          quantity: 2,
          unitPrice: 3499.0,
        },
      ],
    });
    toast.info("Auto-populated enterprise datacenter requisition demo.");
  };

  const onSubmit = (formData: OrderFormData) => {
    setOptimisticStatus("Connecting to datacenter inventory allocation service...");

    startTransition(async () => {
      try {
        const response = await submitOrderMutation(formData);
        setLastResponse(response);
        setOptimisticStatus(null);

        if (response.success) {
          toast.success("Hardware Requisition Dispatched!", {
            description: `Order ${response.orderId} queued for rack deployment.`,
          });
          cartActions.clearCart();
        } else {
          toast.error("Requisition Rejected by Server", {
            description: response.message,
          });
        }
      } catch {
        setOptimisticStatus(null);
        toast.error("Server Action Execution Failed", {
          description: "An unexpected network or server error occurred.",
        });
      }
    });
  };

  const calculatedSubtotal = watchedItems.reduce(
    (acc, it) => acc + (it.quantity || 1) * (it.unitPrice || 0),
    0
  );
  const discountRate = (watch("discountCode")?.toUpperCase() === "ENTERPRISE20") ? 0.2 : (watch("discountCode")?.toUpperCase() === "NEXT15") ? 0.15 : 0;
  const discountAmount = calculatedSubtotal * discountRate;
  const estTax = (calculatedSubtotal - discountAmount) * 0.08;
  const estTotal = calculatedSubtotal - discountAmount + estTax;

  return (
    <div id="order-mutation-form" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Datacenter Node Requisition & Allocation
            </h2>
            <Badge variant="outline" className="text-[11px] font-mono border-emerald-500/40 text-emerald-500">
              Server Action (&apos;use server&apos;)
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Type-safe B2B hardware procurement form with dual-layer Zod schema validation
            and secure server-side price verification (CO2).
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFillDemoData}
          className="text-xs gap-1.5 self-start sm:self-auto h-8"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Pre-fill Demo Requisition</span>
        </Button>
      </div>

      {/* Optimistic Status Banner */}
      {optimisticStatus && (
        <div className="p-3.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs flex items-center gap-2.5 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          <span className="font-medium">{optimisticStatus}</span>
        </div>
      )}

      {/* Success Confirmation Card */}
      {lastResponse && lastResponse.success && (
        <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="h-5 w-5" />
              <span>Hardware Allocation Confirmed & Scheduled for Rack Deployment!</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-mono">
              Server Cache Revalidated via revalidatePath(&apos;/&apos;)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-background border space-y-1">
              <span className="text-muted-foreground text-[11px]">Requisition PO Ref</span>
              <div className="font-mono font-bold text-sm text-foreground">{lastResponse.orderId}</div>
            </div>
            <div className="p-3 rounded-lg bg-background border space-y-1">
              <span className="text-muted-foreground text-[11px]">Tracking Reference</span>
              <div className="font-mono font-bold text-sm text-foreground">{lastResponse.trackingNumber}</div>
            </div>
            <div className="p-3 rounded-lg bg-background border space-y-1">
              <span className="text-muted-foreground text-[11px]">Server Verified Net Total</span>
              <div className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                {formatCurrency(lastResponse.totalAmount || 0)}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            A confirmation receipt was registered at {lastResponse.timestamp}. Hardware nodes have been reserved in the Ashburn DC warehouse.
          </p>
        </div>
      )}

      {/* Error Banner */}
      {lastResponse && !lastResponse.success && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="h-4 w-4" />
            <span>Requisition Rejected by Server Action</span>
          </div>
          <p>{lastResponse.message}</p>
          {lastResponse.errors && (
            <ul className="list-disc list-inside space-y-0.5 opacity-90 pl-2">
              {Object.entries(lastResponse.errors).map(([field, msgs]) => (
                <li key={field}>
                  <strong className="font-mono">{field}</strong>: {msgs.join(", ")}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Inputs (8 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Entity Details Card */}
            <Card className="border-border/70 shadow-xs">
              <CardHeader className="p-4 sm:p-5 border-b bg-muted/20 pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>Enterprise Entity & Approver Details</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Legal entity and direct engineering point of contact for allocation approval.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="organizationName" className="text-xs">
                    Organization / Entity Legal Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="organizationName"
                    placeholder="e.g. Acme Cloud Infrastructure Inc"
                    error={!!errors.organizationName}
                    aria-invalid={!!errors.organizationName}
                    aria-describedby="org-error"
                    className="h-8 text-xs"
                    {...register("organizationName")}
                  />
                  {errors.organizationName && (
                    <p id="org-error" className="text-[11px] text-destructive">
                      {errors.organizationName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="contactEmail" className="text-xs">
                      Lead DevOps / NOC Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="infra@company.com"
                      error={!!errors.contactEmail}
                      aria-invalid={!!errors.contactEmail}
                      aria-describedby="email-error"
                      className="h-8 text-xs font-mono"
                      {...register("contactEmail")}
                    />
                    {errors.contactEmail && (
                      <p id="email-error" className="text-[11px] text-destructive">
                        {errors.contactEmail.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="contactPhone" className="text-xs">
                      24/7 Escalation Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contactPhone"
                      placeholder="+1 555-019-2834"
                      error={!!errors.contactPhone}
                      aria-invalid={!!errors.contactPhone}
                      aria-describedby="phone-error"
                      className="h-8 text-xs font-mono"
                      {...register("contactPhone")}
                    />
                    {errors.contactPhone && (
                      <p id="phone-error" className="text-[11px] text-destructive">
                        {errors.contactPhone.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Datacenter Deployment Logistics */}
            <Card className="border-border/70 shadow-xs">
              <CardHeader className="p-4 sm:p-5 border-b bg-muted/20 pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <span>Datacenter Destination & Cabinet Logistics</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Physical rack bay, cabinet ID, and logistics SLA for hardware mounting.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-3.5">
                <div className="space-y-1">
                  <Label htmlFor="street" className="text-xs">
                    Facility Address & Cabinet/Rack ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="street"
                    placeholder="Ashburn DC-1, Hall B, Rack Bay D-12"
                    error={!!errors.street}
                    aria-invalid={!!errors.street}
                    aria-describedby="street-error"
                    className="h-8 text-xs font-mono"
                    {...register("street")}
                  />
                  {errors.street && (
                    <p id="street-error" className="text-[11px] text-destructive">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="space-y-1">
                    <Label htmlFor="city" className="text-xs">City *</Label>
                    <Input id="city" placeholder="Ashburn" className="h-8 text-xs" error={!!errors.city} {...register("city")} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="state" className="text-xs">State *</Label>
                    <Input id="state" placeholder="VA" className="h-8 text-xs font-mono" error={!!errors.state} {...register("state")} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postalCode" className="text-xs">ZIP / Postal *</Label>
                    <Input id="postalCode" placeholder="20147" className="h-8 text-xs font-mono" error={!!errors.postalCode} {...register("postalCode")} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="country" className="text-xs">Country *</Label>
                    <Input id="country" placeholder="United States" className="h-8 text-xs" error={!!errors.country} {...register("country")} />
                  </div>
                </div>

                {/* SLA and Payment Method Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/40">
                  <div className="space-y-1">
                    <Label htmlFor="priority" className="text-xs">Deployment SLA</Label>
                    <select
                      id="priority"
                      {...register("priority")}
                      className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="standard">Standard (3-5 Days)</option>
                      <option value="expedited">Expedited (24-48h)</option>
                      <option value="critical-mission">Critical (Next-Flight)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="paymentMethod" className="text-xs">Invoicing Method</Label>
                    <select
                      id="paymentMethod"
                      {...register("paymentMethod")}
                      className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="corporate-po">Net 30 Enterprise PO</option>
                      <option value="wire-transfer">Fedwire / SWIFT</option>
                      <option value="credit-card">Corporate Purchasing Card</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="discountCode" className="text-xs">Promo Code</Label>
                    <Input
                      id="discountCode"
                      placeholder="ENTERPRISE20"
                      className="h-8 text-xs font-mono uppercase"
                      error={!!errors.discountCode}
                      {...register("discountCode")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Requisition Allocation Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border/70 shadow-xs bg-muted/10 sticky top-20">
              <CardHeader className="p-4 border-b bg-muted/20 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-primary" />
                    <span>Requisition Hardware Allocation</span>
                  </CardTitle>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {watchedItems.length} SKUs
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-3.5">
                {/* Configured Item List */}
                {watchedItems.length === 0 ? (
                  <div className="p-6 text-center space-y-2 border border-dashed rounded-lg bg-background">
                    <Server className="h-8 w-8 mx-auto text-muted-foreground/40" />
                    <p className="text-xs font-medium text-foreground">
                      No hardware nodes allocated yet.
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Add servers or switches from the catalog or click &apos;Pre-fill Demo Requisition&apos;.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {watchedItems.map((item, idx) => (
                      <div
                        key={item.productId || idx}
                        className="p-2.5 rounded-lg border bg-background flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5 min-w-0 pr-2">
                          <div className="font-semibold text-foreground truncate">
                            {item.productName}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            Qty: <strong className="text-foreground">{item.quantity}</strong> × {formatCurrency(item.unitPrice)}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-foreground shrink-0">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price Calculations */}
                <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Hardware Subtotal</span>
                    <span className="font-mono">{formatCurrency(calculatedSubtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Enterprise Discount ({discountRate * 100}%)</span>
                      <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted-foreground">
                    <span>Est. Datacenter Tax (8%)</span>
                    <span className="font-mono">{formatCurrency(estTax)}</span>
                  </div>

                  <div className="flex justify-between text-muted-foreground">
                    <span>Rack Mount SLA</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Included</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-2 border-t text-sm font-bold text-foreground">
                    <span>Requisition Net Total</span>
                    <span className="font-mono text-base text-primary">
                      {formatCurrency(estTotal)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isPending || watchedItems.length === 0}
                  className="w-full h-9 font-semibold gap-2 shadow-xs text-xs"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Executing Server Action...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Dispatch Hardware Requisition</span>
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Payload verified on Node.js server via safeParseAsync</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
