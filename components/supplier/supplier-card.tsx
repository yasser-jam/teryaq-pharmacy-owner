import { Supplier } from '@/types';
import { Card, CardContent } from '../ui/card';
import { Avatar } from '../ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import ActionMenu from '../base/action-menu';
import { useRouter } from 'next/navigation';
import { ListOrdered } from 'lucide-react';
import { EditPencil } from 'iconoir-react';
import { DropdownMenuItem } from '../ui/dropdown-menu';

interface SupplierCardProps {
  supplier?: Supplier;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function SupplierCard({
  supplier,
  onEdit,
  onDelete,
}: SupplierCardProps) {
  const router = useRouter();
  return (
    <>
      <Card className='rounded-sm relative bg-gray-50 border-teal-600 border-dashed shadow-none w-full'>
        <CardContent className='!decoration-0'>
          <Avatar className='bg-teal-800 absolute -top-4 start-4 rounded-sm  flex justify-center items-center w-8 h-8'>
            <AvatarFallback className='text-white'>
              {supplier?.name.split(' ')[0][0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='font-semibold text-lg'>{supplier?.name}</div>
          <div className='text-sm text-gray-500'>{supplier?.phone}</div>

          <div className='absolute top-4 end-4'>
            <ActionMenu
              editAction
              deleteAction
              onEdit={onEdit}
              onDelete={onDelete}
            >
              <DropdownMenuItem
                onClick={() =>
                  router.replace(`/suppliers/${supplier?.id}/orders`)
                }
              >
                <ListOrdered /> Orders
              </DropdownMenuItem>
            </ActionMenu>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
