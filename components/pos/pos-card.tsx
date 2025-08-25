import { SaleInvoice } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Calendar, CreditCard, DollarSign, ReceiptText, User2 } from "lucide-react";

export default function POSCard({ invoice }: { invoice: SaleInvoice }) {
  const subtotal = invoice.items?.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  ) ?? 0;

  const discount = invoice.discount ?? 0;
  const total = invoice.totalAmount ?? Math.max(subtotal - discount, 0);
  const paid = invoice.paidAmount ?? 0;
  const remaining = invoice.remainingAmount ?? Math.max(total - paid, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ReceiptText className="h-5 w-5" />
          <span>Sale Invoice</span>
          {invoice.status ? (
            <Badge variant={invoice.status === "DONE" ? "default" : "secondary"} size={'lg'} className="ml-auto">
              {invoice.status}
            </Badge>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-gray-700">
            <User2 className="h-4 w-4" />
            <span className="font-medium">Customer:</span>
            <span className="truncate">{invoice.customerName || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 justify-end">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Date:</span>
            <span>{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleString() : "—"}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="font-medium">Payment:</span>
            <span>{invoice.paymentType}</span>
          </div>
          <div className="truncate">
            <span className="font-medium">Method:</span>
            <span className="ml-2">{invoice.paymentMethod || "—"}</span>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <DollarSign className="h-4 w-4" />
            <Badge variant="outline">{invoice.currency}</Badge>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Items</span>
            <span className="font-medium">{invoice.items?.length ?? 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{subtotal.toFixed(2)} {invoice.currency}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Discount</span>
            <span>-{discount.toFixed(2)} {invoice.currency}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{total.toFixed(2)} {invoice.currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Paid</span>
            <span className="font-medium">{paid.toFixed(2)} {invoice.currency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Remaining</span>
            <span className="font-medium">{remaining.toFixed(2)} {invoice.currency}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
