"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Package,
  DollarSign,
  Building,
  User,
  FileText,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { StockItem, StockItemDetails } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { id } from "date-fns/locale";
import { use } from "react";
import { api } from "@/lib/api";
import BasePageDialog from "@/components/base/page-dialog";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function StockPage({
  params,
}: {
  params: Promise<{ id: string, productType: string }>;
}) {
  const { id } = use(params);
  const router = useRouter()
  const t = useTranslations();

  const idNumber = id.split('-')[0];
  const productType = id.split("-")[1];

  const { data: stockItem } = useQuery<StockItemDetails>({
    queryKey: ["stock-item", id],
    queryFn: () => api(`/stock/product/${idNumber}/details?productType=${productType}`),
  });

  if (!stockItem) return null;

  // const getStatusBadge = () => {
  //   if (stockItem.stockItems[0].isExpired) {
  //     return <Badge variant="destructive">Expired</Badge>;
  //   }
  //   if (stockItem.stockItems[0].isExpiringSoon) {
  //     return <Badge variant="blue-light">Expiring Soon</Badge>;
  //   }
  //   if (stockItem.stockItems[0].quantity <= stockItem.minQuantity) {
  //     return <Badge variant="blue-outline">Low Stock</Badge>;
  //   }
  //   return <Badge variant="green">In Stock</Badge>;
  // };

  const getProductTypeBadge = () => {
    const variant =
      stockItem.productType === "MASTER" || stockItem.productType === "مركزي"
        ? "blue"
        : "green-light";
    return <Badge variant={variant}>{stockItem.productType}</Badge>;
  };


  return (
    <BasePageDialog
      open={true}
      onOpenChange={() => router.replace("/stock")}
      loading={false}
      title={t("StockItem.title")}
      subtitle={t("StockItem.subtitle")}
      footer={null}
      className=""
      classTitle=""
      headerChildren={null}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            {t("StockItem.productInfo")}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("StockItem.productId")}</span>
              <span className="font-medium">#{stockItem.productId}</span>
            </div>
            {/* <div className="flex justify-between">
              <span className="text-gray-600">Supplier:</span>
              <span className="font-medium">{stockItem.supplier}</span>
            </div> */}
          </div>
        </div>

        {/* Inventory Details */}
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="h-5 w-5 text-green-600" />
            {t("StockItem.inventoryDetails")}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("StockItem.currentStock")}</span>
              <span className="font-bold text-lg">{stockItem.totalQuantity}</span>
            </div>
          </div>
        </div>

        {stockItem.stockItems.map((item) => (
          <div key={item.id} className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              {t("StockItem.batchDetails")}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t("StockItem.batchId")}</span>
                <span className="font-medium">#{item.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("StockItem.expiryDate")}</span>
                <span className="font-medium">{item.expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t("StockItem.currentStock")}</span>
                <span className="font-bold text-lg">{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
        {/* <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Pricing Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Purchase Price:</span>
              <span className="font-medium">
                ${stockItem.actualPurchasePrice?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Selling Price:</span>
              <span className="font-bold text-lg text-green-600">
                ${stockItem.sellingPrice?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profit Margin:</span>
              <span className="font-medium text-green-600">
                $
                {(
                  stockItem.sellingPrice - stockItem.actualPurchasePrice
                ).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Value:</span>
              <span className="font-bold">
                ${(stockItem.sellingPrice * stockItem.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div> */}

        {/* Expiry & Status */}
        {/* <div className="bg-amber-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Expiry & Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Expiry Date:</span>
              <span className="font-medium">
                {new Date(stockItem.expiryDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Days Until Expiry:</span>
              <span
                className={`font-medium ${
                  stockItem.daysUntilExpiry < 30
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {stockItem.daysUntilExpiry} days
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <div>{getStatusBadge()}</div>
            </div>
          </div>
        </div> */}

        {/* Purchase Information */}
        {/* <div className="bg-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Purchase Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice ID:</span>
              <span className="font-medium">
                #{stockItem.purchaseInvoiceId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice Number:</span>
              <span className="font-medium">
                {stockItem.purchaseInvoiceNumber}
              </span>
            </div>
          </div>
        </div> */}

        {/* Activity Information */}
        {/* <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            Activity Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Date Added:</span>
              <span className="font-medium">
                {new Date(stockItem.dateAdded).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Added By:</span>
              <span className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                User #{stockItem.addedBy}
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </BasePageDialog>
  );
}
