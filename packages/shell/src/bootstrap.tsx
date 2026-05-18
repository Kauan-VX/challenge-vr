import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "./store";
import { queryClient } from "./query/client";
import App from "./App";
import AppErrorBoundary from "./components/AppErrorBoundary";
import "./styles/main.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Elemento root nao encontrado no documento");
}

createRoot(container).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
        </Provider>
      </QueryClientProvider>
    </AppErrorBoundary>
  </React.StrictMode>,
);
