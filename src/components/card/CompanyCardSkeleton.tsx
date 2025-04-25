import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/shadcn/skeleton";

interface SkeletonCompanyCardProps {
  className?: string;
}

export const CompanyCardSkeleton: React.FC<SkeletonCompanyCardProps> = ({
  className,
}) => (
  <div
    className={cn(
      "flex h-68 w-64 flex-col justify-between rounded-lg bg-white p-4 pb-6 shadow-md",
      className,
    )}
  >
    <div className="space-y-2">
      <Skeleton className="h-7 w-full rounded-lg" />
      <Skeleton className="h-14 w-full" />
    </div>

    <div>
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
    </div>
  </div>
);
