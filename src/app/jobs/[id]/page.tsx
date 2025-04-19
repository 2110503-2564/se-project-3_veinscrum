"use client";

import { Button } from "@/components/ui/shadcn/button";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function JobDetailPage() {
  const { id: jobId } = useParams();

  const {
    data: jobResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () =>
      await axios.get(BackendRoutes.JOB_LISTINGS_ID({ id: jobId as string })),
    enabled: !!jobId,
    select: (data) => data?.data?.data,
  });

  const job = jobResponse;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading job details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">
          Error loading job details:{" "}
          {(error as Error)?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-[1200px] rounded-lg bg-white p-8 shadow">
        <h1 className="mb-12 text-2xl font-semibold" data-testid="job-title">
          {job.jobTitle}
        </h1>

        <div className="flex flex-col space-y-8">
          <div className="grid grid-cols-2 gap-16">
            {/* Left side - Image */}
            <div data-testid="job-image">
              {job.image ? (
                <img
                  src={job.image}
                  alt={job.jobTitle}
                  className="object-cover"
                />
              ) : (
                <div
                  className="flex h-full items-center justify-center"
                  data-testid="job-image-placeholder"
                >
                  <Building2 className="h-16 w-16 text-gray-300" />
                </div>
              )}
            </div>

            {/* Right side - Description */}
            <div>
              <p
                className="pr-8 text-justify text-gray-600"
                data-testid="job-description"
              >
                {job.description}
              </p>
            </div>
          </div>

          {/* Button below both columns */}
          <div className="flex justify-center">
            <Button
              className="w-[250px] rounded-md bg-black py-3 text-center text-white transition-colors hover:bg-gray-800"
              onClick={() => {
                // TODO: Implement interview booking logic
                console.log("Book interview clicked");
              }}
            >
              Book Interview Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
