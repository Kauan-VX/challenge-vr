import type { CartItem } from '../types/product';

const BASE_URL = 'https://dummyjson.com';

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
  signal?: AbortSignal
): Promise<CartResponse> {
  const body = {
    userId: payload.userId,
    products: payload.items.map((it) => ({ id: it.id, quantity: it.quantity }))
  };

  const res = await fetch(`${BASE_URL}/carts/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal
  });

  if (!res.ok) {
    throw new Error(`Falha ao finalizar o pedido (${res.status})`);
  }

  return res.json() as Promise<CartResponse>;
}

export async function fetchCartById(id: number, signal?: AbortSignal): Promise<CartResponse> {
  const res = await fetch(`${BASE_URL}/carts/${id}`, { signal });
  if (!res.ok) {
    throw new Error(`Carrinho ${id} nao encontrado`);
  }
  return res.json() as Promise<CartResponse>;
}
