import { cn } from '@/lib/utils';
import { Medicine } from '@/types';

interface MedicineCardProps {
  medicine: Medicine;
  className?: string
}

export default function MedicineCard({ medicine, className }: MedicineCardProps) {
  return (
    <div
      className={cn(`flex items-center border-l-4 p-4 space-x-4 border-primary-foreground`, className)}
    >
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold text-white bg-info`}
      >
        MED
      </div>

      <div className='flex-1'>
        <h3 className='text-gray-800 font-medium'>{medicine.tradeName}</h3>
        <p className='text-gray-400 text-sm mt-1'>{medicine.scientificName}</p>
      </div>

      <div className='flex space-x-2'>
        {medicine.categories.map((badge, i) => (
          <span
            key={i}
            className='bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full'
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}
