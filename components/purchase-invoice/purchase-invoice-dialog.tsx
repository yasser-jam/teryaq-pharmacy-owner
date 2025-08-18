"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Package, Receipt, Building2, Hash } from "lucide-react";
import { InvoiceItem, PurchaseOrder } from "@/types";
import { PurchaseInvoiceBill } from "./purchase-invoice-bill";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { DialogTitle } from "@radix-ui/react-dialog";

interface PurchaseInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: PurchaseOrder;
}

export function PurchaseInvoiceDialog({
  isOpen,
  onClose,
  purchaseOrder,
}: PurchaseInvoiceDialogProps) {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  // Initialize invoice items from purchase order
  useEffect(() => {
    if (purchaseOrder?.items) {
      setInvoiceItems(
        purchaseOrder.items.map((el) => ({
          productId: el.productId,
          productName: el.productName,
          productType: el.productType,
          receivedQty: el.quantity,
          bonusQty: 0,
          invoicePrice: el.price,
          batchNo: "",
          expiryDate: "",
          sellingPrice: el.price,
          minStockLevel: el.quantity,
        }))
      );
    }
  }, [purchaseOrder]);

  const updateInvoiceItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setInvoiceItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const calculateSubtotal = (item: InvoiceItem) => {
    return (item.receivedQty + item.bonusQty) * item.invoicePrice;
  };

  const calculateTotal = () => {
    return invoiceItems.reduce(
      (total, item) => total + calculateSubtotal(item),
      0
    );
  };

  const handleSubmit = () => {
    // Handle invoice creation logic here
    console.log("Creating invoice:", {
      purchaseOrderId: purchaseOrder.id,
      supplierId: purchaseOrder.supplierId,
      currency: purchaseOrder.currency,
      total: calculateTotal(),
      invoiceNumber,
      items: invoiceItems,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-none !w-screen max-h-[95vh] p-0 gap-0 flex flex-col">
        <div className="flex flex-1 overflow-hidden">
          {/* Left Side - Form */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Receipt className="h-8 w-8 text-primary" />
                <div>
                  <DialogTitle className="text-3xl font-bold">Create Invoice</DialogTitle>
                  <p className="text-muted-foreground">
                    Generate invoice from purchase order {purchaseOrder.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Purchase Order Info */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Purchase Order Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Order ID
                        </Label>
                        <p className="font-mono text-sm italic text-gray-500">#{purchaseOrder.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Supplier
                        </Label>
                        <p className="font-medium">
                          {purchaseOrder.supplierName}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Invoice Number */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Invoice Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                      <Input
                        id="invoiceNumber"
                        placeholder="Enter invoice number"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(String(e))}
                        className="font-mono"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Invoice Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Items</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fill in the received quantities and pricing details for each
                    item
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {invoiceItems?.map((item, index) => (
                    <div
                      key={item.productId}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{item.productName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">
                              {item.productType}
                            </Badge>
                            <span className="text-sm text-muted-foreground font-mono">
                              {item.productId}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Received Qty *</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={item.receivedQty || ""}
                            onChange={(e) =>
                              updateInvoiceItem(
                                index,
                                "receivedQty",
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Bonus Qty</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={item.bonusQty || ""}
                            onChange={(e) =>
                              updateInvoiceItem(
                                index,
                                "bonusQty",
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Invoice Price *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={item.invoicePrice || ""}
                            onChange={(e) =>
                              updateInvoiceItem(
                                index,
                                "invoicePrice",
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Selling Price *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={item.sellingPrice || ""}
                            onChange={(e) =>
                              updateInvoiceItem(
                                index,
                                "sellingPrice",
                                Number.parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Batch No *</Label>
                          <Input
                            placeholder="Enter batch number"
                            value={item.batchNo}
                            onChange={(e) =>
                              updateInvoiceItem(
                                index,
                                "batchNo",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Expiry Date *</Label>
                          <Input
                            type="date"
                            value={item.expiryDate}
                            onChange={(e) =>
                              updateInvoiceItem(
                                index,
                                "expiryDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Min Stock Level</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={item.minStockLevel || ""}
                            onChange={(e) =>
                              updateInvoiceItem(
                                index,
                                "minStockLevel",
                                Number.parseInt(String(e)) || 0
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Summary */}
          <PurchaseInvoiceBill
            invoiceItems={invoiceItems}
            invoiceNumber={invoiceNumber}
            purchaseOrder={purchaseOrder}
            onCancel={onClose}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
