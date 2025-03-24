"use client";

import { InterviewSessionCardInfo } from "@/app/_components/InterviewSessionCardInfo";
import { Button } from "@/components/ui/shadcn/button";
import { Globe, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

interface CompanyProps {
  company: {
    name: string;
    address: string;
    website: string;
    description: string;
    tel: string;
  };
  onExplore?: () => void;
}

export default function CompanyBox({ company }: CompanyProps) {
  const router = useRouter();

  return (
    <div className="flex h-64 w-64 flex-col justify-between rounded-lg bg-white p-4 pb-6 shadow-md">
      <div>
        <h2 className="text-xl font-bold">{company.name}</h2>
        <p className="text-sm text-gray-600">{company.description}</p>
      </div>
      <div>
        <div className="flex flex-col gap-1">
          <InterviewSessionCardInfo icon={MapPin} text={company.address} />
          <InterviewSessionCardInfo icon={Globe} text={company.website} />
          <InterviewSessionCardInfo icon={Phone} text={company.tel} />
        </div>
        <Button
          className="mt-4 w-full"
          onClick={() => router.push("/session/create")} // add param (comapnyId) if exists
        >
          Book
        </Button>
      </div>
    </div>
  );
}
