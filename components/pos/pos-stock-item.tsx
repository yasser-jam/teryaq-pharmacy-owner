import { Currency, StockItem } from "@/types";
import { Package } from "lucide-react";
import { Badge } from "../ui/badge";

export default function POSStockItem({
  item,
  selectStockItem,
  currency
}: {
  item: StockItem;
  selectStockItem: (stockItem: StockItem) => void;
  currency: Currency;
}) {
  return (
    <>
      <div
        key={item.id}
        onClick={() => selectStockItem(item)}
        className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Package className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium">{item.productName}</h4>
            <p className="text-sm text-gray-600">
              ID: {item.id} • Stock: {item.totalQuantity}
            </p>
            <p className="text-xs text-gray-500">
              Latest expiry: {item.latestExpiryDate || "—"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold">
            {typeof item.sellingPrice === "number"
              ? item.sellingPrice.toFixed(2)
              : "Unknown"}{" "}
            {currency}
          </p>
          <Badge
            variant={item.productType === "MASTER" ? "default" : "secondary"}
            className="text-xs"
          >
            {item.productType}
          </Badge>
        </div>
      </div>
    </>
  );
}
