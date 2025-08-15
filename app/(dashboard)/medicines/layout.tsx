'use client';
import BaseHeader from '@/components/base/base-header';
import BaseSkeleton from '@/components/base/base-skeleton';
import { MedicineCard } from '@/components/medicine/medicine-card';
import { MedicineTable } from '@/components/medicine/medicine-table';
import { SysViewSwitch } from '@/components/sys/view-switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Medicine } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const {
    data: medicines,
    isFetching,
    refetch,
  } = useQuery<{ content: Medicine[] }>({
    queryKey: ['medicines-list'],
    queryFn: () => api('pharmacy_products'),
  });

  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<'cards' | 'inline-cards' | 'table'>('table');

  const router = useRouter();

  useEffect(() => {
    refetch();
  }, [search]);

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

        <div className='flex items-center gap-4 my-4'>
          <Input
            value={search}
            onChange={(val) => setSearch(String(val))}
            prefix={<Search></Search>}
            className='grow'
            placeholder='Search for Medicine'
          />

          <SysViewSwitch mode={mode} onModeChange={setMode} />
        </div>
      </div>

      {isFetching ? (
        <BaseSkeleton />
      ) : (
        <>
          {mode == 'table' ? (
            <MedicineTable search='' medicines={medicines?.content || []} />
          ) : (
            <div className='grid grid-cols-3 gap-4 max-h-[800px] overflow-auto mt-4'>
              {medicines?.content?.map((el) => (
                <MedicineCard key={el.id} medicine={el} />
              ))}
            </div>
          )}
        </>
      )}

      {children}
    </>
  );
}
