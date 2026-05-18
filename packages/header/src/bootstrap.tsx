import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { cartReducer, addItem } from "@vr/shared";
import Header from "./Header";
import { demoProduct } from "./dev/fixtures";
import "./styles/main.css";

const standaloneStore = configureStore({
  reducer: { cart: cartReducer },
});

standaloneStore.dispatch(addItem(demoProduct));

const container = document.getElementById("header-root");
if (container) {
  createRoot(container).render(
    <Provider store={standaloneStore}>
      <Header />
    </Provider>,
  );
}
