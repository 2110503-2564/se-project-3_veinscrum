"use client";

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
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
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
  const { status } = useSession();
  const router = useRouter();
  const { jobId } = useParams<{ jobId: string }>();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof createSessionFormSchema>>({
    resolver: zodResolver(createSessionFormSchema),
  });

  const {
    data: job,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [BackendRoutes.JOB_LISTINGS_ID({ id: jobId })],
    queryFn: async () =>
      await axios.get(BackendRoutes.JOB_LISTINGS_ID({ id: jobId })),
    enabled: !!jobId,
    select: (data) => data?.data?.data,
  });

  const { mutate: createInterviewSession } = useMutation({
    mutationFn: async (data: z.infer<typeof createSessionFormSchema>) =>
      await axios.post<POSTSessionResponse, POSTSessionRequest>(
        BackendRoutes.SESSIONS,
        {
          jobListing: jobId,
          companyId: job?.companyId,
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading job details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">
          Error loading job details:{" "}
          {(error as Error)?.message || "Unknown error"}
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
    <div className="mx-auto mt-16 max-w-3xl space-y-6 rounded-xl bg-white px-16 py-10 shadow-md">
      <h1 className="text-2xl font-semibold" data-testid="job-title">
        {job.jobTitle}
      </h1>

      <div className="flex flex-col items-start gap-8 md:flex-row">
        <Image
          data-testid="job-image"
          src={job.image || "/placeholder.png"}
          alt={job.jobTitle}
          className="size-36 rounded-md object-cover"
          width={144}
          height={144}
        />

        <div className="w-full space-y-4 md:w-2/3">
          <p
            className="pr-8 text-justify text-gray-600"
            data-testid="job-description"
          >
            {job.description}
          </p>
        </div>
      </div>
      {status === "authenticated" && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                  setIsOpen(false);
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
                <Button type="submit" className="w-full">
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
