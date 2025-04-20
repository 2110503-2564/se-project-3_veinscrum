"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Building2, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/shadcn/button";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { DeleteJobListingDialog } from "@/components/dialog/DeleteJobListingDialog";
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/lib/axios";
import { BackendRoutes } from "@/constants/routes/Backend";
import { toast } from "sonner";

interface JobCardProps {
  id: string;
  jobTitle: string;
  companyName: string;
  location?: string;
  tel?: string;
  onDelete: (id: string) => void;
}

export function JobCardProfile({
  id,
  jobTitle,
  companyName,
  location,
  tel,
  onDelete,
}: JobCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: deleteJob, isPending } = useMutation({
    mutationFn: async () => {
      console.log(BackendRoutes.JOB_LISTINGS_ID({ id }));
      await axios.delete(BackendRoutes.JOB_LISTINGS_ID({ id }));
    },
    onMutate: () => {
      toast.loading("Deleting job...", { id: "delete-job" });
    },
    onError: () => {
      toast.error("Failed to delete job", { id: "delete-job" });
    },
    onSuccess: () => {
      toast.success("Job deleted successfully", { id: "delete-job" });
      setIsDeleteDialogOpen(false);
      onDelete(id);
    },
  });

  return (
    <>
      <Card
        className="w-full rounded-lg bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
        data-testid="job-card"
      >
        <CardContent className="flex flex-col gap-3 p-0">
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-semibold text-gray-900" data-testid="job-title">
                {jobTitle}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 text-gray-600">
                <Building2 className="h-3.5 w-3.5" />
                <span className="text-xs" data-testid="company-name">
                  {companyName}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 rounded-md bg-gray-50 p-2 text-xs">
              {location && (
                <p className="flex items-center gap-x-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-600" />
                  <span className="text-gray-600" data-testid="company-address">
                    {location}
                  </span>
                </p>
              )}
              {tel && (
                <p className="flex items-center gap-x-2">
                  <Phone className="h-3.5 w-3.5 text-gray-600" />
                  <span className="text-gray-600" data-testid="company-tel">
                    {tel}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href={`/jobs/${id}`}>
              <Button
                variant="default"
                size="sm"
                className="bg-black text-white transition-colors hover:bg-gray-800"
              >
                View Details
              </Button>
            </Link>
            <Link href={FrontendRoutes.JOB_LISTINGS_ID_EDIT({ jobId: id })}>
              <Button variant="outline" size="sm">
                Update Details
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete Details
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteJobListingDialog
        isOpen={isDeleteDialogOpen}
        isPending={isPending}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={() => {
          deleteJob();
          setIsDeleteDialogOpen(false);
        }}
      />
    </>
  );
}
