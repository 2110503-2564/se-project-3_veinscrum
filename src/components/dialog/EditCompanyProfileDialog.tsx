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
import { Textarea } from "@/components/ui/shadcn/textarea";
import { useState } from "react";

export interface EditCompanyProfileFormSchema {
  name: string;
  address: string;
  website: string;
  tel: string;
  description: string;
}

interface EditCompanyProfileDialogProps {
  company: {
    _id: string;
    name: string;
    address: string;
    website: string;
    description: string;
    tel: string;
  };
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onUpdate: (data: EditCompanyProfileFormSchema) => void;
}

export function EditCompanyProfileDialog({
  company,
  isOpen,
  isPending,
  onClose,
  onUpdate,
}: EditCompanyProfileDialogProps) {
  const [formData, setFormData] = useState<EditCompanyProfileFormSchema>({
    name: company.name,
    address: company.address,
    website: company.website,
    tel: company.tel,
    description: company.description,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Company Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Address
            </label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter company address"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="website" className="text-sm font-medium">
              Website
            </label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter company website"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tel" className="text-sm font-medium">
              Telephone
            </label>
            <Input
              id="tel"
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              placeholder="Enter telephone number"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter company description"
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
