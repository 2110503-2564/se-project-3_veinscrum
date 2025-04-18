interface Pagination {
  page: number;
  limit: number;
}

interface WithPagination {
  count: number;
  pagination: {
    next?: Pagination;
    prev?: Pagination;
  };
}
