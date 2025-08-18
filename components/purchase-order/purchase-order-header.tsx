'use client';
import { PurchaseItem, PurchaseOrder } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface PurchaseOrderHeaderProps {
  items: PurchaseItem[];
  currency?: string;
}

export default function PurchaseOrderHeader({ 
  items, 
  currency = 'USD' 
}: PurchaseOrderHeaderProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Card className="border-dashed border-amber-200 bg-amber-50">
      <CardContent className="p-4">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`${item.productId}-${index}`} className="flex justify-between items-center">
              <div className="font-medium">
                {item.productName}
              </div>
              <div className="text-sm text-muted-foreground">
                {item.quantity} x {item.price.toFixed(2)} {currency}
              </div>
            </div>
          ))}
          
          <div className="border-t border-amber-200 pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total ({totalItems} {totalItems === 1 ? 'item' : 'items'}):</span>
              <span>
                {totalPrice.toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}