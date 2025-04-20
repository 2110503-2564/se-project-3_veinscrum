'use client';

import { axios } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { BackendRoutes } from "@/constants/routes/Backend";
import { useSession } from "next-auth/react";

export default function CompanySessionPage() {
    const { status } = useSession();
    const {
        data: me,
        isLoading: isMeLoading,
        error: meError,
      } = useQuery({
        queryKey: [BackendRoutes.AUTH_ME],
        queryFn: async () => await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME),
        enabled: status == "authenticated",
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
            BackendRoutes.COMPANIES_ID_SESSIONS({ companyId })
          ),
        select: (data) => data.data.data,
        enabled: isCompanyDataReady,
    });
    const groupJobListing = new Map<string, Array<User>>();
        sessionData?.forEach((session) => {
            const jobTitle = session.jobListing?.jobTitle || "";
            const userId = session.user;
            if (!groupJobListing.has(jobTitle)) {
                groupJobListing.set(jobTitle, []);
            }
            groupJobListing.get(jobTitle)!.push(userId);
    });

    return (
        <main className="mx-auto mt-16 space-y-8">
            <h1 className="text-center text-4xl font-bold">My Scheduled Sessions</h1>

        {isSessionLoading && <p>Loading sessions...</p>}
        {sessionError && <p>Error loading sessions.</p>}
       
        {Array.from(groupJobListing.entries()).map(([jobTitle, users]) => (
            <div key={jobTitle} className="border p-4 rounded mb-8">
                <h2 className="text-2xl font-semibold mb-4">{jobTitle}</h2>
                {users.map((user, index) => (
                    <div key={index} className="p-4 border mb-2 rounded">
                        <div>Name: {user.name}</div>
                        <div>Email: {user.email}</div>
                    </div>
                ))}
            </div>
        ))}

        </main>
    );
}
  