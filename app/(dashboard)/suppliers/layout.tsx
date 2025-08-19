'use client';
import BaseHeader from '@/components/base/base-header';
import BaseNotFound from '@/components/base/base-not-found';
import BaseSkeleton from '@/components/base/base-skeleton';
import SupplierCard from '@/components/supplier/supplier-card';
import SysInfo from '@/components/sys/sys-info';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { successToast } from '@/lib/toast';
import { Supplier } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Page({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data: suppliers, isFetching, refetch } = useQuery<Supplier[]>({
    queryKey: ['suppliers'],
    queryFn: () => api('/suppliers'),
  });

  const { mutate: removeSupplier } = useMutation({
    mutationFn: (id: number) => api(`/suppliers/${id}`, {
      method: 'DELETE'
    }),
    onSuccess: () => {
      refetch()

      successToast('Supplier Deleted Successfully')
    }
  })

  return (
    <>
      <BaseHeader
        title='Suppliers'
        subtitle='Suppliers page for adding the suppliers to handle sales operations'
      >
        <Button onClick={() => router.push('/suppliers/create')}>
          <Plus />
          Add Supplier
        </Button>
      </BaseHeader>

      <SysInfo
      className='mt-4'
        text='
This page is responsible for adding suppliers and update their data in order to make orders'
      />

      {isFetching ? (
        <BaseSkeleton />
      ) : suppliers?.length ?  (
        <div className='grid grid-cols-3 gap-8 mt-12'>
          {suppliers?.map((el) => (
            <SupplierCard key={el.id} supplier={el} onEdit={() => router.replace(`/suppliers/${el.id}`)} onDelete={() => removeSupplier(el.id)}></SupplierCard>
          ))}
        </div>
      ) : <BaseNotFound item='Supplier' />}

      {children}
    </>
  );
}
