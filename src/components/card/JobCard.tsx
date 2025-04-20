import { Card, CardContent } from "@/components/ui/shadcn/card";
import { FrontendRoutes } from "@/constants/routes/Frontend";
import { Building2, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/shadcn/button";

interface JobCardProps {
  jobListing: JobListing;
  company: Company;
}

export function JobCard({ jobListing, company }: JobCardProps) {
  return (
    <Card
      className="w-full rounded-lg bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
      data-testid="job-card"
    >
      <CardContent className="flex flex-col gap-3 p-0">
        <div className="space-y-3">
          <div>
            <h3
              className="text-base font-semibold text-gray-900"
              data-testid="job-title"
            >
              {jobListing.jobTitle}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-gray-600">
              <Building2 className="h-3.5 w-3.5" />
              <span className="text-xs" data-testid="company-name">
                {company.name}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 rounded-md bg-gray-50 p-2 text-xs">
            {company.address && (
              <p className="flex items-center gap-x-2">
                <MapPin className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-gray-600" data-testid="company-address">
                  {company.address}
                </span>
              </p>
            )}
            {jobListing.tel && (
              <p className="flex items-center gap-x-2">
                <Phone className="h-3.5 w-3.5 text-gray-600" />
                <span className="text-gray-600" data-testid="company-tel">
                  {jobListing.tel}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href={FrontendRoutes.JOB_LISTINGS_ID({ jobId: jobListing._id })}
          >
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
