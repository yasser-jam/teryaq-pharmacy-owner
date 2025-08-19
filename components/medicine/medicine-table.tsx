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
import { cn, isMasterProduct } from '@/lib/utils';
import DeleteButton from '../base/delete-button';
import MedicineTypeBadge from './medicine-type-badge';

interface Props {
  search: string;
  medicines: Medicine[];
  onDelete?: (med: Medicine) => void
}

export function MedicineTable({ medicines, onDelete }: Props) {
  const router = useRouter();

  const columns: ColumnDef<Medicine>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className='flex items-center'>
          <Avatar>
            <AvatarFallback className='bg-teal-500 text-white'>
              <Flask></Flask>
            </AvatarFallback>
          </Avatar>

          <div className='ms-2'>
            <div className='text-base font-medium'>{row.original.tradeName}</div>
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
        <MedicineTypeBadge med={row.original}></MedicineTypeBadge>
      ),
    },

    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ row }) => (
        <Badge variant='warning' size="lg">{row.original.size}</Badge>
      ),
    },
    {
      accessorKey: 'requiresPrescription',
      header: 'Require Prescription',
      cell: ({ row }) => 
        <Badge variant={row.original.requiresPrescription ? 'destructive' : 'default'} size="lg">{row.original.requiresPrescription ? 'Require Prescription' : 'Do not Require'}</Badge>
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className='flex items-center justify-end gap-2'>
          <Button
            onClick={() => router.push(`/medicines/${row.original.id}`)}
            variant='outline'
            className='text-primary'
            size='icon'
            disabled={isMasterProduct(row.original)}
          >
            <Eye />
          </Button>
          <DeleteButton disabled={isMasterProduct(row.original)} onDelete={() => onDelete?.(row.original)} />
        </div>
      ),
    },
  ];

  return (
    <div className='rounded-md'>
      <BaseTable
        columns={columns}
        data={medicines || []}
        hidePagination
      />
    </div>
  );
}
