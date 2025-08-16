import { Supplier } from '@/types';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Eye, User } from 'lucide-react';
import { Button } from '../ui/button';

interface SupplierInlineCardProps {
  supplier: Supplier;
  selected?: boolean;
  onSelect: () => void;
}

export default function SupplierInlineCard({
  supplier,
  selected,
  onSelect,
}: SupplierInlineCardProps) {
  return (
    <>
      <div
        className='flex justify-between items-center py-2 px-4 border border-dashed bg-slate-50 cursor-pointer border-primary hover:bg-muted/100 transition-colors rounded-sm'
        onClick={onSelect}
      >
        <div className='flex items-center gap-4'>
          <Avatar>
            <AvatarFallback className='bg-green-500 text-white'>
              <User />
            </AvatarFallback>
          </Avatar>

          <div>
            <div className='font-medium'>Supplier Name</div>
            <div className='text-sm text-gray-500 font-medium'>0993655221</div>
          </div>
        </div>
      </div>
    </>
  );
}
