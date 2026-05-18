import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { CartItem, Product } from '../types/product';

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existing = state.items.find((it) => it.id === product.id);
      if (existing) {
        existing.quantity += 1;
        return;
      }
      state.items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1
      });
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((it) => it.id !== action.payload);
    },
    decrementItem: (state, action: PayloadAction<number>) => {
      const item = state.items.find((it) => it.id === action.payload);
      if (!item) return;
      if (item.quantity <= 1) {
        state.items = state.items.filter((it) => it.id !== action.payload);
      } else {
        item.quantity -= 1;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    }
  }
});

export const {
  addItem,
  removeItem,
  decrementItem,
  clearCart,
  openCart,
  closeCart,
  toggleCart
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;

interface RootStateLike {
  cart: CartState;
}

export const selectCartItems = (state: RootStateLike) => state.cart.items;
export const selectCartIsOpen = (state: RootStateLike) => state.cart.isOpen;

export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((acc, it) => acc + it.quantity, 0)
);

export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce((acc, it) => acc + it.price * it.quantity, 0)
);
