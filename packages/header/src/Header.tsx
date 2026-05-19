import React from "react";
import { useCartStore, selectCartCount, selectCartIsOpen, CartIcon } from "@vr/shared";
import logo from "@vr/shared/src/assets/logo.png";
import CartModal from "./components/CartModal";
import HeaderSearch from "./components/HeaderSearch";
import CategoryBar from "./components/CategoryBar";
import "./styles/main.css";

const Header: React.FC = () => {
  const cartCount = useCartStore(selectCartCount);
  const isOpen = useCartStore(selectCartIsOpen);
  const openCart = useCartStore((s) => s.openCart);

  return (
    <header
      className="sticky top-0 z-50 bg-vr-surface border-b border-vr-border shadow-(--shadow-vr-sm)"
      role="banner"
    >
      <div className="mx-auto flex items-center gap-4 px-4 py-3 max-w-vr-content sm:gap-2 sm:px-3">
        <a
          className="inline-flex items-center gap-2 text-vr-text font-bold text-lg no-underline shrink-0 transition-opacity duration-200 hover:opacity-80"
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
        </a>

        <HeaderSearch />

        <button
          type="button"
          className="relative inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-vr-primary-soft text-vr-primary font-semibold transition-all duration-200 ease-out hover:bg-vr-primary hover:text-white hover:shadow-(--shadow-vr-sm) hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-3 focus-visible:outline-vr-primary/35 focus-visible:outline-offset-2 shrink-0"
          onClick={openCart}
          aria-label={`Abrir carrinho (${cartCount} item${cartCount === 1 ? "" : "s"})`}
          data-testid="header-cart-button"
          data-cart-target="true"
        >
          <CartIcon size={22} />
          <span className="hidden md:inline-block">Carrinho</span>
          {cartCount > 0 && (
            <span
              className="absolute -top-2 -right-2 min-w-5.5 h-5.5 px-1.5 rounded-full bg-vr-primary text-white text-xs font-bold inline-grid place-items-center shadow-(--shadow-vr-sm)"
              data-testid="header-cart-badge"
              aria-hidden="true"
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <CategoryBar />

      {isOpen && <CartModal />}
    </header>
  );
};

export default Header;
