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
    <div className="mx-auto max-w-[1200px] space-y-8 px-6 py-8">
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-8 text-center text-3xl font-bold">{company.name}</h1>

        <div className="mx-auto max-w-3xl space-y-4">
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">{company.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">{company.website}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">{company.tel}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">
                {company.description}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-8 shadow-sm">
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
    </div>
  );
}
