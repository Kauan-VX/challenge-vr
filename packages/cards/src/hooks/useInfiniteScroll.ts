import { useEffect, useRef } from "react";

export interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

export function useInfiniteScroll<T extends Element = HTMLDivElement>({
  hasMore,
  isLoading,
  onLoadMore,
  // 320px ≈ um viewport extra: dispara o fetch antes do usuário
  // chegar no fim da lista, evitando o "buraco" de loading visível
  rootMargin = "320px 0px",
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<T | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const node = sentinelRef.current;
    if (!node) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore, rootMargin]);

  return sentinelRef;
}
