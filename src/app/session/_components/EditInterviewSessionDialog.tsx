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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const editInterviewSessionFormSchema = z
  .object({
    company: z.string().nonempty(),
    date: z.date(),
  })
  .refine(
    (data) => {
      const startDate = new Date("2022-05-10");
      const endDate = new Date("2022-05-13");
      return data.date >= startDate && data.date <= endDate;
    },
    {
      message:
        "Interview sessions can only be scheduled from May 10th to May 13th, 2022.",
      path: ["date"],
    },
  );
export type EditInterviewSessionFormSchema = z.infer<
  typeof editInterviewSessionFormSchema
>;

interface EditInterviewSessionDialogProps {
  interviewSession: InterviewSession;
  companies?: Array<Company>;
  isOpen: boolean;
  isPending: boolean;
  isLoading: boolean;
  onUpdate: (data: { _id: string } & EditInterviewSessionFormSchema) => void;
  onClose: () => void;
}

export function EditInterviewSessionDialog({
  interviewSession,
  companies,
  isOpen,
  isPending,
  isLoading,
  onUpdate,
  onClose,
}: EditInterviewSessionDialogProps) {
  const form = useForm<z.infer<typeof editInterviewSessionFormSchema>>({
    resolver: zodResolver(editInterviewSessionFormSchema),
    defaultValues: {
      company: interviewSession.company.id,
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
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Company</FormLabel>
                    <FormControl>
                      <div className="col-span-3">
                        {isLoading ? (
                          <Input
                            value={interviewSession.company.name}
                            disabled
                            className="w-full"
                          />
                        ) : (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a company" />
                            </SelectTrigger>
                            <SelectContent>
                              {companies?.map((company) => (
                                <SelectItem
                                  key={company.id}
                                  value={company.id.toString()}
                                >
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">User</FormLabel>
                    <FormControl className="col-span-3">
                      <Input value={interviewSession.user.name} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
