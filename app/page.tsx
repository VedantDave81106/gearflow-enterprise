import { Suspense } from "react";
import { INITIAL_PRODUCTS } from "@/lib/data/products";
import { HydrationBoundaryDemo, HydrationAuditPayload } from "@/components/hydration-boundary-demo";
import { ProductCatalog } from "@/components/product-catalog";
import { OrderForm } from "@/components/order-form";
import { WebVitalsHud } from "@/components/web-vitals-hud";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ScreenThemeButton } from "@/components/theme-toggle";
import {
  ShoppingBag,
  Layers,
  ShieldCheck,
  ArrowRight,
  Activity,
  Terminal,
  CheckCircle2,
} from "lucide-react";

/**
 * Server Component Loading Fallback for Suspense Demonstration
 */
function OrderFormSkeleton() {
  return (
    <div className="rounded-xl border p-6 space-y-4 bg-card">
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-9 w-36 ml-auto" />
    </div>
  );
}

/**
 * Async React Server Component (RSC) Root View
 * Executes on the server at request time.
 * Demonstrates CO1 (App Router compilation, RSC-to-Client props serialization).
 */
export default async function HomePage() {
  // Server-side products catalog
  const products = INITIAL_PRODUCTS;

  // Server-side audit payload passed across the RSC -> Client boundary
  const serverPayload: HydrationAuditPayload = {
    serverBuildId: "next-flight-v15.1.7-student",
    serverTimestamp: new Date().toISOString(),
    nodeEnvironment: process.env.NODE_ENV || "development",
    executionTarget: "Server-side Node.js Runtime",
    catalogCount: products.length,
    serverCapabilities: [
      "React Server Components (RSC)",
      "Next.js Server Actions ('use server')",
      "Flight RPC Stream Serialization",
      "Dynamic OpenGraph Image Generation",
      "Core Web Vitals Automated Instrumentation",
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12">
      {/* Student Project Hero Banner */}
      <section className="rounded-xl border bg-card p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                Next.js 15 App Router • Architecture Demo
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              NextGadgets — Tech Store &amp; Architecture Demo
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              An accessible, full-stack Next.js 15 application demonstrating React Server Components (RSC),
              decoupled Zustand client state management, accessible Radix UI primitives, and type-safe Server Actions
              with shared Zod validation schemas.
            </p>

            {/* Action buttons including on-screen Light/Dark Mode toggle */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a href="#products-section">
                <Button size="sm" className="h-8 text-xs font-semibold gap-1.5 shadow-xs">
                  <span>Browse Products</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </a>
              <a href="#checkout-section">
                <Button size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-primary" />
                  <span>Checkout Form</span>
                </Button>
              </a>

              {/* Explicit on-screen Light/Dark Mode button */}
              <ScreenThemeButton />

              <a href="#hydration-section">
                <Button size="sm" variant="ghost" className="h-8 text-xs font-medium gap-1.5 text-muted-foreground">
                  <Activity className="h-3.5 w-3.5" />
                  <span>RSC Hydration Demo</span>
                </Button>
              </a>
            </div>
          </div>

          {/* 4 Feature Overview Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0 text-xs">
            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <span className="text-[11px] text-muted-foreground block font-mono">
                Product Catalog
              </span>
              <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5 text-blue-500" />
                <span>6 Gadgets</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Server-Rendered
              </span>
            </div>

            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <span className="text-[11px] text-muted-foreground block font-mono">
                Client State
              </span>
              <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-500" />
                <span>Zustand Store</span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                Persistent localStorage
              </span>
            </div>

            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <span className="text-[11px] text-muted-foreground block font-mono">
                Layout Stability
              </span>
              <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>CLS: 0.000</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                Zero Layout Shifts
              </span>
            </div>

            <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
              <span className="text-[11px] text-muted-foreground block font-mono">
                Type Safety
              </span>
              <div className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                <span>Zod + Action</span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                End-to-End Validated
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Part B: Product Catalog & Zustand State (CO1, CO2) */}
      <section className="space-y-4">
        <ProductCatalog initialProducts={products} />
      </section>

      {/* Part C: Type-Safe Order Checkout Form Mutation (CO2) */}
      <section className="space-y-4 pt-4 border-t">
        <Suspense fallback={<OrderFormSkeleton />}>
          <OrderForm />
        </Suspense>
      </section>

      {/* Part A: RSC Architecture & Hydration Diagnostics (CO1) */}
      <section className="space-y-4 pt-4 border-t">
        <HydrationBoundaryDemo serverPayload={serverPayload} />
      </section>

      {/* Topic 6: Core Web Vitals Telemetry */}
      <section className="space-y-4 pt-4 border-t">
        <WebVitalsHud />
      </section>
    </div>
  );
}
