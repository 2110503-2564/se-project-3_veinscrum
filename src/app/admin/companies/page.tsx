"use client";

import { CompanyCard } from "@/components/card/CompanyCard";
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

  const companiesQuery = useQuery({
    queryKey: [BackendRoutes.COMPANIES, getQuery()],
    queryFn: async () =>
      await axios.get<GETAllCompaniesResponse>(BackendRoutes.COMPANIES, {
        params: getQuery(),
      }),
  });

  const companies = companiesQuery?.data;

  const isCompaniesLoading = companiesQuery?.isLoading;

  return (
    <main className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col justify-between gap-y-16 px-4 py-4 md:py-16">
      <div>
        <h1 className="text-center text-4xl font-bold">
          All Scheduled Sessions
        </h1>
        <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-4">
          {companies?.data &&
            companies?.data?.data?.map((company, idx) => (
              <CompanyCard key={idx} company={company} variant="viewonly" />
            ))}
        </div>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!companies?.data?.pagination.prev || isCompaniesLoading}
              onClick={() => setPage(page - 1)}
            />
          </PaginationItem>
          {companies?.data?.pagination.prev && !isCompaniesLoading && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
          {companies?.data?.pagination.next && !isCompaniesLoading && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              disabled={!companies?.data?.pagination.next || isCompaniesLoading}
              onClick={() => setPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
