"use client";

import { FlagUserList } from "@/components/card/FlagUserList";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function CompanySessionPage() {
  const { status } = useSession();

  const {
    data: me,
    isLoading: isMeLoading,
    error: meError,
  } = useQuery({
    queryKey: [BackendRoutes.AUTH_ME],
    queryFn: async () => await axios.get(BackendRoutes.AUTH_ME),
    enabled: status === "authenticated",
  });

  const companyId = me?.data?.data.company || "";
  const isCompanyDataReady = !isMeLoading && !meError && !!companyId;

  const {
    data: sessionData,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: [BackendRoutes.COMPANIES_ID_SESSIONS({ companyId })],
    queryFn: async () =>
      await axios.get<GETInterviewSessionByCompany>(
        BackendRoutes.COMPANIES_ID_SESSIONS({ companyId }),
      ),
    select: (data) => data.data.data,
    enabled: isCompanyDataReady,
  });

  const groupJobListing = new Map<string, Array<InterviewSession>>();

  sessionData?.forEach((session) => {
    const JobListingId = session.jobListing._id;

    if (!groupJobListing.has(JobListingId)) {
      groupJobListing.set(JobListingId, []);
    }
    groupJobListing.get(JobListingId)!.push(session);
  });

  const noData = !isSessionLoading && groupJobListing.size === 0;

  return (
    <main className="mx-auto mt-16 max-w-3xl px-4">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Flagged Users by Job Title
      </h1>

      {isSessionLoading && <p>Loading sessions...</p>}
      {sessionError && <p>Error loading sessions.</p>}
      {noData && (
        <p className="text-center text-lg text-gray-500">
          No flagged users found for any job title.
        </p>
      )}

      {!noData && <FlagUserList groupedData={groupJobListing} />}
    </main>
  );
}
