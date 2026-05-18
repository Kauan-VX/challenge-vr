import { store } from "../store";
import { addItem, selectCartCount } from "@vr/shared";

describe("shell store", () => {
  it("contem o slice de cart configurado pelo @vr/shared", () => {
    const state = store.getState();
    expect(state.cart).toBeDefined();
    expect(Array.isArray(state.cart.items)).toBe(true);
  });

  it("aceita acoes do slice compartilhado", () => {
    const before = selectCartCount(store.getState());
    store.dispatch(
      addItem({
        id: 999,
        title: "Item",
        description: "",
        price: 1,
        discountPercentage: 0,
        rating: 0,
        stock: 1,
        brand: "",
        category: "",
        thumbnail: "",
        images: [],
      }),
    );
    expect(selectCartCount(store.getState())).toBe(before + 1);
  });
});
