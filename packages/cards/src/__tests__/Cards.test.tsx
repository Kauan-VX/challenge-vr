import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { selectCartItems } from "@vr/shared";
import Cards from "../Cards";
import { AppProviders, makeQueryClient, makeStore } from "./testUtils";

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
  (global as unknown as { fetch: jest.Mock }).fetch = jest
    .fn()
    .mockImplementation((url: string) => {
      const skipMatch = /skip=(\d+)/.exec(url);
      const skip = skipMatch ? Number(skipMatch[1]) : 0;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(productsPage(skip + 1, 12, 24)),
      });
    });
});

afterEach(() => {
  jest.resetAllMocks();
});

const renderCards = () => {
  const store = makeStore();
  const client = makeQueryClient();
  const utils = render(
    <AppProviders store={store} client={client}>
      <Cards />
    </AppProviders>,
  );
  return { store, client, ...utils, user: userEvent.setup() };
};

describe("Cards", () => {
  it("busca produtos no mount e renderiza grid", async () => {
    renderCards();
    await waitFor(() => expect(screen.getByTestId("cards-grid")).toBeInTheDocument());
    expect(screen.getAllByTestId(/product-card-/)).toHaveLength(12);
  });

  it("adicionar produto despacha acao no store", async () => {
    const { user, store } = renderCards();
    await waitFor(() => expect(screen.getByTestId("cards-grid")).toBeInTheDocument());
    await user.click(screen.getByTestId("add-1"));
    expect(selectCartItems(store.getState())).toHaveLength(1);
  });

  it('carrega proxima pagina ao clicar em "Carregar mais"', async () => {
    const { user } = renderCards();
    await waitFor(() => expect(screen.getByTestId("cards-grid")).toBeInTheDocument());
    expect(screen.getAllByTestId(/product-card-/)).toHaveLength(12);
    await user.click(screen.getByTestId("load-more"));
    await waitFor(() => expect(screen.getAllByTestId(/product-card-/).length).toBeGreaterThan(12));
  });

  it("busca por termo dispara request com /products/search", async () => {
    const { user } = renderCards();
    await waitFor(() => expect(screen.getByTestId("cards-grid")).toBeInTheDocument());
    await user.type(screen.getByLabelText(/Buscar produto/i), "tenis");
    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls.map((c) => c[0] as string);
      expect(calls.some((url) => url.includes("/products/search") && url.includes("q=tenis"))).toBe(
        true,
      );
    });
  });

  it("mostra mensagem de erro quando a API falha", async () => {
    (global as unknown as { fetch: jest.Mock }).fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500 });
    renderCards();
    await waitFor(() => expect(screen.getByTestId("cards-error")).toBeInTheDocument());
  });
});
