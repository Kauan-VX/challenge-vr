import React from "react";
import type { Preview } from "@storybook/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cartReducer } from "../packages/shared/src";
import "./storybook.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#f6f8f6" },
        { name: "surface", value: "#ffffff" },
        { name: "dark", value: "#0c0f0d" },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: "Mobile (375)", styles: { width: "375px", height: "720px" } },
        tablet: { name: "Tablet (768)", styles: { width: "768px", height: "900px" } },
        desktop: { name: "Desktop (1200)", styles: { width: "1200px", height: "900px" } },
      },
    },
  },
  decorators: [
    (Story, ctx) => {
      const store = configureStore({
        reducer: { cart: cartReducer },
        preloadedState: ctx.parameters.preloadedState,
      });
      return (
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <Story />
          </Provider>
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
