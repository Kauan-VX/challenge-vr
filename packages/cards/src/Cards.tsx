import React, { useState } from "react";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import { useProducts } from "./hooks/useProducts";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import {
  type Product,
  useFiltersStore,
  selectSearch,
  selectCategory,
  translateCategory,
} from "@vr/shared";
import "./styles/main.css";

const PAGE_SIZE = 12;

const Cards: React.FC = () => {
  const search = useFiltersStore(selectSearch);
  const category = useFiltersStore(selectCategory);
  const clearFilters = useFiltersStore((s) => s.clearFilters);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { items, total, status, error, loadMore, hasMore, isFetchingMore } = useProducts({
    search,
    category,
    pageSize: PAGE_SIZE,
  });

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    hasMore,
    isLoading: isFetchingMore,
    onLoadMore: loadMore,
  });

  const isInitialLoading = status === "loading" && items.length === 0;

  const headerTitle = category
    ? translateCategory(category)
    : search
      ? `Resultados para "${search}"`
      : "Produtos";

  return (
    <section className="mx-auto max-w-vr-content px-5 pt-2 pb-12">
      <header className="flex flex-wrap items-baseline justify-between gap-3 mb-6">
        <div>
          <h2 className="m-0 text-[26px] font-extrabold tracking-tight" data-testid="cards-title">
            {headerTitle}
          </h2>
          <p className="m-0 mt-1 text-vr-text-muted text-sm" aria-live="polite">
            {total > 0 ? `${total} produto${total === 1 ? "" : "s"}` : "Sem resultados"}
          </p>
        </div>
        {(category || search) && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-vr-primary font-semibold hover:underline"
            data-testid="clear-filters"
          >
            Limpar filtros
          </button>
        )}
      </header>

      {error && (
        <div
          className="bg-vr-danger-soft border border-[#f3b9b9] text-vr-danger px-4 py-3 rounded-md mb-4"
          role="alert"
          data-testid="cards-error"
        >
          {error}
        </div>
      )}

      {isInitialLoading ? (
        <ul
          className="list-none m-0 p-0 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4"
          aria-hidden="true"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <li
              key={i}
              className="bg-vr-surface rounded-2xl border border-vr-border flex flex-col overflow-hidden pointer-events-none"
            >
              <div className="aspect-square bg-vr-surface-alt" />
              <div className="px-4 pt-3 pb-4 flex flex-col gap-2 flex-1">
                <span className="block h-2.5 w-2/5 rounded bg-[linear-gradient(90deg,#eef0f5_0%,#f7f8fc_50%,#eef0f5_100%)] bg-size-[200%_100%] animate-vr-shimmer" />
                <span className="block h-3.5 w-3/5 rounded bg-[linear-gradient(90deg,#eef0f5_0%,#f7f8fc_50%,#eef0f5_100%)] bg-size-[200%_100%] animate-vr-shimmer" />
                <span className="block h-2.5 w-4/5 rounded bg-[linear-gradient(90deg,#eef0f5_0%,#f7f8fc_50%,#eef0f5_100%)] bg-size-[200%_100%] animate-vr-shimmer" />
                <span className="block h-8 mt-3 rounded bg-[linear-gradient(90deg,#eef0f5_0%,#f7f8fc_50%,#eef0f5_100%)] bg-size-[200%_100%] animate-vr-shimmer" />
              </div>
            </li>
          ))}
        </ul>
      ) : items.length === 0 && status === "success" ? (
        <p className="text-center text-vr-text-muted py-12 px-4" data-testid="cards-empty">
          Nenhum produto encontrado para os filtros aplicados.
        </p>
      ) : (
        <>
          <ul
            className="list-none m-0 p-0 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4"
            data-testid="cards-grid"
          >
            {items.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} onOpenDetails={setSelectedProduct} />
              </li>
            ))}
          </ul>

          <div
            ref={sentinelRef}
            className="h-12 mt-6 flex items-center justify-center text-sm text-vr-text-muted"
            data-testid="infinite-scroll-sentinel"
          >
            {isFetchingMore ? (
              <span className="inline-flex items-center gap-2" data-testid="loading-more">
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full border-2 border-vr-border border-t-vr-primary animate-spin"
                  aria-hidden="true"
                />
                Carregando mais produtos...
              </span>
            ) : hasMore ? (
              <button
                type="button"
                className="text-vr-primary font-semibold hover:underline focus-visible:underline focus-visible:outline-none"
                onClick={loadMore}
                data-testid="load-more"
              >
                Carregar mais
              </button>
            ) : items.length > 0 ? (
              <span>Voce viu tudo por aqui.</span>
            ) : null}
          </div>
        </>
      )}

      {selectedProduct && (
        <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
};

export default Cards;
