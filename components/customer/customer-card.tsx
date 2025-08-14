import { Customer } from '@/types'
import { Card, CardContent } from '../ui/card'
import { Avatar } from '../ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import ActionMenu from '../base/action-menu'

interface CustomerCardProps {
  customer?: Customer
  onEdit?: () => void
  onDelete?: () => void
}

export default function CustomerCard({
  customer,
  onEdit,
  onDelete,
}: CustomerCardProps) {
  return (
    <>
      <Card className='rounded-sm relative bg-indigo-50 border-indigo-600 border-dashed shadow-none w-full'>
        <CardContent className='!decoration-0'>
          <Avatar className='bg-indigo-800 absolute -top-4 left-4 rounded-sm  flex justify-center items-center w-8 h-8'>
            <AvatarFallback className='text-white'>
              {customer?.name.split(' ')[0][0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='font-semibold text-lg'>{customer?.name}</div>
          <div className='text-sm text-gray-500'>{customer?.phoneNumber}</div>

          <div className='absolute top-4 right-4'>
            <ActionMenu editAction deleteAction onEdit={onEdit} onDelete={onDelete} />
          </div>
        </CardContent>
      </Card>
    </>
  )
}


