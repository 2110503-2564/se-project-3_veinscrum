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
import { MDXEditorMethods } from "@mdxeditor/editor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const editJobSchema = z.object({
  image: z.string().optional(),
  jobTitle: z.string().nonempty("Job Title is required"),
  description: z.string().nonempty("Description is required"),
});

export default function EditJobPage() {
  const queryClient = useQueryClient();
  const params = useParams<{ jobId: string }>();
  const { status } = useSession();
  const router = useRouter();
  const textEditorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof editJobSchema>>({
    resolver: zodResolver(editJobSchema),
    defaultValues: {
      image: "",
      jobTitle: "",
      description: "",
    },
  });

  const {
    data: jobListing,
    isLoading: isJobListingLoading,
    isError: isJobListingError,
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

      textEditorRef.current?.setMarkdown(result.data.data.description);

      return result;
    },
    enabled: status == "authenticated",
    select: (data) => data.data.data,
  });

  const { mutate: editJobListing } = useMutation({
    mutationFn: async (data: z.infer<typeof editJobSchema>) =>
      axios.put(BackendRoutes.JOB_LISTINGS_ID({ id: params.jobId }), {
        ...data,
        company: jobListing?.company,
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

      queryClient.invalidateQueries({
        queryKey: [BackendRoutes.JOB_LISTINGS_ID({ id: params.jobId })],
      });

      router.push(
        FrontendRoutes.JOB_LISTINGS_ID({
          jobId: params.jobId,
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

  if (isJobListingError) return <div>Error loading job</div>;

  return (
    <Form {...form}>
      <main className="mx-auto mt-16">
        <form
          className="mx-auto max-w-2xl space-y-6 rounded-xl bg-white px-4 py-8 drop-shadow-md"
          onSubmit={form.handleSubmit((e) => editJobListing(e))}
        >
          <h1 className="text-center text-3xl font-bold">Edit Job</h1>
          <FormField
            control={form.control}
            name="jobTitle"
            disabled={isJobListingLoading || !jobListing}
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
            disabled={isJobListingLoading || !jobListing}
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
            disabled={isJobListingLoading || !jobListing}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <TextEditor
                    value={field.value}
                    onChange={field.onChange}
                    ref={textEditorRef}
                  />
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
            disabled={isJobListingLoading || !jobListing}
          >
            Update
          </Button>
        </form>
      </main>
    </Form>
  );
}
