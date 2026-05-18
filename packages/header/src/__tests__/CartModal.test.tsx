import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { cartReducer, addItem, openCart, selectCartItems } from "@vr/shared";
import type { Product } from "@vr/shared";
import Header from "../Header";

const sample = (id: number, title: string, price = 10): Product => ({
  id,
  title,
  description: "",
  price,
  discountPercentage: 0,
  rating: 0,
  stock: 10,
  brand: "",
  category: "",
  thumbnail: "",
  images: [],
});

const setup = () => {
  const store = configureStore({ reducer: { cart: cartReducer } });
  store.dispatch(addItem(sample(1, "Tenis", 199.9)));
  store.dispatch(addItem(sample(1, "Tenis", 199.9)));
  store.dispatch(addItem(sample(2, "Mochila", 89.5)));
  store.dispatch(openCart());
  const utils = render(
    <Provider store={store}>
      <Header />
    </Provider>,
  );
  return { store, ...utils, user: userEvent.setup() };
};

describe("CartModal", () => {
  it("renderiza a lista de produtos selecionados", () => {
    setup();
    const list = screen.getByTestId("cart-list");
    expect(within(list).getByText("Tenis")).toBeInTheDocument();
    expect(within(list).getByText("Mochila")).toBeInTheDocument();
    expect(screen.getByTestId("qty-1")).toHaveTextContent("2");
    expect(screen.getByTestId("qty-2")).toHaveTextContent("1");
  });

  it("exibe o total formatado em BRL", () => {
    setup();
    const total = screen.getByTestId("cart-total").textContent ?? "";
    expect(total.replace(/\s/g, " ")).toMatch(/R\$\s?489,30/);
  });

  it("decrementa quantidade ao clicar em -", async () => {
    const { user } = setup();
    await user.click(screen.getByLabelText(/Diminuir quantidade de Tenis/i));
    expect(screen.getByTestId("qty-1")).toHaveTextContent("1");
  });

  it("remove item ao clicar em remover", async () => {
    const { user } = setup();
    await user.click(screen.getByLabelText(/Remover Mochila/i));
    expect(screen.queryByText("Mochila")).not.toBeInTheDocument();
  });

  it("fecha ao pressionar Escape", async () => {
    const { user } = setup();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("mostra estado vazio depois de limpar o carrinho", async () => {
    const { user } = setup();
    await user.click(screen.getByText("Limpar carrinho"));
    expect(screen.getByTestId("cart-empty")).toBeInTheDocument();
  });

  it("finaliza o pedido chamando POST /carts/add e limpa o carrinho", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 51,
          total: 489.3,
          discountedTotal: 489.3,
          userId: 1,
          totalProducts: 2,
          totalQuantity: 3,
          products: [],
        }),
    });
    (global as unknown as { fetch: jest.Mock }).fetch = fetchMock;

    const { user, store } = setup();
    await user.click(screen.getByTestId("cart-checkout"));

    await waitFor(() => expect(screen.getByTestId("cart-confirmation")).toBeInTheDocument());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://dummyjson.com/carts/add");
    expect(init).toMatchObject({ method: "POST" });
    const body = JSON.parse(init.body);
    expect(body.userId).toBe(1);
    expect(body.products).toEqual([
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ]);

    expect(screen.getByText("#51")).toBeInTheDocument();
    expect(selectCartItems(store.getState())).toHaveLength(0);
  });

  it("exibe erro quando a API de carrinho falha", async () => {
    (global as unknown as { fetch: jest.Mock }).fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500 });

    const { user, store } = setup();
    await user.click(screen.getByTestId("cart-checkout"));

    await waitFor(() => expect(screen.getByTestId("cart-error")).toBeInTheDocument());
    expect(selectCartItems(store.getState())).toHaveLength(2);
  });
});
