import { InterviewSessionCardInfo } from "@/components/card/InterviewSessionCardInfo";
import { Button } from "@/components/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { cn } from "@/lib/utils";
import { EllipsisIcon, Globe, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import removeMd from "remove-markdown";

interface AdminCompanyCardProps {
  company: Company;
  className?: string;
  onDelete: () => void;
  onUpdate: () => void;
}

export const AdminCompanyCard: React.FC<AdminCompanyCardProps> = ({
  company,
  onDelete,
  onUpdate,
  className,
}) => (
  <div
    className={cn(
      "flex h-68 w-64 flex-col justify-between rounded-lg bg-white p-4 pb-6 shadow-md",
      className,
    )}
  >
    <div className="space-y-1">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">{company.name}</h2>
      </div>
      <p className="line-clamp-3 text-sm break-words text-gray-600">
        {removeMd(company.description)}
      </p>
    </div>
    <div>
      <div className="space-y-1">
        <InterviewSessionCardInfo icon={MapPin} text={company.address} />

        <div>
          <Link href={company.website} className="hover:underline">
            <InterviewSessionCardInfo icon={Globe} text={company.website} />
          </Link>
        </div>

        <InterviewSessionCardInfo icon={Phone} text={company.tel} />
      </div>
      <div className="mt-4 flex items-center gap-1">
        <Button className="grow" asChild>
          <Link
            href={FrontendRoutes.COMPANY_PROFILE({ companyId: company._id })}
          >
            View Company
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              data-testid="company-profile-dropdown-menu-trigger"
              size="icon"
            >
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onUpdate()}>
              Edit Company Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => onDelete()}
            >
              Delete Company
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
);
