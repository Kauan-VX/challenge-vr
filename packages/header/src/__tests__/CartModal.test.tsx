import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCartStore, useFiltersStore } from "@vr/shared";
import type { Product } from "@vr/shared";
import Header from "../Header";
import { AppProviders, httpGet, httpPost, stubCategories } from "./testUtils";

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

beforeEach(() => {
  useFiltersStore.setState({ search: "", category: null });
  httpGet.mockReset();
  httpPost.mockReset();
  stubCategories();
});

const setup = () => {
  useCartStore.setState({ items: [], isOpen: false });
  const store = useCartStore.getState();
  store.addItem(sample(1, "Tenis", 199.9));
  store.addItem(sample(1, "Tenis", 199.9));
  store.addItem(sample(2, "Mochila", 89.5));
  store.openCart();
  const utils = render(
    <AppProviders>
      <Header />
    </AppProviders>,
  );
  return { ...utils, user: userEvent.setup() };
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
    httpPost.mockResolvedValueOnce({
      data: {
        id: 51,
        total: 489.3,
        discountedTotal: 489.3,
        userId: 1,
        totalProducts: 2,
        totalQuantity: 3,
        products: [],
      },
    } as Awaited<ReturnType<typeof httpPost>>);

    const { user } = setup();
    await user.click(screen.getByTestId("cart-checkout"));

    await waitFor(() => expect(screen.getByTestId("cart-confirmation")).toBeInTheDocument());

    expect(httpPost).toHaveBeenCalledTimes(1);
    const [url, body] = httpPost.mock.calls[0];
    expect(url).toBe("/carts/add");
    expect(body).toEqual({
      userId: 1,
      products: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 },
      ],
    });

    expect(screen.getByText("#51")).toBeInTheDocument();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("exibe erro quando a API de carrinho falha", async () => {
    httpPost.mockRejectedValueOnce(new Error("Falha ao finalizar o pedido (500)"));

    const { user } = setup();
    await user.click(screen.getByTestId("cart-checkout"));

    await waitFor(() => expect(screen.getByTestId("cart-error")).toBeInTheDocument());
    expect(useCartStore.getState().items).toHaveLength(2);
  });
});
