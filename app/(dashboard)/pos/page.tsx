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
import CustomerSelect from "@/components/customer/customer-select";
import SysInfo from "@/components/sys/sys-info";
import POSCurrencyToggle from "@/components/pos/pos-currency-toggle";
import POSInvoiceItems from "@/components/pos/pos-invoice-items";
import { initSaleInvoice } from "@/lib/init";
import POSInvoiceSummary from "@/components/pos/pos-invoice-summary";

// Mock stock items data
const mockStockItems: StockItem[] = [
  {
    id: 1,
    productId: 101,
    productName: "Paracetamol 500mg",
    productType: "PHARMACY",
    quantity: 100,
    bonusQty: 5,
    total: 105,
    supplier: "PharmaCorp",
    categories: ["Pain Relief", "Tablets"],
    minQuantity: 20,
    expiryDate: "2025-12-31",
    batchNo: "PC2024001",
    actualPurchasePrice: 0.5,
    sellingPrice: 1.2,
    dateAdded: "2024-01-15",
    addedBy: 1,
    purchaseInvoiceId: 1001,
    isExpired: false,
    isExpiringSoon: false,
    daysUntilExpiry: 365,
    pharmacyId: 1,
    purchaseInvoiceNumber: "PI-2024-001",
  },
  {
    id: 2,
    productId: 102,
    productName: "Amoxicillin 250mg",
    productType: "PHARMACY",
    quantity: 50,
    bonusQty: 2,
    total: 52,
    supplier: "MediSupply",
    categories: ["Antibiotics", "Capsules"],
    minQuantity: 10,
    expiryDate: "2025-06-30",
    batchNo: "MS2024002",
    actualPurchasePrice: 2.0,
    sellingPrice: 4.5,
    dateAdded: "2024-02-01",
    addedBy: 1,
    purchaseInvoiceId: 1002,
    isExpired: false,
    isExpiringSoon: false,
    daysUntilExpiry: 180,
    pharmacyId: 1,
    purchaseInvoiceNumber: "PI-2024-002",
  },
  {
    id: 3,
    productId: 103,
    productName: "Vitamin C 1000mg",
    productType: "MASTER",
    quantity: 200,
    bonusQty: 10,
    total: 210,
    supplier: "VitaHealth",
    categories: ["Vitamins", "Tablets"],
    minQuantity: 50,
    expiryDate: "2026-03-15",
    batchNo: "VH2024003",
    actualPurchasePrice: 0.8,
    sellingPrice: 2.0,
    dateAdded: "2024-01-20",
    addedBy: 1,
    purchaseInvoiceId: 1003,
    isExpired: false,
    isExpiringSoon: false,
    daysUntilExpiry: 450,
    pharmacyId: 1,
    purchaseInvoiceNumber: "PI-2024-003",
  },
];

export interface SaleInvoiceRequest {
  customerId: number;
  paymentType: "CASH" | "CREDIT";
  paymentMethod: "CASH" | "BANK_ACCOUNT";
  currency: "SYP" | "USD";
  invoiceDiscountType: "PERCENTAGE" | "FIXED_AMOUNT";
  invoiceDiscountValue: number;
  discount: number;
  paidAmount: number | null;
  items: SaleInvoiceItemRequest[];
}

export interface SaleInvoiceItemRequest {
  stockItemId: number;
  quantity: number;
  unitPrice: number;
}

interface POSPageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function POSPage({ open, onOpenChange }: POSPageProps) {
  const [invoice, setInvoice] = useState<SaleInvoice>(initSaleInvoice());

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] =
    useState<StockItem[]>(mockStockItems);


  const onProcessSale = () => {
    console.log(invoice);
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredItems(mockStockItems);
    } else {
      const filtered = mockStockItems.filter(
        (item) =>
          item.productName.toLowerCase().includes(term.toLowerCase()) ||
          item.id.toString().includes(term)
      );
      setFilteredItems(filtered);
    }
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
      const newInvoiceItem: SaleInvoiceItemRequest = {
        stockItemId: stockItem.id,
        quantity: 1,
        unitPrice: stockItem.sellingPrice,
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
          i === index ? { ...item, quantity } : item
        ),
      }));
    }
  };

  const getStockItemName = (stockItemId: number) => {
    const stockItem = mockStockItems.find((item) => item.id === stockItemId);
    return stockItem ? stockItem.productName : `Item ID: ${stockItemId}`;
  };

  //   const discountAmount =
  //     invoice.invoiceDiscountType === "PERCENTAGE"
  //       ? (subtotal * invoice.invoiceDiscountValue) / 100
  //       : invoice.invoiceDiscountValue;
  //   const total = subtotal - discountAmount;

  const router = useRouter();
  return (
    <Dialog open={true} onOpenChange={() => router.replace("/")}>
      <DialogContent className="!max-w-[100vw] !max-h-[100vh] w-full h-full overflow-auto p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">
                Point of Sale
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Top Section - Stock Items */}
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
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search products by name or ID..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {filteredItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => selectStockItem(item)}
                          className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {item.productName}
                              </h4>
                              <p className="text-sm text-gray-600">
                                ID: {item.id} • Stock: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {item.sellingPrice.toFixed(2)} {invoice.currency}
                            </p>
                            <Badge
                              variant={
                                item.productType === "MASTER"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {item.productType}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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

                    {/* {invoice.paymentType === "CREDIT" && (
      <div className="mt-4">
        <Label>Amount Paid</Label>
        <Input
          type="number"
          step="0.01"
          value={invoice.paidAmount || ""}
          onChange={(e) =>
            setInvoice((prev) => ({
              ...prev,
              paidAmount: Number.parseFloat(e.target.value),
            }))
          }
          placeholder="0.00"
        />
        {invoice.paidAmount &&
          invoice.paidAmount > invoice.totalAmount && (
            <p className="text-sm text-green-600 mt-1">
              Change:{" "}
              {(invoice.paidAmount - invoice.totalAmount).toFixed(2)}{" "}
              {invoice.currency}
            </p>
          )}
      </div>
    )} */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    getStockItemName={getStockItemName}
                  />
                </CardContent>
              </Card>

              <POSInvoiceSummary invoice={invoice} onProcessSale={onProcessSale} />

              <div className="xl:col-span-2 space-y-6">
                {/* Discount */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Discount</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Discount Type</Label>
                      <Select
                        value={invoice.invoiceDiscountType}
                        onValueChange={(value: "PERCENTAGE" | "FIXED_AMOUNT") =>
                          setInvoice((prev) => ({
                            ...prev,
                            invoiceDiscountType: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENTAGE">
                            Percentage (%)
                          </SelectItem>
                          <SelectItem value="FIXED_AMOUNT">
                            Fixed Amount
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Discount Value</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={invoice.invoiceDiscountValue || ""}
                        onChange={(e) =>
                          setInvoice((prev) => ({
                            ...prev,
                            invoiceDiscountValue:
                              Number.parseFloat(e.target.value) || 0,
                          }))
                        }
                        placeholder={
                          invoice.invoiceDiscountType === "PERCENTAGE"
                            ? "0-100"
                            : "0.00"
                        }
                      />
                    </div>
                  </CardContent>
                </Card> */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
