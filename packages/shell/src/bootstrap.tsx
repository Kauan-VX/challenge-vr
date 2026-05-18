import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
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
        <App />
      </QueryClientProvider>
    </AppErrorBoundary>
  </React.StrictMode>,
);
