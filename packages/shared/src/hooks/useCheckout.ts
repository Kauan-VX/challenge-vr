import { useMutation } from "@tanstack/react-query";
import { createCart, type CartCheckoutPayload, type CartResponse } from "../api/carts";

export function useCheckout() {
  return useMutation<CartResponse, Error, CartCheckoutPayload>({
    mutationKey: ["checkout"],
    mutationFn: (payload) => createCart(payload),
  });
}
