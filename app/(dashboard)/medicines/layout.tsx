'use client';
import BaseHeader from '@/components/base/base-header';
import BaseSkeleton from '@/components/base/base-skeleton';
import MedicineCard from '@/components/medicine/medicine-card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Medicine } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: products, isFetching } = useQuery<{ content: Medicine[] }>({
    queryKey: ['medicines-list'],
    queryFn: () => api('pharmacy_products'),
  });

  const router = useRouter()

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
      </div>

      {isFetching ? (
        <BaseSkeleton />
      ) : (
        <div className='max-h-[800px] overflow-auto'>
          {products?.content.map((el) => (
            <div>div</div>
          ))}
        </div>
      )}

      {children}
    </>
  );
}
