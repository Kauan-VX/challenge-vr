import React, { memo, useRef, useState } from "react";
import {
  useCartStore,
  flyToCart,
  formatPrice,
  humanizeSlug,
  MinusIcon,
  PlusIcon,
  Product,
  selectCartItemQuantity,
  StarIcon,
  TrashIcon,
} from "@vr/shared";

interface Props {
  product: Product;
}

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="100%" height="100%" fill="%23eef0f5"/></svg>';

const LOW_STOCK_THRESHOLD = 10;

const ProductCardImpl: React.FC<Props> = ({ product }) => {
  const quantityInCart = useCartStore(selectCartItemQuantity(product.id));
  const addItem = useCartStore((s) => s.addItem);
  const decrementItem = useCartStore((s) => s.decrementItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const [imgFailed, setImgFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const hasDiscount = product.discountPercentage > 0;
  const discounted = hasDiscount
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;
  const savings = product.price - discounted;
  const isInCart = quantityInCart > 0;
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= LOW_STOCK_THRESHOLD;

  const handleAdd = () => {
    if (outOfStock) return;
    const img = imageRef.current;
    if (img) {
      flyToCart({
        imageUrl: img.currentSrc || img.src,
        source: img.getBoundingClientRect(),
      });
    }
    addItem(product);
  };

  const handleDecrement = () => {
    if (quantityInCart <= 1) {
      removeItem(product.id);
    } else {
      decrementItem(product.id);
    }
  };

  return (
    <article
      className="bg-vr-surface rounded-2xl border border-vr-border flex flex-col overflow-hidden transition-[box-shadow,border-color] duration-200 ease-out hover:border-vr-primary/40 hover:shadow-(--shadow-vr-sm)"
      data-testid={`product-card-${product.id}`}
      aria-label={product.title}
    >
      <div className="relative aspect-square bg-vr-surface-alt grid place-items-center overflow-hidden">
        <img
          ref={imageRef}
          src={imgFailed ? FALLBACK_IMG : product.thumbnail || FALLBACK_IMG}
          alt={product.title}
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
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
      </div>

      <div className="px-4 pt-3 pb-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between gap-2 text-[11px] text-vr-text-muted uppercase tracking-wider">
          <span className="font-semibold truncate">
            {product.brand || humanizeSlug(product.category)}
          </span>
          <span className="text-vr-text-muted/80 whitespace-nowrap">
            {humanizeSlug(product.category)}
          </span>
        </div>

        <h3
          className="m-0 text-base font-semibold leading-tight line-clamp-2 min-h-[2.6em]"
          title={product.title}
        >
          {product.title}
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
          <span
            className="inline-flex items-center gap-1 text-[#c47a00] font-semibold"
            aria-label={`Avaliacao ${product.rating}`}
          >
            <StarIcon size={14} />
            <span>{product.rating.toFixed(1)}</span>
          </span>
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
          <div
            className="mt-2 grid grid-cols-[40px_1fr_40px] items-stretch h-11 rounded-md border-2 border-vr-primary bg-vr-primary-soft overflow-hidden"
            data-testid={`stepper-${product.id}`}
            role="group"
            aria-label={`Quantidade de ${product.title} no carrinho`}
          >
            <button
              type="button"
              onClick={handleDecrement}
              className="inline-grid place-items-center text-vr-primary hover:bg-vr-primary hover:text-white transition-colors"
              data-testid={
                quantityInCart === 1 ? `remove-${product.id}` : `decrement-${product.id}`
              }
              aria-label={
                quantityInCart === 1
                  ? `Remover ${product.title} do carrinho`
                  : `Diminuir quantidade de ${product.title}`
              }
            >
              {quantityInCart === 1 ? <TrashIcon size={16} /> : <MinusIcon size={16} />}
            </button>
            <span
              className="inline-flex items-center justify-center font-bold text-vr-primary text-sm tabular-nums"
              data-testid={`stepper-count-${product.id}`}
            >
              {quantityInCart} no carrinho
            </span>
            <button
              type="button"
              onClick={handleAdd}
              disabled={quantityInCart >= product.stock}
              className="inline-grid place-items-center text-vr-primary hover:bg-vr-primary hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-vr-primary"
              data-testid={`add-${product.id}`}
              aria-label={`Adicionar mais um ${product.title} ao carrinho`}
            >
              <PlusIcon size={16} />
            </button>
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
};

const ProductCard = memo(ProductCardImpl);
ProductCard.displayName = "ProductCard";
export default ProductCard;
