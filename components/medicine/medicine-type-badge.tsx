import { Badge } from "@/components/ui/badge";
import { cn, isMasterProduct } from "@/lib/utils";
import { Medicine } from "@/types";

export default function MedicineTypeBadge({ med }: { med: Medicine }) {
  return (
    <Badge
      className={cn(
        "px-2 py-1",
        isMasterProduct(med)
          ? "text-destructive bg-destructive/5"
          : "text-primary bg-primary/5"
      )}
    >
      {isMasterProduct(med) ? "مركزي" : "خاص للصيدلية"}
    </Badge>
  );
}
