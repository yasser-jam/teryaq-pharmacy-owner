'use client';

import { useTranslations } from 'next-intl';
import BaseHeader from '@/components/base/base-header';
import BaseNotFound from '@/components/base/base-not-found';
import BaseSearch from '@/components/base/base-search';
import BaseSkeleton from '@/components/base/base-skeleton';
import SupplierCard from '@/components/supplier/supplier-card';
import SysInfo from '@/components/sys/sys-info';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { errorToast, successToast } from '@/lib/toast';
import { Supplier } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Suppliers');
  const router = useRouter();


  const [searchValue, setSearchValue] = useState<string>('')

  const { data: suppliers, isFetching, refetch } = useQuery<Supplier[]>({
    queryKey: ['suppliers'],
    queryFn: () => api('/suppliers/search', {
      params: {
        name: searchValue
      }
    }),
  });

  const { mutate: removeSupplier } = useMutation({
    mutationFn: (id: number) => api(`/suppliers/${id}`, {
      method: 'DELETE'
    }),
    onSuccess: () => {
      refetch()
      successToast(t('deleted'))
    },
    onError: () => {
      
      errorToast(t('supplierDelete'))
    }
  })

  useEffect(() => {
    refetch()
  }, [searchValue])
  return (
    <>
      <BaseHeader
        title={t('title')}
        subtitle={t('subtitle')}
      >
        <Button onClick={() => router.push('/suppliers/create')}>
          <Plus />
          {t('add')}
        </Button>
      </BaseHeader>

      {/* <SysInfo
      className='mt-4'
        text='
This page is responsible for adding suppliers and update their data in order to make orders'
      /> */}

        <BaseSearch 
          value={searchValue} 
          onChange={setSearchValue} 
          className='w-full mt-4'
          placeholder={t('search')}
        />

      {isFetching ? (
        <BaseSkeleton type='grid' />
      ) : suppliers?.length ? (
        <div className='grid grid-cols-3 gap-8 mt-12'>
          {suppliers?.map((el) => (
            <SupplierCard 
              key={el.id} 
              supplier={el} 
              onEdit={() => router.replace(`/suppliers/${el.id}`)} 
              onDelete={() => removeSupplier(el.id)}
            />
          ))}
        </div>
      ) : <BaseNotFound item={t('supplier')} />}

      {children}
    </>
  );
}
