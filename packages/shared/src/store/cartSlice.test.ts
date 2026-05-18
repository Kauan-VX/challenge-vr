import {
  cartReducer,
  addItem,
  removeItem,
  decrementItem,
  clearCart,
  toggleCart,
  selectCartCount,
  selectCartTotal
} from './cartSlice';
import type { Product } from '../types/product';

const product = (id: number, price = 10): Product => ({
  id,
  title: `Produto ${id}`,
  description: '',
  price,
  discountPercentage: 0,
  rating: 0,
  stock: 100,
  brand: '',
  category: '',
  thumbnail: '',
  images: []
});

describe('cartSlice', () => {
  it('adiciona um produto novo com quantidade 1', () => {
    const state = cartReducer(undefined, addItem(product(1)));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ id: 1, quantity: 1 });
  });

  it('incrementa quantidade quando o produto ja esta no carrinho', () => {
    let state = cartReducer(undefined, addItem(product(1)));
    state = cartReducer(state, addItem(product(1)));
    state = cartReducer(state, addItem(product(1)));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('decrementa e remove quando atinge 0', () => {
    let state = cartReducer(undefined, addItem(product(2)));
    state = cartReducer(state, addItem(product(2)));
    state = cartReducer(state, decrementItem(2));
    expect(state.items[0].quantity).toBe(1);
    state = cartReducer(state, decrementItem(2));
    expect(state.items).toHaveLength(0);
  });

  it('remove um item especifico', () => {
    let state = cartReducer(undefined, addItem(product(1)));
    state = cartReducer(state, addItem(product(2)));
    state = cartReducer(state, removeItem(1));
    expect(state.items.map((it) => it.id)).toEqual([2]);
  });

  it('limpa o carrinho', () => {
    let state = cartReducer(undefined, addItem(product(1)));
    state = cartReducer(state, addItem(product(2)));
    state = cartReducer(state, clearCart());
    expect(state.items).toHaveLength(0);
  });

  it('alterna o estado do modal', () => {
    let state = cartReducer(undefined, toggleCart());
    expect(state.isOpen).toBe(true);
    state = cartReducer(state, toggleCart());
    expect(state.isOpen).toBe(false);
  });

  it('selectors derivam total e contagem corretamente', () => {
    let state = cartReducer(undefined, addItem(product(1, 9.9)));
    state = cartReducer(state, addItem(product(1, 9.9)));
    state = cartReducer(state, addItem(product(2, 25)));
    const root = { cart: state };
    expect(selectCartCount(root)).toBe(3);
    expect(selectCartTotal(root)).toBeCloseTo(9.9 * 2 + 25);
  });
});
