import { SaleInvoice, SaleInvoiceItem } from "@/types";
import { Button } from "../ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function POSInvoiceItems({
  invoice,
  removeItem,
  updateItemQuantity,
  getStockItemName,
}: {
  invoice: SaleInvoice;
  removeItem: (index: number) => void;
  updateItemQuantity: (index: number, quantity: number) => void;
  getStockItemName: (stockItemId: number) => string;
}) {
  return (
    <div className="space-y-2">
      {invoice.items.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No items selected. Click on stock items above to add them.
        </p>
      ) : (
        invoice.items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-white border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">
                  {getStockItemName(item.stockItemId)}
                </p>
                <p className="text-sm text-gray-600">ID: {item.stockItemId}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateItemQuantity(index, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateItemQuantity(index, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <span className="text-sm text-gray-600">
                @ {item.unitPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {(item.quantity * item.unitPrice).toFixed(2)} {invoice.currency}
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
