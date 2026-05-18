import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import Footer from './Footer';

const container = document.getElementById('footer-root');
if (container) {
  createRoot(container).render(<Footer />);
}
