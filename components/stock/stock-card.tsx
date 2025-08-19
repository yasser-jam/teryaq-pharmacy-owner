import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Pill,
  Hash,
  TrendingUp,
  ShoppingCart,
} from "lucide-react"
import type { ProductType, StockItem } from "@/types"

interface StockCardProps {
  stockItem: StockItem
}

export function StockCard({ stockItem }: StockCardProps) {
  const getProductTypeColor = (type: ProductType) => {
    switch (type) {
      case "MASTER":
      case "مركزي":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "PHARMACY":
      case "صيدلية":
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getExpiryStatus = () => {
    if (stockItem.isExpired) {
      return {
        color: "text-red-600",
        bg: "bg-red-50",
        icon: AlertTriangle,
        text: "Expired",
      }
    }
    if (stockItem.isExpiringSoon) {
      return {
        color: "text-amber-600",
        bg: "bg-amber-50",
        icon: Clock,
        text: `${stockItem.daysUntilExpiry} days left`,
      }
    }
    return {
      color: "text-green-600",
      bg: "bg-green-50",
      icon: CheckCircle,
      text: "Good",
    }
  }

  const getStockStatus = () => {
    if (stockItem.minQuantity && stockItem.quantity <= stockItem.minQuantity) {
      return { color: "text-red-600", bg: "bg-red-50", text: "Low Stock" }
    }
    return { color: "text-green-600", bg: "bg-green-50", text: "In Stock" }
  }

  const expiryStatus = getExpiryStatus()
  const stockStatus = getStockStatus()
  const ExpiryIcon = expiryStatus.icon

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md pt-0">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            <h3 className="font-semibold text-lg truncate">{stockItem.productName}</h3>
          </div>
          <Badge className={`${getProductTypeColor(stockItem.productType)} font-medium`}>{stockItem.productType}</Badge>
        </div>
        <div className="flex items-center gap-2 text-indigo-100">
          <Hash className="h-4 w-4" />
          <span className="text-sm">ID: {stockItem.productId}</span>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Quantity Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 rounded-lg ${stockStatus.bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <Package className={`h-4 w-4 ${stockStatus.color}`} />
              <span className="text-sm font-medium text-gray-700">Quantity</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{stockItem.quantity}</span>
              {stockItem.bonusQty > 0 && <span className="text-sm text-green-600">+{stockItem.bonusQty}</span>}
            </div>
            <span className={`text-xs ${stockStatus.color} font-medium`}>{stockStatus.text}</span>
          </div>

          <div className={`p-3 rounded-lg ${expiryStatus.bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <ExpiryIcon className={`h-4 w-4 ${expiryStatus.color}`} />
              <span className="text-sm font-medium text-gray-700">Expiry</span>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {new Date(stockItem.expiryDate).toLocaleDateString()}
            </div>
            <span className={`text-xs ${expiryStatus.color} font-medium`}>{expiryStatus.text}</span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-4 bg-gradient-to-r from-pink-400 to-red-400 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">Categories</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {stockItem.categories.map((category, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Supplier */}
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
          <User className="h-4 w-4 text-blue-600" />
          <div>
            <span className="text-sm font-medium text-gray-700">Supplier</span>
            <p className="text-sm text-blue-700 font-medium">{stockItem.supplier}</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
            <ShoppingCart className="h-4 w-4 text-green-600" />
            <div>
              <span className="text-xs text-gray-600">Purchase</span>
              <p className="text-sm font-bold text-green-700">${stockItem.actualPurchasePrice}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <div>
              <span className="text-xs text-gray-600">Selling</span>
              <p className="text-sm font-bold text-emerald-700">${stockItem.sellingPrice}</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Batch: {stockItem.batchNo}</span>
            <span>Invoice: {stockItem.purchaseInvoiceNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>Added: {new Date(stockItem.dateAdded).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
