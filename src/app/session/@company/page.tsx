"use client";

import { FlagUserList } from "@/components/card/FlagUserList";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { User } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface JobListingGroup {
  jobTitle: string;
  jobListingId: string;
  users: Array<User>;
}

export default function CompanySessionPage() {
  const queryClient = useQueryClient();
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

  const groupedJobListings = Array.isArray(sessionData)
    ? sessionData.reduce(
        (acc: Array<JobListingGroup>, session: InterviewSession) => {
          const jobTitle = session.jobListing?.jobTitle || "Unknown Job";
          const jobListingId = session.jobListing?._id || "";
          const user: User = {
            id: session.user._id,
            name: session.user.name,
            email: session.user.email,
            tel: session.user.tel,
          };

          const existingGroup = acc.find(
            (group: JobListingGroup) => group.jobListingId === jobListingId,
          );
          if (existingGroup) {
            existingGroup.users.push(user);
          } else {
            acc.push({
              jobTitle,
              jobListingId,
              users: [user],
            });
          }
          return acc;
        },
        [] as Array<JobListingGroup>,
      )
    : [];

  const noData = !isSessionLoading && groupedJobListings.length === 0;

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

      {!noData && <FlagUserList groupedData={groupedJobListings} />}
    </main>
  );
}
