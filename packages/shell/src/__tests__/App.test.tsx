import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "../store";
import App from "../App";

describe("Shell <App />", () => {
  it("compoe os tres remotes (header, cards, footer) atraves de Suspense", async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <Provider store={store}>
          <App />
        </Provider>
      </QueryClientProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("remote-header")).toBeInTheDocument());
    expect(screen.getByTestId("remote-cards")).toBeInTheDocument();
    expect(screen.getByTestId("remote-footer")).toBeInTheDocument();
  });
});
