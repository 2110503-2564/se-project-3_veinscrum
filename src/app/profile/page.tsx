"use client";

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
import { axios } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EllipsisIcon, Globe, Mail, MapPin, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: [BackendRoutes.AUTH_ME],
    queryFn: async () => await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME),
    enabled: !!session?.token,
    select: (data) => data?.data?.data,
  });

  const { data: company, isLoading: isCompanyLoading } = useQuery({
    queryKey: [BackendRoutes.COMPANIES_ID({ id: user?.company || "" })],
    queryFn: async () =>
      await axios.get<GETCompanyResponse>(
        BackendRoutes.COMPANIES_ID({ id: user?.company || "" }),
      ),
    enabled: !!session?.token && !!user?.company,
    select: (data) => data?.data?.data,
  });

  const { mutate: updateCompany, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof editCompanyProfileFormSchema>) =>
      await axios.put(
        BackendRoutes.COMPANIES_ID({ id: company?.id ?? "" }),
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
      queryClient.invalidateQueries({
        queryKey: [BackendRoutes.COMPANIES_ID({ id: company?.id ?? "" })],
      });
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
            <div className="mb-2 flex justify-end">
              <DropdownMenu>
                <Button asChild variant="ghost" size="icon">
                  <DropdownMenuTrigger>
                    <EllipsisIcon />
                  </DropdownMenuTrigger>
                </Button>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Delete Profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h1 className="text-2xl font-bold">{company?.name}</h1>
          </div>

          <div className="flex flex-col gap-8 md:grid md:grid-cols-3">
            <div className="flex h-[192px] w-full items-center justify-center">
              <Image
                src={company?.logo ?? "/placeholder.png"}
                alt={company?.name ?? "Company Logo"}
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

              <TextEditor markdown={company?.description} readOnly />
            </div>
          </div>

          {company && (
            <EditCompanyProfileDialog
              company={company}
              isOpen={isEditDialogOpen}
              isPending={isPending}
              onClose={() => setIsEditDialogOpen(false)}
              onUpdate={updateCompany}
            />
          )}
        </div>
      )}
    </main>
  );
}
