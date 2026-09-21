"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore, cartActions } from "@/lib/store/cart-store";
import {
  Cpu,
  ShoppingCart,
  FileText,
} from "lucide-react";

export function Navbar() {
  // Selective Zustand subscription: subscribes ONLY to total items count.
  // Changes to other cart fields (e.g. promo codes, item prices) do NOT trigger navbar re-render!
  const totalItemCount = useCartStore(
    (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    0
  );

  return (
    <>
      {/* Accessible Skip Link for screen reader and keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & CO Badges */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold tracking-tight text-base sm:text-lg hover:opacity-90 transition-opacity"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Cpu className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="leading-tight">
                  GearFlow <span className="text-primary font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-primary/10 ml-0.5">Enterprise</span>
                </span>
                <span className="text-[10px] text-muted-foreground hidden sm:inline">
                  Next.js App Router Architecture
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 ml-2 border-l pl-3">
              <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-500">
                CO1: App Router & Hydration
              </Badge>
              <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500">
                CO2: Server Actions & Zod
              </Badge>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <a
              href="#catalog-section"
              className="px-3 py-1.5 rounded-md hover:text-foreground hover:bg-accent transition-colors"
            >
              Catalog
            </a>
            <a
              href="#hydration-section"
              className="px-3 py-1.5 rounded-md hover:text-foreground hover:bg-accent transition-colors"
            >
              Hydration Audit
            </a>
            <a
              href="#order-mutation-form"
              className="px-3 py-1.5 rounded-md hover:text-foreground hover:bg-accent transition-colors"
            >
              Server Mutation
            </a>
            <a
              href="#web-vitals-audit"
              className="px-3 py-1.5 rounded-md hover:text-foreground hover:bg-accent transition-colors"
            >
              Web Vitals
            </a>
            <Link
              href="/report"
              className="px-3 py-1.5 rounded-md hover:text-foreground hover:bg-accent transition-colors flex items-center gap-1 text-primary font-semibold"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Technical Report</span>
            </Link>
          </nav>

          {/* Actions: Cart Drawer Trigger + Theme Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => cartActions.setIsDrawerOpen(true)}
              className="relative h-9 gap-2 px-3 border-border/70 hover:border-primary/50"
              aria-label={`Open provisioning cart with ${totalItemCount} items`}
            >
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline text-xs font-medium">Cart</span>
              {totalItemCount > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                  {totalItemCount}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground font-mono">0</span>
              )}
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
