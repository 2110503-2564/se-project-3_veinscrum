"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { Input } from "@/components/ui/shadcn/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TextEditor } from "../input/TextEditor";
import { Form, FormField, FormItem, FormLabel } from "../ui/shadcn/form";

export const editCompanyProfileFormSchema = z.object({
  name: z.string().nonempty("Company name is required"),
  address: z.string().nonempty("Address is required"),
  website: z
    .string()
    .url("Invalid website URL")
    .nonempty("Website is required"),
  tel: z.string().nonempty("Telephone is required"),
  description: z.string().nonempty("Description is required"),
});

interface EditCompanyProfileDialogProps {
  company: Company;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onUpdate: (data: z.infer<typeof editCompanyProfileFormSchema>) => void;
}

export function EditCompanyProfileDialog({
  company,
  isOpen,
  isPending,
  onClose,
  onUpdate,
}: EditCompanyProfileDialogProps) {
  const form = useForm<z.infer<typeof editCompanyProfileFormSchema>>({
    resolver: zodResolver(editCompanyProfileFormSchema),
    defaultValues: {
      name: company.name,
      address: company.address,
      website: company.website,
      tel: company.tel,
      description: company.description,
    },
  });

  useEffect(() => {
    form.reset(company);
  }, [company, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Company Profile</DialogTitle>
          <DialogDescription>
            Make changes to your company profile here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((e) => onUpdate(e))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="name" className="text-sm font-medium">
                    Company Name
                  </FormLabel>
                  <Input placeholder="Enter company name" {...field} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="address" className="text-sm font-medium">
                    Address
                  </FormLabel>
                  <Input placeholder="Enter company address" {...field} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="website" className="text-sm font-medium">
                    Website
                  </FormLabel>
                  <Input placeholder="Enter company website" {...field} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tel"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="tel" className="text-sm font-medium">
                    Telephone
                  </FormLabel>
                  <Input placeholder="Enter telephone number" {...field} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel
                    htmlFor="description"
                    className="text-sm font-medium"
                  >
                    Description
                  </FormLabel>
                  <TextEditor
                    markdown={field.value}
                    onChange={field.onChange}
                  />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
