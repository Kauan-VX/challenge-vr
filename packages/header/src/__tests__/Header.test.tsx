import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cartReducer, addItem } from '@vr/shared';
import type { Product } from '@vr/shared';
import Header from '../Header';

const sample = (id: number, title = `Produto ${id}`): Product => ({
  id,
  title,
  description: '',
  price: 19.9,
  discountPercentage: 0,
  rating: 0,
  stock: 10,
  brand: '',
  category: '',
  thumbnail: '',
  images: []
});

const makeStore = () => configureStore({ reducer: { cart: cartReducer } });

const renderHeader = (seed?: (store: ReturnType<typeof makeStore>) => void) => {
  const store = makeStore();
  seed?.(store);
  return {
    store,
    ...render(
      <Provider store={store}>
        <Header />
      </Provider>
    )
  };
};

describe('Header', () => {
  it('nao mostra badge quando o carrinho esta vazio', () => {
    renderHeader();
    expect(screen.queryByTestId('header-cart-badge')).not.toBeInTheDocument();
  });

  it('mostra badge com a contagem total de itens', () => {
    const store = configureStore({ reducer: { cart: cartReducer } });
    store.dispatch(addItem(sample(1)));
    store.dispatch(addItem(sample(1)));
    store.dispatch(addItem(sample(2)));
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );
    expect(screen.getByTestId('header-cart-badge')).toHaveTextContent('3');
  });

  it('abre o modal ao clicar no botao do carrinho', async () => {
    const user = userEvent.setup();
    const store = configureStore({ reducer: { cart: cartReducer } });
    store.dispatch(addItem(sample(1, 'Camiseta')));
    render(
      <Provider store={store}>
        <Header />
      </Provider>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByTestId('header-cart-button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Camiseta')).toBeInTheDocument();
  });
});
