import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCartStore } from "@vr/shared";
import Header from "./Header";
import { demoProduct } from "./dev/fixtures";
import "./styles/main.css";

useCartStore.getState().addItem(demoProduct);

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false } },
});

const container = document.getElementById("header-root");
if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <Header />
    </QueryClientProvider>,
  );
}
