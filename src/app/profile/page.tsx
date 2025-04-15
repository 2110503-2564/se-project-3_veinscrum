"use client";

import {
  EditCompanyProfileDialog,
  EditCompanyProfileFormSchema,
} from "@/components/dialog/EditCompanyProfileDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { withBaseRoute } from "@/utils/routes/withBaseRoute";
import { useQuery } from "@tanstack/react-query";
import { Ellipsis, Globe, Mail, MapPin, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  tel: string;
  role: string;
  company?: string;
}

interface Company {
  _id: string;
  id: string;
  name: string;
  address: string;
  website: string;
  description: string;
  tel: string;
  sessions: Array<{
    _id: string;
    title: string;
    date: string;
    status: string;
  }>;
}

interface GETMeResponse {
  success: boolean;
  message?: string;
  data: User;
}

interface GETCompanyResponse {
  success: boolean;
  message?: string;
  data: Company;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: userResponse } = useQuery({
    queryKey: [BackendRoutes.AUTH_ME],
    queryFn: async () => await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME),
    enabled: !!session?.token,
  });

  const user = userResponse?.data?.data;
  const accountRole = user?.role;

  const { data: companyResponse } = useQuery({
    queryKey: [BackendRoutes.COMPANIES_ID({ id: user?.company || "" })],
    queryFn: async () =>
      await axios.get<GETCompanyResponse>(
        BackendRoutes.COMPANIES_ID({ id: user?.company || "" }),
      ),
    enabled: !!session?.token && !!user?.company,
  });

  const company = companyResponse?.data?.data;

  const handleUpdateProfile = async (data: EditCompanyProfileFormSchema) => {
    if (!company?._id) return;

    try {
      setIsUpdating(true);
      const response = await fetch(
        withBaseRoute(BackendRoutes.COMPANIES_ID({ id: company._id })),
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully");
      setIsEditDialogOpen(false);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <main className="mx-auto mt-16">
      {accountRole !== "company" ? (
        //  user session
        <div className="mx-auto max-w-sm space-y-2 rounded-xl bg-white px-4 py-6 text-center drop-shadow-xl">
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="mx-auto max-w-md text-left">
            <p>User Name : {user?.name}</p>
            <p>Email : {user?.email}</p>
            <p>Tel : {user?.tel}</p>
          </div>
        </div>
      ) : 
       (
        <div className="mx-auto max-w-4xl rounded-xl bg-white px-6 py-10 shadow-md">
          <div className="mb-8 text-center">
            <div className="mb-2 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-fit w-fit rounded-full p-2 transition-colors hover:bg-slate-100 focus:outline-none">
                    <Ellipsis className="h-5 w-5 cursor-pointer transition-colors hover:text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
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

          <div className="flex flex-col items-start gap-8 md:flex-row">
            {/* Company Icon */}
            <div className="flex w-full justify-center md:w-1/3">
              <div className="h-48 w-48 rounded-md bg-gray-200" />
            </div>

            {/* Company info  */}
            <div className="w-full space-y-4 md:w-2/3">
              {/* Info box */}
              <div className="space-y-2 rounded-lg bg-gray-100 p-4 text-sm">
                <p className="flex gap-3">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  {company?.address}
                </p>

                <p className="flex gap-3">
                  <Mail className="h-5 w-5 text-gray-600" />
                  {user?.email}
                </p>

                <p className="flex gap-3">
                  <Globe className="h-5 w-5 text-gray-600" />
                  {company?.website}
                </p>

                <p className="flex gap-3">
                  <Phone className="h-5 w-5 text-gray-600" />
                  {company?.tel}
                </p>
              </div>

              {/* Company description */}
              <p className="text-sm leading-relaxed text-gray-700">
                {company?.description}
              </p>
            </div>
          </div>

          {company && (
            <EditCompanyProfileDialog
              company={company}
              isOpen={isEditDialogOpen}
              isPending={isUpdating}
              onClose={() => setIsEditDialogOpen(false)}
              onUpdate={handleUpdateProfile}
            />
          )}
        </div>
      ) }
    </main>
  );
}
