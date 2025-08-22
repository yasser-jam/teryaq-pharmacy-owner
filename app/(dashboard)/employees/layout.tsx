'use client';
import BaseHeader from '@/components/base/base-header';
import BaseNotFound from '@/components/base/base-not-found';
import BaseSkeleton from '@/components/base/base-skeleton';
import EmployeeCard from '@/components/employee/employee-card';
import SupplierCard from '@/components/supplier/supplier-card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Employee } from '@/lib/schema';
import { successToast } from '@/lib/toast';
import { Supplier } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Page({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data: employees, isFetching, refetch } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: () => api('/employees'),
  });

  const { mutate: removeEmployee } = useMutation({
    mutationFn: (id: number) => api(`/employees/${id}`, {
      method: 'DELETE'
    }),
    onSuccess: () => {
      refetch()

      successToast('Employee Deleted Successfully')
    }
  })

  return (
    <>
      <BaseHeader
        title='Employees'
        subtitle='Employees page for adding the employees to handle sales operations'
      >
        <Button onClick={() => router.push('/employees/create')}>
          <Plus />
          Add Employee
        </Button>
      </BaseHeader>

      {isFetching ? (
        <BaseSkeleton />
      ) : employees?.length ?  (
        <div className='grid grid-cols-3 gap-8 mt-12'>
          {employees?.map((el) => (
            <EmployeeCard key={el.id} employee={el} onEdit={() => router.replace(`/employees/${el.id}`)} onDelete={() => removeEmployee(el.id)} ></EmployeeCard>
            // <SupplierCard key={el.id} supplier={el} onEdit={() => router.replace(`/suppliers/${el.id}`)} onDelete={() => removeEmployee(el.id)}></SupplierCard>
          ))}
        </div>
      ) : <BaseNotFound item='Employee' />}

      {children}
    </>
  );
}
