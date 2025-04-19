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
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const createCompanySchema = z.object({
  name: z.string().nonempty("Company Name is required"),
  logo: z.string().optional(),
  address: z.string().nonempty("Address is required"),
  website: z.string().nonempty("Website is required"),
  description: z.string().nonempty("Description is required"),
  tel: z.string().nonempty("Telephone number is required"),
});

export default function CreateCompanyPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof createCompanySchema>>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      logo: "",
      address: "",
      website: "",
      description: "",
      tel: "",
    },
  });

  const { mutate: createCompany } = useMutation({
    mutationFn: async (data: z.infer<typeof createCompanySchema>) => {
      return await axios.post(BackendRoutes.COMPANIES, data);
    },
    onMutate: () =>
      toast.loading("Creating Company", {
        id: "create-company",
        description: "",
      }),
    onSuccess: () => {
      toast.success("Company Created Successfully", {
        id: "create-company",
        description: "",
      });
      router.push(FrontendRoutes.ADMIN_COMPANY);
    },
    onError: (error) => {
      toast.error("Failed to create company", {
        id: "create-company",
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
          onSubmit={form.handleSubmit((data) => {
            //console.log("Submitted values:", data);
            createCompany(data);
          })}
        >
          <h1 className="text-center text-3xl font-bold">Create Company</h1>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo</FormLabel>
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row justify-between gap-4">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="tel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
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
