import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { http } from "@vr/shared";
import { useProducts } from "../hooks/useProducts";

const httpGet = jest.spyOn(http, "get");

const productsPage = (start: number, count: number, total: number) => ({
  products: Array.from({ length: count }, (_, i) => ({
    id: start + i,
    title: `Produto ${start + i}`,
    description: "",
    price: 10,
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

const installSuccessMock = (total = 24) => {
  httpGet.mockImplementation(async (_url, config) => {
    const skip = (config as { params?: { skip?: number } } | undefined)?.params?.skip ?? 0;
    return { data: productsPage(skip + 1, 12, total) } as never;
  });
};

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe("useProducts", () => {
  beforeEach(() => {
    httpGet.mockReset();
    installSuccessMock();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("retorna 'loading' antes da resposta e 'success' depois", async () => {
    const { result } = renderHook(() => useProducts({ search: "", category: null, pageSize: 12 }), {
      wrapper,
    });

    expect(result.current.status).toBe("loading");
    expect(result.current.items).toHaveLength(0);

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.items).toHaveLength(12);
    expect(result.current.total).toBe(24);
    expect(result.current.hasMore).toBe(true);
  });

  it("usa /products/search quando ha termo de busca", async () => {
    const { result } = renderHook(
      () => useProducts({ search: "tenis", category: null, pageSize: 12 }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.status).toBe("success"));
    const calls = httpGet.mock.calls;
    expect(calls.some(([url]) => (url as string).includes("/products/search"))).toBe(true);
    const searchParams = calls
      .map((c) => (c[1] as { params?: { q?: string } } | undefined)?.params?.q)
      .filter(Boolean);
    expect(searchParams).toContain("tenis");
  });

  it("loadMore acumula paginas e respeita o total", async () => {
    const { result } = renderHook(() => useProducts({ search: "", category: null, pageSize: 12 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.items).toHaveLength(12));

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.items).toHaveLength(24));
    expect(result.current.hasMore).toBe(false);

    const callsBefore = httpGet.mock.calls.length;
    act(() => result.current.loadMore());
    expect(httpGet.mock.calls.length).toBe(callsBefore);
  });

  it("expõe error quando a API falha", async () => {
    httpGet.mockReset();
    httpGet.mockRejectedValue(new Error("Falha ao carregar produtos (500)"));

    const { result } = renderHook(() => useProducts({ search: "", category: null, pageSize: 12 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toMatch(/Falha ao carregar produtos/);
  });
});
