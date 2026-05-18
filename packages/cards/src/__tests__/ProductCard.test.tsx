import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { cartReducer, selectCartItems } from "@vr/shared";
import type { Product } from "@vr/shared";
import ProductCard from "../components/ProductCard";

const baseProduct: Product = {
  id: 42,
  title: "Tenis Esportivo",
  description: "Confortavel e leve",
  price: 250,
  discountPercentage: 10,
  rating: 4.5,
  stock: 12,
  brand: "VR Sports",
  category: "sports",
  thumbnail: "https://dummyjson.com/image/i/products/42/thumbnail.jpg",
  images: [],
};

const renderWithStore = (product = baseProduct) => {
  const store = configureStore({ reducer: { cart: cartReducer } });
  const utils = render(
    <Provider store={store}>
      <ProductCard product={product} />
    </Provider>,
  );
  return { store, ...utils, user: userEvent.setup() };
};

describe("ProductCard", () => {
  it("mostra titulo, marca e preco com desconto aplicado", () => {
    renderWithStore();
    expect(screen.getByText("Tenis Esportivo")).toBeInTheDocument();
    expect(screen.getByText("VR Sports")).toBeInTheDocument();
    const priceText = screen.getByText(/R\$\s?225,00/);
    expect(priceText).toBeInTheDocument();
  });

  it("mostra badge com porcentagem de desconto quando aplicavel", () => {
    renderWithStore();
    expect(screen.getByLabelText("Desconto")).toHaveTextContent("-10%");
  });

  it("omite badge quando nao ha desconto", () => {
    renderWithStore({ ...baseProduct, discountPercentage: 0 });
    expect(screen.queryByLabelText("Desconto")).not.toBeInTheDocument();
  });

  it("despacha addItem ao clicar em adicionar", async () => {
    const { user, store } = renderWithStore();
    await user.click(screen.getByTestId("add-42"));
    const items = selectCartItems(store.getState());
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: 42, quantity: 1 });
  });
});
