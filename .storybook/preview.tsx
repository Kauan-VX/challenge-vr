import React, { useLayoutEffect } from "react";
import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  http,
  useCartStore,
  useFiltersStore,
  type CartItem,
  type Category,
} from "../packages/shared/src";
import "./storybook.css";

declare module "@storybook/react" {
  interface Parameters {
    cart?: { items?: CartItem[]; isOpen?: boolean };
    filters?: { search?: string; category?: string | null };
    httpMock?: {
      products?: unknown;
      categories?: Category[];
    };
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false, gcTime: 0 } },
});

const DEFAULT_CATEGORIES: Category[] = [
  { slug: "beauty", name: "Beauty", url: "" },
  { slug: "fragrances", name: "Fragrances", url: "" },
  { slug: "furniture", name: "Furniture", url: "" },
  { slug: "laptops", name: "Laptops", url: "" },
  { slug: "smartphones", name: "Smartphones", url: "" },
];

const originalGet = http.get.bind(http);
const originalPost = http.post.bind(http);

function installHttpStub(mock: { categories?: Category[]; products?: unknown }) {
  const categories = mock.categories ?? DEFAULT_CATEGORIES;
  const productsResponse = mock.products ?? { products: [], total: 0, skip: 0, limit: 0 };
  http.get = ((url: string) => {
    if (url.includes("/products/categories")) {
      return Promise.resolve({ data: categories });
    }
    return Promise.resolve({ data: productsResponse });
  }) as typeof http.get;
  http.post = (() => Promise.resolve({ data: {} })) as typeof http.post;
}

function restoreHttp() {
  http.get = originalGet;
  http.post = originalPost;
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#f6f8f6" },
        { name: "surface", value: "#ffffff" },
        { name: "dark", value: "#0c0f0d" },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: "Mobile (375)", styles: { width: "375px", height: "720px" } },
        tablet: { name: "Tablet (768)", styles: { width: "768px", height: "900px" } },
        desktop: { name: "Desktop (1200)", styles: { width: "1200px", height: "900px" } },
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const cart = ctx.parameters.cart ?? {};
      const filters = ctx.parameters.filters ?? {};
      const httpMock = ctx.parameters.httpMock ?? {};

      useLayoutEffect(() => {
        useCartStore.setState({
          items: cart.items ?? [],
          isOpen: cart.isOpen ?? false,
        });
        useFiltersStore.setState({
          search: filters.search ?? "",
          category: filters.category ?? null,
        });
        installHttpStub(httpMock);
        return () => restoreHttp();
      }, [cart, filters, httpMock]);

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
