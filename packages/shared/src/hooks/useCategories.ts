import { useQuery } from "@tanstack/react-query";
import { fetchCategories, type Category } from "../api/products";

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: ({ signal }) => fetchCategories(signal),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });
}
