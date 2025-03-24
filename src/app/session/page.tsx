"use client";

import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { UserInterviewSessionCard } from "../_components/UserInterviewSessionCard";
import { DeleteInterviewSessionDialog } from "./_components/DeleteInterviewSessionDialog";
import {
  EditInterviewSessionDialog,
  EditInterviewSessionFormSchema,
} from "./_components/EditInterviewSessionDialog";

export default function UserInterviewSessionsPage() {
  const queryClient = useQueryClient();
  const { status } = useSession();
  const [interviewSessionToDelete, setInterviewSessionToDelete] =
    useState<Nullable<InterviewSession>>(null);
  const [interviewSessionToUpdate, setInterviewSessionToUpdate] =
    useState<Nullable<InterviewSession>>(null);

  // Get current user data
  const {
    data: me,
    isLoading: isMeLoading,
    error: meError,
  } = useQuery({
    queryKey: [BackendRoutes.AUTH_ME],
    queryFn: async () =>
      (await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME)).data,
    enabled: status == "authenticated",
  });

  const userId = me?.data?._id || "";
  const isUserDataReady = !isMeLoading && !meError && !!userId;

  // Data fetching
  const queries = useQueries({
    queries: [
      {
        queryKey: [BackendRoutes.USERS_ID_SESSIONS({ id: userId })],
        queryFn: async () =>
          (
            await axios.get<GETAllInterviewSessionsResponse>(
              BackendRoutes.USERS_ID_SESSIONS({ id: userId }),
            )
          ).data,
        enabled: isUserDataReady,
      },
      {
        queryKey: [BackendRoutes.COMPANIES],
        queryFn: async () =>
          (await axios.get<GETAllCompaniesResponse>(BackendRoutes.COMPANIES))
            .data,
        enabled: !interviewSessionToUpdate,
      },
    ],
  });

  const [interviewSessionsQuery, companiesQuery] = queries;

  const interviewSessions = interviewSessionsQuery?.data;
  const companies = companiesQuery?.data;
  const isInterviewSessionLoading = interviewSessionsQuery?.isLoading;
  const isCompaniesLoading = companiesQuery?.isLoading;

  // Refresh data helper function
  const refreshInterviewSessionData = () => {
    queryClient.invalidateQueries({
      queryKey: [BackendRoutes.USERS_ID_SESSIONS({ id: userId })],
    });
  };

  // Update interview session mutation
  const {
    mutate: updateInterviewSession,
    isPending: isInterviewSessionUpdating,
  } = useMutation({
    mutationFn: async (
      data: { _id: string } & EditInterviewSessionFormSchema,
    ) => {
      await axios.put(BackendRoutes.SESSIONS_ID({ id: data._id }), data);
    },
    onMutate: () => {
      toast.dismiss();
      toast.loading("Updating session...", { id: "update-session" });
    },
    onSuccess: () => {
      toast.success("Session updated successfully", { id: "update-session" });
      setInterviewSessionToUpdate(null);
      refreshInterviewSessionData();
    },
    onError: (error) => {
      toast.error("Failed to update session", {
        id: "update-session",
        description: isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong",
      });
    },
  });

  // Delete interview session mutation
  const {
    mutate: deleteInterviewSession,
    isPending: isInterviewSessionDeleting,
  } = useMutation({
    mutationFn: (data: { _id: string }) =>
      axios.delete(BackendRoutes.SESSIONS_ID({ id: data._id })),
    onSuccess: () => {
      toast.success("Session delete successfully", { id: "delete-session" });
      setInterviewSessionToDelete(null);
      refreshInterviewSessionData();
    },
    onError: (error) => {
      toast.error("Failed to delete session", {
        id: "delete-session",
        description: isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong",
      });
    },
  });

  // Handle various error states
  if (status === "unauthenticated") {
    return (
      <div className="mt-16 text-center">
        Please sign in to view your sessions
      </div>
    );
  }

  if (meError) {
    return (
      <div className="mt-16 text-center">
        Failed to load user data. Please try again later.
      </div>
    );
  }

  return (
    <main className="mx-auto mt-16 space-y-8">
      <h1 className="text-center text-4xl font-bold">My Scheduled Sessions</h1>

      <div className="mx-auto h-[70vh] max-w-2xl space-y-2 overflow-y-auto pr-4">
        {isInterviewSessionLoading ? (
          <p className="text-center">Loading sessions...</p>
        ) : interviewSessions?.data.length ? (
          interviewSessions.data.map((interviewSession) => (
            <UserInterviewSessionCard
              key={interviewSession._id}
              interviewSession={interviewSession}
              onDelete={() => setInterviewSessionToDelete(interviewSession)}
              onEdit={() => setInterviewSessionToUpdate(interviewSession)}
            />
          ))
        ) : (
          <p className="text-center">There&apos;s nothing here.</p>
        )}
      </div>

      {interviewSessionToDelete ? (
        <DeleteInterviewSessionDialog
          interviewSession={interviewSessionToDelete}
          isOpen={!!interviewSessionToDelete}
          isPending={isInterviewSessionDeleting}
          onClose={() => setInterviewSessionToDelete(null)}
          onDelete={() =>
            deleteInterviewSession({ _id: interviewSessionToDelete._id })
          }
        />
      ) : null}

      {interviewSessionToUpdate ? (
        <EditInterviewSessionDialog
          interviewSession={interviewSessionToUpdate}
          companies={companies?.data}
          isOpen={!!interviewSessionToUpdate}
          isPending={isInterviewSessionUpdating}
          isLoading={isCompaniesLoading}
          onClose={() => setInterviewSessionToUpdate(null)}
          onUpdate={(data) => updateInterviewSession(data)}
        />
      ) : null}
    </main>
  );
}
