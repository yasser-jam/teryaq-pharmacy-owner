import { Badge } from "@/components/ui/badge";
import { RefundStatus } from "@/types";
import { cn } from "@/lib/utils";

interface RefundStatusBadgeProps {
  status: RefundStatus;
  className?: string;
}

export function RefundStatusBadge({ status, className }: RefundStatusBadgeProps) {
  const getStatusColors = (status: RefundStatus) => {
    switch (status) {
      case "NO_REFUND":
        return "bg-gray-100 text-gray-800";
      case "PARTIALLY_REFUNDED":
        return "bg-yellow-100 text-yellow-800";
      case "FULLY_REFUNDED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={cn(getStatusColors(status), className)}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
