"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useCartStore, cartActions } from "@/lib/store/cart-store";
import { AcademicRubricModal } from "@/components/academic-rubric-modal";
import {
  ShoppingBag,
  ShoppingCart,
  FileText,
  GraduationCap,
  Layers,
  Activity,
  Terminal,
} from "lucide-react";

export function Navbar() {
  const [rubricOpen, setRubricOpen] = React.useState(false);

  // Selective Zustand subscription: subscribes ONLY to total items count.
  // Isolated from layout re-renders.
  const totalItemCount = useCartStore(
    (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    0
  );

  return (
    <>
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none text-xs"
      >
        Skip to main content
      </a>

      {/* Top Academic Status Bar */}
      <div className="border-b bg-muted/40 text-[11px] text-muted-foreground py-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Next.js 15 App Router</span>
            </span>
            <span className="hidden sm:inline text-border">|</span>
            <span className="hidden sm:inline">RSC + Zustand + Server Actions</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setRubricOpen(true)}
              className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
            >
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              <span>Course Outcomes (CO1/CO2)</span>
            </button>
            <span className="text-border">|</span>
            <Link
              href="/report"
              className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
            >
              <FileText className="h-3 w-3" />
              <span>Technical Report</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold tracking-tight text-base hover:opacity-90 transition-opacity"
            >
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-semibold tracking-tight">NextGadgets</span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                  Store
                </span>
              </div>
            </Link>

            <span className="hidden lg:inline text-xs text-muted-foreground font-mono bg-muted/60 px-2 py-0.5 rounded border">
              Web Dev Assignment
            </span>
          </div>

          {/* Quick Nav Anchors */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <a
              href="#products-section"
              className="px-2.5 py-1.5 rounded-md hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Products</span>
            </a>
            <a
              href="#checkout-section"
              className="px-2.5 py-1.5 rounded-md hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Checkout Form</span>
            </a>
            <a
              href="#hydration-section"
              className="px-2.5 py-1.5 rounded-md hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Hydration Demo</span>
            </a>
            <a
              href="#web-vitals-audit"
              className="px-2.5 py-1.5 rounded-md hover:text-foreground hover:bg-muted transition-colors"
            >
              Web Vitals
            </a>
          </nav>

          {/* Actions: Cart Drawer Trigger + Theme Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => cartActions.setIsDrawerOpen(true)}
              className="h-8 gap-2 px-2.5 border-border/80 text-xs"
              aria-label={`Open shopping cart with ${totalItemCount} items`}
            >
              <ShoppingCart className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline font-medium">Cart</span>
              <span
                className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                  totalItemCount > 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {totalItemCount}
              </span>
            </Button>

            {/* Segmented Light/Dark Mode Toggle in Navbar */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Academic Rubric Modal */}
      <AcademicRubricModal open={rubricOpen} onOpenChange={setRubricOpen} />
    </>
  );
}
