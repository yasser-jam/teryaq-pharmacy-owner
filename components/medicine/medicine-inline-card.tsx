import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Pill, Droplets, Scale, Ruler, Syringe } from 'lucide-react';
import { Medicine } from '@/types';

interface MedicineCardProps {
  medicine: Medicine;
  className?: string;
}

export function MedicineInlineCard({ medicine, className }: MedicineCardProps) {
  const getCardGradient = (type: string) => {
    switch (type) {
      case 'tablet':
        return 'bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200';
      case 'liquid':
        return 'bg-gradient-to-br from-cyan-50 to-sky-100 border-cyan-200';
      case 'injection':
        return 'bg-gradient-to-br from-rose-50 to-pink-100 border-rose-200';
      case 'capsule':
        return 'bg-gradient-to-br from-violet-50 to-indigo-100 border-violet-200';
      default:
        return 'bg-gradient-to-br from-violet-50 to-indigo-100 border-violet-200';
    }
  };

  const getAvatarColor = (type: string) => {
    switch (type) {
      case 'tablet':
        return 'bg-gradient-to-br from-orange-400 to-amber-500 text-white';
      case 'liquid':
        return 'bg-gradient-to-br from-cyan-400 to-sky-500 text-white';
      case 'injection':
        return 'bg-gradient-to-br from-rose-400 to-pink-500 text-white';
      case 'capsule':
        return 'bg-gradient-to-br from-violet-400 to-indigo-500 text-white';
      default:
        return 'bg-gradient-to-br from-gray-400 to-slate-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tablet':
        return <Pill className='h-5 w-5' />;
      case 'liquid':
        return <Droplets className='h-5 w-5' />;
      case 'injection':
        return <Syringe className='h-5 w-5' />;
      case 'capsule':
        return <Pill className='h-5 w-5' />;
      default:
        return <Pill className='h-5 w-5' />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'tablet':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'liquid':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'injection':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'capsule':
        return 'bg-violet-100 text-violet-800 border-violet-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div
      className={`rounded-xl border px-4 py-1 relative overflow-hidden ${getCardGradient(
        String(medicine.type)
      )}`}
    >
      <div className='absolute top-0 right-0 w-20 h-20 rounded-full bg-white/20 -translate-y-10 translate-x-10' />
      <div className='absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 translate-y-8 -translate-x-8' />

      <div className='flex items-center justify-between gap-4 relative z-10'>
        <div className='flex items-center gap-2'>
          <Avatar
            className={`h-9 w-9 shadow-lg ${getAvatarColor(
              String(medicine.type)
            )}`}
          >
            <AvatarFallback className={getAvatarColor(String(medicine.type))}>
              {getTypeIcon(String(medicine.type))}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className='font-bold text-base leading-tight mt-3 mb-1 text-gray-900'>
              {medicine.tradeName}
            </h3>

            <p className='text-sm text-gray-500 mb-4 leading-tight'>
              {medicine.scientificName}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-6 text-sm text-gray-700'>
          <div className='flex items-center gap-2 bg-white/100 px-3 py-1 rounded-full'>
            <Scale className='h-4 w-4' />
            <span className='font-medium'>{medicine.size}</span>
          </div>
          <div className='flex items-center gap-2 bg-white/100 px-3 py-1 rounded-full'>
            <Ruler className='h-4 w-4' />
            <span className='font-medium'>{medicine.concentration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
