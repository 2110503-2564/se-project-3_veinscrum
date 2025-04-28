"use client";

import { AdminSessionCard } from "@/components/card/AdminInterviewSessionCard";
import { InterviewSessionCardSkeleton } from "@/components/card/InterviewSessionCardSkeleton";
import { DeleteInterviewSessionDialog } from "@/components/dialog/DeleteInterviewSessionDialog";
import {
  EditInterviewSessionDialog,
  EditInterviewSessionFormSchema,
} from "@/components/dialog/EditInterviewSessionDialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/shadcn/pagination";
import { BackendRoutes } from "@/constants/routes/Backend";
import { usePagination } from "@/hooks/usePagination";
import { axios } from "@/lib/axios";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminSessionsPage() {
  const queryClient = useQueryClient();

  const { page, setPage, getQuery } = usePagination();

  const [interviewSessionToDelete, setInterviewSessionToDelete] =
    useState<Nullable<InterviewSession>>(null);
  const [interviewSessionToUpdate, setInterviewSessionToUpdate] =
    useState<Nullable<InterviewSession>>(null);

  const queries = useQueries({
    queries: [
      {
        queryKey: [BackendRoutes.SESSIONS, getQuery()],
        queryFn: async () =>
          await axios.get<GETAllInterviewSessionsResponse>(
            BackendRoutes.SESSIONS,
            {
              params: getQuery(),
            },
          ),
      },
    ],
  });

  const [sessionsQuery] = queries;

  const sessions = sessionsQuery?.data;

  const isSessionsLoading = sessionsQuery?.isLoading;

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

  const refreshInterviewSessionData = async () => {
    await queryClient.invalidateQueries({
      queryKey: [BackendRoutes.SESSIONS],
    });

    // Check if current page is now empty (except for page 1)
    if (page > 1) {
      const currentData = await axios.get<GETAllInterviewSessionsResponse>(
        BackendRoutes.SESSIONS,
        { params: getQuery() },
      );

      // If the current page has no data after deletion, go to previous page
      if (currentData?.data?.data?.length === 0) {
        setPage(page - 1);
      }
    }
  };

  return (
    <main className="mx-auto flex w-full flex-col justify-between gap-y-16 px-4 py-4 md:py-16">
      <div>
        <h1 className="text-left text-4xl font-bold">All Scheduled Sessions</h1>
        <div className="mt-4 space-y-2.5">
          {!isSessionsLoading
            ? sessions?.data &&
              sessions?.data?.data?.map((session, idx) => (
                <AdminSessionCard
                  key={idx}
                  interviewSession={session}
                  onDelete={() => setInterviewSessionToDelete(session)}
                  onEdit={() => setInterviewSessionToUpdate(session)}
                />
              ))
            : Array.from({ length: 4 }).map((_, idx) => (
                <InterviewSessionCardSkeleton key={idx} infoNumbers={4} />
              ))}
        </div>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!sessions?.data?.pagination.prev || isSessionsLoading}
              onClick={() => setPage(page - 1)}
            />
          </PaginationItem>
          {sessions?.data?.pagination.prev && !isSessionsLoading && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
          {sessions?.data?.pagination.next && !isSessionsLoading && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              disabled={!sessions?.data?.pagination.next || isSessionsLoading}
              onClick={() => setPage(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

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
