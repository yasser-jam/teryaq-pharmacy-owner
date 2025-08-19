"use client";
import BaseHeader from '@/components/base/base-header';
import BaseNotFound from '@/components/base/base-not-found';
import BaseSkeleton from '@/components/base/base-skeleton';
import CustomerCard from '@/components/customer/customer-card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { successToast } from '@/lib/toast';
import { Customer } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data: customers, isFetching, refetch } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: () => api('/customers'),
  });

  const { mutate: removeCustomer } = useMutation({
    mutationFn: (id: number) =>
      api(`/customers/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      refetch();

      successToast('Customer Deleted Successfully');
    },
  });

  return (
    <>
      <BaseHeader
        title='Customers'
        subtitle='Customers page for adding the customers to handle sales operations'
      >
        <Button onClick={() => router.push('/customers/list/create')}>
          <Plus />
          Add Customer
        </Button>
      </BaseHeader>

      {/* <SysInfo
        text='
This page is responsible for adding customers and update their data in order to make sales'
      /> */}

      {isFetching ? (
        <BaseSkeleton />
      ) : customers?.length ? (
        <div className='grid grid-cols-1 gap-8 mt-12'>
          {customers?.map((el) => (
            <CustomerCard
              key={el.id}
              customer={el}
              onEdit={() => router.replace(`/customers/list/${el.id}`)}
              onDelete={() => removeCustomer(el.id)}
            ></CustomerCard>
          ))}
        </div>
      ) : (
        <BaseNotFound item='Customer' />
      )}

      {children}
    </>
  );
}
