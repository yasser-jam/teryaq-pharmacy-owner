import { Badge } from "@/components/ui/badge";
import { cn, isMasterProduct } from "@/lib/utils";
import { Medicine } from "@/types";

export default function MedicineTypeBadge({ med }: { med: Medicine }) {
  return (
    <Badge
      size="lg"
      className={cn(
        isMasterProduct(med)
          ? "text-destructive bg-destructive/5"
          : "text-primary bg-primary/5"
      )}
    >
      {isMasterProduct(med) ? "Master" : "Pharmacy Product"}
    </Badge>
  );
}
