"use client";

import { JobCard } from "@/components/card/JobCard";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { useParams } from "next/navigation";

export default function CompanyProfilePage() {
  const { id: companyId } = useParams();

  const {
    data: companyResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["company", companyId],
    queryFn: async () =>
      await axios.get(BackendRoutes.COMPANIES_ID({ id: companyId as string })),
    enabled: !!companyId,
    select: (data) => data?.data?.data,
  });

  const company = companyResponse;
  const jobs = company?.jobListings || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-gray-500">Loading company details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-red-500">
          Error loading company details:{" "}
          {(error as Error)?.message || "Unknown error"}
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
    <>
    <div className="mx-auto max-w-3xl rounded-xl bg-white px-6 py-10 mt-16 shadow-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">{company.name}</h1>
      </div>

      <div className="flex flex-col items-start gap-8 md:flex-row">
        {/* Company Icon */}
        <div className="flex w-full justify-center md:w-1/3">
          <div className="h-36 w-36 rounded-md bg-gray-200" />
        </div>

        {/* Company info */}
        <div className="w-full space-y-4 md:w-2/3">
          <div className="space-y-2 rounded-lg bg-gray-100 p-4 text-sm">
            <p className="flex gap-3">
              <MapPin className="h-5 w-5 text-gray-600" />
              {company.address}
            </p>

            <p className="flex gap-3">
              <Mail className="h-5 w-5 text-gray-600" />
              Email:
            </p>

            <p className="flex gap-3">
              <Globe className="h-5 w-5 text-gray-600" />
              {company.website}
            </p>

            <p className="flex gap-3">
              <Phone className="h-5 w-5 text-gray-600" />
              {company.tel}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-gray-700">
        {company.description}
      </p>
    </div>

      <div className="mx-auto max-w-3xl rounded-xl bg-white px-6 py-10 mt-16 shadow-md">
        <h2 className="mb-8 text-center text-2xl font-bold">Job Listings</h2>
        <div className="mx-auto max-w-3xl space-y-4">
          {jobs.length === 0 ? (
            <p className="text-center text-gray-500">
              No job listings available.
            </p>
          ) : (
            jobs.map((job: { _id: string; jobTitle: string }) => (
              <JobCard
                key={job._id}
                id={job._id}
                jobTitle={job.jobTitle}
                companyName={company.name}
                location={company.address}
                tel={company.tel}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
