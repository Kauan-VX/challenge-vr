import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, useCartStore, useFiltersStore } from "@vr/shared";
import Cards from "../Cards";
import { AppProviders, makeQueryClient, resetCartStore, resetFiltersStore } from "./testUtils";

const httpGet = jest.spyOn(http, "get");

const productsPage = (start: number, count: number, total = 30) => ({
  products: Array.from({ length: count }, (_, i) => ({
    id: start + i,
    title: `Produto ${start + i}`,
    description: "",
    price: 100,
    discountPercentage: 0,
    rating: 4,
    stock: 10,
    brand: "Brand",
    category: "cat",
    thumbnail: "",
    images: [],
  })),
  total,
  skip: start - 1,
  limit: count,
});

beforeEach(() => {
  resetCartStore();
  resetFiltersStore();
  httpGet.mockReset();
  httpGet.mockImplementation((url: string, config?: { params?: { skip?: number } }) => {
    const skip = config?.params?.skip ?? 0;
    return Promise.resolve({ data: productsPage(skip + 1, 12, 24) }) as ReturnType<typeof http.get>;
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

const renderCards = () => {
  const client = makeQueryClient();
  const utils = render(
    <AppProviders client={client}>
      <Cards />
    </AppProviders>,
  );
  return { client, ...utils, user: userEvent.setup() };
};

describe("Cards", () => {
  it("busca produtos no mount e renderiza grid", async () => {
    renderCards();
    await waitFor(() => expect(screen.getByTestId("cards-grid")).toBeInTheDocument());
    expect(screen.getAllByTestId(/product-card-/)).toHaveLength(12);
  });

  it("adicionar produto atualiza o carrinho", async () => {
    const { user } = renderCards();
    await waitFor(() => expect(screen.getByTestId("cards-grid")).toBeInTheDocument());
    await user.click(screen.getByTestId("add-1"));
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it('carrega proxima pagina ao clicar em "Carregar mais"', async () => {
    const { user } = renderCards();
    await waitFor(() => expect(screen.getByTestId("cards-grid")).toBeInTheDocument());
    expect(screen.getAllByTestId(/product-card-/)).toHaveLength(12);
    await user.click(screen.getByTestId("load-more"));
    await waitFor(() => expect(screen.getAllByTestId(/product-card-/).length).toBeGreaterThan(12));
  });

  it("filtro de busca dispara request com /products/search", async () => {
    renderCards();
    await waitFor(() => expect(screen.getByTestId("cards-grid")).toBeInTheDocument());
    act(() => useFiltersStore.getState().setSearch("tenis"));
    await waitFor(() => {
      const urls = httpGet.mock.calls.map((c) => c[0] as string);
      const searchParams = httpGet.mock.calls
        .map((c) => (c[1] as { params?: { q?: string } } | undefined)?.params?.q)
        .filter(Boolean);
      expect(urls.some((url) => url.includes("/products/search"))).toBe(true);
      expect(searchParams).toContain("tenis");
    });
  });

  it("filtro por categoria dispara request com /products/category/{slug}", async () => {
    renderCards();
    await waitFor(() => expect(screen.getByTestId("cards-grid")).toBeInTheDocument());
    act(() => useFiltersStore.getState().setCategory("beauty"));
    await waitFor(() => {
      const urls = httpGet.mock.calls.map((c) => c[0] as string);
      expect(urls.some((url) => url.includes("/products/category/beauty"))).toBe(true);
    });
  });

  it("mostra mensagem de erro quando a API falha", async () => {
    httpGet.mockReset();
    httpGet.mockRejectedValue(new Error("Falha ao carregar produtos (500)"));
    renderCards();
    await waitFor(() => expect(screen.getByTestId("cards-error")).toBeInTheDocument());
  });
});
