"use client";

import { JobCardProfile } from "@/components/card/JobCardProfile";
import { TextEditor } from "@/components/input/TextEditor";
import { Button } from "@/components/ui/shadcn/button";
import { BackendRoutes } from "@/constants/routes/Backend";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { axios } from "@/lib/axios";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Globe, MapPin, Phone, PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CompanyProfilePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { status } = useSession();
  const { companyId } = useParams<{ companyId: string }>();

  const [isDeleteJobListingDialogOpen, setIsDeleteJobListingDialogOpen] =
    useState(false);

  const [
    { data: me },
    {
      data: company,
      isLoading: isCompanyLoading,
      isError: isCompanyError,
      error: companyError,
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
        queryKey: [BackendRoutes.COMPANIES_ID({ companyId })],
        queryFn: async () =>
          await axios.get<GETCompanyResponse>(
            BackendRoutes.COMPANIES_ID({ companyId }),
          ),
        enabled: !!companyId,
        select: (data: AxiosResponse<GETCompanyResponse>) => data?.data?.data,
      },
    ],
  });

  // Refresh data helper function
  const refreshCompany = () => {
    queryClient.invalidateQueries({
      queryKey: [BackendRoutes.COMPANIES_ID({ companyId })],
    });
  };

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
        refreshCompany();
        setIsDeleteJobListingDialogOpen(false);
      },
    });

  const jobs = company?.jobListings || [];

  const isAdmin = me?.role === "admin";
  const isOwner = me?.role === "company" && me.company === company?.id;
  const canEdit = me && (isAdmin || isOwner);

  if (isCompanyLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-gray-500">Loading company details...</p>
      </div>
    );
  }

  if (isCompanyError) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-red-500">
          Error loading company details:{" "}
          {(companyError as Error)?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-gray-500">Company not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto my-16 max-w-4xl space-y-8">
      <div className="rounded-xl bg-white px-6 py-10 shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{company.name}</h1>
        </div>

        <div className="flex items-center gap-8 max-md:flex-col">
          <Image
            src={company.logo || "/placeholder.png"}
            alt={company.name}
            width={192}
            height={192}
            className="mx-auto rounded-md object-cover"
          />

          <div className="w-full space-y-4">
            <div className="space-y-2 rounded-lg bg-gray-100 p-4 text-sm">
              <p className="flex gap-x-3">
                <MapPin className="size-5 text-gray-600" />
                {company.address}
              </p>

              <p className="flex gap-x-3">
                <Globe className="size-5 text-gray-600" />
                {company.website}
              </p>

              <p className="flex gap-x-3">
                <Phone className="size-5 text-gray-600" />
                {company.tel}
              </p>
            </div>
          </div>
        </div>
        <TextEditor markdown={company.description} readOnly />
      </div>

      <div className="rounded-xl bg-white px-6 py-10 shadow-md">
        <div className="mb-8 grid grid-cols-3 items-center">
          <div></div>
          <h2 className="text-center text-2xl font-bold">Job Listings</h2>

          {canEdit && (
            <div className="flex justify-end">
              <div className="shrink-0">
                <Button
                  onClick={() =>
                    router.push(FrontendRoutes.JOB_LISTINGS_CREATE)
                  }
                >
                  <PlusIcon className="h-4 w-4" />
                  Create
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {jobs.length === 0 ? (
            <p className="text-center text-gray-500">
              No job listings available.
            </p>
          ) : (
            jobs.map((job, idx) => (
              <JobCardProfile
                key={idx}
                id={job._id}
                jobTitle={job.jobTitle}
                companyName={company.name}
                location={company.address}
                tel={company.tel}
                requestedUser={me}
                isDeleteDialogOpen={isDeleteJobListingDialogOpen}
                isDeletePending={isDeleteJobListingPending}
                onDelete={(jobListingId) =>
                  deleteJobListing({ id: jobListingId })
                }
                onDeleteDialogClose={() => {
                  setIsDeleteJobListingDialogOpen(false);
                }}
                onDeleteDialogOpen={() => setIsDeleteJobListingDialogOpen(true)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
