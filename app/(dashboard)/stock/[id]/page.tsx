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
import { StockItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { id } from "date-fns/locale";
import { use } from "react";
import { api } from "@/lib/api";
import BasePageDialog from "@/components/base/page-dialog";

export default function StockPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: stockItem } = useQuery<StockItem>({
    queryKey: ["stock-item", id],
    queryFn: () => api(`/stock/${id}/detail`),
  });

  if (!stockItem) return null;

  const getStatusBadge = () => {
    if (stockItem.isExpired) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (stockItem.isExpiringSoon) {
      return <Badge variant="blue-light">Expiring Soon</Badge>;
    }
    if (stockItem.quantity <= stockItem.minQuantity) {
      return <Badge variant="blue-outline">Low Stock</Badge>;
    }
    return <Badge variant="green">In Stock</Badge>;
  };

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
      onOpenChange={() => {}}
      loading={false}
      title="Stock Item"
      subtitle="Stock Item"
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
            Product Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Product ID:</span>
              <span className="font-medium">#{stockItem.productId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Batch Number:</span>
              <span className="font-medium">{stockItem.batchNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Supplier:</span>
              <span className="font-medium">{stockItem.supplier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pharmacy ID:</span>
              <span className="font-medium">#{stockItem.pharmacyId}</span>
            </div>
          </div>
        </div>

        {/* Inventory Details */}
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="h-5 w-5 text-green-600" />
            Inventory Details
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Stock:</span>
              <span className="font-bold text-lg">{stockItem.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bonus Quantity:</span>
              <span className="font-medium text-green-600">
                +{stockItem.bonusQty}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Available:</span>
              <span className="font-bold">{stockItem.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Minimum Stock:</span>
              <span className="font-medium">{stockItem.minQuantity}</span>
            </div>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="bg-blue-50 rounded-lg p-6">
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
        </div>

        {/* Expiry & Status */}
        <div className="bg-amber-50 rounded-lg p-6">
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
        </div>

        {/* Purchase Information */}
        <div className="bg-purple-50 rounded-lg p-6">
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
        </div>

        {/* Activity Information */}
        <div className="bg-gray-50 rounded-lg p-6">
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
        </div>
      </div>
    </BasePageDialog>
  );
}
