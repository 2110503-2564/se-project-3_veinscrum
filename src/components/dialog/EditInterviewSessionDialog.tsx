import { Button } from "@/components/ui/shadcn/button";
import { DateTimePicker24h } from "@/components/ui/shadcn/custom/datetime-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/shadcn/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const editInterviewSessionFormSchema = z.object({
  date: z.date(),
});

export type EditInterviewSessionFormSchema = z.infer<
  typeof editInterviewSessionFormSchema
>;

interface EditInterviewSessionDialogProps {
  interviewSession: InterviewSession;
  isOpen: boolean;
  isPending: boolean;
  onUpdate: (data: { _id: string } & EditInterviewSessionFormSchema) => void;
  onClose: () => void;
}

export function EditInterviewSessionDialog({
  interviewSession,
  isOpen,
  isPending,
  onUpdate,
  onClose,
}: EditInterviewSessionDialogProps) {
  const form = useForm<z.infer<typeof editInterviewSessionFormSchema>>({
    resolver: zodResolver(editInterviewSessionFormSchema),
    defaultValues: {
      date: new Date(interviewSession.date),
    },
  });

  return (
    <Form {...form}>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <form
            onSubmit={form.handleSubmit((data) => {
              onUpdate({ _id: interviewSession._id, ...data });
            })}
          >
            <DialogHeader>
              <DialogTitle>Edit Session</DialogTitle>
              <DialogDescription>
                Update the company information and session date
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">Company</FormLabel>
                <FormControl>
                  <div className="col-span-3">
                    <Input
                      value={interviewSession.jobListing.company.name}
                      disabled
                      className="w-full"
                    />
                  </div>
                </FormControl>
              </FormItem>

              <FormItem className="grid grid-cols-4 items-center gap-4">
                <FormLabel className="text-right">User</FormLabel>
                <FormControl className="col-span-3">
                  <Input
                    value={interviewSession.user.name}
                    disabled
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Date</FormLabel>
                      <FormControl className="col-span-3">
                        <DateTimePicker24h
                          value={field.value}
                          onChange={field.onChange}
                          format="d MMM yyyy HH:mm"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
