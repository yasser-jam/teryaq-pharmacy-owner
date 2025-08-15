'use client';

import { useState } from 'react';
import { useUpdateEffect } from 'ahooks';

import { useRouter } from 'next/navigation';

import { Eye, Flask, Reply, Trash } from 'iconoir-react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';

import { Medicine, Pagination } from '@/types';

import { api } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import BaseTable from '@/components/base/table';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  search: string;
  medicines: Medicine[];
}

export function MedicineTable({ search, medicines }: Props) {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalCount: 100,
  });

  const router = useRouter();

  const queryClient = useQueryClient();

  // reset pagination on filters or search change
  // refetch when change search or filters
  useUpdateEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1, limit: 10 }));
    queryClient.invalidateQueries({ queryKey: ['medicines-list'] });
  }, [search]);

  const columns: ColumnDef<Medicine>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className='flex'>
          <Avatar>
            <AvatarFallback className='bg-teal-500 text-white'>
              <Flask></Flask>
            </AvatarFallback>
          </Avatar>

          <div className='ms-2'>
            <div className='text-sm font-medium'>{row.original.tradeName}</div>
            <div className='text-xs text-gray-500 font-medium'>
              {row.original.scientificName}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge className='text-purple-600 bg-purple-100 px-2 py-1'>{row.original.productTypeName}</Badge>
      ),
    },

    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ row }) => (
        <Badge className='text-amber-600 bg-amber-100 px-2 py-1'>{row.original.size}</Badge>
      ),
    },
    {
      accessorKey: 'requiresPrescription',
      header: 'Require Prescription',
      cell: ({ row }) => 
        <Badge className={cn('', row.original.requiresPrescription ? 'text-destructive bg-destructive/5' : 'text-primary bg-primary/5')}>{row.original.requiresPrescription ? 'Require' : 'Do not Require'}</Badge>
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className='flex items-center justify-end gap-2'>
          <Button
            onClick={() => router.push(`/medicines/${row.original.id}`)}
            variant='outline'
            className='size-8 text-primary'
            size='icon'
          >
            <Eye />
          </Button>
          <Button
            disabled
            variant='outline'
            className='size-8 text-destructive'
            size='icon'
          >
            <Trash />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className='rounded-md border'>
      <BaseTable
        columns={columns}
        data={medicines || []}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
