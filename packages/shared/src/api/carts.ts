import { http, extractErrorMessage } from "./http";
import type { CartItem } from "../types/product";

export interface CartCheckoutPayload {
  userId: number;
  items: CartItem[];
}

export interface CartResponse {
  id: number;
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
  products: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountPercentage: number;
    discountedPrice: number;
    thumbnail: string;
  }>;
}

export async function createCart(
  payload: CartCheckoutPayload,
  signal?: AbortSignal,
): Promise<CartResponse> {
  const body = {
    userId: payload.userId,
    products: payload.items.map((it) => ({ id: it.id, quantity: it.quantity })),
  };

  try {
    const res = await http.post<CartResponse>("/carts/add", body, { signal });
    return res.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err, "Falha ao finalizar o pedido"));
  }
}
