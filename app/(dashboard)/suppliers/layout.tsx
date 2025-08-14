import BaseHeader from '@/components/base/base-header';
import SupplierCard from '@/components/supplier/supplier-card';
import SysInfo from '@/components/sys/sys-info';
import { Button } from '@/components/ui/button';
import { Info, Plus } from 'lucide-react';

export default function Page() {
  return (
    <>
      <BaseHeader
        title='Suppliers'
        subtitle='Suppliers page for adding the suppliers to handle sales operations'
      >
        <Button>
          <Plus />
          Add Supplier
        </Button>
      </BaseHeader>

      <SysInfo
        text='
This page is responsible for adding suppliers and update their data in order to make orders'
      />

      <div className='grid grid-cols-1 mt-12'>
        <SupplierCard></SupplierCard>
      </div>
    </>
  );
}
