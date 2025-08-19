import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Package } from "lucide-react";
import type { StockItem } from "@/types";

interface StockCardProps {
  stockItem: StockItem;
}

export function StockMiniCard({ stockItem }: StockCardProps) {
  const getStockStatusColor = () => {
    if (stockItem.minQuantity && stockItem.quantity <= stockItem.minQuantity) {
      return "destructive";
    }
    return "blue";
  };

  const getProductTypeColor = () => {
    switch (stockItem.productType) {
      case "MASTER":
      case "مركزي":
        return "default";
      case "PHARMACY":
      case "صيدلية":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="transition-shadow duration-200 border border-gray-200 bg-blue-50 border-1 border-dashed border-blue-500 cursor-pointer">
      <CardContent className="px-4 relative">
        <Badge
          variant={getProductTypeColor()}
          className="absolute top- right-2 text-xs px-2 py-1"
        >
          {stockItem.productType}
        </Badge>

        <div className="space-y-3">
          <div className="flex items-center gap-2 w-full relative">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                <Package className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 text-base leading-tight">
                {stockItem.productName}
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant={getStockStatusColor()}
                className="text-xs px-2 py-1"
              >
                Qty: {stockItem.quantity}
              </Badge>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 text-sm">
                ${stockItem.sellingPrice || 'unknown'}
              </p>
            </div>
          </div>

          {/* Added Date */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{new Date(stockItem.dateAdded).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
