import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PurchaseOrder } from "@/types";
import { CalendarDays, Package, DollarSign, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { getCookie } from "@/lib/utils";
import { Button } from "../ui/button";
import dayjs from "dayjs";

interface PurchaseOrderSupplierCardProps {
  order: PurchaseOrder;
  onViewDetails?: (orderId: number) => void;
}

export default function PurchaseOrderSupplierCard({
  order,
  onViewDetails,
}: PurchaseOrderSupplierCardProps) {
  const t = useTranslations('PurchaseOrderCard');
  const tStatus = useTranslations('PurchaseOrderCard.status');

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "DONE":
      case "RECEIVED":
        return "text-green-600 bg-green-50 border-green-200";
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
    return dayjs(new Date(year, month - 1, day, hour, minute)).format('MMM DD, YYYY HH:mm');
  };

  const getStatusTranslation = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': tStatus('pending'),
      'DONE': tStatus('done'),
      'RECEIVED': tStatus('received'),
      'CANCELLED': tStatus('cancelled')
    };
    return statusMap[status] || status.toLowerCase();
  };

  const locale = getCookie('tp.locale') || 'en';

  return (
    <Card dir={locale === 'ar' ? 'rtl' : 'ltr'} className="w-full hover:shadow-md transition-shadow duration-200 cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Order info */}
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                {t('orderNumber', { id: order.id })}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarDays className="h-3 w-3" />
              <span>{formatDate(order.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="h-3 w-3" />
              <span>
                {order.items.length} {order.items.length === 1 ? t('items').slice(0, -1) : t('items')}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              {t('quantity')}: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
          </div>

          {/* Right side - Amount and actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-lg font-bold text-green-600">
                {order.currency} {order.total.toFixed(2)}
              </span>
            </div>

            <Badge
              variant="outline"
              className={`${getStatusColor(order.status)} font-medium capitalize px-2 py-1 text-xs`}
            >
              {getStatusTranslation(order.status)}
            </Badge>

            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                className="group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors"
                onClick={() => onViewDetails(order.id)}
              >
                {t('viewDetails')}
                <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
