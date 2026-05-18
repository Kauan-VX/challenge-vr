import React, { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CartStepper,
  CloseIcon,
  PRODUCT_GALLERY_FALLBACK,
  PackageIcon,
  ReturnIcon,
  ShieldIcon,
  Stars,
  TruckIcon,
  flyToCart,
  formatPrice,
  selectCartItemQuantity,
  translateAvailability,
  translateCategory,
  translateReturnPolicy,
  translateShipping,
  translateWarranty,
  useCartStore,
  useModalControls,
  type Product,
} from "@vr/shared";

interface Props {
  product: Product;
  onClose: () => void;
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const AVATAR_PALETTE = [
  ["bg-rose-100", "text-rose-700"],
  ["bg-amber-100", "text-amber-700"],
  ["bg-emerald-100", "text-emerald-700"],
  ["bg-sky-100", "text-sky-700"],
  ["bg-violet-100", "text-violet-700"],
  ["bg-fuchsia-100", "text-fuchsia-700"],
];

function pickAvatar(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateFormatter.format(date);
}

const ProductDetailModal: React.FC<Props> = ({ product, onClose }) => {
  const quantityInCart = useCartStore(selectCartItemQuantity(product.id));
  const addItem = useCartStore((state) => state.addItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const galleryImageRef = useRef<HTMLImageElement | null>(null);
  useModalControls({ containerRef: dialogRef, onClose });

  const images = useMemo(
    () => (product.images?.length ? product.images : [product.thumbnail]),
    [product.images, product.thumbnail],
  );
  const [activeImage, setActiveImage] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  const hasDiscount = product.discountPercentage > 0;
  const discounted = hasDiscount
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;
  const savings = product.price - discounted;
  const outOfStock = product.stock <= 0;
  const isInCart = quantityInCart > 0;
  const reviewCount = product.reviews?.length ?? 0;

  const onOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const handleAdd = () => {
    if (outOfStock) return;
    const image = galleryImageRef.current;
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

  const availability = translateAvailability(product.availabilityStatus);
  const shipping = translateShipping(product.shippingInformation);
  const warranty = translateWarranty(product.warrantyInformation);
  const returnPolicy = translateReturnPolicy(product.returnPolicy);

  return createPortal(
    <div
      className="fixed inset-0 bg-vr-overlay z-1000 flex items-end sm:items-center justify-center p-0 sm:p-6 animate-vr-fade"
      onMouseDown={onOverlayClick}
      data-testid="product-detail-overlay"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`detail-title-${product.id}`}
        tabIndex={-1}
        className="w-full max-w-5xl max-h-[95vh] bg-vr-surface rounded-t-3xl sm:rounded-3xl flex flex-col shadow-(--shadow-vr-lg) outline-none animate-vr-slide-in overflow-hidden"
        data-testid="product-detail-modal"
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-vr-border shrink-0 bg-vr-surface">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[11px] uppercase tracking-wider font-bold text-vr-primary-strong bg-vr-primary-soft px-2.5 py-1 rounded-full">
              {translateCategory(product.category)}
            </span>
            {product.brand && (
              <span className="text-sm font-semibold text-vr-text truncate">{product.brand}</span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="inline-grid place-items-center w-9 h-9 rounded-full text-vr-text-muted hover:bg-vr-surface-alt hover:text-vr-text transition-colors"
            data-testid="detail-close"
          >
            <CloseIcon size={18} />
          </button>
        </header>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-8 p-6">
            <div className="flex flex-col gap-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#ffffff_0%,#eef2ee_60%,#dde4dc_100%)]">
                <img
                  ref={galleryImageRef}
                  src={
                    imageFailed
                      ? PRODUCT_GALLERY_FALLBACK
                      : images[activeImage] || PRODUCT_GALLERY_FALLBACK
                  }
                  alt={product.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-6 transition-opacity duration-200"
                  onError={() => setImageFailed(true)}
                />
                {hasDiscount && (
                  <span className="absolute top-4 left-4 bg-vr-primary text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-(--shadow-vr-sm) tracking-wide">
                    -{Math.round(product.discountPercentage)}%
                  </span>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto" data-testid="detail-thumbs">
                  {images.map((src, index) => {
                    const active = index === activeImage;
                    return (
                      <button
                        key={`${src}-${index}`}
                        type="button"
                        onClick={() => {
                          setActiveImage(index);
                          setImageFailed(false);
                        }}
                        aria-label={`Imagem ${index + 1}`}
                        aria-pressed={active ? "true" : "false"}
                        className={
                          active
                            ? "shrink-0 w-16 h-16 rounded-xl overflow-hidden ring-2 ring-vr-primary ring-offset-2 ring-offset-vr-surface"
                            : "shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-vr-border opacity-70 hover:opacity-100 hover:border-vr-primary/40 transition-all"
                        }
                      >
                        <img
                          src={src}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-5 min-w-0">
              <div>
                <h2
                  id={`detail-title-${product.id}`}
                  className="m-0 text-[28px] leading-tight font-extrabold tracking-tight"
                >
                  {product.title}
                </h2>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Stars value={product.rating} size={18} />
                  <span className="font-bold text-vr-text tabular-nums">
                    {product.rating.toFixed(1)}
                  </span>
                  {reviewCount > 0 && (
                    <span className="text-vr-text-muted">
                      · {reviewCount} avaliaç{reviewCount === 1 ? "ão" : "ões"}
                    </span>
                  )}
                </div>
              </div>

              {product.description && (
                <p className="m-0 text-sm text-vr-text-muted leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="relative overflow-hidden rounded-2xl p-5 bg-linear-to-br from-vr-primary-soft to-vr-surface border border-vr-primary/15">
                <div className="flex items-baseline gap-3 flex-wrap">
                  {hasDiscount && (
                    <span className="line-through text-vr-text-muted text-sm">
                      {formatPrice(product.price)}
                    </span>
                  )}
                  <span className="text-4xl font-black text-vr-text tabular-nums leading-none">
                    {formatPrice(discounted)}
                  </span>
                </div>
                {hasDiscount && (
                  <p className="m-0 mt-2 text-sm font-bold text-vr-success">
                    Você economiza {formatPrice(savings)}
                  </p>
                )}
                {product.minimumOrderQuantity && product.minimumOrderQuantity > 1 && (
                  <p className="m-0 mt-1 text-xs text-vr-text-muted">
                    Pedido mínimo: {product.minimumOrderQuantity} unidades
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <InfoTile
                  icon={<PackageIcon size={14} />}
                  label="Disponibilidade"
                  value={
                    outOfStock
                      ? "Sem estoque"
                      : availability
                        ? `${availability} · ${product.stock} unidades`
                        : `${product.stock} em estoque`
                  }
                  tone={outOfStock ? "danger" : "success"}
                />
                {shipping && (
                  <InfoTile icon={<TruckIcon size={14} />} label="Entrega" value={shipping} />
                )}
                {warranty && (
                  <InfoTile icon={<ShieldIcon size={14} />} label="Garantia" value={warranty} />
                )}
                {returnPolicy && (
                  <InfoTile
                    icon={<ReturnIcon size={14} />}
                    label="Devolução"
                    value={returnPolicy}
                  />
                )}
              </div>

              {isInCart ? (
                <CartStepper
                  quantity={quantityInCart}
                  maxQuantity={product.stock}
                  productTitle={product.title}
                  onDecrement={handleDecrement}
                  onIncrement={handleAdd}
                  size="md"
                  testId={`detail-stepper-${product.id}`}
                  removeTestId={`detail-remove-${product.id}`}
                  decrementTestId={`detail-decrement-${product.id}`}
                  incrementTestId={`detail-add-${product.id}`}
                />
              ) : (
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={outOfStock}
                  className="h-12 inline-flex items-center justify-center bg-vr-primary text-white border-0 rounded-xl font-bold transition-colors hover:bg-vr-primary-hover disabled:bg-vr-surface-alt disabled:text-vr-text-muted disabled:cursor-not-allowed shadow-(--shadow-vr-sm)"
                  data-testid={`detail-add-${product.id}`}
                >
                  {outOfStock ? "Indisponível" : "Adicionar ao carrinho"}
                </button>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center text-xs text-vr-primary-strong bg-vr-primary-soft px-2.5 py-1 rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {(product.sku || product.weight || product.dimensions || product.meta?.barcode) && (
            <section className="border-t border-vr-border bg-vr-surface-alt/30 px-6 py-5">
              <h3 className="m-0 mb-3 text-xs font-bold uppercase tracking-[0.12em] text-vr-text-muted">
                Especificações
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 text-sm">
                {product.sku && <SpecItem label="SKU" value={product.sku} />}
                {product.weight !== undefined && (
                  <SpecItem label="Peso" value={`${product.weight}g`} />
                )}
                {product.dimensions && (
                  <SpecItem
                    label="Dimensões"
                    value={`${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`}
                  />
                )}
                {product.meta?.barcode && (
                  <SpecItem label="Código de barras" value={product.meta.barcode} />
                )}
              </div>
            </section>
          )}

          {product.reviews && product.reviews.length > 0 && (
            <section className="border-t border-vr-border px-6 py-5">
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="m-0 text-xs font-bold uppercase tracking-[0.12em] text-vr-text-muted">
                  Avaliações
                </h3>
                <span className="text-sm font-bold text-vr-text inline-flex items-center gap-2">
                  <Stars value={product.rating} size={14} />
                  {product.rating.toFixed(1)}
                  <span className="text-vr-text-muted font-normal">({product.reviews.length})</span>
                </span>
              </div>
              <ul className="list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.reviews.map((review, index) => (
                  <ReviewCard key={`${review.reviewerEmail}-${index}`} review={review} />
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

const InfoTile: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "default" | "success" | "danger";
}> = ({ icon, label, value, tone = "default" }) => {
  const valueClass =
    tone === "success" ? "text-vr-success" : tone === "danger" ? "text-vr-danger" : "text-vr-text";
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-vr-border bg-vr-surface px-3 py-2.5">
      <span className="text-vr-text-muted mt-0.5">{icon}</span>
      <div className="min-w-0 flex-1">
        <span className="block text-[10px] uppercase tracking-wider text-vr-text-muted font-semibold">
          {label}
        </span>
        <span className={`block text-sm font-semibold leading-snug ${valueClass}`}>{value}</span>
      </div>
    </div>
  );
};

const SpecItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[10px] uppercase tracking-wider text-vr-text-muted font-semibold">
      {label}
    </span>
    <span className="text-sm font-semibold text-vr-text tabular-nums">{value}</span>
  </div>
);

const ReviewCard: React.FC<{ review: NonNullable<Product["reviews"]>[number] }> = ({ review }) => {
  const initial = review.reviewerName.trim().charAt(0).toUpperCase() || "?";
  const [bg, fg] = pickAvatar(review.reviewerEmail || review.reviewerName);
  return (
    <li className="border border-vr-border rounded-2xl p-4 bg-vr-surface">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`inline-grid place-items-center w-10 h-10 rounded-full font-bold text-base shrink-0 ${bg} ${fg}`}
        >
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-semibold truncate">{review.reviewerName}</span>
            <span className="text-xs text-vr-text-muted">{formatDate(review.date)}</span>
          </div>
          <Stars value={review.rating} size={12} />
          <p className="m-0 mt-2 text-sm text-vr-text leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </li>
  );
};

export default ProductDetailModal;
