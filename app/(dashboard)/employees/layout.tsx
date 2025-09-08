'use client';
import BaseHeader from '@/components/base/base-header';
import BaseNotFound from '@/components/base/base-not-found';
import BaseSkeleton from '@/components/base/base-skeleton';
import EmployeeCard from '@/components/employee/employee-card';
import SupplierCard from '@/components/supplier/supplier-card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Employee } from '@/types';
import { successToast } from '@/lib/toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useTranslations } from 'next-intl';

export default function Page({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const t = useTranslations('Employees');

  const { data: employees, isFetching, refetch } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: () => api('/employees'),
  });

  const { mutate: removeEmployee } = useMutation({
    mutationFn: (id: number) => api(`/employees/${id}`, {
      method: 'DELETE'
    }),
    onSuccess: () => {
      refetch();
      successToast(t('deleteSuccess'));
    }
  });

  return (
    <>
      <BaseHeader
        title={t('listTitle')}
        subtitle={t('listSubtitle')}
      >
        <Button onClick={() => router.push('/employees/create')}>
          <Plus />
          {t('addButton')}
        </Button>
      </BaseHeader>

      {isFetching ? (
        <BaseSkeleton type="grid" />
      ) : employees?.length ?  (
        <div className='grid grid-cols-3 gap-8 mt-12'>
          {employees?.map((el) => (
            <EmployeeCard key={el.id} employee={el} onEdit={() => router.replace(`/employees/${el.id}`)} onDelete={() => removeEmployee(el.id)} />
          ))}
        </div>
      ) : <BaseNotFound item={t('notFound')} />}

      {children}
    </>
  );
}
