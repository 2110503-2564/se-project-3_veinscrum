"use client";

import { Button } from "@/components/ui/shadcn/button";
import { InterviewSessionCardInfo } from "@/app/_components/InterviewSessionCardInfo";
import { MapPin, Globe, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

interface CompanyProps {
  company: {
    name: string;
    address: string;
    website: string;
    description: string;
    tel: string;
  },
  onExplore?: () => void;
}

export default function CompanyBox({ company }: CompanyProps) {
  const router = useRouter();

  return (
    <div className="p-4 rounded-lg shadow-md bg-white flex flex-col gap-3">
      <h2 className="text-lg font-bold">{company.name}</h2>
      <p className="text-sm text-gray-600">{company.description}</p>

      <InterviewSessionCardInfo icon={MapPin} text={company.address} />
      <InterviewSessionCardInfo icon={Globe} text={company.website} />
      <InterviewSessionCardInfo icon={Phone} text={company.tel} />

      <Button
        className="mt-4 w-full"
        onClick={() => router.push("/session/create")}
      >
        Explore
      </Button>
    </div>
  );
}
