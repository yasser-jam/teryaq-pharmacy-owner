"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InvoiceItem, PurchaseOrder } from "@/types";

interface PurchaseInvoiceBillProps {
  invoiceItems: InvoiceItem[];
  invoiceNumber: string;
  purchaseOrder: Pick<PurchaseOrder, 'supplierName' | 'currency'>;
  onCancel: () => void;
  onSubmit: () => void;
}

export function PurchaseInvoiceBill({
  invoiceItems,
  invoiceNumber,
  purchaseOrder,
  onCancel,
  onSubmit,
}: PurchaseInvoiceBillProps) {
  const calculateSubtotal = (item: InvoiceItem) => {
    return (item.receivedQty + item.bonusQty) * item.invoicePrice;
  };

  const calculateTotal = () => {
    return invoiceItems.reduce(
      (total, item) => total + calculateSubtotal(item),
      0
    );
  };

  return (
    <div className="w-96 border-l border-border overflow-y-auto bg-muted/5 p-6 flex flex-col">
      <div className="flex-1">
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm pb-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {invoiceItems.length} items
              </p>
            </div>
          </div>
          <Separator />
        </div>

        <div className="space-y-4">
          {/* Invoice Info */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Invoice #
              </span>
              <span className="font-mono font-medium">
                {invoiceNumber || "Not set"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Date
              </span>
              <span className="text-sm">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Supplier
              </span>
              <span className="text-sm text-right">
                {purchaseOrder.supplierName}
              </span>
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-3">
            {invoiceItems.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-start text-sm"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.receivedQty} × {purchaseOrder.currency}{" "}
                    {item.invoicePrice.toFixed(2)}
                    {item.bonusQty > 0 && ` + ${item.bonusQty} bonus`}
                  </p>
                </div>
                <div className="font-medium">
                  {purchaseOrder.currency} {calculateSubtotal(item).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>
                {purchaseOrder.currency} {calculateTotal().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (0%)</span>
              <span>{purchaseOrder.currency} 0.00</span>
            </div>
            <div className="flex justify-between font-semibold pt-2">
              <span>Total</span>
              <span className="text-lg">
                {purchaseOrder.currency} {calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm pt-4 border-t">
        <Button className="w-full" size="lg" onClick={onSubmit}>
          Create Invoice
        </Button>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}