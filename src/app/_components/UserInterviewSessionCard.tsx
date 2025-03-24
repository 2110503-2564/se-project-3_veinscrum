import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/shadcn/dropdown-menu";
import { CalendarIcon, PhoneIcon } from "lucide-react";
import { InterviewSessionCardInfo } from "./InterviewSessionCardInfo";
import { InterviewSessionCardWithDropdown } from "./InterviewSessionCardWithDropdown";

interface UserInterviewSessionCardProps {
  interviewSession: InterviewSession;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const UserInterviewSessionCard: React.FC<
  UserInterviewSessionCardProps
> = ({ interviewSession, onEdit, onDelete }) => {
  const dropdownContent = (
    <DropdownMenuContent>
      <DropdownMenuLabel>Interview Session</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled={!onEdit} onClick={onEdit}>
        Edit Session
      </DropdownMenuItem>
      <DropdownMenuItem disabled={!onDelete} onClick={onDelete}>
        Delete Session
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <InterviewSessionCardWithDropdown
      title={interviewSession.company.name}
      description={interviewSession.company.description}
      dropdownContent={dropdownContent}
    >
      <InterviewSessionCardInfo
        icon={PhoneIcon}
        text={interviewSession.company.tel}
      />
      <InterviewSessionCardInfo
        icon={CalendarIcon}
        text={interviewSession.date.toLocaleString()}
      />
    </InterviewSessionCardWithDropdown>
  );
};
