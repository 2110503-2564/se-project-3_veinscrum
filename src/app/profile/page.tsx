"use client";

import { JobCardProfile } from "@/components/card/JobCardProfile";
import { DeleteCompanyProfileDialog } from "@/components/dialog/DeleteCompanyProfileDialog";
import {
  EditCompanyProfileDialog,
  editCompanyProfileFormSchema,
} from "@/components/dialog/EditCompanyProfileDialog";
import { TextEditor } from "@/components/input/TextEditor";
import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { BackendRoutes } from "@/constants/routes/Backend";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { axios } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EllipsisIcon, Globe, Mail, MapPin, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function ProfilePage() {
  const router = useRouter();
  const { status } = useSession();
  const [isUpdateCompanyDialogOpen, setIsUpdateCompanyDialogOpen] =
    useState(false);
  const [isDeleteCompanyDialogOpen, setIsDeleteCompanyDialogOpen] =
    useState(false);
  const [isDeleteJobListingDialogOpen, setIsDeleteJobListingDialogOpen] =
    useState(false);

  const { data: me, isLoading: isMeLoading } = useQuery({
    queryKey: [BackendRoutes.AUTH_ME],
    queryFn: async () => await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME),
    enabled: status === "authenticated",
    select: (data) => data?.data?.data,
  });

  const {
    data: company,
    isLoading: isCompanyLoading,
    refetch: refetchCompany,
  } = useQuery({
    queryKey: [BackendRoutes.COMPANIES_ID({ companyId: me?.company ?? "" })],
    queryFn: async () =>
      await axios.get<GETCompanyResponse>(
        BackendRoutes.COMPANIES_ID({ companyId: me?.company ?? "" }),
      ),
    enabled: status === "authenticated" && !!me?.company,
    select: (data) => data?.data?.data,
  });

  const { mutate: updateCompany, isPending: isUpdateCompanyPending } =
    useMutation({
      mutationFn: async (data: z.infer<typeof editCompanyProfileFormSchema>) =>
        await axios.put(
          BackendRoutes.COMPANIES_ID({ companyId: company?.id ?? "" }),
          data,
        ),
      onMutate: () => {
        toast.loading("Updating company...", { id: "update-company" });
      },
      onError: () => {
        toast.error("Failed to update company", { id: "update-company" });
      },
      onSuccess: () => {
        toast.success("Company updated successfully", { id: "update-company" });
        setIsUpdateCompanyDialogOpen(false);
        refetchCompany();
      },
    });

  const { mutate: deleteCompany, isPending: isDeleteCompanyPending } =
    useMutation({
      mutationFn: async () =>
        await axios.delete(
          BackendRoutes.COMPANIES_ID({ companyId: company?.id ?? "" }),
        ),
      onMutate: () => {
        toast.loading("Deleting company...", { id: "delete-company" });
      },
      onError: () => {
        toast.error("Failed to delete company", { id: "delete-company" });
      },
      onSuccess: async () => {
        toast.success("Company deleted successfully", { id: "delete-company" });
        setIsDeleteCompanyDialogOpen(false);
        refetchCompany();
      },
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
        refetchCompany();
        setIsDeleteJobListingDialogOpen(false);
      },
    });

  if (isMeLoading || isCompanyLoading || status === "loading") return null;

  return (
    <main className="mx-auto mt-16">
      {me?.role !== "company" ? (
        <div className="mx-auto max-w-sm space-y-2 rounded-xl bg-white px-4 py-6 text-center drop-shadow-xl">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="mx-auto max-w-md text-left">
            <p>User Name : {me?.name}</p>
            <p>Email : {me?.email}</p>
            <p>Tel : {me?.tel}</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="mx-auto max-w-4xl rounded-xl bg-white px-6 py-10 shadow-md">
            <div className="mb-8 text-center">
              {!company ? (
                <div className="mx-auto">
                  <h1
                    data-testid="company-profile-no-company-profile-title"
                    className="text-xl font-semibold"
                  >
                    No Company Profile
                  </h1>
                  <div className="flex flex-row items-center justify-center gap-4">
                    <p data-testid="company-profile-no-company-profile-description">
                      You havent created a company profile yet.
                    </p>
                    <Button
                      onClick={() => router.push(FrontendRoutes.COMPANY_CREATE)}
                    >
                      Create Company Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mb-2 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        data-testid="company-profile-dropdown-menu-trigger"
                        variant="ghost"
                        size="icon"
                      >
                        <EllipsisIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        data-testid="company-profile-edit-profile"
                        onClick={() => setIsUpdateCompanyDialogOpen(true)}
                      >
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        data-testid="company-profile-delete-profile"
                        className="text-red-600 focus:text-red-600"
                        onClick={() => setIsDeleteCompanyDialogOpen(true)}
                      >
                        Delete Profile
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <EditCompanyProfileDialog
                    company={company}
                    isPending={isUpdateCompanyPending}
                    onUpdate={updateCompany}
                    isOpen={isUpdateCompanyDialogOpen}
                    setIsOpen={setIsUpdateCompanyDialogOpen}
                  />
                  <DeleteCompanyProfileDialog
                    isOpen={isDeleteCompanyDialogOpen}
                    isPending={isDeleteCompanyPending}
                    onClose={() => setIsDeleteCompanyDialogOpen(false)}
                    onDelete={() => {
                      deleteCompany();
                      setIsDeleteCompanyDialogOpen(false);
                    }}
                  />
                </div>
              )}
              <h1
                data-testid="company-profile-name"
                className="text-2xl font-bold"
              >
                {company?.name}
              </h1>
            </div>

            <div className="space-y-8 gap-x-8 md:grid md:grid-cols-3">
              <div className="flex w-full justify-center">
                <Image
                  src={company?.logo || "/placeholder.png"}
                  alt={company?.name || "Company Logo"}
                  width={192}
                  height={192}
                  className="rounded-md object-cover"
                />
              </div>

              <div className="col-span-2 w-full space-y-4">
                <div className="space-y-2 rounded-lg bg-gray-100 p-4 text-sm">
                  <p
                    data-testid="company-profile-address"
                    className="flex items-center gap-x-3"
                  >
                    <MapPin className="size-5 text-gray-600" />
                    {company?.address}
                  </p>
                  <p
                    data-testid="company-profile-email"
                    className="flex items-center gap-x-3"
                  >
                    <Mail className="size-5 text-gray-600" />
                    {me?.email}
                  </p>
                  <p
                    data-testid="company-profile-website"
                    className="flex items-center gap-x-3"
                  >
                    <Globe className="size-5 text-gray-600" />
                    {company?.website}
                  </p>
                  <p
                    data-testid="company-profile-telephone"
                    className="flex items-center gap-x-3"
                  >
                    <Phone className="size-5 text-gray-600" />
                    {company?.tel}
                  </p>
                </div>

                <TextEditor
                  key={company?.description}
                  value={company?.description}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="mx-auto my-10 max-w-4xl rounded-xl bg-white px-6 py-10 shadow-md">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="w-full text-center text-2xl font-bold">
                Job Listings
              </h2>
              <div className="shrink-0">
                <Button
                  onClick={() =>
                    router.push(FrontendRoutes.JOB_LISTINGS_CREATE)
                  }
                >
                  Create +
                </Button>
              </div>
            </div>
            <div className="mx-auto max-w-3xl space-y-4">
              {company?.jobListings?.length === 0 ? (
                <p
                  data-testid="company-profile-no-job-listings"
                  className="text-center text-gray-500"
                >
                  No job listings available.
                </p>
              ) : (
                company?.jobListings?.map((job, idx) => (
                  <div key={idx} className="relative mb-4">
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
                      onDeleteDialogClose={() =>
                        setIsDeleteJobListingDialogOpen(false)
                      }
                      onDeleteDialogOpen={() =>
                        setIsDeleteJobListingDialogOpen(true)
                      }
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
