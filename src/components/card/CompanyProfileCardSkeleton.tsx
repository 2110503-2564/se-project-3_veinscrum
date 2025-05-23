import { Skeleton } from "../ui/shadcn/skeleton";

interface CompanyProfileCardSkeleton {
  className?: string;
}

export const CompanyProfileCardSkeleton: React.FC<
  CompanyProfileCardSkeleton
> = () => {
  return (
    <div className="space-y-8 gap-x-8 md:grid md:grid-cols-3">
      <div className="flex w-full items-start justify-center">
        <Skeleton className="h-48 w-48 rounded-md" />
      </div>

      <div className="col-span-2 w-full space-y-4">
        <div className="space-y-2 rounded-lg bg-gray-100 p-4 text-sm">
          <div className="flex items-center gap-x-3">
            <Skeleton className="h-5 w-5 rounded-md bg-gray-200" />
            <Skeleton className="h-5 w-full rounded-md bg-gray-200" />
          </div>
          <div className="flex items-center gap-x-3">
            <Skeleton className="h-5 w-5 rounded-md bg-gray-200" />
            <Skeleton className="h-5 w-full rounded-md bg-gray-200" />
          </div>
          <div className="flex items-center gap-x-3">
            <Skeleton className="h-5 w-5 rounded-md bg-gray-200" />
            <Skeleton className="h-5 w-full rounded-md bg-gray-200" />
          </div>
          <div className="flex items-center gap-x-3">
            <Skeleton className="h-5 w-5 rounded-md bg-gray-200" />
            <Skeleton className="h-5 w-full rounded-md bg-gray-200" />
          </div>
        </div>

        <Skeleton className="h-15 w-full rounded-md" />
      </div>
    </div>
  );
};
