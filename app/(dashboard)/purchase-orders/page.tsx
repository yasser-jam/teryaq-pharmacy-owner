'use client'
import BaseHeader from '@/components/base/base-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { PurchaseOrder } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PurchaseOrderCard from '@/components/purchase-order/purchase-order-card';
import { toast } from 'sonner';
import { PurchaseInvoiceDialog } from '@/components/purchase-invoice/purchase-invoice-dialog';

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'done'>('pending');

  const [receivingOrderId, setReceivingOrderId] = useState<number | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);
  const [createInvoiceDialogOpen, setCreateInvoiceDialogOpen] = useState(false);

  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);

  const queryClient = useQueryClient();
  const { data: orders = { content: [] }, isLoading } = useQuery<{ content: PurchaseOrder[] }>({
    queryKey: ['purchase-orders'],
    queryFn: () => api('/purchase-orders'),
  });

  const receiveOrderMutation = useMutation({
    mutationFn: (orderId: number) => 
      api(`/purchase-orders/${orderId}/receive`, { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success('Order marked as received successfully');
      setReceivingOrderId(null);
    },
    onError: (error) => {
      console.error('Error receiving order:', error);
      toast.error('Failed to mark order as received');
      setReceivingOrderId(null);
    }
  });

  const filteredOrders = orders.content.filter(order => 
    activeTab === 'pending' ? order.status === 'PENDING' : order.status === 'DONE'
  );

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: number) => 
      api(`/purchase-orders/${orderId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success('Order deleted successfully');
      setDeletingOrderId(null);
    },
    onError: (error) => {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
      setDeletingOrderId(null);
    }
  });

  const handleReceiveOrder = async (order: PurchaseOrder) => {
    setSelectedPurchaseOrder(order);
    setCreateInvoiceDialogOpen(true);
    try {
      // setReceivingOrderId(orderId);
      // await receiveOrderMutation.mutateAsync(orderId);
    } catch (error) {
      // console.error('Error in handleReceiveOrder:', error);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      setDeletingOrderId(orderId);
      await deleteOrderMutation.mutateAsync(orderId);
    } catch (error) {
      console.error('Error in handleDeleteOrder:', error);
    }
  };

  return (
    <div className='container px-4 py-6'>
      <BaseHeader
        title='Purchase Orders'
        subtitle='Manage and track your purchase orders'
      >
        <Button onClick={() => router.push('/purchase-orders/create')}>
          <Plus className='mr-2 h-4 w-4' />
          New Purchase Order
        </Button>
      </BaseHeader>

      <Tabs 
        defaultValue='pending' 
        className='mt-6'
        onValueChange={(value) => setActiveTab(value as 'pending' | 'done')}
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='pending'>Pending Orders</TabsTrigger>
          <TabsTrigger value='done'>Received Orders</TabsTrigger>
        </TabsList>

        <TabsContent value='pending' className='mt-4 space-y-4'>
          {isLoading ? (
            <div className='flex justify-center '>
              <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary' />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className='rounded-lg border border-dashed p-6 text-center text-sm'>
              <p className='text-muted-foreground'>No {activeTab} purchase orders found</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {filteredOrders.map((order) => (
                <PurchaseOrderCard 
                  key={order.id} 
                  order={order}
                  onReceive={() => handleReceiveOrder(order)}
                  isReceiving={receivingOrderId === order.id}
                  onDelete={handleDeleteOrder}
                  isDeleting={deletingOrderId === order.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='done' className='mt-4 space-y-4'>
          {isLoading ? (
            <div className='flex justify-center '>
              <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary' />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className='rounded-lg border border-dashed p-6 text-center text-sm'>
              <p className='text-muted-foreground'>No {activeTab} purchase orders found</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {filteredOrders.map((order) => (
                <PurchaseOrderCard 
                  key={order.id} 
                  order={order}
                  onReceive={() => handleReceiveOrder(order)}
                  isReceiving={receivingOrderId === order.id}
                  onDelete={handleDeleteOrder}
                  isDeleting={deletingOrderId === order.id}
                  hideActionMenu
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {
        createInvoiceDialogOpen && (
          <PurchaseInvoiceDialog
            isOpen={createInvoiceDialogOpen}
            onClose={() => setCreateInvoiceDialogOpen(false)}
            purchaseOrder={selectedPurchaseOrder!}
          />
        )
      }          
    </div>
  );
}
