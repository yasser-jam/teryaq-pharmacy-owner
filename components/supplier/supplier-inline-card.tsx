import { Supplier } from "@/types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Eye, User } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SupplierInlineCardProps {
  supplier: Supplier;
  selected?: boolean;
  onSelect: () => void;
}

export default function SupplierInlineCard({
  supplier,
  selected,
  onSelect,
}: SupplierInlineCardProps) {
  return (
    <>
      <div
        className={cn(
          "flex justify-between items-center py-2 px-4 border border-dashed bg-transparent cursor-pointer border-primary hover:bg-green/100 transition-colors rounded-sm",
          selected && "bg-green-50"
        )}
        onClick={onSelect}
      >
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="bg-green-500 text-white">
              <User />
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="font-medium">{supplier.name}</div>
            <div className="text-sm text-gray-500 font-medium">
              {supplier.phone}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
