'use client';

import BaseHeader from '@/components/base/base-header';
import BaseNotFound from '@/components/base/base-not-found';
import BaseSkeleton from '@/components/base/base-skeleton';
import POSCard from '@/components/pos/pos-card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Pagination, SaleInvoice } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import BaseDateRangeFilter from '@/components/base/base-date-range-filter';
import dayjs from 'dayjs';
import { initPagination } from '@/lib/init';
import BasePagination from '@/components/base/pagination';
import Link from 'next/link';

export default function Page({ children }: { children: React.ReactNode }) {
  let { data, isFetching, refetch, isError } = useQuery<SaleInvoice[]>({
    queryKey: ['list-pos'],
    queryFn: () =>
      api('/sales/searchByDateRange', {
        params: {
          startDate,
          endDate,
        },
      }),
  });

  const [filteredData, setFilteredData] = useState<SaleInvoice[]>([]);

  useEffect(() => {
    setFilteredData(data || []);
    if (isError) setFilteredData([]);
  }, [data, isError]);

  const router = useRouter();

  const [startDate, setStartDate] = useState<string | undefined>(
    dayjs().format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = useState<string | undefined>(
    dayjs().format('YYYY-MM-DD')
  );

  const [pagination, setPagination] = useState<Pagination>(initPagination())

  // useEffect(() => {
  //   refetch()
  // }, [pagination])

  const handleDateChange = (
    start: string | undefined,
    end: string | undefined
  ) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <>
      <BaseHeader title='Sales' subtitle='Sales pageto handle sales operations'>
        <div className='flex items-center gap-2'>
          <Link href='/pos/create' target='_blank'>
            <Button>
              <Plus />
              Make new Sale
            </Button>

          </Link>
        </div>
      </BaseHeader>

      <div className='mt-4'>
        <BaseDateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          onSearch={() => refetch()}
        />
      </div>

      {isFetching ? (
        <BaseSkeleton />
      ) : filteredData?.length ? (
        <div className='mt-4 grid gap-4 max-h-[500px] overflow-auto'>
          {filteredData?.map((el) => (
            <POSCard key={el.id} invoice={el}></POSCard>
          ))}
        </div>
      ) : (
        <BaseNotFound item='Sale' />
      )}

      {children}

      {/* <BasePagination pagination={pagination} onPaginationChange={setPagination} /> */}
    </>
  );
}
