"use client";

import { JobCardProfile } from "@/components/card/JobCardProfile";
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
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminJobListingsPage() {
  const queryClient = useQueryClient();
  const { status } = useSession();
  const { page, setPage, getQuery } = usePagination({
    initialLimit: 4,
  });

  const [isDeleteJobListingDialogOpen, setIsDeleteJobListingDialogOpen] =
    useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  // Refresh data helper function
  const refreshJobListings = async () => {
    await queryClient.invalidateQueries({
      queryKey: [BackendRoutes.JOB_LISTINGS],
    });

    // Check if current page is now empty (except for page 1)
    if (page > 1) {
      const currentData = await axios.get<GETAllJobListingsResponse>(
        BackendRoutes.JOB_LISTINGS,
        { params: getQuery() },
      );

      // If the current page has no data after deletion, go to previous page
      if (currentData?.data?.data?.length === 0) {
        setPage(page - 1);
      }
    }
  };

  const [
    { data: me },
    {
      data: jobListings,
      isLoading: isJobListingsLoading,
      isError: isJobListingsError,
      error: jobListingsError,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: [BackendRoutes.AUTH_ME],
        queryFn: async () =>
          await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME),
        enabled: status === "authenticated",
        select: (data: AxiosResponse<GETMeResponse>) => data.data.data,
      },
      {
        queryKey: [BackendRoutes.JOB_LISTINGS, getQuery()],
        queryFn: async () =>
          await axios.get<GETAllJobListingsResponse>(
            BackendRoutes.JOB_LISTINGS,
            { params: getQuery() },
          ),
        enabled: status === "authenticated",
        select: (data: AxiosResponse<GETAllJobListingsResponse>) => data?.data,
      },
    ],
  });

  const { mutate: deleteJobListing, isPending: isDeleteJobListingPending } =
    useMutation({
      mutationFn: async (data: { id: string }) =>
        await axios.delete(BackendRoutes.JOB_LISTINGS_ID({ id: data.id })),
      onMutate: () => {
        toast.loading("Deleting job...", { id: "delete-job" });
      },
      onError: () => {
        toast.error("Failed to delete job", { id: "delete-job" });
      },
      onSuccess: () => {
        toast.success("Job deleted successfully", { id: "delete-job" });
        refreshJobListings();
        setIsDeleteJobListingDialogOpen(false);
        setSelectedJobId("");
      },
    });

  const handleDeleteDialogOpen = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsDeleteJobListingDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteJobListingDialogOpen(false);
    setSelectedJobId("");
  };

  if (isJobListingsError) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-red-500">
          Error loading company details:{" "}
          {(jobListingsError as Error)?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col justify-between gap-y-16 px-4 py-4 md:py-16">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-center text-4xl font-bold">All Job Listings</h1>
        </div>
        <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-4">
          {jobListings ? (
            jobListings.data.map((job, idx) => (
              <JobCardProfile
                key={idx}
                id={job._id}
                jobTitle={job.jobTitle}
                companyName={job.company.name}
                companyId={job.company._id}
                location={job.company.address}
                tel={job.company.tel}
                requestedUser={me}
                isDeleteDialogOpen={
                  isDeleteJobListingDialogOpen && selectedJobId === job._id
                }
                isDeletePending={isDeleteJobListingPending}
                onDelete={(jobListingId) =>
                  deleteJobListing({ id: jobListingId })
                }
                onDeleteDialogClose={handleDeleteDialogClose}
                onDeleteDialogOpen={() => handleDeleteDialogOpen(job._id)}
              />
            ))
          ) : (
            <p className="text-gray-500">jobListings not found</p>
          )}
        </div>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!jobListings?.pagination.prev || isJobListingsLoading}
              onClick={() => setPage(page - 1)}
            />
          </PaginationItem>
          {jobListings?.pagination.prev && !isJobListingsLoading && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
          {jobListings?.pagination.next && !isJobListingsLoading && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              disabled={!jobListings?.pagination.next || isJobListingsLoading}
              onClick={() => setPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
