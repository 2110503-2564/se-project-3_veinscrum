import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/shadcn/dropdown-menu";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { BuildingIcon, CalendarIcon, PhoneIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { InterviewSessionCardInfo } from "./InterviewSessionCardInfo";
import { InterviewSessionCardWithDropdown } from "./InterviewSessionCardWithDropdown";

interface AdminSessionCardProps {
  interviewSession: InterviewSession;

  onEdit?: () => void;
  onDelete?: () => void;
}

export const AdminSessionCard: React.FC<AdminSessionCardProps> = ({
  interviewSession,
  onEdit,
  onDelete,
}) => {
  const dropdownContent = (
    <DropdownMenuContent>
      <DropdownMenuLabel>Interview Session</DropdownMenuLabel>
      <DropdownMenuSeparator />
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
    >
      <InterviewSessionCardInfo
        icon={UserIcon}
        text={interviewSession.user.name}
      />
      <Link
        href={FrontendRoutes.COMPANY_PROFILE({
          companyId: interviewSession.jobListing.company._id,
        })}
        className="hover:underline"
      >
        <InterviewSessionCardInfo
          icon={BuildingIcon}
          text={interviewSession.jobListing.company.name}
        />
      </Link>
      <InterviewSessionCardInfo
        icon={PhoneIcon}
        text={interviewSession.user.tel}
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
