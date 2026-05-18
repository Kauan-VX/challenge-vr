import React, { useState, useCallback } from "react";
import ProductCard from "./components/ProductCard";
import Toolbar from "./components/Toolbar";
import { useProducts } from "./hooks/useProducts";
import { useDebounced } from "./hooks/useDebounced";
import "./styles/main.css";

const PAGE_SIZE = 12;

const Cards: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput, 350);

  const { items, total, status, error, loadMore, hasMore, isFetchingMore } = useProducts({
    search,
    pageSize: PAGE_SIZE,
  });

  const handleSearch = useCallback((value: string) => setSearchInput(value), []);

  const isInitialLoading = status === "loading" && items.length === 0;

  return (
    <section className="mx-auto max-w-vr-content px-5" aria-busy={status === "loading"}>
      <header className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-5 items-end mb-5">
        <div>
          <h2 className="m-0 mb-1 text-[22px] font-extrabold">Produtos</h2>
          <p className="m-0 text-vr-text-muted text-base">
            Selecione e adicione ao carrinho. O Header reflete a sua selecao em tempo real.
          </p>
        </div>
        <Toolbar search={searchInput} total={total} onSearchChange={handleSearch} />
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
                <ProductCard product={p} />
              </li>
            ))}
          </ul>

          <div className="text-center mt-5">
            {hasMore ? (
              <button
                type="button"
                className="bg-vr-surface border border-vr-border rounded-[10px] px-5 py-3 font-semibold text-vr-text hover:enabled:border-vr-primary hover:enabled:text-vr-primary disabled:opacity-60 disabled:cursor-progress"
                onClick={loadMore}
                disabled={isFetchingMore}
                data-testid="load-more"
              >
                {isFetchingMore ? "Carregando..." : "Carregar mais"}
              </button>
            ) : items.length > 0 ? (
              <p className="text-vr-text-muted text-sm">Voce viu tudo por aqui.</p>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
};

export default Cards;
