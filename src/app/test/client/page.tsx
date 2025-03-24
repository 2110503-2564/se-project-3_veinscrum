"use client";

import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export default function TestClientPage() {
  const { data: companies } = useQuery({
    queryKey: [BackendRoutes.COMPANIES],
    queryFn: async () =>
      await axios.get<GETAllCompaniesResponse>(BackendRoutes.COMPANIES),
  });

  return (
    <div>
      {companies?.data &&
        companies?.data.data?.map((company, idx) => (
          <div key={idx}>
            <p>{company.name}</p>
            <p>{company.address}</p>
            <p>{company.website}</p>
            <p>{company.description}</p>
            <p>{company.tel}</p>
          </div>
        ))}
    </div>
  );
}
