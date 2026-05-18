import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cartReducer } from "@vr/shared";
import "./styles/main.css";
import Cards from "./Cards";

const standaloneStore = configureStore({
  reducer: { cart: cartReducer },
});

const standaloneQueryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
});

const container = document.getElementById("cards-root");
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={standaloneQueryClient}>
      <Provider store={standaloneStore}>
        <Cards />
      </Provider>
    </QueryClientProvider>,
  );
}
