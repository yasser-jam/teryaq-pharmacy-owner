import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type BaseSkeletonProps = {
  className?: string;
  type?: "table" | "grid";
};

export default function BaseSkeleton({ className, type = "table" }: BaseSkeletonProps) {
  if (type === "grid") {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6", className)}>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="rounded-xl w-full h-32 my-6" />
        ))}
      </div>
    );
  }
  // Default: table
  return <Skeleton className={cn('rounded-xl w-full h-128 my-6', className)} />;
}