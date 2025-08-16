'use client'
import BaseHeader from '@/components/base/base-header';
import { MedicineInlineCard } from '@/components/medicine/medicine-inline-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Medicine } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter();

  const { data: purchases, isFetching } = useQuery({
    queryKey: ['purchases'],
    queryFn: () => api('/purchase-orders'),
  });

  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 100,
  });

  useEffect(() => {

  }, [pagination])

  return (
    <>
      <div className='container px-4'>
        <BaseHeader
          title='Purchases'
          subtitle='From this page you can see all the Purchases Orders'
        >
          <Button onClick={() => router.push('/purchase-orders/create')}>
            <Plus />
            Make New Purchase
          </Button>
        </BaseHeader>

        <div className='grid gap-4'>
            <div className='px-4 py-2'>
                <div>Purchase Title</div>
                <div>items count</div>
            </div>
        </div>
      </div>
    </>
  );
}
