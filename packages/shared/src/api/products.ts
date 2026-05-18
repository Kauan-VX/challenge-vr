import { http } from "./http";
import type { ProductsResponse } from "../types/product";

export interface FetchProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
  category?: string | null;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export async function fetchProducts(
  params: FetchProductsParams = {},
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  const { limit = 12, skip = 0, search, category } = params;
  const term = search?.trim();

  if (term) {
    const { data } = await http.get<ProductsResponse>("/products/search", {
      params: { q: term, limit, skip },
      signal,
    });
    return data;
  }

  if (category) {
    const path = `/products/category/${encodeURIComponent(category)}`;
    const { data } = await http.get<ProductsResponse>(path, {
      params: { limit, skip },
      signal,
    });
    return data;
  }

  const { data } = await http.get<ProductsResponse>("/products", {
    params: { limit, skip },
    signal,
  });
  return data;
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  const { data } = await http.get<Category[]>("/products/categories", { signal });
  return data;
}
