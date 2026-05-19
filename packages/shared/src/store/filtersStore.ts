import { create, type StoreApi, type UseBoundStore } from "zustand";

export interface FiltersState {
  search: string;
  category: string | null;
  setSearch: (value: string) => void;
  setCategory: (slug: string | null) => void;
  clearFilters: () => void;
}

const GLOBAL_KEY = "__VR_FILTERS_STORE__";

type FiltersStore = UseBoundStore<StoreApi<FiltersState>>;

const globalRef = globalThis as typeof globalThis & {
  [GLOBAL_KEY]?: FiltersStore;
};

function createFiltersStore(): FiltersStore {
  return create<FiltersState>((set) => ({
    search: "",
    category: null,
    setSearch: (value) => set({ search: value }),
    // troca de categoria zera o search: a DummyJSON combina os dois por interseção,
    // entao manter um termo antigo costuma cair em "sem resultados" e parece bug
    setCategory: (slug) => set({ category: slug, search: "" }),
    clearFilters: () => set({ search: "", category: null }),
  }));
}

export const useFiltersStore: FiltersStore =
  globalRef[GLOBAL_KEY] ?? (globalRef[GLOBAL_KEY] = createFiltersStore());

export const selectSearch = (state: FiltersState) => state.search;
export const selectCategory = (state: FiltersState) => state.category;
