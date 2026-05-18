import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '@vr/shared';

export interface UseProductsParams {
  search: string;
  pageSize: number;
}

export interface UseProductsResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  items: Product[];
  total: number;
  error?: string;
  loadMore: () => void;
  hasMore: boolean;
  isFetchingMore: boolean;
}

export function useProducts({ search, pageSize }: UseProductsParams): UseProductsResult {
  const query = useInfiniteQuery({
    queryKey: ['products', { search, pageSize }],
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      fetchProducts({ limit: pageSize, skip: pageParam, search }, signal),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.products.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    }
  });

  const items = (query.data?.pages ?? []).flatMap((p) => p.products);
  const total = query.data?.pages[0]?.total ?? 0;

  const status: UseProductsResult['status'] =
    query.isPending ? 'loading'
    : query.isError ? 'error'
    : query.isSuccess ? 'success'
    : 'idle';

  return {
    status,
    items,
    total,
    error: query.error instanceof Error ? query.error.message : undefined,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    },
    hasMore: Boolean(query.hasNextPage),
    isFetchingMore: query.isFetchingNextPage
  };
}
