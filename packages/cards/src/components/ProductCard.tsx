import React, { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { addItem, formatPrice, humanizeSlug, Product, StarIcon } from "@vr/shared";

interface Props {
  product: Product;
}

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="100%" height="100%" fill="%23eef0f5"/></svg>';

const ProductCardImpl: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch();
  const [imgFailed, setImgFailed] = useState(false);

  const discounted =
    product.discountPercentage > 0
      ? product.price * (1 - product.discountPercentage / 100)
      : product.price;

  return (
    <article
      className="bg-vr-surface rounded-2xl border border-vr-border flex flex-col overflow-hidden transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:shadow-(--shadow-vr-md) hover:border-transparent"
      data-testid={`product-card-${product.id}`}
    >
      <div className="relative aspect-square bg-vr-surface-alt grid place-items-center overflow-hidden">
        <img
          src={imgFailed ? FALLBACK_IMG : product.thumbnail || FALLBACK_IMG}
          alt={product.title}
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover"
        />
        {product.discountPercentage > 0 && (
          <span
            className="absolute top-2 left-2 bg-vr-primary text-white text-xs font-bold px-2 py-1 rounded-full"
            aria-label="Desconto"
          >
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>

      <div className="px-4 pt-3 pb-4 flex flex-col gap-2 flex-1">
        <p className="m-0 text-xs text-vr-text-muted uppercase tracking-wider">
          {product.brand || humanizeSlug(product.category)}
        </p>
        <h3
          className="m-0 text-base font-semibold leading-tight line-clamp-2 min-h-[2.6em]"
          title={product.title}
        >
          {product.title}
        </h3>
        <div
          className="inline-flex items-center gap-1 text-sm text-[#c47a00]"
          aria-label={`Avaliacao ${product.rating}`}
        >
          <StarIcon size={14} />
          <span>{product.rating.toFixed(1)}</span>
        </div>
        <div className="mt-auto flex items-baseline gap-2 flex-wrap">
          {product.discountPercentage > 0 && (
            <span className="line-through text-vr-text-muted text-sm">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="text-lg font-extrabold text-vr-text tabular-nums">
            {formatPrice(discounted)}
          </span>
        </div>
        <button
          type="button"
          className="mt-2 bg-vr-primary text-white border-0 py-2.5 rounded-md font-bold transition-colors hover:bg-vr-primary-hover"
          onClick={() => dispatch(addItem(product))}
          data-testid={`add-${product.id}`}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  );
};

const ProductCard = memo(ProductCardImpl);
ProductCard.displayName = "ProductCard";
export default ProductCard;
