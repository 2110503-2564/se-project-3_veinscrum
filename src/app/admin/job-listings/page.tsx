"use client";

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
import { JobCard } from "@/components/card/JobCard";

export default function AdminCompaniesPage() {
  const { page, setPage, getQuery } = usePagination({
    initialLimit: 4,
  });

  const jobListingsQuery = useQuery({
    queryKey: [BackendRoutes.JOB_LISTINGS, getQuery()],
    queryFn: async () =>
      await axios.get<GETAllJobListingsResponse>(BackendRoutes.JOB_LISTINGS, {
        params: getQuery(),
      }),
  });

  const jobListings = jobListingsQuery?.data;

  const isjobListingsLoading = jobListingsQuery?.isLoading;

  return (
    <main className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col justify-between gap-y-16 px-4 py-4 md:py-16">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-center text-4xl font-bold">
            All Job lishtings
          </h1>
        </div>
        <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-4">
          {jobListings?.data &&
            jobListings?.data?.data?.map((job, idx) => (
                console.log(job),
              console.log(job.company),
              <JobCard key={idx} jobListing={job} company={job.company} />
            ))}
        </div>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!jobListings?.data?.pagination.prev || isjobListingsLoading}
              onClick={() => setPage(page - 1)}
            />
          </PaginationItem>
          {jobListings?.data?.pagination.prev && !isjobListingsLoading && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
          {jobListings?.data?.pagination.next && !isjobListingsLoading && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              disabled={!jobListings?.data?.pagination.next || isjobListingsLoading}
              onClick={() => setPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}

