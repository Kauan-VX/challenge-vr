import type { Product } from "@vr/shared";

/**
 * Dados usados apenas pelo bootstrap standalone do Header (npm start -w @vr/header)
 * para pré-popular o carrinho e permitir visualizar o componente isoladamente.
 * Em modo federado (consumido pelo shell), nada disso é executado.
 */
export const demoProduct: Product = {
  id: 1,
  title: "Produto demonstração",
  description: "",
  price: 49.9,
  discountPercentage: 0,
  rating: 0,
  stock: 10,
  brand: "",
  category: "",
  thumbnail: "https://dummyjson.com/image/i/products/1/thumbnail.jpg",
  images: [],
};
