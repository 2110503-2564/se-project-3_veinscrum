"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/shadcn/alert-dialog";
import { buttonVariants } from "@/components/ui/shadcn/button";

interface DeleteCompanyDialogProps {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteCompanyProfileDialog({
  isOpen,
  isPending,
  onClose,
  onDelete,
}: DeleteCompanyDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            company profile.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            data-testid="company-profile-delete-profile-button"
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => onDelete()}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
