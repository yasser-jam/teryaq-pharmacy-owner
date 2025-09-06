'use client';
import BasePageDialog from '@/components/base/page-dialog';
import BasePagination from '@/components/base/pagination';
import BaseSkeleton from '@/components/base/base-skeleton';
import PurchaseOrderSupplierCard from '@/components/purchase-order/purchase-order-supplier-card';
import { api } from '@/lib/api';
import { PurchaseOrder, Pagination } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations('SupplierOrders');
  const router = useRouter();
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    size: 12,
    totalElements: 0
  });

  const { data, isFetching } = useQuery<{
    page: number;
    size: number;
    totalElements: number;
    content: PurchaseOrder[];
  }>({
    queryKey: ['supplier-orders', id, pagination.page, pagination.size],
    queryFn: () => api(`purchase-orders/supplier/${id}?page=${pagination.page}&size=${pagination.size}`),
  });

  const goBack = () => {
    router.replace('/suppliers')
  }

  const handleViewDetails = (orderId: number) => {
    router.push(`/purchase-orders/${orderId}`);
  };

  const handlePaginationChange = (newPagination: Pagination) => {
    setPagination(newPagination);
  };

  const orders = data?.content || [];
  const totalElements = data?.totalElements || 0;

  return (
    <BasePageDialog
      title={t('title')}
      className='w-[1200px] max-h-[90vh]'
      onOpenChange={goBack}
    >
      <div className="space-y-6">
        {/* Loading State */}
        {isFetching && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <BaseSkeleton key={index} className="h-16" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isFetching && orders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">{t('noOrders')}</div>
            <div className="text-gray-400 text-sm">{t('noOrdersDescription')}</div>
          </div>
        )}

        {/* Orders List */}
        {!isFetching && orders.length > 0 && (
          <>
            <div className="space-y-3">
              {orders.map((order) => (
                <PurchaseOrderSupplierCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalElements > pagination.size && (
              <div className="mt-6">
                <BasePagination
                  pagination={{
                    page: pagination.page,
                    size: pagination.size,
                    totalElements: totalElements
                  }}
                  onPaginationChange={handlePaginationChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </BasePageDialog>
  );
}
