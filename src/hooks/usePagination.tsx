import { useState } from "react";

export const usePagination = (props?: {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
}) => {
  const [page, setPage] = useState(props?.initialPage ?? 1);
  const [limit, setLimit] = useState(props?.initialLimit ?? 4);

  function getQuery() {
    return {
      page,
      limit,
    };
  }

  return { page, limit, setPage, setLimit, getQuery };
};
