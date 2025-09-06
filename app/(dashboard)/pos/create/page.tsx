"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Banknote,
  Wallet,
  Plus,
  Minus,
  Trash2,
  Search,
  Package,
  Scan,
  X,
} from "lucide-react";
import type { SaleInvoice, StockItem } from "@/types";
import { useRouter } from "next/navigation";
import POSPaymentTypeSelect from "@/components/pos/pos-payment-type-select";
import POSTypeMethodSelect from "@/components/pos/pos-type-method-select";
import CustomerSelect from "@/components/customer/customer-select";
import SysInfo from "@/components/sys/sys-info";
import POSCurrencyToggle from "@/components/pos/pos-currency-toggle";
import POSInvoiceItems from "@/components/pos/pos-invoice-items";
import { initSaleInvoice } from "@/lib/init";
import POSInvoiceSummary from "@/components/pos/pos-invoice-summary";
import POSStockItems from "@/components/pos/pos-stock-items";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { successToast } from "@/lib/toast";



export default function POSPage() {
  const [invoice, setInvoice] = useState<SaleInvoice>(initSaleInvoice());
  const [typeMethod, setTypeMethod] = useState<'CASH' | 'BANK_ACCOUNT'>('CASH');
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: makeSale, isPending } = useMutation({
    mutationKey: ["sale"],
    mutationFn: () =>
      api(`sales`, {
        method: "POST",
        body: invoice,
      }),
    onSuccess: () => {
      successToast("Sale operation Successfully!");
      queryClient.invalidateQueries({ queryKey: ["list-pos"] });

      // reset the data
      setInvoice(initSaleInvoice());
      setTypeMethod("CASH");
    },
  });

  const onProcessSale = () => {
    makeSale();
  };

  const selectStockItem = (stockItem: StockItem) => {
    const existingItemIndex = invoice.items.findIndex(
      (item) => item.stockItemId === stockItem.id
    );

    if (existingItemIndex >= 0) {
      setInvoice((prev) => ({
        ...prev,
        items: prev.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      }));
    } else {
      // SaleInvoiceItem requires: id, productName, stockItemId, quantity, unitPrice, subTotal
      const newInvoiceItem = {
        id: Date.now(),
        productName: stockItem.productName,
        stockItemId: stockItem.id,
        quantity: 1,
        unitPrice: stockItem.sellingPrice,
        subTotal: stockItem.sellingPrice,
      };
      setInvoice((prev) => ({
        ...prev,
        items: [...prev.items, newInvoiceItem],
      }));
    }
  };

  const removeItem = (index: number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    if (quantity > 0) {
      setInvoice((prev) => ({
        ...prev,
        items: prev.items.map((item, i) =>
          i === index ? { ...item, quantity, subTotal: item.unitPrice * quantity } : item
        ),
      }));
    }
  };

  //   const discountAmount =
  //     invoice.invoiceDiscountType === "PERCENTAGE"
  //       ? (subtotal * invoice.invoiceDiscountValue) / 100
  //       : invoice.invoiceDiscountValue;
  //   const total = subtotal - discountAmount;

  return (
    <Dialog open={true} onOpenChange={() => router.replace("/pos")}>
      <DialogContent className="!max-w-[100vw] !max-h-[100vh] w-full h-full overflow-auto p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-2xl font-bold">
              Point of Sale
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-3 gap-6">
              <Card className="col-span-2 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Stock Items
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Scan className="h-4 w-4" />
                    <span>
                      You can scan barcode instead of searching products
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <POSStockItems
                    selectStockItem={selectStockItem}
                    invoice={invoice}
                  />
                </CardContent>
              </Card>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <POSPaymentTypeSelect
                      paymentType={invoice.paymentType}
                      setPaymentType={(paymentType) =>
                        setInvoice((prev) => ({
                          ...prev,
                          paymentType,
                        }))
                      }
                    />
                    <POSTypeMethodSelect
                      typeMethod={typeMethod}
                      setTypeMethod={setTypeMethod}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Customer & Invoice Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SysInfo
                      text="You can leave Customer empty for walk-in customers"
                      color="blue"
                    ></SysInfo>
                    {/* CustomerSelect in separate row, only if paymentType is CREDIT */}
                    {invoice.paymentType === 'CREDIT' && (
                      <div>
                        <Label>Select Customer</Label>
                        <CustomerSelect
                          customerId={invoice.customerId ?? 0}
                          setCustomerId={(customerId: number) =>
                            setInvoice((prev) => ({
                              ...prev,
                              customerId,
                            }))
                          }
                        />
                      </div>
                    )}
                    <div>
                      <Label>Currency</Label>
                      <POSCurrencyToggle
                        currency={invoice.currency}
                        setCurrency={(currency: "SYP" | "USD") =>
                          setInvoice((prev) => ({
                            ...prev,
                            currency,
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Invoice Items</CardTitle>
                </CardHeader>

                <CardContent>
                  <POSInvoiceItems
                    invoice={invoice}
                    removeItem={removeItem}
                    updateItemQuantity={updateItemQuantity}
                  />
                </CardContent>
              </Card>

              <POSInvoiceSummary
                invoice={invoice}
                onProcessSale={onProcessSale}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
