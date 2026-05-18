import {
  useCartStore,
  selectCartCount,
  selectCartTotal,
  selectCartItemQuantity,
} from "./cartStore";
import type { CartItemInput } from "../types/product";

const item = (id: number, price = 10): CartItemInput => ({
  id,
  title: `Item ${id}`,
  price,
  thumbnail: "",
});

beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
});

describe("cartStore", () => {
  it("addItem adiciona um novo item com quantity 1", () => {
    useCartStore.getState().addItem(item(1, 99.9));
    expect(useCartStore.getState().items).toEqual([
      { id: 1, title: "Item 1", price: 99.9, thumbnail: "", quantity: 1 },
    ]);
  });

  it("addItem incrementa quantity quando id ja existe", () => {
    const { addItem } = useCartStore.getState();
    addItem(item(1));
    addItem(item(1));
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  it("decrementItem reduz quantidade e remove quando chega a zero", () => {
    const { addItem, decrementItem } = useCartStore.getState();
    addItem(item(1));
    addItem(item(1));
    decrementItem(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
    decrementItem(1);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("removeItem retira o produto independente da quantidade", () => {
    const { addItem, removeItem } = useCartStore.getState();
    addItem(item(1));
    addItem(item(1));
    removeItem(1);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("clearCart esvazia a lista", () => {
    const { addItem, clearCart } = useCartStore.getState();
    addItem(item(1));
    addItem(item(2));
    clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("openCart e closeCart controlam o flag isOpen", () => {
    const { openCart, closeCart } = useCartStore.getState();
    openCart();
    expect(useCartStore.getState().isOpen).toBe(true);
    closeCart();
    expect(useCartStore.getState().isOpen).toBe(false);
  });

  it("selectCartCount soma as quantidades", () => {
    const { addItem } = useCartStore.getState();
    addItem(item(1));
    addItem(item(1));
    addItem(item(2));
    expect(selectCartCount(useCartStore.getState())).toBe(3);
  });

  it("selectCartTotal soma price * quantity", () => {
    const { addItem } = useCartStore.getState();
    addItem(item(1, 10));
    addItem(item(1, 10));
    addItem(item(2, 5));
    expect(selectCartTotal(useCartStore.getState())).toBe(25);
  });

  it("selectCartItemQuantity retorna quantidade por id ou 0", () => {
    const { addItem } = useCartStore.getState();
    addItem(item(7));
    addItem(item(7));
    expect(selectCartItemQuantity(7)(useCartStore.getState())).toBe(2);
    expect(selectCartItemQuantity(99)(useCartStore.getState())).toBe(0);
  });
});
