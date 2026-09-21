"use client";

import * as React from "react";
import { Search, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFilterStore } from "@/lib/store/filter-store";
import { formatCurrency } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All Hardware" },
  { id: "compute", label: "Compute" },
  { id: "networking", label: "Networking" },
  { id: "storage", label: "Storage" },
  { id: "security", label: "Security" },
  { id: "accessories", label: "Accessories" },
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
  const resetFilters = useFilterStore((s) => s.resetFilters);

  return (
    <div className="rounded-xl border bg-card/70 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span>Catalog Filter Slice (Zustand)</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Field */}
        <div className="relative md:col-span-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search specs, models, processors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
            aria-label="Filter catalog items"
          />
        </div>

        {/* Categories */}
        <div className="md:col-span-5 flex flex-wrap gap-1.5 items-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                category === cat.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted hover:bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* In-Stock Only & Price Cap */}
        <div className="md:col-span-3 flex items-center justify-end gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="stock-filter"
              checked={inStockOnly}
              onCheckedChange={setInStockOnly}
            />
            <Label htmlFor="stock-filter" className="text-xs cursor-pointer">
              In Stock Only
            </Label>
          </div>
        </div>
      </div>

      {/* Price Slider Bar */}
      <div className="pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-1 max-w-sm">
          <span className="text-muted-foreground whitespace-nowrap">
            Max Price:
          </span>
          <Slider
            value={[maxPrice]}
            max={10000}
            min={300}
            step={100}
            onValueChange={(val) => setMaxPrice(val[0])}
            className="flex-1"
          />
          <span className="font-mono font-medium">{formatCurrency(maxPrice)}</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Isolated client state ensures filter mutations trigger zero full-page server reconciliations.
        </p>
      </div>
    </div>
  );
}
