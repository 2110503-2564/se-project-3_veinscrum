"use client";

import { CompanyCard } from "@/components/card/CompanyCard";
import { SkeletonCompanyCard } from "@/components/card/CompanyCardSkeleton";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: companies, isLoading } = useQuery({
    queryKey: [BackendRoutes.COMPANIES],
    queryFn: async () =>
      await axios.get<GETAllCompaniesResponse>(BackendRoutes.COMPANIES, {
        params: {
          page: 1,
          limit: 8,
        },
      }),
    select: (data) => data.data,
  });

  return (
    <main className="mx-auto flex w-full max-w-(--breakpoint-xl) flex-col justify-between gap-y-16 px-4 py-4 md:py-16">
      <div className="space-y-2">
        <h1 data-testid="home-title" className="text-center text-4xl font-bold">
          Online Job Fair Registration
        </h1>
        <p className="text-muted-foreground text-center text-lg">
          Register for online job fairs and get hired.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-center text-2xl font-bold">
          Some of the companies that are hiring
        </h2>
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCompanyCard key={i} />
              ))
            : companies?.data.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
        </div>
      </div>
    </main>
  );
}
