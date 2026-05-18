import { http, extractErrorMessage } from "./http";
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
  const hasSearch = !!search && search.trim().length > 0;

  try {
    if (hasSearch) {
      const res = await http.get<ProductsResponse>("/products/search", {
        params: { q: search, limit, skip },
        signal,
      });
      return res.data;
    }
    if (category) {
      const res = await http.get<ProductsResponse>(
        `/products/category/${encodeURIComponent(category)}`,
        { params: { limit, skip }, signal },
      );
      return res.data;
    }
    const res = await http.get<ProductsResponse>("/products", {
      params: { limit, skip },
      signal,
    });
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Falha ao carregar produtos"));
  }
}

export async function fetchCategories(signal?: AbortSignal): Promise<Category[]> {
  try {
    const res = await http.get<Category[]>("/products/categories", { signal });
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Falha ao carregar categorias"));
  }
}
