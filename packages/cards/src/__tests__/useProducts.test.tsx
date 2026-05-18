import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useProducts } from "../hooks/useProducts";

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

const makeFetchMock = (total = 24) =>
  jest.fn().mockImplementation((url: string) => {
    const skipMatch = /skip=(\d+)/.exec(url);
    const skip = skipMatch ? Number(skipMatch[1]) : 0;
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(productsPage(skip + 1, 12, total)),
    });
  });

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe("useProducts", () => {
  beforeEach(() => {
    (global as unknown as { fetch: jest.Mock }).fetch = makeFetchMock();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("retorna 'loading' antes da resposta e 'success' depois", async () => {
    const { result } = renderHook(() => useProducts({ search: "", pageSize: 12 }), { wrapper });

    expect(result.current.status).toBe("loading");
    expect(result.current.items).toHaveLength(0);

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.items).toHaveLength(12);
    expect(result.current.total).toBe(24);
    expect(result.current.hasMore).toBe(true);
  });

  it("usa /products/search quando ha termo de busca", async () => {
    const fetchMock = makeFetchMock();
    (global as unknown as { fetch: jest.Mock }).fetch = fetchMock;

    const { result } = renderHook(() => useProducts({ search: "tenis", pageSize: 12 }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.status).toBe("success"));
    const urls = fetchMock.mock.calls.map((c) => c[0] as string);
    expect(urls.some((url) => url.includes("/products/search") && url.includes("q=tenis"))).toBe(
      true,
    );
  });

  it("loadMore acumula paginas e respeita o total", async () => {
    const { result } = renderHook(() => useProducts({ search: "", pageSize: 12 }), { wrapper });

    await waitFor(() => expect(result.current.items).toHaveLength(12));

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.items).toHaveLength(24));
    expect(result.current.hasMore).toBe(false);

    const callsBefore = (global.fetch as jest.Mock).mock.calls.length;
    act(() => result.current.loadMore());
    expect((global.fetch as jest.Mock).mock.calls.length).toBe(callsBefore);
  });

  it("expõe error quando a API falha", async () => {
    (global as unknown as { fetch: jest.Mock }).fetch = jest
      .fn()
      .mockResolvedValue({ ok: false, status: 500 });

    const { result } = renderHook(() => useProducts({ search: "", pageSize: 12 }), { wrapper });

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toMatch(/Falha ao carregar produtos/);
  });
});
