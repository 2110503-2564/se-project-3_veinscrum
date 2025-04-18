import { Building2, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/CustomButton";
import { Card, CardContent } from "../ui/CustomCard";

interface JobCardProps {
  id: string;
  jobTitle: string;
  companyName: string;
  location?: string;
  tel?: string;
}

export function JobCard({
  id,
  jobTitle,
  companyName,
  location,
  tel,
}: JobCardProps) {
  return (
    <Card className="w-full rounded-lg bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
      <CardContent className="flex flex-col gap-3 p-0">
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {jobTitle}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-gray-600">
              <Building2 className="h-3.5 w-3.5" />
              <span className="text-xs">{companyName}</span>
            </div>
          </div>

          <div className="space-y-1.5 rounded-md bg-gray-50 p-2 text-xs">
            {location && (
              <p className="flex items-center gap-x-2">
                <MapPin className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-gray-600">{location}</span>
              </p>
            )}
            {tel && (
              <p className="flex items-center gap-x-2">
                <Phone className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-gray-600">{tel}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Link href={`/jobs/${id}`}>
            <Button
              variant="default"
              size="sm"
              className="bg-black text-white transition-colors hover:bg-gray-800"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
