import { PurchaseItem, Medicine } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X, Package } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { log } from "console";

interface PurchaseOrderInlineCardProps {
  purchaseItem: PurchaseItem & { medicine?: Medicine };
  onItemChange: (updatedItem: PurchaseItem) => void;
  onRemove: () => void;
  className?: string;
  currency?: string;
}

export default function PurchaseOrderInlineCard({
  purchaseItem,
  onItemChange,
  onRemove,
  className,
  currency = 'USD',
}: PurchaseOrderInlineCardProps) {
  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, purchaseItem.quantity + value);
    onItemChange({ ...purchaseItem, quantity: newQuantity });
  };

  const handlePriceChange = (e: string) => {
    const price = parseFloat(e) || 0;
    onItemChange({ ...purchaseItem, price });
  };

  const isFixedPrice = purchaseItem.productType === 'مركزي' || purchaseItem.productType === 'MASTER';
  const refSellingPrice = purchaseItem.medicine?.refSellingPrice || 0;

  return (
    <div className={cn(
      "flex items-center gap-4 p-3 border border-dashed bg-slate-50 rounded-sm",
      "transition-colors",
      isFixedPrice ? "border-blue-300 bg-blue-50" : "border-primary",
      className
    )}>
      <Avatar className="h-10 w-10">
        <AvatarFallback className="bg-blue-100 text-blue-600">
          <Package className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="font-medium text-sm">
          {purchaseItem.medicine?.tradeName || 'Item'}
        </div>
        <div className="text-xs text-muted-foreground">
          {purchaseItem.barcode} • {purchaseItem.productType}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 rounded-full hover:bg-blue-100 text-blue-600"
          onClick={() => handleQuantityChange(-1)}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="w-8 text-center text-sm font-medium">
          {purchaseItem.quantity}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 rounded-full hover:bg-blue-100 text-blue-600"
          onClick={() => handleQuantityChange(1)}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="w-28">
        {!isFixedPrice ? (
          <div className="relative">
            <Input
              type="number"
              min="0"
              step="0.1"
              value={purchaseItem.price}
              onChange={(e) => handlePriceChange(String(e))}
              className="h-2 py-1 leading-[0] text-right pr-0 text-sm"
            />
          </div>
        ) : (
          <div className="h-8 flex items-center justify-end px-2 text-sm font-medium bg-blue-50 rounded-md">
            {purchaseItem.price.toFixed(2)} {currency}
          </div>
        )}
        {refSellingPrice > 0 && (
          <div className="text-xs text-muted-foreground text-right mt-1">
            Ref: {refSellingPrice} {currency}
          </div>
        )}
      </div>

      <div className=" text-right">
        <div className="font-medium">
          {(purchaseItem.quantity * purchaseItem.price).toFixed(2)} {currency}
        </div>
        {refSellingPrice > 0 && (
          <div className="text-xs text-muted-foreground">
            {(purchaseItem.quantity * refSellingPrice).toFixed(2)} {currency}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-red-50 rounded-full"
        onClick={onRemove}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}