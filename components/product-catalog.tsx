"use client";

import * as React from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { ProductFilterPanel } from "@/components/product-filter-panel";
import { useFilterStore } from "@/lib/store/filter-store";
import { cartActions } from "@/lib/store/cart-store";
import { formatCurrency } from "@/lib/utils";
import {
  FilterX,
  Plus,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductCatalogProps {
  initialProducts: Product[];
}

export function ProductCatalog({ initialProducts }: ProductCatalogProps) {
  const searchQuery = useFilterStore((s) => s.searchQuery);
  const category = useFilterStore((s) => s.category);
  const maxPrice = useFilterStore((s) => s.maxPrice);
  const inStockOnly = useFilterStore((s) => s.inStockOnly);
  const sortBy = useFilterStore((s) => s.sortBy);
  const viewMode = useFilterStore((s) => s.viewMode);

  const [addedItemMap, setAddedItemMap] = React.useState<Record<string, boolean>>({});

  const handleTableAdd = (product: Product) => {
    cartActions.addItem(product, 1);
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    toast.success(`Allocated 1x ${product.name} to requisition cart`, {
      description: `Unit price: ${formatCurrency(product.price)}`,
    });
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  // Filter and sort items dynamically
  const filteredProducts = React.useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Search matching name, description, features, SKU
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesSku = product.sku?.toLowerCase().includes(q) || false;
          const matchesFeatures = product.features.some((f) =>
            f.toLowerCase().includes(q)
          );
          if (!matchesName && !matchesDesc && !matchesSku && !matchesFeatures) {
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
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [initialProducts, searchQuery, category, maxPrice, inStockOnly, sortBy]);

  return (
    <div id="catalog-section" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Hardware Inventory & Node Allocation
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time datacenter hardware nodes available for deployment.
            Managed via Zustand persistent client state slice.
          </p>
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          Showing <span className="font-bold text-foreground">{filteredProducts.length}</span> of{" "}
          <span>{initialProducts.length}</span> models
        </div>
      </div>

      {/* Filter Toolbar */}
      <ProductFilterPanel />

      {/* Products Presentation */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center space-y-3 bg-muted/15">
          <FilterX className="h-10 w-10 mx-auto text-muted-foreground/50" />
          <h3 className="font-semibold text-sm">No hardware matched your criteria</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search query, increasing maximum price, or resetting category filters.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/40 font-semibold text-foreground">
                  <th className="p-3">Node Model & SKU</th>
                  <th className="p-3">Category / Form Factor</th>
                  <th className="p-3">Architecture Specs</th>
                  <th className="p-3">Datacenter / Stock</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProducts.map((p) => {
                  const isAdded = addedItemMap[p.id];
                  return (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 rounded-lg overflow-hidden shrink-0 border bg-muted">
                            <Image
                              src={p.imageUrl}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground line-clamp-1">
                              {p.name}
                            </div>
                            <div className="font-mono text-[11px] text-muted-foreground">
                              {p.sku}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="capitalize font-medium text-foreground">
                          {p.category}
                        </div>
                        <div className="text-[11px] font-mono text-muted-foreground">
                          {p.formFactor || "Rackmount"}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.features.slice(0, 2).map((f) => (
                            <span
                              key={f}
                              className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono text-muted-foreground border"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1 font-medium text-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{p.stock} units</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {p.datacenter || "Ashburn DC-1"}
                        </div>
                      </td>

                      <td className="p-3 text-right font-mono font-bold text-sm text-foreground">
                        {formatCurrency(p.price)}
                      </td>

                      <td className="p-3 text-center">
                        <Button
                          size="sm"
                          variant={isAdded ? "secondary" : "default"}
                          onClick={() => handleTableAdd(p)}
                          className="h-7 text-xs px-2.5 gap-1 font-medium"
                        >
                          {isAdded ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-500" />
                              <span>Allocated</span>
                            </>
                          ) : (
                            <>
                              <Plus className="h-3 w-3" />
                              <span>Add</span>
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
