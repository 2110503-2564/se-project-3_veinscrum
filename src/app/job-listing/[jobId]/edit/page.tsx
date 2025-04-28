"use client";

import { ImageUploadInput } from "@/components/input/ImageUpload";
import { TextEditor } from "@/components/input/TextEditor";
import { Button } from "@/components/ui/shadcn/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { BackendRoutes } from "@/constants/routes/Backend";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { axios } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editJobSchema = z.object({
  image: z.string().optional(),
  jobTitle: z.string().nonempty("Job Title is required"),
  description: z.string().nonempty("Description is required"),
});

export default function EditJobPage() {
  const params = useParams<{ jobId: string }>();
  const { status } = useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof editJobSchema>>({
    resolver: zodResolver(editJobSchema),
  });

  const {
    data: job,
    isLoading: jobLoading,
    isError: jobError,
  } = useQuery({
    queryKey: [BackendRoutes.JOB_LISTINGS_ID({ id: params.jobId })],
    queryFn: async () => {
      const result = await axios.get<GETJobListingResponse>(
        BackendRoutes.JOB_LISTINGS_ID({ id: params.jobId }),
      );

      form.reset({
        image: result.data.data.image,
        jobTitle: result.data.data.jobTitle,
        description: result.data.data.description,
      });

      return result;
    },
    enabled: status == "authenticated",
    select: (data) => data.data.data,
  });

  const { mutate: editJob } = useMutation({
    mutationFn: async (data: z.infer<typeof editJobSchema>) =>
      axios.put(BackendRoutes.JOB_LISTINGS_ID({ id: params.jobId }), {
        ...data,
        company: job?.company,
      }),
    onMutate: () =>
      toast.loading("Editing Job", {
        id: "edit-job",
        description: "",
      }),
    onSuccess: () => {
      toast.success("Job Edited Successfully", {
        id: "edit-job",
        description: "",
      });
      router.push(
        FrontendRoutes.COMPANY_PROFILE({
          companyId: job?.company.id ?? "",
        }),
      );
    },
    onError: (error) => {
      toast.error("Failed to edit Job", {
        id: "edit-job",
        description: isAxiosError(error)
          ? error.response?.data.error
          : "Something went wrong",
      });
    },
  });

  if (jobLoading) return <div>Loading...</div>;
  if (jobError) return <div>Error loading job</div>;

  return (
    <Form {...form}>
      <main className="mx-auto mt-16">
        <form
          className="mx-auto max-w-2xl space-y-6 rounded-xl bg-white px-4 py-8 drop-shadow-md"
          onSubmit={form.handleSubmit((e) => editJob(e))}
        >
          <h1 className="text-center text-3xl font-bold">Edit Job</h1>
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input
                    data-testid="job-listing-edit-job-title-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage data-testid="job-listing-edit-job-title-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Image</FormLabel>
                <FormControl>
                  <ImageUploadInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <TextEditor {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            data-testid="job-listing-edit-submit-button"
            type="submit"
            className="w-full"
            size="lg"
          >
            Update
          </Button>
        </form>
      </main>
    </Form>
  );
}
