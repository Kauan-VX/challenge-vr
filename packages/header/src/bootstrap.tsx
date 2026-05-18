import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cartReducer, addItem } from '@vr/shared';
import './styles/main.css';
import Header from './Header';

const standaloneStore = configureStore({
  reducer: { cart: cartReducer }
});

standaloneStore.dispatch(
  addItem({
    id: 1,
    title: 'Produto demonstracao',
    description: '',
    price: 49.9,
    discountPercentage: 0,
    rating: 0,
    stock: 10,
    brand: '',
    category: '',
    thumbnail: 'https://dummyjson.com/image/i/products/1/thumbnail.jpg',
    images: []
  })
);

const container = document.getElementById('header-root');
if (container) {
  createRoot(container).render(
    <Provider store={standaloneStore}>
      <Header />
    </Provider>
  );
}
