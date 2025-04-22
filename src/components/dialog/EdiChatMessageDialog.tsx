import { Button } from "@/components/ui/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { Input } from "@/components/ui/shadcn/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem } from "../ui/shadcn/form";

export const editChatMessageFormSchema = z.object({
  content: z.string().nonempty("Content is required"),
});

interface EditChatMessageDialogProps {
  message: Message;
  isPending: boolean;
  onUpdate: (data: z.infer<typeof editChatMessageFormSchema>) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const EditChatMessageDialog: React.FC<EditChatMessageDialogProps> = ({
  message,
  isPending,
  onUpdate,
  isOpen,
  setIsOpen,
}) => {
  const form = useForm<z.infer<typeof editChatMessageFormSchema>>({
    resolver: zodResolver(editChatMessageFormSchema),
    defaultValues: {
      content: message.content,
    },
  });

  return (
    <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((e) => onUpdate(e))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Input placeholder="Enter message" {...field} />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
