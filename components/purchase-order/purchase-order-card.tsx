import { PurchaseOrder } from "@/types"
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface PurchaseOrderCardProps {
  order: PurchaseOrder
  onReceive?: (orderId: number) => void
  isReceiving?: boolean
}

export default function PurchaseOrderCard({ order, onReceive, isReceiving = false }: PurchaseOrderCardProps) {
  const formattedDate = format(
    new Date(
      order.createdAt[0],
      order.createdAt[1] - 1,
      order.createdAt[2],
      order.createdAt[3],
      order.createdAt[4],
      order.createdAt[5]
    ),
    'PPpp'
  )

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    RECEIVED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }

  return (
    <Card className="w-full overflow-hidden border py-0">
      <CardHeader className="bg-gray-50 p-3">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-base font-semibold">Order #{order.id}</CardTitle>
            <CardDescription className="text-xs">
              Supplier: <span className="font-medium text-gray-900">{order.supplierName}</span>
            </CardDescription>
            <div className="text-xs text-gray-500">
              {formattedDate}
            </div>
          </div>
          <Badge className={`${statusColors[order.status]} hover:${statusColors[order.status]} capitalize text-xs h-6`}>
            {order.status.toLowerCase()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 text-sm">
        <div className="divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="px-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{item.productName}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.barcode} • {item.productType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {item.quantity} × {item.price.toFixed(2)} {order.currency}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(item.quantity * item.price).toFixed(2)} {order.currency}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-2 bg-gray-50 text-sm gap-2">
        <div className="text-gray-600">
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-2">
          <div className="font-semibold">
            {order.total.toFixed(2)} {order.currency}
          </div>
          {order.status === 'PENDING' && onReceive && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onReceive(order.id)}
              disabled={isReceiving}
              className="h-7 text-xs"
            >
              {isReceiving ? 'Receiving...' : 'Receive'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}