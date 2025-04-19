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
  variant?: "default" | "viewonly";
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  variant = "default",
}) => {
  return (
    <div
      className={cn(
        "flex h-68 w-64 flex-col justify-between rounded-lg bg-white p-4 pb-6 shadow-md",
        { "h-52": variant === "viewonly" },
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
          <InterviewSessionCardInfo icon={Globe} text={company.website} />
          <InterviewSessionCardInfo icon={Phone} text={company.tel} />
        </div>
        {variant === "default" && (
          <Button asChild className="mt-4 w-full">
            <Link href={FrontendRoutes.SESSION_CREATE_ID({ id: company.id })}>
              Book
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
