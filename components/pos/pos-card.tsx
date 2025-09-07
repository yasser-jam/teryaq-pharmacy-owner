import { SaleInvoice } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Calendar, CreditCard, DollarSign, ReceiptText, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { RefundItemsDialog } from "../refund/refund-items-dialog";
import { RefundStatusBadge } from "../refund/refund-status-badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { successToast } from "@/lib/toast";

export default function POSCard({ invoice }: { invoice: SaleInvoice }) {
  const subtotal = invoice.items?.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  ) ?? 0;

  const discount = invoice.discount ?? 0;
  const total = invoice.totalAmount ?? Math.max(subtotal - discount, 0);
  const paid = invoice.paidAmount ?? 0;
  const remaining = invoice.remainingAmount ?? Math.max(total - paid, 0);

  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

  const queryClient = useQueryClient()

  const { mutate: refund, isPending } = useMutation({
    mutationFn: (data: any) => api(`sales/${invoice.id}/refund`, {
      body: data,
      method: 'POST'
    }),
    onSuccess: () => {
      successToast('Refund Completed Successfully!')
      setIsRefundDialogOpen(false);

      queryClient.invalidateQueries({ queryKey: ['list-pos'] })
    }
  })

  const refundItems = invoice.items.map((item) => ({
    id: item.id,
    productName: item.productName,
    quantity: item.quantity,
    refundedQuantity: item.refundedQuantity || 0,
    stockItemId: item.stockItemId,
    subTotal: item.subTotal,
    unitPrice: item.unitPrice,
    availableForRefund: item.availableForRefund || item.quantity - (item.refundedQuantity || 0),
  }));

  return (
    <Card className="border-2 border-dashed rounded-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ReceiptText className="h-5 w-5" />
          <span>Sale Invoice</span>
          {invoice.status ? (
            <Badge variant={invoice.status === "DONE" ? "default" : "secondary"} size={'lg'} className="ml-auto">
              {invoice.status}
            </Badge>
          ) : null}
          {invoice.refundStatus ? (
            <RefundStatusBadge status={invoice.refundStatus} className="ml-2" />
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-3">
          <div className="flex flex-col gap-2 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <User2 className="h-4 w-4" />
              <span className="font-medium">Customer:</span>
              <span className="truncate">{invoice.customerName || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-800">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Date:</span>
              <span>{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleString() : "—"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 text-purple-800">
              <CreditCard className="h-4 w-4" />
              <span className="font-medium">Payment:</span>
              <span>{invoice.paymentType}</span>
            </div>
            <div className="flex items-center gap-2 text-purple-800">
              <span className="font-medium">Method:</span>
              <span className="ml-2">{invoice.paymentMethod || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-purple-800">
              <DollarSign className="h-4 w-4" />
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">{invoice.currency}</Badge>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 space-y-2 relative overflow-hidden">
            {/* <div className="absolute -top-5 -right-5 h-20 w-20 bg-yellow-200 rounded-full flex items-end justify-start p-3 opacity-70">
              <ReceiptText className="h-8 w-8 text-yellow-700" />
            </div> */}
            <h4 className="font-semibold text-yellow-800 mb-3">Items</h4>
            <div className="divide-y divide-yellow-200">
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item) => (
                  <div key={item.id} className="flex justify-between py-1">
                    <span className="text-yellow-900 truncate max-w-[60%]">{item.productName}</span>
                    <span className="font-medium text-yellow-800">x{item.quantity}</span>
                  </div>
                ))
              ) : (
                <span className="text-yellow-600">No items</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Bill Details section */}
          <div className="bg-green-50 rounded-lg p-4 space-y-2 relative overflow-hidden">
            <div className="absolute -top-5 -right-5 h-20 w-20 bg-green-200 rounded-full flex items-end justify-start p-3 opacity-70">
              <ReceiptText className="h-8 w-8 text-green-700" />
            </div>
            <h4 className="font-semibold text-green-800 mb-3">Bill Details</h4>
            <div className="flex justify-between">
              <span className="text-green-700">Items</span>
              <span className="font-medium text-green-900">{invoice.items?.length ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Subtotal</span>
              <span className="font-medium text-green-900">{subtotal.toFixed(2)} {invoice.currency}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span className="text-green-700">Discount</span>
              <span className="font-medium text-red-700">-{discount.toFixed(2)} {invoice.currency}</span>
            </div>
            <Separator className="my-2 bg-green-200" />
            <div className="flex justify-between font-semibold text-lg">
              <span className="text-green-800">Total</span>
              <span className="text-green-900">{total.toFixed(2)} {invoice.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Paid</span>
              <span className="font-medium text-green-900">{paid.toFixed(2)} {invoice.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Remaining</span>
              <span className="font-medium text-green-900">{remaining.toFixed(2)} {invoice.currency}</span>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 bg-red-100 text-red-700 border-red-300 hover:bg-red-200"
              onClick={() => setIsRefundDialogOpen(true)}
              disabled={invoice.refundStatus === "FULLY_REFUNDED"}
            >
              Refund
            </Button>
          </div>
        </div>
      </CardContent>

      <RefundItemsDialog
        items={refundItems}
        isOpen={isRefundDialogOpen}
        loading={isPending}
        onClose={() => setIsRefundDialogOpen(false)}
        onSubmit={(data) => refund(data)}
      />
    </Card>
  );
}
