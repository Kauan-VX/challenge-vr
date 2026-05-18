export type { Product, ProductsResponse, CartItem, CartItemInput } from "./types/product";
export {
  cartReducer,
  addItem,
  removeItem,
  decrementItem,
  clearCart,
  openCart,
  closeCart,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartIsOpen,
} from "./store/cartSlice";
export type { CartState } from "./store/cartSlice";
export { fetchProducts } from "./api/products";
export type { FetchProductsParams } from "./api/products";
export { createCart } from "./api/carts";
export type { CartCheckoutPayload, CartResponse } from "./api/carts";
export { formatPrice, humanizeSlug } from "./utils/format";
export * from "./icons";
