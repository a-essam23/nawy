import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ApartmentFilterState {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  project?: string;
  developer?: string;
  sortBy?: "price" | "bedrooms" | "bathrooms" | "area" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

const initialState: ApartmentFilterState = {
  searchTerm: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  minBedrooms: undefined,
  maxBedrooms: undefined,
  minBathrooms: undefined,
  maxBathrooms: undefined,
  minArea: undefined,
  maxArea: undefined,
  project: undefined,
  developer: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

interface useApartmentFilterStoreProps extends ApartmentFilterState {
  updateFilters: (filters: Partial<ApartmentFilterState>) => void;
  getFilters: () => ApartmentFilterState;
  resetFilters: () => void;
}

export const useApartmentFilterStore = create<useApartmentFilterStoreProps>()(
  persist(
    (set, get) => ({
      ...initialState,
      updateFilters(filters) {
        set((state) => ({
          ...state,
          ...filters,
        }));
      },
      getFilters: () => {
        const state = get();
        const filters: ApartmentFilterState = {
          searchTerm: state.searchTerm,
          minPrice: state.minPrice,
          maxPrice: state.maxPrice,
          minBedrooms: state.minBedrooms,
          maxBedrooms: state.maxBedrooms,
          minBathrooms: state.minBathrooms,
          maxBathrooms: state.maxBathrooms,
          minArea: state.minArea,
          maxArea: state.maxArea,
          project: state.project,
          developer: state.developer,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
          page: state.page,
          limit: state.limit,
        };
        return filters;
      },
      resetFilters: () => {
        set(initialState);
      },
    }),
    {
      name: "apartment-filter-storage",
      partialize: (state) => ({
        searchTerm: state.searchTerm,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
        minBedrooms: state.minBedrooms,
        maxBedrooms: state.maxBedrooms,
        minBathrooms: state.minBathrooms,
        maxBathrooms: state.maxBathrooms,
        minArea: state.minArea,
        maxArea: state.maxArea,
        project: state.project,
        developer: state.developer,
        sortBy: state.sortBy,
        sortOrder: state.sortOrder,
        page: state.page,
        limit: state.limit,
      }),
    }
  )
);
