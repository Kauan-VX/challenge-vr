import React, { memo, useRef, useState } from "react";
import {
  CartStepper,
  PRODUCT_THUMBNAIL_FALLBACK,
  Stars,
  flyToCart,
  formatPrice,
  selectCartItemQuantity,
  translateCategory,
  useCartStore,
  type Product,
} from "@vr/shared";

interface Props {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

const LOW_STOCK_THRESHOLD = 10;

function ProductCard({ product, onOpenDetails }: Props) {
  const quantityInCart = useCartStore(selectCartItemQuantity(product.id));
  const addItem = useCartStore((state) => state.addItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  const hasDiscount = product.discountPercentage > 0;
  const discounted = hasDiscount
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;
  const savings = product.price - discounted;
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= LOW_STOCK_THRESHOLD;
  const isInCart = quantityInCart > 0;

  const openDetails = () => onOpenDetails?.(product);

  const handleAdd = () => {
    if (outOfStock) return;
    const image = imageRef.current;
    if (image) {
      flyToCart({
        imageUrl: image.currentSrc || image.src,
        source: image.getBoundingClientRect(),
      });
    }
    addItem(product);
  };

  const handleDecrement = () => {
    if (quantityInCart <= 1) removeItem(product.id);
    else decrementItem(product.id);
  };

  return (
    <article
      className="bg-vr-surface rounded-2xl border border-vr-border flex flex-col overflow-hidden transition-[box-shadow,border-color] duration-200 ease-out hover:border-vr-primary/40 hover:shadow-(--shadow-vr-sm)"
      data-testid={`product-card-${product.id}`}
      aria-label={product.title}
    >
      <button
        type="button"
        onClick={openDetails}
        className="relative aspect-square bg-vr-surface-alt grid place-items-center overflow-hidden cursor-pointer rounded-t-2xl outline-none focus-visible:ring-2 focus-visible:ring-vr-primary/60 focus-visible:ring-inset"
        aria-label={`Ver detalhes de ${product.title}`}
        data-testid={`open-details-${product.id}`}
      >
        <img
          ref={imageRef}
          src={
            imageFailed
              ? PRODUCT_THUMBNAIL_FALLBACK
              : product.thumbnail || PRODUCT_THUMBNAIL_FALLBACK
          }
          alt={product.title}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
          {hasDiscount && (
            <span
              className="bg-vr-primary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-(--shadow-vr-sm)"
              aria-label="Desconto"
            >
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
          {lowStock && (
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
              Apenas {product.stock} restantes
            </span>
          )}
          {outOfStock && (
            <span className="bg-vr-danger-soft text-vr-danger border border-[#f3b9b9] text-[11px] font-semibold px-2 py-0.5 rounded-full">
              Sem estoque
            </span>
          )}
        </div>
      </button>

      <div className="px-4 pt-3 pb-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2 text-[11px] text-vr-text-muted uppercase tracking-wider">
          <span className="font-semibold truncate">
            {product.brand || translateCategory(product.category)}
          </span>
          <span className="text-vr-text-muted/80 whitespace-nowrap">
            {translateCategory(product.category)}
          </span>
        </div>

        <h3 className="m-0 min-h-[2.6em]">
          <button
            type="button"
            onClick={openDetails}
            className="text-left text-base font-semibold leading-tight line-clamp-2 hover:text-vr-primary transition-colors focus-visible:outline-none focus-visible:text-vr-primary"
            title={product.title}
          >
            {product.title}
          </button>
        </h3>

        {product.description && (
          <p
            className="m-0 text-xs text-vr-text-muted line-clamp-2 leading-snug"
            title={product.description}
          >
            {product.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs">
          <Stars value={product.rating} size={14} />
          <span className="font-semibold text-vr-text">{product.rating.toFixed(1)}</span>
          {!outOfStock && !lowStock && (
            <span className="text-vr-text-muted">· {product.stock} em estoque</span>
          )}
        </div>

        <div className="mt-auto pt-2 flex items-baseline gap-2 flex-wrap">
          {hasDiscount && (
            <span className="line-through text-vr-text-muted text-sm">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="text-xl font-extrabold text-vr-text tabular-nums">
            {formatPrice(discounted)}
          </span>
        </div>
        {hasDiscount && (
          <p className="m-0 text-[11px] font-semibold text-vr-success">
            Economia de {formatPrice(savings)}
          </p>
        )}

        {isInCart ? (
          <div className="mt-2">
            <CartStepper
              quantity={quantityInCart}
              maxQuantity={product.stock}
              productTitle={product.title}
              onDecrement={handleDecrement}
              onIncrement={handleAdd}
              testId={`stepper-${product.id}`}
              removeTestId={`remove-${product.id}`}
              decrementTestId={`decrement-${product.id}`}
              incrementTestId={`add-${product.id}`}
              countTestId={`stepper-count-${product.id}`}
            />
          </div>
        ) : (
          <button
            type="button"
            className="mt-2 h-11 inline-flex items-center justify-center bg-vr-primary text-white border-0 rounded-md font-bold transition-colors hover:bg-vr-primary-hover disabled:bg-vr-surface-alt disabled:text-vr-text-muted disabled:cursor-not-allowed"
            onClick={handleAdd}
            disabled={outOfStock}
            data-testid={`add-${product.id}`}
            aria-label={
              outOfStock ? `${product.title} sem estoque` : `Adicionar ${product.title} ao carrinho`
            }
          >
            {outOfStock ? "Indisponível" : "Adicionar ao carrinho"}
          </button>
        )}
      </div>
    </article>
  );
}

export default memo(ProductCard);
