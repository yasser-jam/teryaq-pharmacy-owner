import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PurchaseOrder } from "@/types";
import { CalendarDays, Package, User, DollarSign } from "lucide-react";
import ActionMenu from "../base/action-menu";
import { Button } from "../ui/button";

interface PurchaseItem {
  name: string;
  quantity: number;
  unitPrice: number;
}
interface PurchaseOrderCardProps {
  order: PurchaseOrder;
  onReceive?: (orderId: number) => void;
  isReceiving?: boolean;
  onDelete: (orderId: number) => Promise<void>;
  isDeleting?: boolean;
  hideActionMenu?: boolean;
}

export default function PurchaseOrderCard({
  order,
  onReceive,
  isReceiving,
  onDelete,
  isDeleting,
  hideActionMenu,
}: PurchaseOrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "DONE":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "CANCELLED":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (
    dateArray: [number, number, number, number, number, number, number]
  ) => {
    const [year, month, day, hour, minute] = dateArray;
    return new Date(year, month - 1, day, hour, minute).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xs transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.id}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <User className="h-4 w-4" />
              <span className="font-medium">{order.supplierName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${getStatusColor(
                order.status
              )} font-medium capitalize px-3 py-1`}
            >
              {order.status.toLowerCase()}
            </Badge>

            <ActionMenu
              deleteAction
              onDelete={() => onDelete(order.id)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">Created Date</p>
            <p className="text-sm text-gray-600">
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Items ({order.items.length})
          </h4>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {item.productName}
                  </p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {order.currency} {item.price}
                  </p>
                  <p className="text-sm text-gray-600">per unit</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Amount */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-gray-900">Total Amount</span>
            </div>
            <span className="text-xl font-bold text-green-600">
              {order.currency} {order.total.toFixed(2)}
            </span>
          </div>
        </div>

        <Button
          className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-white w-full"
          onClick={() => onReceive?.(order.id)}
        >
          Receive Order
        </Button>
      </CardContent>
    </Card>
  );
}
