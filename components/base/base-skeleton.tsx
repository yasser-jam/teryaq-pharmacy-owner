import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export default function BaseSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn('rounded-xl', className)} />;
}