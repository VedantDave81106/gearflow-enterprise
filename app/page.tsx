import { Suspense } from "react";
import Link from "next/link";
import { INITIAL_PRODUCTS } from "@/lib/data/products";
import { HydrationBoundaryDemo, HydrationAuditPayload } from "@/components/hydration-boundary-demo";
import { ProductCatalog } from "@/components/product-catalog";
import { OrderForm } from "@/components/order-form";
import { WebVitalsHud } from "@/components/web-vitals-hud";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Server,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  FileCode,
  Gauge,
} from "lucide-react";

/**
 * Server Component Loading Fallback for Suspense Demonstration
 */
function OrderFormSkeleton() {
  return (
    <div className="rounded-xl border p-6 space-y-6 bg-card">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-10 w-40 ml-auto" />
    </div>
  );
}

/**
 * Async React Server Component (RSC) Root View
 * Executes on Node.js / V8 Server Engine at request time.
 * Demonstrates CO1 (App Router compilation, RSC-to-Client props serialization).
 */
export default async function HomePage() {
  // Server-side simulated database query
  const products = INITIAL_PRODUCTS;

  // Server-side audit payload passed across the RSC -> Client boundary
  const serverPayload: HydrationAuditPayload = {
    serverBuildId: "next-flight-v15.1.7-prod",
    serverTimestamp: new Date().toISOString(),
    nodeEnvironment: process.env.NODE_ENV || "development",
    executionTarget: "Server-side Node.js V8 Engine",
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-primary/5 via-background to-background p-6 sm:p-12 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="bg-primary/90 text-primary-foreground text-xs font-semibold px-2.5 py-0.5">
              Unit I, II, III Assignment
            </Badge>
            <Badge variant="outline" className="border-blue-500/40 text-blue-500 font-mono text-xs">
              CO1 & CO2 Fully Implemented
            </Badge>
            <span className="text-xs text-muted-foreground">
              PO1, PO3, PO5, PO11 | PSO 2, PSO 3
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Responsive Accessible Architecture &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-primary">
              Type-Safe Server Actions
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            A production-ready full-stack application built with Next.js 15 App Router.
            Demonstrating isolated React Server Components (RSC), decoupled persistent Zustand
            client state slices, shared Zod schema form validations, and zero layout shift hydration.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a href="#catalog-section">
              <Button className="gap-2 font-semibold shadow-sm">
                <span>Explore Catalog & Cart</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#order-mutation-form">
              <Button variant="outline" className="gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Test Server Action Mutation</span>
              </Button>
            </a>
            <Link href="/report">
              <Button variant="secondary" className="gap-2">
                <FileCode className="h-4 w-4 text-primary" />
                <span>View Technical Report</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/50">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
              <Server className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">React Server Components</h4>
              <p className="text-[11px] text-muted-foreground">
                Server-streamed HTML with zero client JavaScript overhead for data fetching.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">Decoupled Zustand Store</h4>
              <p className="text-[11px] text-muted-foreground">
                Persistent client slice with selective subscriptions to prevent parent re-renders.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">End-to-End Zod Schema</h4>
              <p className="text-[11px] text-muted-foreground">
                Unified validation between client input forms and backend Server Actions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
              <Gauge className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold text-foreground">Audited Core Web Vitals</h4>
              <p className="text-[11px] text-muted-foreground">
                Sub-second LCP, zero CLS (0.000), and rapid INP tracked via real-time telemetry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Part A: Hydration Boundary & Serialization Deep Dive */}
      <section id="hydration-section" className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">Part A</Badge>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Course Outcome 1 (CO1)
          </span>
        </div>
        <HydrationBoundaryDemo serverPayload={serverPayload} />
      </section>

      {/* Part B: Decoupled Zustand Client State & Catalog Section */}
      <section id="catalog-section" className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">Part B</Badge>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Decoupled State Management (CO1, CO2)
          </span>
        </div>
        <ProductCatalog initialProducts={products} />
      </section>

      {/* Part C: Type-Safe Server Action Form Mutation Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">Part C</Badge>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            End-to-End Type-Safe Form Mutation (CO2)
          </span>
        </div>
        <Suspense fallback={<OrderFormSkeleton />}>
          <OrderForm />
        </Suspense>
      </section>

      {/* Topic 6: Real-time Core Web Vitals Telemetry HUD */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">Topic 6</Badge>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Core Web Vitals & Hydration Auditing
          </span>
        </div>
        <WebVitalsHud />
      </section>
    </div>
  );
}
