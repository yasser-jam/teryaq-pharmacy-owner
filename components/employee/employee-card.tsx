import { Employee } from '@/lib/schema';
import { Card, CardContent } from '../ui/card';
import { Avatar } from '../ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import ActionMenu from '../base/action-menu';

interface EmployeeCardProps {
  employee?: Employee;
  onEdit?: () => void
  onDelete?: () => void
}

export default function EmployeeCard({ employee, onEdit, onDelete } : EmployeeCardProps) {
  return (
    <>
      <Card className='rounded-sm relative bg-gray-50 border-teal-600 border-dashed shadow-none'>
        <CardContent>
          <Avatar className='bg-teal-800 absolute -top-4 left-4 rounded-sm  flex justify-center items-center w-8 h-8'>
            <AvatarFallback className='text-white'>{ employee?.firstName.split(' ')[0][0].toUpperCase() }</AvatarFallback>
          </Avatar>
          <div className='font-semibold text-lg'>{employee?.firstName}</div>
          <div className='text-sm text-gray-500'>{employee?.phoneNumber}</div>

          <div className='absolute top-4 right-4'>
            <ActionMenu editAction deleteAction onEdit={onEdit} onDelete={onDelete} />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
