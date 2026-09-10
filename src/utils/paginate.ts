interface PaginateResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface FetchResult<T> {
  data: T[];
  total: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export const paginate = async <T>(
  fetchFn: (skip: number, limit: number) => Promise<FetchResult<T>>,
  page?: number,
  limit?: number,
): Promise<PaginateResult<T>> => {
  const currentPage = Math.max(Number(page) || DEFAULT_PAGE, 1);
  const currentLimit = Math.min(
    Math.max(Number(limit) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );

  const skip = (currentPage - 1) * currentLimit;

  const { data, total } = await fetchFn(skip, currentLimit);

  return {
    data,
    pagination: {
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages: Math.ceil(total / currentLimit),
    },
  };
};