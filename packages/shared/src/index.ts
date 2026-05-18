export type {
  Product,
  ProductsResponse,
  CartItem,
  CartItemInput,
  ProductReview,
  ProductDimensions,
  ProductMeta,
} from "./types/product";
export {
  useCartStore,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
  selectCartIsOpen,
  selectCartItemQuantity,
} from "./store/cartStore";
export type { CartState } from "./store/cartStore";
export { useFiltersStore, selectSearch, selectCategory } from "./store/filtersStore";
export type { FiltersState } from "./store/filtersStore";
export { fetchProducts, fetchCategories } from "./api/products";
export type { FetchProductsParams, Category } from "./api/products";
export { createCart } from "./api/carts";
export type { CartCheckoutPayload, CartResponse } from "./api/carts";
export { http, ApiError } from "./api/http";
export { useCategories } from "./hooks/useCategories";
export { useCheckout } from "./hooks/useCheckout";
export { useModalControls } from "./hooks/useModalControls";
export { Stars } from "./components/Stars";
export { CartStepper } from "./components/CartStepper";
export {
  PRODUCT_THUMBNAIL_FALLBACK,
  PRODUCT_GALLERY_FALLBACK,
  PRODUCT_ROW_FALLBACK,
} from "./utils/placeholders";
export { formatPrice } from "./utils/format";
export { translateCategory } from "./utils/categories";
export {
  translateAvailability,
  translateWarranty,
  translateShipping,
  translateReturnPolicy,
} from "./utils/productLabels";
export { flyToCart } from "./utils/flyToCart";
export type { FlyToCartOptions } from "./utils/flyToCart";
export { reportError, setTelemetrySink } from "./utils/telemetry";
export type { TelemetryContext, TelemetrySink } from "./utils/telemetry";
export * from "./icons";
