import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/shadcn/dropdown-menu";
import { Building2, CalendarIcon, PhoneIcon } from "lucide-react";
import { Button } from "../ui/shadcn/button";
import { InterviewSessionCardInfo } from "./InterviewSessionCardInfo";
import { InterviewSessionCardWithDropdown } from "./InterviewSessionCardWithDropdown";

interface UserInterviewSessionCardProps {
  interviewSession: InterviewSession;
  onEdit?: () => void;
  onDelete?: () => void;
  onChat?: () => void;
}

export const UserInterviewSessionCard: React.FC<
  UserInterviewSessionCardProps
> = ({ interviewSession, onEdit, onDelete, onChat }) => {
  const dropdownContent = (
    <DropdownMenuContent>
      <DropdownMenuLabel>Interview Session</DropdownMenuLabel>
      <DropdownMenuItem variant="default" disabled={!onChat} onClick={onChat}>
        Chat
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled={!onChat} onClick={onChat}>
        Chat
      </DropdownMenuItem>
      <DropdownMenuItem disabled={!onEdit} onClick={onEdit}>
        Edit Session
      </DropdownMenuItem>
      <DropdownMenuItem
        variant="destructive"
        disabled={!onDelete}
        onClick={onDelete}
      >
        Delete Session
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <InterviewSessionCardWithDropdown
      title={interviewSession.jobListing.jobTitle}
      description={interviewSession.jobListing.company.description}
      dropdownContent={dropdownContent}
      topRightElement={
        <div className="flex justify-end gap-2">
          <Button
            data-testid="user-interview-session-card-chat-button"
            className="bg-black text-white hover:bg-zinc-800 hover:text-white"
            variant="outline"
            size="sm"
            onClick={onChat}
          >
            Start chat
          </Button>
        </div>
      }
    >
      <InterviewSessionCardInfo
        icon={Building2}
        text={interviewSession.jobListing.company.name}
      />
      <InterviewSessionCardInfo
        icon={PhoneIcon}
        text={interviewSession.jobListing.company.tel}
      />
      <InterviewSessionCardInfo
        icon={CalendarIcon}
        text={new Date(interviewSession.date).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
    </InterviewSessionCardWithDropdown>
  );
};
