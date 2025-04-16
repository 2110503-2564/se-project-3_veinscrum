"use client";

import { InterviewSessionCardInfo } from "@/app/_components/InterviewSessionCardInfo";
import { Button } from "@/components/ui/shadcn/button";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { Globe, MapPin, Phone } from "lucide-react";
import Link from "next/link";

interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="flex h-68 w-64 flex-col justify-between rounded-lg bg-white p-4 pb-6 shadow-md">
      <div>
        <h2 className="text-xl font-bold">{company.name}</h2>
        <p className="text-sm text-gray-600">{company.description}</p>
      </div>
      <div>
        <div className="space-y-1">
          <InterviewSessionCardInfo icon={MapPin} text={company.address} />
          <InterviewSessionCardInfo icon={Globe} text={company.website} />
          <InterviewSessionCardInfo icon={Phone} text={company.tel} />
        </div>
        <Button asChild className="mt-4 w-full">
          <Link href={FrontendRoutes.SESSION_CREATE_ID({ id: company.id })}>
            Book
          </Link>
        </Button>

        {/* TEST ONLY */}
        <Button asChild className="mt-4 w-full" variant="outline">
          <Link href={`/company/profile/${company.id}`}>
            TEST View Company Profile
          </Link>
        </Button>
        
      </div>
    </div>
  );
};
