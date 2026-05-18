import React from "react";
import { MinusIcon, PlusIcon, TrashIcon } from "../icons";

interface CartStepperProps {
  quantity: number;
  maxQuantity: number;
  productTitle: string;
  onDecrement: () => void;
  onIncrement: () => void;
  size?: "sm" | "md";
  testId?: string;
  decrementTestId?: string;
  removeTestId?: string;
  incrementTestId?: string;
  countTestId?: string;
}

const SIZES = {
  sm: {
    container: "h-11 grid-cols-[40px_1fr_40px] rounded-md",
    icon: 16,
    font: "text-sm",
  },
  md: {
    container: "h-12 grid-cols-[52px_1fr_52px] rounded-xl",
    icon: 18,
    font: "text-base",
  },
} as const;

export const CartStepper: React.FC<CartStepperProps> = ({
  quantity,
  maxQuantity,
  productTitle,
  onDecrement,
  onIncrement,
  size = "sm",
  testId,
  decrementTestId,
  removeTestId,
  incrementTestId,
  countTestId,
}) => {
  const spec = SIZES[size];
  const isLast = quantity <= 1;
  const reachedMax = quantity >= maxQuantity;

  return (
    <div
      role="group"
      aria-label={`Quantidade de ${productTitle} no carrinho`}
      data-testid={testId}
      className={`grid items-stretch border-2 border-vr-primary bg-vr-primary-soft overflow-hidden ${spec.container}`}
    >
      <button
        type="button"
        onClick={onDecrement}
        className="inline-grid place-items-center text-vr-primary hover:bg-vr-primary hover:text-white transition-colors"
        data-testid={isLast ? removeTestId : decrementTestId}
        aria-label={
          isLast ? `Remover ${productTitle} do carrinho` : `Diminuir quantidade de ${productTitle}`
        }
      >
        {isLast ? <TrashIcon size={spec.icon} /> : <MinusIcon size={spec.icon} />}
      </button>
      <span
        className={`inline-flex items-center justify-center font-bold text-vr-primary tabular-nums ${spec.font}`}
        data-testid={countTestId}
      >
        {quantity} no carrinho
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={reachedMax}
        className="inline-grid place-items-center text-vr-primary hover:bg-vr-primary hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-vr-primary"
        data-testid={incrementTestId}
        aria-label={`Adicionar mais um ${productTitle} ao carrinho`}
      >
        <PlusIcon size={spec.icon} />
      </button>
    </div>
  );
};
