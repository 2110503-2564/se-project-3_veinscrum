"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { Mail, Phone, Globe, MapPin } from "lucide-react";

import { CompanyCard } from "@/components/card/CompanyCard";

interface Company {
  _id: string;
  id: string;
  name: string;
  address: string;
  website: string;
  description: string;
  tel: string;
}

interface GETCompanyResponse {
  success: boolean;
  message?: string;
  data: Company;
}

export default function CompanyProfilePage() {
  const { id: companyId } = useParams();

  const { data: companyResponse, isLoading, isError } = useQuery({
    queryKey: ['company', companyId],
    queryFn: async () =>
      await axios.get<GETCompanyResponse>(
        BackendRoutes.COMPANIES_ID({ id: companyId as string })
      ),
    enabled: !!companyId,
  });

  const company = companyResponse?.data?.data;

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError || !company) return <p className="text-center py-10">Company not found.</p>;

  return (
    <>
    <main className="max-w-6xl mx-auto px-12 py-12 mt-16 bg-white rounded-xl shadow-md space-y-10">
      <h1 className="text-3xl font-bold text-center">{company.name}</h1>

      <div className="flex flex-col md:flex-row justify-between gap-8">
        <div className="w-full md:w-1/4 flex justify-center md:justify-start">
          <div className="w-48 h-48 bg-gray-200 rounded-md" />
        </div>

        <div className="w-full md:w-1/2 text-sm space-y-1">
          <p className="font-medium">Address :</p>
          <p className="font-medium leading-relaxed">{company.address}</p>
        </div>

        <div className="fit-content w-full max-h-fit md:w-1/4 bg-gray-100 p-4 rounded-md text-sm space-y-2">
          <p className="flex items-center gap-2 break-all">
            <Globe className="w-4 h-4 shrink-0" />
            {company.website}
          </p>
          <p className="flex items-center gap-2 break-all">
            <Mail className="w-4 h-4 shrink-0" />
            N/A
          </p>
          <p className="flex items-center gap-2 break-all">
            <MapPin className="w-4 h-4 shrink-0" />
            {company.name}
          </p>
          <p className="flex items-center gap-2 break-all">
            <Phone className="w-4 h-4 shrink-0" />
            {company.tel}
          </p>
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">
        {company.description}
      </p>
    </main>

    <main className="max-w-6xl mx-auto px-6 py-12 mt-16 bg-white rounded-xl shadow-md space-y-10">
      <h1 className="text-3xl font-bold text-center">Job Listings</h1>

        {/* Job Listings */}
        <div className="flex justify-center">
        <CompanyCard company={{ ...company, sessions: [] }} />
        </div>
        </main>   
    </>
  );
}
