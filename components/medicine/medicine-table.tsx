'use client';

import { useState } from 'react';
import { useUpdateEffect } from 'ahooks';

import { useRouter } from 'next/navigation';

import { Eye, Reply, Trash } from 'iconoir-react';

import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';

import { Medicine, Pagination } from '@/types';

import { api } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import BaseTable from '@/components/base/table';

interface Props {
  search: string;
}

export function MedicineTable({ search }: Props) {
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalCount: 100,
  });

  const router = useRouter();

  const fetchMedicines = async () => {
    const response = await api('/pharmacy_products', {
      params: {
      },
    });

    // update the total count
    setPagination((val) => ({ limit: response?.size, page: response?.number, totalCount: response?.totalElements }));

    return response?.content;
  };

  const {
    data: medicines,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['medicines-list-table', pagination.limit, pagination.page],
    queryFn: fetchMedicines,
    initialData: [],
  });

  // reset pagination on filters or search change
  // refetch when change search or filters
  useUpdateEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1, limit: 10 }));
    refetch();
  }, [search]);

  const columns: ColumnDef<Medicine>[] = [
    {
      accessorKey: 'name',
      header: 'Trade Name',
      cell: ({ row }) => (
        <div className='text-sm font-medium'>{row.original.tradeName}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Type',
      cell: ({ row }) => (
        <div className='text-sm text-text-secondary whitespace-pre-wrap max-w-xs'>
          {row.original.type}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Categories',
      cell: ({ row }) =>
        row.original.categories?.length ? (
          row.original.categories?.map((el) => <Badge>{el}</Badge>)
        ) : (
          <span className='text-sm text-text-secondary italic'>
            No category
          </span>
        ),
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
            className='size-8 text-secondary'
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
