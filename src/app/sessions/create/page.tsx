"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createCompanySchema = z.object({
  companyName: z.string().nonempty("Company Name is required"),
  address: z.string().nonempty("Address is required"),
  website: z.string().nonempty("Website is required"),
  description: z.string().nonempty("Description is required"),
  tel: z.string().nonempty("Telephone number is required"),
});

export default function CreateCompanyPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createCompanySchema),
    defaultValues: { companyName: "", address: "", website: "", description: "", tel: "" },
  });

  interface FormData {
    companyName: string;
    address: string;
    website: string;
    description: string;
    tel: string;
  }

  const onSubmit = (data: FormData): void => {
    toast.success("Company Created Successfully");
    router.push("/");
  };

  return (
    <Form {...form}>
      <main className="mx-auto mt-16 max-w-sm space-y-6 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-center text-3xl font-bold">Create Company</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {Object.keys(createCompanySchema.shape).map((key) => (
            <FormField key={key} name={key as keyof typeof createCompanySchema.shape} control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>{key.replace(/([A-Z])/g, ' $1').trim()}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          ))}
          <Button type="submit" className="w-full">Create</Button>
        </form>
      </main>
    </Form>
  );
}