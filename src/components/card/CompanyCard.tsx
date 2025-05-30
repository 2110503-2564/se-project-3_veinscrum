"use client";

import { InterviewSessionCardInfo } from "@/components/card/InterviewSessionCardInfo";
import { Button } from "@/components/ui/shadcn/button";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { cn } from "@/lib/utils";
import { Globe, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import removeMd from "remove-markdown";

interface CompanyCardProps {
  company: Company;
  className?: string;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  className,
}) => (
  <div
    className={cn(
      "flex h-68 w-64 flex-col justify-between rounded-lg bg-white p-4 pb-6 shadow-md",
      className,
    )}
  >
    <div className="space-y-1">
      <h2 className="text-xl font-bold">{company.name}</h2>
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
      <Button asChild className="mt-4 w-full">
        <Link href={FrontendRoutes.COMPANY_PROFILE({ companyId: company._id })}>
          View Company
        </Link>
      </Button>
    </div>
  </div>
);
