import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Button } from "../ui/shadcn/button";
import { Skeleton } from "../ui/shadcn/skeleton";

interface JobCardProps {
  buttonNumbers?: number;
}

export function JobCardProfileSkeleton({ buttonNumbers = 1 }: JobCardProps) {
  return (
    <>
      <Card
        className="w-full rounded-lg bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
        data-testid="job-card"
      >
        <CardContent className="w-full space-y-3.5 p-0">
          <div className="space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-6 w-64" />
              <div className="mt-1 flex items-center gap-1.5 text-gray-600">
                <Skeleton className="h-3.5 w-3.5" />
                <Skeleton className="h-3.5 w-12" />
              </div>
            </div>

            <div className="space-y-1.5 rounded-md bg-gray-50 p-2 text-xs">
              <div className="flex items-center gap-x-2">
                <Skeleton className="h-3.5 w-3.5 bg-gray-200" />
                <Skeleton className="h-3.5 w-24 bg-gray-200" />
              </div>
              <div className="flex items-center gap-x-2">
                <Skeleton className="h-3.5 w-3.5 bg-gray-200" />
                <Skeleton className="h-3.5 w-24 bg-gray-200" />
              </div>
            </div>
          </div>

          <div className="flex w-full justify-end gap-4">
            {Array.from({ length: buttonNumbers }).map((_, idx) => (
              <Button key={idx} variant="default" size="sm" asChild>
                <Skeleton className="w-28 bg-gray-300" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
