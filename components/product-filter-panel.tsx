"use client";

import * as React from "react";
import {
  Search,
  RotateCcw,
  LayoutGrid,
  List,
  Cpu,
  Server,
  HardDrive,
  Shield,
  Layers,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFilterStore } from "@/lib/store/filter-store";
import { formatCurrency } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All Nodes", icon: Layers },
  { id: "compute", label: "Compute", icon: Cpu },
  { id: "networking", label: "Networking", icon: Server },
  { id: "storage", label: "Storage", icon: HardDrive },
  { id: "security", label: "Security & HSM", icon: Shield },
  { id: "accessories", label: "Power & Modules", icon: Layers },
];

export function ProductFilterPanel() {
  const searchQuery = useFilterStore((s) => s.searchQuery);
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery);
  const category = useFilterStore((s) => s.category);
  const setCategory = useFilterStore((s) => s.setCategory);
  const maxPrice = useFilterStore((s) => s.maxPrice);
  const setMaxPrice = useFilterStore((s) => s.setMaxPrice);
  const inStockOnly = useFilterStore((s) => s.inStockOnly);
  const setInStockOnly = useFilterStore((s) => s.setInStockOnly);
  const sortBy = useFilterStore((s) => s.sortBy);
  const setSortBy = useFilterStore((s) => s.setSortBy);
  const viewMode = useFilterStore((s) => s.viewMode);
  const setViewMode = useFilterStore((s) => s.setViewMode);
  const resetFilters = useFilterStore((s) => s.resetFilters);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    category !== "all" ||
    maxPrice < 10000 ||
    inStockOnly ||
    sortBy !== "featured";

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Filter Bar: Search + Category Pills + View Mode */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by SKU, processor, NVMe, or network specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs font-mono"
            aria-label="Filter hardware inventory"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort & View Mode Controls */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          {/* Sort Select */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as "featured" | "price-asc" | "price-desc" | "rating"
              )
            }
            className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="Sort inventory"
          >
            <option value="featured">Featured Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {/* Grid vs Table View Mode */}
          <div className="flex items-center border rounded-md p-0.5 bg-muted/40">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-background shadow-xs text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
              aria-label="Switch to grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "table"
                  ? "bg-background shadow-xs text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table View"
              aria-label="Switch to table view"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/40">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                isActive
                  ? "bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                  : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Sliders & In-Stock Toggles */}
      <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <span className="text-muted-foreground whitespace-nowrap font-medium">
            Max Unit Price:
          </span>
          <Slider
            value={[maxPrice]}
            max={10000}
            min={350}
            step={150}
            onValueChange={(val) => setMaxPrice(val[0])}
            className="flex-1"
          />
          <span className="font-mono font-bold text-foreground min-w-[70px] text-right">
            {formatCurrency(maxPrice)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="stock-filter"
            checked={inStockOnly}
            onCheckedChange={setInStockOnly}
          />
          <Label htmlFor="stock-filter" className="text-xs cursor-pointer font-medium">
            In-Stock Nodes Only
          </Label>
        </div>
      </div>
    </div>
  );
}
