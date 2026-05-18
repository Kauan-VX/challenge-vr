import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCartStore, useFiltersStore } from "@vr/shared";

export const resetCartStore = () => {
  useCartStore.setState({ items: [], isOpen: false });
};

export const resetFiltersStore = () => {
  useFiltersStore.setState({ search: "", category: null });
};

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
