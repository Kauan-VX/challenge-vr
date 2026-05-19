import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "@vr/shared";

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });

interface ProvidersProps {
  client?: QueryClient;
  children: React.ReactNode;
}

export const AppProviders: React.FC<ProvidersProps> = ({
  client = makeQueryClient(),
  children,
}) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

export const httpGet = jest.spyOn(http, "get");
export const httpPost = jest.spyOn(http, "post");

export function stubCategories(slugs: Array<{ slug: string; name: string }> = []) {
  const categories = slugs.map((s) => ({ ...s, url: "" }));
  httpGet.mockImplementation(async (url) => {
    if (typeof url === "string" && url.includes("/products/categories")) {
      return { data: categories } as never;
    }
    return { data: [] } as never;
  });
}

// Pre-popula a cache do React Query com categorias pra que `useCategories` retorne
// sincrono e nao gere updates fora do act() ao resolver a promise da request.
export function clientWithCategories(slugs: Array<{ slug: string; name: string }> = []) {
  const client = makeQueryClient();
  client.setQueryData(
    ["categories"],
    slugs.map((s) => ({ ...s, url: "" })),
  );
  return client;
}
