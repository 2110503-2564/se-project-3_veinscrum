import { InterviewSessionWithFlag } from "@/app/session/@company/page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/shadcn/accordion";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { cn } from "@/lib/utils";
import { CalendarIcon, EllipsisIcon, MailIcon, PhoneIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { FlagButton } from "../input/FlagButton";
import { Button } from "../ui/CustomButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/shadcn/dropdown-menu";
import { InterviewSessionCardInfo } from "./InterviewSessionCardInfo";

interface FlagUserCardProps {
  interviewSessions: Array<InterviewSessionWithFlag>;
  isToggleStartPending: boolean;
  toggleStar: (data: { user: string; jobListing: string }, flag?: Flag) => void;
}

export const FlagUserCard: React.FC<FlagUserCardProps> = ({
  interviewSessions,
  isToggleStartPending,
  toggleStar,
}) => {
  const router = useRouter();
  const jobListing = interviewSessions[0].jobListing;

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
          <div className="space-y-4">
            {interviewSessions.map((interviewSession, idx) => {
              return (
                <div
                  key={idx}
                  className="border-input flex w-full justify-between rounded-sm border-1 p-4 shadow-sm"
                >
                  <div className="w-full space-y-2">
                    <div className="flex w-full items-center gap-1">
                      <FlagButton
                        starred={!!interviewSession.flag}
                        disabled={isToggleStartPending}
                        setStarred={() =>
                          toggleStar(
                            {
                              user: interviewSession.user._id,
                              jobListing: jobListing._id,
                            },
                            interviewSession.flag,
                          )
                        }
                      />
                      <div className="flex w-full items-center justify-between">
                        <h1
                          className={cn(
                            "text-md font-bold",
                            interviewSession.flag && "text-yellow-600",
                          )}
                        >
                          {interviewSession.user.name}
                        </h1>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              disabled={isToggleStartPending}
                              variant="ghost"
                              className="h-fit rounded-full p-1"
                            >
                              <EllipsisIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem
                              onSelect={() =>
                                router.push(
                                  FrontendRoutes.CHAT_SESSION({
                                    sessionId: interviewSession._id,
                                  }),
                                )
                              }
                              className="text-sm"
                            >
                              Chat
                            </DropdownMenuItem>
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
