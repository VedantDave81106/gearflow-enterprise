"use client";

import * as React from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { ProductFilterPanel } from "@/components/product-filter-panel";
import { useFilterStore } from "@/lib/store/filter-store";
import { Server, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCatalogProps {
  initialProducts: Product[];
}

export function ProductCatalog({ initialProducts }: ProductCatalogProps) {
  const searchQuery = useFilterStore((s) => s.searchQuery);
  const category = useFilterStore((s) => s.category);
  const maxPrice = useFilterStore((s) => s.maxPrice);
  const inStockOnly = useFilterStore((s) => s.inStockOnly);
  const sortBy = useFilterStore((s) => s.sortBy);

  // Filter and sort items dynamically
  const filteredProducts = React.useMemo(() => {
    return initialProducts.filter((product) => {
      // Search matching name, description, features
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesFeatures = product.features.some((f) =>
          f.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesDesc && !matchesFeatures) {
          return false;
        }
      }

      // Category matching
      if (category !== "all" && product.category !== category) {
        return false;
      }

      // Price limit
      if (product.price > maxPrice) {
        return false;
      }

      // Stock check
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [initialProducts, searchQuery, category, maxPrice, inStockOnly, sortBy]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Enterprise Hardware Catalog
            </h2>
            <Badge variant="outline" className="gap-1 font-mono text-[11px]">
              <Server className="h-3 w-3 text-blue-500" />
              {filteredProducts.length} Available
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Server-rendered base catalog augmented with client-side reactive Zustand filters.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <ProductFilterPanel />

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center space-y-3 bg-muted/20">
          <FilterX className="h-10 w-10 mx-auto text-muted-foreground/50" />
          <h3 className="font-semibold text-sm">No hardware matches your criteria</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search query, increasing maximum price, or resetting category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
