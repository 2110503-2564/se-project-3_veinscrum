import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion";
import { BackendRoutes } from "@/constants/routes/Backend";
import { axios } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, EllipsisIcon, MailIcon, PhoneIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { FlagButton } from "../input/FlagButton";
import { Button } from "../ui/CustomButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/shadcn/dropdown-menu";
import { InterviewSessionCardInfo } from "./InterviewSessionCardInfo";
import { useRouter } from "next/navigation";
import { FrontendRoutes } from "@/constants/routes/Frontend";

interface FlagUserCardProps {
  interviewSessions: Array<InterviewSession>;
}

export const FlagUserCard: React.FC<FlagUserCardProps> = ({
  interviewSessions,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const jobListing = interviewSessions[0].jobListing;

  // Fetch flags for this job listing
  const { data: flags } = useQuery({
    queryKey: [BackendRoutes.FLAGS, jobListing._id],
    queryFn: async () => {
      const response = await axios.get<GETFlagsByJobListingResponse>(
        BackendRoutes.JOB_LISTINGS_ID_FLAGS({ id: jobListing._id }),
      );

      console.log("Fetched flags:", {
        jobListing: jobListing._id,
        flags: response.data.data,
      });

      return response.data.data;
    },
  });

  const { mutate: unflagUser, isPending: isUnflagging } = useMutation({
    mutationFn: async (userId: string) => {
      // Find the flag ID for this user and job listing
      const flag = flags?.find((f) => {
        const userMatch = String(f.user) === String(userId);
        const jobMatch = String(f.jobListing) === String(jobListing._id);
        return userMatch && jobMatch;
      });

      console.log("Found flag:", flag);

      if (!flag) {
        throw new Error("Flag not found");
      }
      await axios.delete(BackendRoutes.FLAGS_ID({ id: flag._id }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [BackendRoutes.COMPANIES_ID_SESSIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [BackendRoutes.FLAGS],
      });
      toast.success("User unflagged successfully");
    },
    onError: (error) => {
      console.error("Failed to unflag user:", error);
      toast.error("Failed to unflag user. Please try again.");
    },
  });

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value={jobListing.jobTitle}
        className="w-full rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="w-full text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              {jobListing.jobTitle}
            </h3>
          </div>
        </AccordionTrigger>

        <AccordionContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden border-t border-gray-100 px-6 py-4">
          {" "}
          <div className="space-y-4">
            {interviewSessions.map((interviewSession, idx) => {
              const userFlag = flags?.find(
                (f) => String(f.user) === String(interviewSession.user._id),
              );
              const isFlagged = !!userFlag;

              return (
                <div
                  key={idx}
                  className="border-input flex w-full justify-between rounded-sm border-1 p-4 shadow-sm"
                >
                  <div className="w-full space-y-2">
                    <div className="flex w-full items-center gap-1">
                      <FlagButton starred={isFlagged} setStarred={() => {}} />
                      <div className="flex w-full items-center justify-between">
                        <h1
                          className={cn(
                            "text-md font-bold",
                            isFlagged && "text-yellow-600",
                          )}
                        >
                          {interviewSession.user.name}
                        </h1>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              disabled={isUnflagging}
                              variant="ghost"
                              className="h-fit rounded-full p-1"
                            >
                              <EllipsisIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                              onSelect={() =>
                                router.push(FrontendRoutes.CHAT_SESSION({sessionId:interviewSession._id}))
                              }
                              className="text-sm"
                            >
                              Chat
                            </DropdownMenuItem>
                            {isFlagged && (
                              <DropdownMenuItem
                                onSelect={() => {
                                  unflagUser(interviewSession.user._id);
                                }}
                                disabled={isUnflagging}
                                variant="destructive"
                                className="text-sm text-red-600"
                              >
                                {isUnflagging ? "Unflagging..." : "Unflag"}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="ml-2 space-y-1 text-sm text-gray-600">
                      <InterviewSessionCardInfo
                        icon={MailIcon}
                        text={interviewSession.user.email}
                      />
                      <InterviewSessionCardInfo
                        icon={PhoneIcon}
                        text={interviewSession.user.tel}
                      />
                      <InterviewSessionCardInfo
                        icon={CalendarIcon}
                        text={interviewSession.date}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
