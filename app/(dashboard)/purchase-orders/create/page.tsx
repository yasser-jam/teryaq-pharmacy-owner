'use client';
import BaseHeader from '@/components/base/base-header';
import BaseNotFound from '@/components/base/base-not-found';
import BasePageDialog from '@/components/base/page-dialog';
import { MedicineInlineCard } from '@/components/medicine/medicine-inline-card';
import SupplierInlineCard from '@/components/supplier/supplier-inline-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Medicine, PurchaseItem, Supplier } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const router = useRouter();

  const { data: medicines, isFetching: medicinesLoading } = useQuery<
    Medicine[]
  >({
    queryKey: ['medicines-orders-list'],
    queryFn: () => api('search/all-products'),
  });

  const { data: suppliers, isFetching: suppliersLoading } = useQuery<
    Supplier[]
  >({
    queryKey: ['suppliers-orders-list'],
    queryFn: () => api('suppliers'),
  });

  const [currency, setCurrency] = useState<'USD' | 'SYP'>('USD');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [supplierId, setSupplierId] = useState<number>(0);

  const goBack = () => router.replace('/purchase-orders');

  const selectMedicine = (med: Medicine) => {
    // remove
    if (items.find((el) => el.productId == med.id)) setItems((prev) => [...prev.filter((el) => el.productId != med.id)]);
    // add new item
    else setItems((prev) => [...prev, {
      productId: med.id,
      quantity: 0,
      barcode: med.barcodes[0],
      price: 0,
      productType: med.type || 'MASTER'
    }]);
  };

  return (
    <>
      <BasePageDialog
        title='Purchase Order'
        subtitle='Fill the details for the Purchase Order'
        className='w-full h-full'
        onOpenChange={goBack}
        headerChildren={<Button>Send Order</Button>}
      >
        <div className='grid grid-cols-3 gap-4'>
          <Card className='col-span-2'>
            <CardContent>
              <CardTitle className='mb-4'>Medicines</CardTitle>
              <div className='grid gap-2 max-h-[200px] overflow-auto'>
                {medicines?.map((el) => (
                  <MedicineInlineCard
                    medicine={el}
                    onSelect={() => selectMedicine(el)}
                  ></MedicineInlineCard>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className='col-span-1 bg-muted/10'>
            <CardContent>
              <CardTitle className='mb-4'>Suppliers</CardTitle>
              <div className='max-h-[200px] overflow-auto'>
                {suppliers?.map((el) => (
                  <SupplierInlineCard
                    key={el.id}
                    supplier={el}
                    selected={supplierId == el.id}
                    onSelect={() => setSupplierId(el.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className='col-span-3'>
            <CardContent>
              <CardTitle className='mb-4'>Current Order</CardTitle>
              {items?.length ? (
                items?.map((el) => <div>el</div>)
              ) : (
                <BaseNotFound item='Selected Medicine' />
              )}
              {/* <div className='max-h-[200px] overflow-auto'>
                {medicines?.map((el) => (
                    <div></div>
                ))}
              </div> */}
            </CardContent>
          </Card>
        </div>
      </BasePageDialog>
    </>
  );
}
