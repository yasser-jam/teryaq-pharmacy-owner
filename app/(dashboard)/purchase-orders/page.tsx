'use client'
import BaseHeader from '@/components/base/base-header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { PurchaseOrder } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PurchaseOrderCard from '@/components/purchase-order/purchase-order-card';
import { toast } from 'sonner';
import { PurchaseInvoiceDialog } from '@/components/purchase-invoice/purchase-invoice-dialog';
import { useTranslations } from 'next-intl';
import BaseDateRangeFilter from '@/components/base/base-date-range-filter';
import dayjs from 'dayjs';
import BaseNotFound from '@/components/base/base-not-found';
import BaseSkeleton from '@/components/base/base-skeleton';

export default function Page() {
  const router = useRouter();
  const t = useTranslations('PurchaseOrderList');
  
  const [activeTab, setActiveTab] = useState<'pending' | 'done'>('pending');
  const [receivingOrderId, setReceivingOrderId] = useState<number | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);
  const [createInvoiceDialogOpen, setCreateInvoiceDialogOpen] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);
  
  const [startDate, setStartDate] = useState<string | undefined>(
    dayjs().format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = useState<string | undefined>(
    dayjs().format('YYYY-MM-DD')
  );

  const queryClient = useQueryClient();
  // const { data: orders = { content: [] }, isLoading, refetch } = useQuery<{ content: PurchaseOrder[] }>({
  //   queryKey: ['purchase-orders', startDate, endDate],
  //   queryFn: () => api('/purchase-orders/time-range', {
  //     params: {
  //       startDate: dayjs(startDate).toISOString(),
  //       endDate: dayjs(endDate).toISOString(),
  //     },
  //   }),
  // });

  const { data: orders = { content: [] }, isLoading, refetch } = useQuery<{ content: PurchaseOrder[] }>({
    queryKey: ['purchase-orders', startDate, endDate],
    queryFn: () => api('/purchase-orders'),
  });

  useEffect(() => {
    refetch();
  }, [startDate, endDate, refetch]);

  const handleDateChange = (
    start: string | undefined,
    end: string | undefined
  ) => {
    setStartDate(start);
    setEndDate(end);
  };

  useMutation({
    mutationFn: (orderId: number) => 
      api(`/purchase-orders/${orderId}/receive`, { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      toast.success(t('receiveSuccess'));
      setReceivingOrderId(null);
    },
    onError: (error) => {
      console.error('Error receiving order:', error);
      toast.error(t('receiveError'));
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
      toast.success(t('deleteSuccess'));
      setDeletingOrderId(null);
    },
    onError: (error) => {
      console.error('Error deleting order:', error);
      toast.error(t('deleteError'));
      setDeletingOrderId(null);
    }
  });

  const handleReceiveOrder = async (order: PurchaseOrder) => {
    setSelectedPurchaseOrder(order);
    setCreateInvoiceDialogOpen(true);
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
    <div className='container px-4 py-6 rtl:text-right'>
      <BaseHeader
        title={t('title')}
        subtitle={t('subtitle')}
      >
        <Button onClick={() => router.push('/purchase-orders/create')}>
          <Plus className='mr-2 h-4 w-4' />
          {t('createButton')}
        </Button>
      </BaseHeader>

      <div className='mt-4'>
        <BaseDateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          onSearch={() => refetch()}
        />
      </div>

      <Tabs 
        defaultValue='pending' 
        className='mt-6'
        onValueChange={(value) => setActiveTab(value as 'pending' | 'done')}
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='pending'>{t('tabs.pending')}</TabsTrigger>
          <TabsTrigger value='done'>{t('tabs.done')}</TabsTrigger>
        </TabsList>

        <TabsContent value='pending' className='mt-4 space-y-4'>
          {isLoading ? (
            <div className='flex justify-center'>
              <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary' />
              <span className='ms-2'>{t('loading')}</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <BaseNotFound item='Purchase Order' />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
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
            <BaseSkeleton type="grid" />
          ) : filteredOrders.length === 0 ? (
            <BaseNotFound item='Purchase Order' />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredOrders.map((order) => (
                <PurchaseOrderCard 
                  key={order.id} 
                  order={order}
                  onDelete={handleDeleteOrder}
                  isDeleting={deletingOrderId === order.id}
                  hideActionMenu
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {createInvoiceDialogOpen && (
        <PurchaseInvoiceDialog
          isOpen={createInvoiceDialogOpen}
          onClose={() => setCreateInvoiceDialogOpen(false)}
          purchaseOrder={selectedPurchaseOrder!}
        />
      )}          
    </div>
  );
}
