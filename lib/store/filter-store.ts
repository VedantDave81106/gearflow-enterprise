import { create } from "zustand";

export interface FilterState {
  searchQuery: string;
  category: string;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: "",
  category: "all",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategory: (category) => set({ category }),
  resetFilters: () => set({ searchQuery: "", category: "all" }),
}));
