"use client";

import { TextEditor } from "@/components/input/TextEditor";
import { Button } from "@/components/ui/shadcn/button";
import { DateTimePicker24h } from "@/components/ui/shadcn/custom/datetime-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { BackendRoutes } from "@/constants/routes/Backend";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { axios } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueries } from "@tanstack/react-query";
import { AxiosResponse, isAxiosError } from "axios";
import { Building2, MapPin, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createSessionFormSchema = z.object({
  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date",
  }),
});

export default function JobDetailPage() {
  const router = useRouter();
  const { status } = useSession();
  const { jobId } = useParams<{ jobId: string }>();
  const [
    isCreateInterviewSessionDialogOpen,
    setIsCreateInterviewSessionDialogOpen,
  ] = useState(false);

  const form = useForm<z.infer<typeof createSessionFormSchema>>({
    resolver: zodResolver(createSessionFormSchema),
  });

  const [
    { data: me, isLoading: isMeLoading },
    {
      data: job,
      isLoading: isJobLoading,
      isError: isJobError,
      error: jobError,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: [BackendRoutes.AUTH_ME],
        queryFn: async () =>
          await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME),
        enabled: status === "authenticated",
        select: (data: AxiosResponse<GETMeResponse>) => data.data.data,
      },
      {
        queryKey: [BackendRoutes.JOB_LISTINGS_ID({ id: jobId })],
        queryFn: async () =>
          await axios.get<GETJobListingResponse>(
            BackendRoutes.JOB_LISTINGS_ID({ id: jobId }),
          ),
        enabled: !!jobId,
        select: (data: AxiosResponse<GETJobListingResponse>) =>
          data?.data?.data,
      },
    ],
  });

  const {
    mutate: createInterviewSession,
    isPending: isCreateInterviewSessionPending,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof createSessionFormSchema>) =>
      await axios.post<POSTSessionResponse, POSTSessionRequest>(
        BackendRoutes.SESSIONS,
        {
          jobListing: jobId,
          company: job?.company,
          date: data.date,
        },
      ),
    onMutate: () =>
      toast.loading("Creating Session", {
        id: "create-session",
        description: "",
      }),
    onSuccess: () => {
      toast.success("Create Session successfully", {
        id: "create-session",
        description: "",
      });
      router.push(FrontendRoutes.SESSION_LIST);
    },
    onError: (error) => {
      toast.error("Failed to create your session", {
        id: "create-session",
        description: isAxiosError(error)
          ? error.response?.data.message
          : "Something went wrong",
      });
    },
  });
  if (isJobLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading job details...</p>
      </div>
    );
  }

  if (isJobError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">
          Error loading job details:{" "}
          {(jobError as Error)?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Job not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-3xl space-y-6 rounded-xl bg-white px-7 py-10 shadow-md sm:px-16">
      <div className="flex w-full flex-col items-center gap-10 sm:flex-row sm:items-start">
        <Image
          data-testid="job-image"
          src={job.image || "/placeholder.png"}
          alt={job.jobTitle}
          className="size-48 rounded-md object-cover"
          width={288}
          height={288}
        />

        <div className="w-full space-y-3 pt-0 sm:pt-5">
          <div>
            <h3
              className="text-2xl font-bold text-gray-900"
              data-testid="job-title"
            >
              {job.jobTitle}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-gray-600">
              <Building2 className="h-3.5 w-3.5" />
              <span className="text-xs" data-testid="company-name">
                {job.company.name}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 rounded-md bg-gray-50 p-2 text-xs">
            {job.company.address && (
              <p className="flex items-center gap-x-2">
                <MapPin className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-gray-600" data-testid="company-address">
                  {job.company.address}
                </span>
              </p>
            )}
            {job.company.tel && (
              <p className="flex items-center gap-x-2">
                <Phone className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-gray-600" data-testid="company-tel">
                  {job.company.tel}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-8 md:flex-row">
        <div className="w-full space-y-4">
          <TextEditor
            readOnly
            markdown={job.description}
            data-testid="job-description"
          />
        </div>
      </div>

      {status === "authenticated" && !(isMeLoading || me?.role !== "user") && (
        <Dialog
          open={isCreateInterviewSessionDialogOpen}
          onOpenChange={setIsCreateInterviewSessionDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full">Book Interview Session</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book Interview Session</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Please select a date and time for your interview session.
            </DialogDescription>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit((e) => {
                  createInterviewSession(e);
                  setIsCreateInterviewSessionDialogOpen(false);
                })}
              >
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">Date</FormLabel>
                      <DateTimePicker24h
                        value={field.value}
                        onChange={field.onChange}
                        format="d MMM yyyy HH:mm"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isCreateInterviewSessionPending || me?.role !== "user"
                  }
                >
                  Book Interview Session
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
