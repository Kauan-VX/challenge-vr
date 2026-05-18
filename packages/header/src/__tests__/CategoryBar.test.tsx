import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFiltersStore } from "@vr/shared";
import CategoryBar from "../components/CategoryBar";
import { AppProviders, httpGet, stubCategories } from "./testUtils";

beforeEach(() => {
  useFiltersStore.setState({ search: "", category: null });
  httpGet.mockReset();
  stubCategories([
    { slug: "beauty", name: "Beauty" },
    { slug: "fragrances", name: "Fragrances" },
    { slug: "laptops", name: "Laptops" },
  ]);
});

const renderBar = () =>
  render(
    <AppProviders>
      <CategoryBar />
    </AppProviders>,
  );

describe("CategoryBar", () => {
  it("renderiza categorias traduzidas em pt-BR", async () => {
    renderBar();
    await waitFor(() => expect(screen.getByTestId("category-beauty")).toBeInTheDocument());
    expect(screen.getByTestId("category-beauty")).toHaveTextContent("Beleza");
    expect(screen.getByTestId("category-fragrances")).toHaveTextContent("Perfumes");
    expect(screen.getByTestId("category-laptops")).toHaveTextContent("Notebooks");
  });

  it("clicar em categoria atualiza filtersStore", async () => {
    const user = userEvent.setup();
    renderBar();
    await waitFor(() => expect(screen.getByTestId("category-beauty")).toBeInTheDocument());
    await user.click(screen.getByTestId("category-beauty"));
    expect(useFiltersStore.getState().category).toBe("beauty");
  });

  it('clicar em "Todos" zera a categoria', async () => {
    useFiltersStore.setState({ search: "", category: "beauty" });
    const user = userEvent.setup();
    renderBar();
    await waitFor(() => expect(screen.getByTestId("category-all")).toBeInTheDocument());
    await user.click(screen.getByTestId("category-all"));
    expect(useFiltersStore.getState().category).toBeNull();
  });

  it("clicar de novo na categoria selecionada desativa o filtro", async () => {
    useFiltersStore.setState({ search: "", category: "beauty" });
    const user = userEvent.setup();
    renderBar();
    await waitFor(() => expect(screen.getByTestId("category-beauty")).toBeInTheDocument());
    await user.click(screen.getByTestId("category-beauty"));
    expect(useFiltersStore.getState().category).toBeNull();
  });
});
