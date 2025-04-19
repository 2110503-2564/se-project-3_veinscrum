"use client";

import { InterviewSessionCardInfo } from "@/components/card/InterviewSessionCardInfo";
import { Button } from "@/components/ui/shadcn/button";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { cn } from "@/lib/utils";
import { Globe, MapPin, Phone } from "lucide-react";
import Link from "next/link";

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
      <div>
        <Link href={`/company/${company.id}`}
          className="text-xl font-bold transition-all duration-300 hover:text-blue-600 hover:underline">{company.name}
        </Link>

        <p className="text-sm text-gray-600">{company.description}</p>
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
