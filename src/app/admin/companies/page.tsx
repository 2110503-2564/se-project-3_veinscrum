"use client";

import { CompanyCard } from "@/components/card/CompanyCard";
import { CompanyCardSkeleton } from "@/components/card/CompanyCardSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/shadcn/pagination";
import { BackendRoutes } from "@/constants/routes/Backend";
import { usePagination } from "@/hooks/usePagination";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export default function AdminCompaniesPage() {
  const { page, setPage, getQuery } = usePagination({
    initialLimit: 8,
  });

  const { data: companies, isLoading } = useQuery({
    queryKey: [BackendRoutes.COMPANIES, getQuery()],
    queryFn: async () =>
      await axios.get<GETAllCompaniesResponse>(BackendRoutes.COMPANIES, {
        params: getQuery(),
      }),
    select: (data) => data.data,
  });

  return (
    <main className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col justify-between gap-y-16 px-4 py-4 md:py-16">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-center text-4xl font-bold">All Companies</h1>
        </div>
        <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <CompanyCardSkeleton key={i} />
              ))
            : companies?.data.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
        </div>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!companies?.pagination.prev || isLoading}
              onClick={() => setPage(page - 1)}
            />
          </PaginationItem>
          {companies?.pagination.prev && !isLoading && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
          {companies?.pagination.next && !isLoading && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              disabled={!companies?.pagination.next || isLoading}
              onClick={() => setPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
