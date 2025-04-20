"use client";

import { JobCard } from "@/components/card/JobCard";
import { TextEditor } from "@/components/input/TextEditor";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Globe, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function CompanyProfilePage() {
  const { companyId } = useParams<{ companyId: string }>();

  const {
    data: companyResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["company", companyId],
    queryFn: async () =>
      await axios.get<GETCompanyResponse>(
        BackendRoutes.COMPANIES_ID({ companyId }),
      ),
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
    <div className="mx-auto my-16 max-w-3xl space-y-8">
      <div className="rounded-xl bg-white px-6 py-10 shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{company.name}</h1>
        </div>

        <div className="flex items-center gap-8 max-md:flex-col">
          <Image
            src={company.logo || "/placeholder.png"}
            alt={company.name}
            width={100}
            height={100}
            className="mx-auto size-36 rounded-md object-cover"
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
        <h2 className="mb-8 text-center text-2xl font-bold">Job Listings</h2>
        <div className="mx-auto max-w-3xl space-y-4">
          {jobs.length === 0 ? (
            <p className="text-center text-gray-500">
              No job listings available.
            </p>
          ) : (
            jobs.map((job, idx) => (
              <JobCard key={idx} jobListing={job} company={company} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
