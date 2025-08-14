import BaseHeader from '@/components/base/base-header';
import SupplierCard from '@/components/supplier/supplier-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Page() {
  return (
    <>
      <BaseHeader title='Suppliers' subtitle='Suppliers page for adding the suppliers to handle sales operations'>
      
        <Button>
            <Plus />
            Add Supplier
        </Button>

      </BaseHeader>
    
    <div className='grid grid-cols-3 mt-12'>
        <SupplierCard ></SupplierCard>
    </div>
    
    </>
  );
}
