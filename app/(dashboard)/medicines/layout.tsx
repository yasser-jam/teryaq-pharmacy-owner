'use client';
import BaseHeader from '@/components/base/base-header';
import BaseSkeleton from '@/components/base/base-skeleton';
import { MedicineCard } from '@/components/medicine/medicine-card';
import {MedicineTable} from '@/components/medicine/medicine-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Medicine } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: products, isFetching, refetch } = useQuery<{ content: Medicine[] }>({
    queryKey: ['medicines-list'],
    queryFn: () => api('pharmacy_products'),
  });

  const [search, setSearch] = useState('')

  const router = useRouter();


  useEffect(() => {
    refetch()
  }, [search])

  return (
    <>
      <div>
        <BaseHeader
          title='Medicines'
          subtitle='From this page you can see all the Medicines related to your Pharmacy'
        >
          <Button onClick={() => router.push('/medicines/create')}>
            <Plus />
            Add Medicine
          </Button>
        </BaseHeader>

          <Input value={search} onChange={(val)=>setSearch(String(val))} className='my-4' prefix={<Search></Search>} placeholder='Search for Medicine' />

      </div>

      {isFetching ? (
        <BaseSkeleton />
      ) : (
        <>

        <MedicineTable search='' />

          <div className='grid grid-cols-3 gap-4 max-h-[800px] overflow-auto mt-4'>
            {products?.content?.map((el) => (
              <MedicineCard medicine={el} />
            ))}
          </div>
        </>
      )}

      {children}
    </>
  );
}
