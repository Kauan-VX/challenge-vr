import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cartReducer } from '@vr/shared';

export const makeStore = (): EnhancedStore =>
  configureStore({ reducer: { cart: cartReducer } });

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } }
  });

interface ProvidersProps {
  store?: EnhancedStore;
  client?: QueryClient;
  children: React.ReactNode;
}

export const AppProviders: React.FC<ProvidersProps> = ({
  store = makeStore(),
  client = makeQueryClient(),
  children
}) => (
  <QueryClientProvider client={client}>
    <Provider store={store}>{children}</Provider>
  </QueryClientProvider>
);
