import { SaleInvoice } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

interface POSInvoiceSummaryProps {
  invoice: SaleInvoice;
  onProcessSale: () => void;
}

export default function POSInvoiceSummary({ invoice, onProcessSale }: POSInvoiceSummaryProps) {
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>
              {subtotal?.toFixed(2)} {invoice.currency}
            </span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Discount:</span>
            <span>
              -{invoice.discount?.toFixed(2)} {invoice.currency}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>
              {invoice.totalAmount?.toFixed(2)} {invoice.currency}
            </span>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={invoice.items.length === 0}
            onClick={() => {
                onProcessSale()
            }}
          >
            Process Sale
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
