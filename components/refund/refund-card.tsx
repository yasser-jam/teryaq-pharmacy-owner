import { Refund, RefundItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, ReceiptText, CalendarDays, DollarSign, TextQuote, Tag } from "lucide-react";

interface RefundCardProps {
  refund: Refund;
}

export function RefundCard({ refund }: RefundCardProps) {
  return (
    <Card className="border-2 border-dashed rounded-lg shadow-sm bg-white p-2">
      <CardHeader className="pb-2 pt-0 px-0">
        <CardTitle className="flex items-center gap-1.5 text-lg font-semibold text-gray-700">
          <ReceiptText className="h-5 w-5 text-gray-500" />
          <span>Refund #{refund.refundId}</span>
          {refund.saleInvoiceId && (
            <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0">
              Invoice ID: {refund.saleInvoiceId}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm px-0 pb-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-gray-600">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Date:</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5">
              {refund.refundDate ? new Date(refund.refundDate).toLocaleString() : "—"}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 ml-auto">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium">Total Amount:</span>
            <span className="font-bold text-green-700">{refund.totalRefundAmount?.toFixed(2) || "0.00"}</span>
          </div>
        </div>

        {refund.refundReason && (
          <div className="flex items-start gap-1.5 text-gray-600 bg-gray-50 p-2 rounded-md">
            <TextQuote className="h-4 w-4 mt-0.5 text-gray-500" />
            <span className="font-medium">Reason:</span>
            <p className="flex-1 text-gray-700 leading-snug">{refund.refundReason}</p>
          </div>
        )}

        <Separator className="my-1 bg-gray-100" />

        <h3 className="font-semibold text-base flex items-center gap-1.5 mb-1 text-gray-700">
          <Package className="h-5 w-5 text-gray-500" />
          Refunded Items
        </h3>
        {refund.refundedItems && refund.refundedItems.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {refund.refundedItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-md mb-1 bg-white shadow-sm last:mb-0">
                <AccordionTrigger className="flex justify-between items-center py-1.5 px-3 hover:bg-gray-50 rounded-t-md text-gray-700 font-medium">
                  <span className="text-sm">{item.productName}</span>
                  <Badge variant="outline" className="text-xs px-1.5 py-0">Qty: {item.quantity}</Badge>
                </AccordionTrigger>
                <AccordionContent className="px-3 py-1.5 text-xs bg-gray-50 rounded-b-md border-t border-gray-100">
                  <div className="grid gap-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Unit Price:</span>
                      <span className="font-medium text-gray-800">{item.unitPrice?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium text-gray-800">{item.subtotal?.toFixed(2)}</span>
                    </div>
                    {item.itemRefundReason && (
                      <div className="flex flex-col mt-1 pt-1 border-t border-gray-100">
                        <span className="text-gray-600 font-medium mb-0.5">Item Refund Reason:</span>
                        <p className="text-gray-700 leading-tight">{item.itemRefundReason}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-gray-500 italic text-center py-1.5">No items refunded.</p>
        )}

        <Separator className="my-1 bg-gray-100" />

        <div className="flex items-center gap-1.5 text-gray-600">
          <Tag className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Stock Restored:</span>
          <Badge variant={refund.stockRestored ? "default" : "destructive"} className={`${refund.stockRestored ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"} text-xs px-1.5 py-0.5`}>
            {refund.stockRestored ? "Yes" : "No"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
