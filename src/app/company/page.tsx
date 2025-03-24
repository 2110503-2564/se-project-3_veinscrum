"use client";

import { Button } from "@/components/ui/shadcn/button";
import { useRouter } from "next/navigation";
import { axios } from "@/lib/axios";
import { BackendRoutes } from "@/constants/routes/Backend";
import CompanyBox from "@/components/ui/shadcn/companycard";
import { useQuery } from "@tanstack/react-query";








export default function CompaniesPage() {
  const router = useRouter();

  const { data: companies, isLoading, error } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await axios.get<{ data: Array<Company> }>(BackendRoutes.COMPANIES);
      return response.data.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load companies.</p>;

  return (
    <main className="mx-auto mt-16 max-w-6xl">
      <h1 className="text-center text-3xl font-bold mb-8">Explore Companies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {companies?.map((company, idx) => (
          <CompanyBox
            key={idx}
            company={company}
            onExplore={() => router.push("/session/create")}
          />
        ))}
      </div>
    </main>
  );
}
