import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCartCount, openCart, selectCartIsOpen, CartIcon } from "@vr/shared";
import logo from "@vr/shared/src/assets/logo.png";
import CartModal from "./components/CartModal";
import "./styles/main.css";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const isOpen = useSelector(selectCartIsOpen);

  return (
    <header
      className="sticky top-0 z-50 bg-vr-surface border-b border-vr-border shadow-(--shadow-vr-sm)"
      role="banner"
    >
      <div className="mx-auto flex items-center gap-5 px-4 py-4 max-w-vr-content sm:gap-3 sm:px-3 sm:py-3">
        <a
          className="inline-flex items-center gap-2 text-vr-text font-bold text-lg no-underline"
          href="#"
          aria-label="VR Beneficios"
        >
          <img
            src={logo}
            alt="VR"
            className="block w-10 h-10 rounded-[10px] object-contain"
            width={40}
            height={40}
          />
          <span className="hidden md:inline">Marketplace</span>
        </a>

        <nav className="hidden md:flex gap-5 ml-5 flex-1" aria-label="Principal">
          <a
            href="#"
            className="text-vr-text-muted no-underline py-2 border-b-2 border-transparent transition-colors hover:text-vr-primary hover:border-vr-primary focus-visible:text-vr-primary focus-visible:outline-none focus-visible:border-vr-primary"
          >
            Produtos
          </a>
          <a
            href="#"
            className="text-vr-text-muted no-underline py-2 border-b-2 border-transparent transition-colors hover:text-vr-primary hover:border-vr-primary focus-visible:text-vr-primary focus-visible:outline-none focus-visible:border-vr-primary"
          >
            Categorias
          </a>
          <a
            href="#"
            className="text-vr-text-muted no-underline py-2 border-b-2 border-transparent transition-colors hover:text-vr-primary hover:border-vr-primary focus-visible:text-vr-primary focus-visible:outline-none focus-visible:border-vr-primary"
          >
            Ofertas
          </a>
        </nav>

        <button
          type="button"
          className="ml-auto relative inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-vr-primary-soft text-vr-primary font-semibold transition-colors hover:bg-vr-primary hover:text-white focus-visible:outline-3 focus-visible:outline-vr-primary/35 focus-visible:outline-offset-2"
          onClick={() => dispatch(openCart())}
          aria-label={`Abrir carrinho (${cartCount} item${cartCount === 1 ? "" : "s"})`}
          data-testid="header-cart-button"
        >
          <CartIcon size={22} />
          <span className="hidden md:inline">Carrinho</span>
          {cartCount > 0 && (
            <span
              className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1.5 rounded-full bg-vr-primary text-white text-xs font-bold inline-grid place-items-center shadow-(--shadow-vr-sm)"
              data-testid="header-cart-badge"
              aria-hidden="true"
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {isOpen && <CartModal />}
    </header>
  );
};

export default Header;
