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
import { BaseDatePicker } from "../base/date-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { successToast } from "@/lib/toast";
import { useTranslations } from "next-intl";

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
  const t = useTranslations('PurchaseInvoiceDialog');
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

  // Subtotal should not include bonusQty, as bonus are free
  const calculateSubtotal = (item: InvoiceItem) => {
    return item.receivedQty * item.invoicePrice;
  };

  const calculateTotal = () => {
    return invoiceItems.reduce(
      (total, item) => total + calculateSubtotal(item),
      0
    );
  };

  const queryClient = useQueryClient();

  const { mutate: createInvoice, isPending } = useMutation({
    mutationKey: ["purchase-invoice"],
    mutationFn: () =>
      api("purchase-invoices", {
        method: "POST",
        body: {
          purchaseOrderId: purchaseOrder.id,
          supplierId: purchaseOrder.supplierId,
          currency: purchaseOrder.currency,
          total: purchaseOrder.total,
          invoiceNumber,
          items: invoiceItems.map((el) => ({
            ...el,
            productName: undefined,
          })),
        },
      }),

    onSuccess: () => {
      successToast(t('createSuccess'));
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      onClose();
    },
  });

  const handleSubmit = () => {
    // Handle invoice creation logic here
    createInvoice();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="!max-w-none !w-screen max-h-[95vh] p-0 gap-0 flex flex-col"
      >
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Receipt className="h-8 w-8 text-primary" />
                <div>
                  <DialogTitle className="text-3xl font-bold">
                    {t('title')}
                  </DialogTitle>
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
                      {t('supplierInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Order ID
                        </Label>
                        <p className="font-mono text-sm italic text-gray-500">
                          #{purchaseOrder.id}
                        </p>
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
                      {t('invoiceInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="invoiceNumber">{t('invoiceNumber')} *</Label>
                      <Input
                        id="invoiceNumber"
                        placeholder={t('invoiceNumberPlaceholder')}
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
                  <CardTitle>{t('invoiceItems')}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t('invoiceItemsDescription')}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {invoiceItems?.map((item, index) => (
                    <div
                      key={item.productId}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <h4 className="font-semibold">{item.productName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm italic text-muted-foreground font-mono">
                              #{item.productId}
                            </span>
                          </div>
                        </div>

                        <Badge variant="blue">{item.productType}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t('receivedQty')} *</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={item.receivedQty || ""}
                            onChange={(e) =>
                              updateInvoiceItem(
                                index,
                                "receivedQty",
                                Number.parseInt(String(e)) || 0
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('bonusQty')}</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={item.bonusQty || ""}
                            onChange={(e) =>
                              updateInvoiceItem(
                                index,
                                "bonusQty",
                                Number.parseInt(String(e)) || 0
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('invoicePrice')} *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={item.invoicePrice || ""}
                            onChange={(e) =>
                              updateInvoiceItem(
                                index,
                                "invoicePrice",
                                Number.parseFloat(String(e)) || 0
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('sellingPrice')} *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={item.sellingPrice || ""}
                            onChange={(e) =>
                              updateInvoiceItem(
                                index,
                                "sellingPrice",
                                Number.parseFloat(String(e)) || 0
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('batchNo')} *</Label>
                          <Input
                            placeholder={t('batchNoPlaceholder')}
                            value={item.batchNo}
                            onChange={(e) =>
                              updateInvoiceItem(index, "batchNo", String(e))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('expiryDate')} *</Label>
                          <BaseDatePicker
                            value={item.expiryDate}
                            onChange={(e) =>
                              updateInvoiceItem(index, "expiryDate", String(e))
                            }
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>{t('minStockLevel')}</Label>
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
            loading={isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
