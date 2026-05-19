import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFiltersStore } from "@vr/shared";
import CategoryBar from "../components/CategoryBar";
import { AppProviders, clientWithCategories } from "./testUtils";

const CATEGORIES = [
  { slug: "beauty", name: "Beauty" },
  { slug: "fragrances", name: "Fragrances" },
  { slug: "laptops", name: "Laptops" },
];

beforeEach(() => {
  useFiltersStore.setState({ search: "", category: null });
});

const renderBar = () =>
  render(
    <AppProviders client={clientWithCategories(CATEGORIES)}>
      <CategoryBar />
    </AppProviders>,
  );

describe("CategoryBar", () => {
  it("renderiza categorias traduzidas em pt-BR", () => {
    renderBar();
    expect(screen.getByTestId("category-beauty")).toHaveTextContent("Beleza");
    expect(screen.getByTestId("category-fragrances")).toHaveTextContent("Perfumes");
    expect(screen.getByTestId("category-laptops")).toHaveTextContent("Notebooks");
  });

  it("clicar em categoria atualiza filtersStore", async () => {
    const user = userEvent.setup();
    renderBar();
    await user.click(screen.getByTestId("category-beauty"));
    expect(useFiltersStore.getState().category).toBe("beauty");
  });

  it('clicar em "Todos" zera a categoria', async () => {
    useFiltersStore.setState({ search: "", category: "beauty" });
    const user = userEvent.setup();
    renderBar();
    await user.click(screen.getByTestId("category-all"));
    expect(useFiltersStore.getState().category).toBeNull();
  });

  it("clicar de novo na categoria selecionada desativa o filtro", async () => {
    useFiltersStore.setState({ search: "", category: "beauty" });
    const user = userEvent.setup();
    renderBar();
    await user.click(screen.getByTestId("category-beauty"));
    expect(useFiltersStore.getState().category).toBeNull();
  });
});
