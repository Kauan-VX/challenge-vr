import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/main.css";
import Cards from "./Cards";

const standaloneQueryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
});

const container = document.getElementById("cards-root");
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={standaloneQueryClient}>
      <Cards />
    </QueryClientProvider>,
  );
}
