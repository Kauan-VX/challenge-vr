import type { Product, ProductsResponse } from '../types/product';

const BASE_URL = 'https://dummyjson.com';

export interface FetchProductsParams {
  limit?: number;
  skip?: number;
  search?: string;
}

export async function fetchProducts(
  params: FetchProductsParams = {},
  signal?: AbortSignal
): Promise<ProductsResponse> {
  const { limit = 12, skip = 0, search } = params;

  let url: string;
  if (search && search.trim().length > 0) {
    const qs = new URLSearchParams({ q: search, limit: String(limit), skip: String(skip) });
    url = `${BASE_URL}/products/search?${qs.toString()}`;
  } else {
    url = `${BASE_URL}/products?limit=${limit}&skip=${skip}`;
  }

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Falha ao carregar produtos (${res.status})`);
  }
  return res.json() as Promise<ProductsResponse>;
}

export async function fetchProductById(id: number, signal?: AbortSignal): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, { signal });
  if (!res.ok) {
    throw new Error(`Produto ${id} nao encontrado`);
  }
  return res.json() as Promise<Product>;
}
