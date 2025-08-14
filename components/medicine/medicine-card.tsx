import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Pill, Droplets, Scale, Ruler } from 'lucide-react';
import { Medicine } from '@/types';

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  // Different colors based on medicine type
  const getAvatarColor = (type: string) => {
    if (type == 'pharmacy' || type == 'صيدلية')
      return 'bg-blue-100 text-blue-700';
    else return 'bg-green-100 text-green-700';
  };

  const getTypeIcon = (type: string) => {
    if (type == 'pharmacy' || type == 'صيدلية')
      return <Pill className='h-4 w-4' />;
    else return <Droplets className='h-4 w-4' />;
  };

  return (
    <Card className='hover:shadow-md transition-shadow duration-200 py-4 shadow-xs bg-slate/10 border-teal-500'>
      <CardContent className='px-2 py-0'>
        <div className='flex items-start gap-3'>
          {/* Avatar with type-based color */}
          <Avatar
            className={`h-12 w-12 ${getAvatarColor(String(medicine.type))}`}
          >
            <AvatarFallback className={getAvatarColor(String(medicine.type))}>
              {getTypeIcon(String(medicine.type))}
            </AvatarFallback>
          </Avatar>

          <div className='flex-1 min-w-0'>
            {/* Category Badge */}
            <div className='mb-2'>
              {medicine.categories?.map((el) => (
                <Badge variant='secondary' className='text-xs'>
                  {el}
                </Badge>
              ))}
            </div>

            {/* Trade Name (Main) */}
            <h3 className='font-semibold text-lg leading-tight mb-1'>
              {medicine.tradeName}
            </h3>

            {/* Scientific Name (Secondary) */}
            <p className='text-sm text-muted-foreground mb-3 leading-tight'>
              {medicine.scientificName}
            </p>

            {/* Size and Concentration */}
            <div className='flex items-center gap-4 text-xs text-muted-foreground'>
              <div className='flex items-center gap-1'>
                <Scale className='h-3 w-3' />
                <span>{medicine.size}</span>
              </div>
              <div className='flex items-center gap-1'>
                <Ruler className='h-3 w-3' />
                <span>{medicine.concentration}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
