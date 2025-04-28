"use client";

import { FlagUserCard } from "@/components/card/FlagUserCard";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse, isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export interface InterviewSessionWithFlag extends InterviewSession {
  flag?: Flag;
}

export default function CompanySessionPage() {
  const queryClient = useQueryClient();
  const { status } = useSession();

  const { data: me } = useQuery({
    queryKey: [BackendRoutes.AUTH_ME],
    queryFn: async () => {
      const response = await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME);
      return response.data.data;
    },
    enabled: status === "authenticated",
  });

  const {
    data: sessionData,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: [
      BackendRoutes.COMPANIES_ID_SESSIONS({ companyId: me?.company ?? "" }),
    ],
    queryFn: async () =>
      await axios.get<GETInterviewSessionByCompany>(
        BackendRoutes.COMPANIES_ID_SESSIONS({ companyId: me?.company ?? "" }),
      ),
    select: (data) => data.data.data,
    enabled: !!me,
  });

  // Group sessions by jobListingId
  const groupJobListing = new Map<string, Array<InterviewSession>>();
  sessionData?.forEach((session) => {
    const jobListingId = session.jobListing._id;
    if (!groupJobListing.has(jobListingId)) {
      groupJobListing.set(jobListingId, []);
    }
    groupJobListing.get(jobListingId)!.push(session);
  });

  // Fetch flags for each job listing
  const flagQueries = useQueries({
    queries: Array.from(groupJobListing.keys()).map((jobListingId) => ({
      queryKey: [BackendRoutes.JOB_LISTINGS_ID_FLAGS({ id: jobListingId })],
      queryFn: async () => {
        const response = await axios.get<GETFlagsByJobListingResponse>(
          BackendRoutes.JOB_LISTINGS_ID_FLAGS({ id: jobListingId }),
        );
        return response.data.data;
      },
      enabled: !!jobListingId,
    })),
  });

  // Map jobListingId to its corresponding flags
  const flagsMap = new Map<string, Array<Flag>>();
  const jobListingIds = Array.from(groupJobListing.keys());
  flagQueries.forEach((result, index) => {
    const jobListingId = jobListingIds[index];
    flagsMap.set(jobListingId, result.data ?? []);
  });

  // Combine sessions with matching flags
  const groupedWithFlags = new Map<string, Array<InterviewSessionWithFlag>>();
  groupJobListing.forEach((sessions, jobListingId) => {
    const flags = flagsMap.get(jobListingId) ?? [];
    const sessionsWithFlags = sessions.map((session) => {
      const matchingFlag = flags.find(
        (flag) => flag.user._id === session.user._id,
      );
      return { ...session, flag: matchingFlag };
    });
    groupedWithFlags.set(jobListingId, sessionsWithFlags);
  });

  const { mutate: createFlag, isPending: isCreateFlagPending } = useMutation({
    mutationFn: async (data: { user: string; jobListing: string }) =>
      await axios.post<POSTFlagRequest, AxiosResponse<POSTFlagResponse>>(
        BackendRoutes.FLAGS,
        {
          user: data.user,
          jobListing: data.jobListing,
        },
      ),
    onSuccess: (data) => {
      toast.success("User flagged successfully");
      if (data.data.data.jobListing) {
        queryClient.invalidateQueries({
          queryKey: [
            BackendRoutes.JOB_LISTINGS_ID_FLAGS({
              id: data.data.data.jobListing,
            }),
          ],
        });
      }
    },
    onError: (error) => {
      console.error("Error creating flag:", error);
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.error || "Failed to flag user"
          : "Failed to flag user",
      );
    },
  });

  const { mutate: deleteFlag, isPending: isDeleteFlagPending } = useMutation({
    mutationFn: async (flag: Flag) => {
      await axios.delete(BackendRoutes.FLAGS_ID({ id: flag._id }));
    },
    onSuccess: async (_, flag) => {
      toast.success("User unflagged successfully");
      await queryClient.invalidateQueries({
        queryKey: [
          BackendRoutes.JOB_LISTINGS_ID_FLAGS({ id: flag.jobListing }),
        ],
      });
    },
    onError: (error) => {
      console.error("Error deleting flag:", error);
      toast.error(
        isAxiosError(error)
          ? error.response?.data?.error || "Failed to unflag user"
          : "Failed to unflag user",
      );
    },
  });

  const toggleStar = (
    data: { user: string; jobListing: string },
    flag?: Flag,
  ) => {
    console.log(data, flag);

    if (flag) {
      deleteFlag(flag);
    } else {
      createFlag(data);
    }
  };

  return (
    <main className="mx-auto mt-16 max-w-3xl space-y-8 px-4">
      <h1 className="text-center text-4xl font-bold">Flag User By Job Title</h1>

      {isSessionLoading && <p>Loading sessions...</p>}
      {sessionError && <p>Error loading sessions.</p>}

      <div className="w-full space-y-4">
        {Array.from(groupedWithFlags.entries()).map(
          ([_, interviewSessionWithFlags], idx) => (
            <FlagUserCard
              key={idx}
              isToggleStartPending={isDeleteFlagPending || isCreateFlagPending}
              toggleStar={toggleStar}
              interviewSessions={interviewSessionWithFlags}
            />
          ),
        )}
      </div>
    </main>
  );
}
