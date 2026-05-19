import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCartStore, useFiltersStore } from "@vr/shared";
import type { Product } from "@vr/shared";
import Header from "../Header";
import { AppProviders, clientWithCategories, httpGet, httpPost, stubCategories } from "./testUtils";

const sample = (id: number, title = `Produto ${id}`): Product => ({
  id,
  title,
  description: "",
  price: 19.9,
  discountPercentage: 0,
  rating: 0,
  stock: 10,
  brand: "",
  category: "",
  thumbnail: "",
  images: [],
});

beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
  useFiltersStore.setState({ search: "", category: null });
  httpGet.mockReset();
  httpPost.mockReset();
  stubCategories();
});

const renderHeader = () =>
  render(
    <AppProviders client={clientWithCategories([{ slug: "beauty", name: "Beauty" }])}>
      <Header />
    </AppProviders>,
  );

describe("Header", () => {
  it("nao mostra badge quando o carrinho esta vazio", () => {
    renderHeader();
    expect(screen.queryByTestId("header-cart-badge")).not.toBeInTheDocument();
  });

  it("mostra badge com a contagem total de itens", () => {
    const { addItem } = useCartStore.getState();
    addItem(sample(1));
    addItem(sample(1));
    addItem(sample(2));
    renderHeader();
    expect(screen.getByTestId("header-cart-badge")).toHaveTextContent("3");
  });

  it("abre o modal ao clicar no botao do carrinho", async () => {
    const user = userEvent.setup();
    const { addItem } = useCartStore.getState();
    addItem(sample(1, "Camiseta"));
    renderHeader();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByTestId("header-cart-button"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Camiseta")).toBeInTheDocument();
  });

  it("inclui o input de busca na navbar", () => {
    renderHeader();
    expect(screen.getByTestId("header-search-input")).toBeInTheDocument();
  });
});
