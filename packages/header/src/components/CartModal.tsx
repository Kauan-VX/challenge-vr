import React, { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  useCartStore,
  useCheckout,
  selectCartItems,
  selectCartTotal,
  formatPrice,
  CloseIcon,
  PlusIcon,
  MinusIcon,
} from "@vr/shared";
import type { CartItem } from "@vr/shared";

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" fill="%23eef0f5"/></svg>';

const DEMO_USER_ID = 1;

const CartModal: React.FC = () => {
  const items = useCartStore(selectCartItems);
  const total = useCartStore(selectCartTotal);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const checkout = useCheckout();

  const handleClose = useCallback(() => {
    closeCart();
  }, [closeCart]);

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
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      thumbnail: item.thumbnail,
    });
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    checkout.mutate({ userId: DEMO_USER_ID, items }, { onSuccess: () => clearCart() });
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

        {checkout.isSuccess && checkout.data ? (
          <div className="flex flex-col flex-1 overflow-hidden" data-testid="cart-confirmation">
            <div className="px-5 pt-6 pb-4 text-center">
              <div className="inline-grid place-items-center w-14 h-14 rounded-full bg-vr-primary-soft text-vr-success mx-auto mb-3">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12.5L10 17.5L19 7.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="m-0 text-xl font-extrabold text-vr-text">Pedido confirmado!</p>
              <p className="m-0 mt-1 text-vr-text-muted text-sm">
                Pedido <strong className="text-vr-text">#{checkout.data.id}</strong> ·{" "}
                {checkout.data.totalProducts} produto{checkout.data.totalProducts === 1 ? "" : "s"}{" "}
                · {checkout.data.totalQuantity} unidade
                {checkout.data.totalQuantity === 1 ? "" : "s"}
              </p>
            </div>

            {checkout.data.products.length > 0 && (
              <ul
                className="list-none m-0 px-4 py-2 overflow-y-auto flex-1 border-t border-vr-border"
                data-testid="cart-confirmation-list"
              >
                {checkout.data.products.map((p) => (
                  <li
                    key={p.id}
                    className="grid grid-cols-[48px_1fr_auto] gap-3 items-center py-3 border-b border-vr-border last:border-b-0"
                  >
                    <img
                      src={p.thumbnail || FALLBACK_IMG}
                      alt=""
                      className="w-12 h-12 object-cover rounded-md bg-vr-surface-alt"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                      }}
                    />
                    <div className="min-w-0">
                      <p className="m-0 text-sm font-semibold truncate" title={p.title}>
                        {p.title}
                      </p>
                      <p className="m-0 text-xs text-vr-text-muted">
                        {p.quantity}x · {formatPrice(p.price)}
                        {p.discountPercentage > 0 && (
                          <span className="ml-1 text-vr-success font-semibold">
                            -{Math.round(p.discountPercentage)}%
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="text-sm font-bold tabular-nums">{formatPrice(p.total)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="border-t border-vr-border px-5 py-4 grid gap-2">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-vr-text-muted">Subtotal</span>
                <span className="tabular-nums line-through text-vr-text-muted">
                  {formatPrice(checkout.data.total)}
                </span>
              </div>
              {checkout.data.total > checkout.data.discountedTotal && (
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-vr-text-muted">Voce economizou</span>
                  <span className="tabular-nums font-semibold text-vr-success">
                    -{formatPrice(checkout.data.total - checkout.data.discountedTotal)}
                  </span>
                </div>
              )}
              <div className="flex items-baseline justify-between pt-1">
                <span className="font-semibold">Total pago</span>
                <span
                  className="text-[22px] font-extrabold tabular-nums text-vr-success"
                  data-testid="cart-confirmation-total"
                >
                  {formatPrice(checkout.data.discountedTotal)}
                </span>
              </div>
              <button
                type="button"
                className="mt-3 bg-vr-primary text-white border-0 px-3 py-3 rounded-[10px] font-bold hover:bg-vr-primary-hover"
                onClick={() => {
                  checkout.reset();
                  handleClose();
                }}
              >
                Continuar comprando
              </button>
            </div>
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
                        onClick={() => decrementItem(item.id)}
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
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remover ${item.title}`}
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-vr-border px-5 py-4 grid gap-3">
              {checkout.isError && (
                <div
                  className="bg-vr-danger-soft border border-[#f3b9b9] text-vr-danger px-3 py-2 rounded-md text-sm"
                  role="alert"
                  data-testid="cart-error"
                >
                  {checkout.error?.message ?? "Erro inesperado ao finalizar"}
                </div>
              )}
              <button
                type="button"
                className="bg-transparent border border-vr-border rounded-md py-2 text-vr-text-muted font-semibold hover:text-vr-danger hover:border-vr-danger disabled:opacity-60 disabled:cursor-progress"
                onClick={() => clearCart()}
                disabled={checkout.isPending}
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
                disabled={checkout.isPending}
                data-testid="cart-checkout"
              >
                {checkout.isPending ? "Finalizando..." : "Finalizar pedido"}
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
