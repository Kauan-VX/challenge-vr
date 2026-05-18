import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  closeCart,
  removeItem,
  decrementItem,
  addItem,
  clearCart,
  createCart,
  formatPrice,
  CloseIcon,
  PlusIcon,
  MinusIcon,
} from "@vr/shared";
import type { CartItem, CartResponse } from "@vr/shared";

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" fill="%23eef0f5"/></svg>';

const DEMO_USER_ID = 1;

type CheckoutState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; cart: CartResponse }
  | { status: "error"; message: string };

const CartModal: React.FC = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [checkout, setCheckout] = useState<CheckoutState>({ status: "idle" });

  const handleClose = useCallback(() => {
    dispatch(closeCart());
  }, [dispatch]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [handleClose]);

  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleIncrement = (item: CartItem) => {
    dispatch(
      addItem({
        id: item.id,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
        description: "",
        discountPercentage: 0,
        rating: 0,
        stock: 0,
        brand: "",
        category: "",
        images: [],
      }),
    );
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setCheckout({ status: "submitting" });
    try {
      const cart = await createCart({ userId: DEMO_USER_ID, items });
      setCheckout({ status: "success", cart });
      dispatch(clearCart());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro inesperado ao finalizar";
      setCheckout({ status: "error", message });
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-vr-overlay flex items-stretch justify-end z-[1000] animate-vr-fade"
      onMouseDown={onOverlayClick}
      data-testid="cart-overlay"
    >
      <div
        className="w-full max-w-110 bg-vr-surface flex flex-col shadow-(--shadow-vr-lg) outline-none animate-vr-slide-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vr-cart-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-vr-border">
          <h2 id="vr-cart-title" className="m-0 text-lg font-bold">
            Seu carrinho
          </h2>
          <button
            type="button"
            className="border-0 bg-transparent inline-grid place-items-center w-8 h-8 rounded-full text-vr-text-muted hover:bg-vr-surface-alt hover:text-vr-text"
            onClick={handleClose}
            aria-label="Fechar carrinho"
          >
            <CloseIcon size={18} />
          </button>
        </header>

        {checkout.status === "success" ? (
          <div
            className="px-5 py-12 text-center flex flex-col gap-2"
            data-testid="cart-confirmation"
          >
            <p className="m-0 text-lg font-bold text-vr-success">Pedido confirmado!</p>
            <p className="m-0 text-vr-text-muted text-sm">
              Numero do pedido: <strong>#{checkout.cart.id}</strong>
            </p>
            <p className="m-0 text-vr-text-muted text-sm">
              {checkout.cart.totalProducts} produto
              {checkout.cart.totalProducts === 1 ? "" : "s"} ({checkout.cart.totalQuantity} unidade
              {checkout.cart.totalQuantity === 1 ? "" : "s"})
            </p>
            <p className="my-3 text-[22px] font-extrabold">
              Total: {formatPrice(checkout.cart.total)}
            </p>
            <button
              type="button"
              className="bg-vr-primary text-white border-0 px-3 py-3 rounded-[10px] font-bold hover:bg-vr-primary-hover"
              onClick={() => {
                setCheckout({ status: "idle" });
                handleClose();
              }}
            >
              Continuar comprando
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="px-5 py-12 text-center text-vr-text-muted" data-testid="cart-empty">
            <p>Seu carrinho esta vazio.</p>
            <p className="text-sm mt-2">Adicione produtos a partir da listagem.</p>
          </div>
        ) : (
          <>
            <ul className="list-none m-0 px-4 py-3 overflow-y-auto flex-1" data-testid="cart-list">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[64px_1fr_auto] gap-3 py-3 border-b border-vr-border last:border-b-0"
                >
                  <img
                    src={item.thumbnail || FALLBACK_IMG}
                    alt=""
                    className="w-16 h-16 object-cover rounded-[6px] bg-vr-surface-alt"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                    }}
                  />
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="m-0 text-sm md:text-base font-semibold truncate">{item.title}</p>
                    <p className="m-0 text-sm text-vr-text-muted">{formatPrice(item.price)}</p>
                    <div
                      className="inline-flex items-center gap-2 mt-1"
                      role="group"
                      aria-label="Quantidade"
                    >
                      <button
                        type="button"
                        className="w-[26px] h-[26px] rounded-md border border-vr-border bg-vr-surface text-vr-text inline-grid place-items-center hover:bg-vr-surface-alt"
                        onClick={() => dispatch(decrementItem(item.id))}
                        aria-label={`Diminuir quantidade de ${item.title}`}
                      >
                        <MinusIcon size={14} />
                      </button>
                      <span
                        className="min-w-[18px] text-center tabular-nums"
                        data-testid={`qty-${item.id}`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="w-[26px] h-[26px] rounded-md border border-vr-border bg-vr-surface text-vr-text inline-grid place-items-center hover:bg-vr-surface-alt"
                        onClick={() => handleIncrement(item)}
                        aria-label={`Aumentar quantidade de ${item.title}`}
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      className="border-0 bg-transparent text-vr-danger text-sm p-0 hover:underline"
                      onClick={() => dispatch(removeItem(item.id))}
                      aria-label={`Remover ${item.title}`}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-vr-border px-5 py-4 grid gap-3">
              {checkout.status === "error" && (
                <div
                  className="bg-vr-danger-soft border border-[#f3b9b9] text-vr-danger px-3 py-2 rounded-md text-sm"
                  role="alert"
                  data-testid="cart-error"
                >
                  {checkout.message}
                </div>
              )}
              <button
                type="button"
                className="bg-transparent border border-vr-border rounded-md py-2 text-vr-text-muted font-semibold hover:text-vr-danger hover:border-vr-danger disabled:opacity-60 disabled:cursor-progress"
                onClick={() => dispatch(clearCart())}
                disabled={checkout.status === "submitting"}
              >
                Limpar carrinho
              </button>
              <div className="flex items-baseline justify-between">
                <span className="text-vr-text-muted">Total</span>
                <span className="text-[22px] font-extrabold tabular-nums" data-testid="cart-total">
                  {formatPrice(total)}
                </span>
              </div>
              <button
                type="button"
                className="bg-vr-primary text-white border-0 py-3 rounded-[10px] font-bold hover:bg-vr-primary-hover disabled:opacity-60 disabled:cursor-progress"
                onClick={handleCheckout}
                disabled={checkout.status === "submitting"}
                data-testid="cart-checkout"
              >
                {checkout.status === "submitting" ? "Finalizando..." : "Finalizar pedido"}
              </button>
            </footer>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default CartModal;
