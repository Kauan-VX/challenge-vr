export type { Product, ProductsResponse, CartItem } from './types/product';
export {
  cartReducer,
  addItem,
  removeItem,
  decrementItem,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartIsOpen
} from './store/cartSlice';
export type { CartState } from './store/cartSlice';
export {
  fetchProducts,
  fetchProductById
} from './api/products';
export type { FetchProductsParams } from './api/products';
export { createCart, fetchCartById } from './api/carts';
export type { CartCheckoutPayload, CartResponse } from './api/carts';
export { formatPrice } from './utils/format';
