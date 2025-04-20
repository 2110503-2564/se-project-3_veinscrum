"use client";

import {
  EditCompanyProfileDialog,
  editCompanyProfileFormSchema,
} from "@/components/dialog/EditCompanyProfileDialog";
import{ DeleteCompanyProfileDialog }from "@/components/dialog/DeleteCompanyProfileDialog";
import { JobCardProfile } from "@/components/card/JobCardProfile";
import { TextEditor } from "@/components/input/TextEditor";
import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EllipsisIcon, Globe, Mail, MapPin, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { FrontendRoutes } from "@/constants/routes/Frontend";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const { data: user, isLoading: isUserLoading , refetch: refetchUser } = useQuery({
    queryKey: [BackendRoutes.AUTH_ME],
    queryFn: async () => await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME),
    enabled: !!session?.token,
    select: (data) => data?.data?.data,
  });

  const {
    data: company,
    isLoading: isCompanyLoading,
    refetch: refetchCompany,
  } = useQuery({
    queryKey: [BackendRoutes.COMPANIES_ID({ companyId: user?.company ?? "" })],
    queryFn: async () =>
      await axios.get<GETCompanyResponse>(
        BackendRoutes.COMPANIES_ID({ companyId: user?.company ?? "" }),
      ),
    enabled: !!session?.token && !!user?.company,
    select: (data) => data?.data?.data,
  });

  const { mutate: updateCompany, isPending } = useMutation({
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
      setIsEditDialogOpen(false);
      refetchCompany();
    },
  });

  const { mutate: deleteCompany } = useMutation({
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
      setIsDeleteDialogOpen(false);
      refetchCompany();
      refetchUser();
    },
  });

  if (isUserLoading || isCompanyLoading || status === "loading") return null;

  return (
    <main className="mx-auto mt-16">
      {user?.role !== "company" ? (
        <div className="mx-auto max-w-sm space-y-2 rounded-xl bg-white px-4 py-6 text-center drop-shadow-xl">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="mx-auto max-w-md text-left">
            <p>User Name : {user?.name}</p>
            <p>Email : {user?.email}</p>
            <p>Tel : {user?.tel}</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl rounded-xl bg-white px-6 py-10 shadow-md">
          <div className="mb-8 text-center">
            {!company ? (
              <div className="mx-auto">
                <h1 className="text-xl font-semibold">No Company Profile</h1>
                <div className="flex flex-row justify-center items-center gap-4">
                  <p>You havent created a company profile yet.</p>
                  <Button onClick={() => router.push(FrontendRoutes.COMPANY_CREATE)}>
                    Create Company Profile
                  </Button>
              </div>
            </div>
            ) : (<div className="mb-2 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <EllipsisIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setIsDeleteDialogOpen(true)}>
                    Delete Profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <EditCompanyProfileDialog
                company={company}
                isPending={isPending}
                onUpdate={updateCompany}
                isOpen={isEditDialogOpen}
                setIsOpen={setIsEditDialogOpen}
              />
              <DeleteCompanyProfileDialog
                isOpen={isDeleteDialogOpen}
                isPending={isPending}
                onClose={() => setIsDeleteDialogOpen(false)}
                onDelete={() => {
                  deleteCompany();
                  setIsDeleteDialogOpen(false);
                }}
              />
            </div>)}
            <h1 className="text-2xl font-bold">{company?.name}</h1>
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
                <p className="flex items-center gap-x-3">
                  <MapPin className="size-5 text-gray-600" />
                  {company?.address}
                </p>
                <p className="flex items-center gap-x-3">
                  <Mail className="size-5 text-gray-600" />
                  {user?.email}
                </p>
                <p className="flex items-center gap-x-3">
                  <Globe className="size-5 text-gray-600" />
                  {company?.website}
                </p>
                <p className="flex items-center gap-x-3">
                  <Phone className="size-5 text-gray-600" />
                  {company?.tel}
                </p>
              </div>

              <TextEditor
                key={company?.description}
                markdown={company?.description}
                readOnly
              />
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto my-10 max-w-4xl rounded-xl bg-white px-6 py-10 shadow-md">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-center w-full">Job Listings</h2>
          <div className="shrink-0">
            <Button onClick={() => router.push(FrontendRoutes.JOB_LISTINGS_CREATE)}>
              Create +
            </Button>
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-4">
          {company?.jobListings?.length === 0 ? (
            <p className="text-center text-gray-500">
              No job listings available.
            </p>
          ) : (
            company?.jobListings?.map((job, idx) => (
              <div key={idx} className="relative mb-4">
                <JobCardProfile
                  id={job._id}
                  jobTitle={job.jobTitle}
                  companyName={company.name}
                  location={company.address}
                  tel={company.tel}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}