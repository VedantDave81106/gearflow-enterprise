import { create } from "zustand";

export interface FilterState {
  searchQuery: string;
  category: string;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: "featured" | "price-asc" | "price-desc" | "rating";

  // Actions
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setMaxPrice: (price: number) => void;
  setInStockOnly: (inStock: boolean) => void;
  setSortBy: (sort: "featured" | "price-asc" | "price-desc" | "rating") => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS = {
  searchQuery: "",
  category: "all",
  maxPrice: 10000,
  inStockOnly: false,
  sortBy: "featured" as const,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...DEFAULT_FILTERS,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategory: (category) => set({ category }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setInStockOnly: (inStockOnly) => set({ inStockOnly }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(DEFAULT_FILTERS),
}));
