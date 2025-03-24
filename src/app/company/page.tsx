"use client";

import { CompanyCard } from "@/components/card/CompanyCard";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export default function CompaniesPage() {
  const {
    data: companies,
    isLoading,
    error,
  } = useQuery({
    queryKey: [BackendRoutes.COMPANIES],
    queryFn: async () =>
      await axios.get<GETAllCompaniesResponse>(BackendRoutes.COMPANIES, {
        params: {
          page: 1,
          limit: 8,
        },
      }),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load companies.</p>;

  return (
    <main className="mx-auto mt-16 max-w-6xl">
      <h1 className="mb-8 text-center text-3xl font-bold">Explore Companies</h1>
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        {companies?.data.data &&
          companies?.data.data.map((company, idx) => (
            <CompanyCard key={idx} company={company} />
          ))}
      </div>
    </main>
  );
}
