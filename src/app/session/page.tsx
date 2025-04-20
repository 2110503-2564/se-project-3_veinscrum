"use client";

import { UserInterviewSessionCard } from "@/components/card/UserInterviewSessionCard";
import { DeleteInterviewSessionDialog } from "@/components/dialog/DeleteInterviewSessionDialog";
import {
  EditInterviewSessionDialog,
  EditInterviewSessionFormSchema,
} from "@/components/dialog/EditInterviewSessionDialog";
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
    queryFn: async () => await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME),
    enabled: status == "authenticated",
  });

  const userId = me?.data?.data._id || "";
  const isUserDataReady = !isMeLoading && !meError && !!userId;

  // Data fetching
  const queries = useQueries({
    queries: [
      {
        queryKey: [BackendRoutes.USERS_ID_SESSIONS({ id: userId })],
        queryFn: async () =>
          await axios.get<GETAllInterviewSessionsResponse>(
            BackendRoutes.USERS_ID_SESSIONS({ id: userId }),
          ),
        enabled: isUserDataReady,
      },
    ],
  });

  const [interviewSessionsQuery] = queries;

  const interviewSessions = interviewSessionsQuery?.data;
  const isInterviewSessionLoading = interviewSessionsQuery?.isLoading;

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
    onMutate: () =>
      toast.loading("Updating session...", {
        id: "update-session",
        description: "",
      }),
    onSuccess: () => {
      toast.success("Session updated successfully", {
        id: "update-session",
        description: "",
      });
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
    onMutate: () =>
      toast.loading("Deleting session...", {
        id: "delete-session",
        description: "",
      }),
    onSuccess: () => {
      toast.success("Session delete successfully", {
        id: "delete-session",
        description: "",
      });
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

      <div className="mx-auto min-h-[calc(100dvh-4.5rem)] max-w-2xl space-y-2 overflow-y-auto pr-4">
        {isInterviewSessionLoading || !interviewSessions ? (
          <p className="text-center">Loading sessions...</p>
        ) : interviewSessions?.data.data.length == 0 ? (
          <p className="text-center">There&apos;s nothing here.</p>
        ) : (
          interviewSessions.data?.data.map((interviewSession) => (
            <UserInterviewSessionCard
              key={interviewSession._id}
              interviewSession={interviewSession}
              onDelete={() => setInterviewSessionToDelete(interviewSession)}
              onEdit={() => setInterviewSessionToUpdate(interviewSession)}
            />
          ))
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
          isOpen={!!interviewSessionToUpdate}
          isPending={isInterviewSessionUpdating}
          onClose={() => setInterviewSessionToUpdate(null)}
          onUpdate={(data) => updateInterviewSession(data)}
        />
      ) : null}
    </main>
  );
}
