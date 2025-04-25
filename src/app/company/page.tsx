"use client";

import { CompanyCard } from "@/components/card/CompanyCard";
import { SkeletonCompanyCard } from "@/components/card/CompanyCardSkeleton";
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

export default function CompaniesPage() {
  const { page, setPage, getQuery } = usePagination({
    initialLimit: 8,
  });

  const {
    data: companies,
    isLoading,
    error,
  } = useQuery({
    queryKey: [BackendRoutes.COMPANIES, getQuery()],
    queryFn: async () =>
      await axios.get<GETAllCompaniesResponse>(BackendRoutes.COMPANIES, {
        params: getQuery(),
      }),
    select: (data) => data.data,
  });

  if (error) return <p>Failed to load companies.</p>;

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-4.5rem)] max-w-(--breakpoint-xl) flex-col justify-between gap-y-16 py-16">
      <div className="space-y-16">
        <h1 className="text-center text-3xl font-bold">Explore Companies</h1>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCompanyCard key={i} />
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
