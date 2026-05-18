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
  httpGet.mockImplementation((url: string) => {
    if (url.includes("/products/categories")) {
      return Promise.resolve({
        data: slugs.map((s) => ({ ...s, url: "" })),
      }) as ReturnType<typeof http.get>;
    }
    return Promise.resolve({ data: [] }) as ReturnType<typeof http.get>;
  });
}
