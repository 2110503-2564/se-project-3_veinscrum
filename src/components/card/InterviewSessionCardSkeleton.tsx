import { Skeleton } from "../ui/shadcn/skeleton";

interface InterviewSessionCardSkeletonProps {
  infoNumbers?: number;
}

export const InterviewSessionCardSkeleton: React.FC<
  InterviewSessionCardSkeletonProps
> = ({ infoNumbers = 3 }) => {
  return (
    <div className="border-input flex w-full justify-between rounded-sm border-1 p-4">
      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="flex flex-col gap-1">
          {Array.from({ length: infoNumbers }).map((_, idx) => (
            <span key={idx} className="flex gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-36" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
