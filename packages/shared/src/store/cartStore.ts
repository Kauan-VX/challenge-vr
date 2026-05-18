import { create, type StoreApi, type UseBoundStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CartItemInput } from "../types/product";

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (input: CartItemInput) => void;
  removeItem: (id: number) => void;
  decrementItem: (id: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const STORAGE_KEY = "vr.cart";
const STORAGE_VERSION = 1;
const GLOBAL_KEY = "__VR_CART_STORE__";

type CartStore = UseBoundStore<StoreApi<CartState>>;

const globalRef = globalThis as typeof globalThis & {
  [GLOBAL_KEY]?: CartStore;
};

function createCartStore(): CartStore {
  return create<CartState>()(
    persist(
      (set) => ({
        items: [],
        isOpen: false,
        addItem: (input) =>
          set((state) => {
            const existing = state.items.find((it) => it.id === input.id);
            if (existing) {
              return {
                items: state.items.map((it) =>
                  it.id === input.id ? { ...it, quantity: it.quantity + 1 } : it,
                ),
              };
            }
            return { items: [...state.items, { ...input, quantity: 1 }] };
          }),
        removeItem: (id) => set((state) => ({ items: state.items.filter((it) => it.id !== id) })),
        decrementItem: (id) =>
          set((state) => {
            const item = state.items.find((it) => it.id === id);
            if (!item) return state;
            if (item.quantity <= 1) {
              return { items: state.items.filter((it) => it.id !== id) };
            }
            return {
              items: state.items.map((it) =>
                it.id === id ? { ...it, quantity: it.quantity - 1 } : it,
              ),
            };
          }),
        clearCart: () => set({ items: [] }),
        openCart: () => set({ isOpen: true }),
        closeCart: () => set({ isOpen: false }),
      }),
      {
        name: STORAGE_KEY,
        version: STORAGE_VERSION,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ items: state.items }),
      },
    ),
  );
}

// pin no globalThis evita duplicar o store se @vr/shared for resolvido
// em mais de um bundle (shell + remotes). singleton no MF cobre 99% dos
// casos, mas em standalone-dev cada remote resolve por conta própria.
export const useCartStore: CartStore =
  globalRef[GLOBAL_KEY] ?? (globalRef[GLOBAL_KEY] = createCartStore());

export const selectCartItems = (state: CartState) => state.items;
export const selectCartIsOpen = (state: CartState) => state.isOpen;
export const selectCartCount = (state: CartState) =>
  state.items.reduce((acc, it) => acc + it.quantity, 0);
export const selectCartTotal = (state: CartState) =>
  state.items.reduce((acc, it) => acc + it.price * it.quantity, 0);
export const selectCartItemQuantity = (id: number) => (state: CartState) =>
  state.items.find((it) => it.id === id)?.quantity ?? 0;
