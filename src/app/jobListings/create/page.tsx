"use client";

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
import { InputImage } from "@/components/ui/shadcn/custom/image-upload";
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
  company: z.string().nonempty(),
  image: z.string(),
  jobTitle: z.string().nonempty("Job Title is required"),
  description: z.string().nonempty("Description is required"),
});

export default function CreateCompanyPage() {
  const { status } = useSession();
  const router = useRouter();

  const {data: me, isLoading: isMeLoading, isError: isMeError} = useQuery({
        queryKey: [BackendRoutes.AUTH_ME],
        queryFn: async () => {
          const result = await axios.get<GETMeResponse>(BackendRoutes.AUTH_ME);

        form.reset({
          company: result.data.data.company,
          image: "",
          jobTitle: "",
          description: "",
        });
          return result;
        },
        enabled: status == "authenticated",
        select: (data) => data.data.data,
      },
  );

  const companyId = me?.company ?? "";


  const form = useForm<z.infer<typeof createJobSchema>>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      company: companyId,
      image: "",
      jobTitle: "",
      description: "",
    },
  });

  const { mutate: createJob } = useMutation({
    mutationFn: async (data: z.infer<typeof createJobSchema>) => {
    //not sure route is correct 
      return await axios.post(BackendRoutes.JOB_LISTINGS, data);
    },
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
      router.push(FrontendRoutes.COMPANY_PROFILE({ id: companyId }));
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
          onSubmit={form.handleSubmit((data) => {console.log(data); createJob(data)})}
        >
          <h1 className="text-center text-3xl font-bold">Create Job</h1>
          <FormField 
            control={form.control}
            name="company"
            render={() => (<></>)}/>
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
                    <InputImage onChange={field.onChange}/>
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
          <Button type="submit"  className="w-full" size="lg" onClick={() => console.log(companyId, form.getValues())}>
            Create
          </Button>
        </form>
      </main>
    </Form>
  );
}
