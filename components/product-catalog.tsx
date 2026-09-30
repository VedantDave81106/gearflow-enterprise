"use client";

import * as React from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { ProductFilterPanel } from "@/components/product-filter-panel";
import { useFilterStore } from "@/lib/store/filter-store";
import { PackageOpen } from "lucide-react";

interface ProductCatalogProps {
  initialProducts: Product[];
}

export function ProductCatalog({ initialProducts }: ProductCatalogProps) {
  const searchQuery = useFilterStore((s) => s.searchQuery);
  const category = useFilterStore((s) => s.category);

  // Filter products based on search query and category
  const filteredProducts = React.useMemo(() => {
    return initialProducts.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc) return false;
      }

      if (category !== "all" && p.category !== category) {
        return false;
      }

      return true;
    });
  }, [initialProducts, searchQuery, category]);

  return (
    <div id="products-section" className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Available Products
        </h2>
        <p className="text-xs text-muted-foreground">
          Products rendered via Server Components with client-side Zustand filtering.
        </p>
      </div>

      <ProductFilterPanel />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl space-y-2 bg-muted/10">
          <PackageOpen className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            No products found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
