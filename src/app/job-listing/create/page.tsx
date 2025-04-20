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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createJobSchema = z.object({
  image: z.string().optional(),
  jobTitle: z.string().nonempty("Job Title is required"),
  description: z.string().nonempty("Description is required"),
});

export default function CreateCompanyPage() {
  const { status } = useSession();
  const router = useRouter();

  const { data: me } = useQuery({
    queryKey: [BackendRoutes.AUTH_ME],
    queryFn: async () => await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME),
    enabled: status == "authenticated",
    select: (data) => data.data.data,
    staleTime: 0,
  });

  const form = useForm<z.infer<typeof createJobSchema>>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      image: "",
      jobTitle: "",
      description: "",
    },
  });

  const { mutate: createJob } = useMutation({
    mutationFn: async (data: z.infer<typeof createJobSchema>) =>
      await axios.post(BackendRoutes.JOB_LISTINGS, {
        ...data,
        company: me?.company,
      }),
    onMutate: () =>
      toast.loading("Creating Job", {
        id: "create-job",
        description: "",
      }),
    onSuccess: () => {
      toast.success("Job Created Successfully", {
        id: "create-job",
        description: "",
      });
      router.push(FrontendRoutes.PROFILE);
    },
    onError: (error) => {
      toast.error("Failed to create Job", {
        id: "create-job",
        description: isAxiosError(error)
          ? error.response?.data.error
          : "Something went wrong",
      });
    },
  });

  return (
    <Form {...form}>
      <main className="mx-auto mt-16">
        <form
          className="mx-auto max-w-2xl space-y-6 rounded-xl bg-white px-4 py-8 drop-shadow-md"
          onSubmit={form.handleSubmit((e) => createJob(e))}
        >
          <h1 className="text-center text-3xl font-bold">Create Job</h1>
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
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
                  <TextEditor
                    markdown={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" size="lg">
            Create
          </Button>
        </form>
      </main>
    </Form>
  );
}
