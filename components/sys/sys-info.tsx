import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

export default function SysInfo({
  text,
  color = 'warning',
  className
}: {
  text: string;
  color?: 'blue' | 'warning';
  className?: string
}) {
  const getColors = () => {
    switch (color) {
      case 'warning':
        return 'bg-amber-50 border-amber-500';

      case 'blue':
        return 'bg-sky-50 border-primary';
    }
  };

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-2 border-dashed border-2 rounded-lg  py-2 px-4',
          getColors(),
          className
        )}
      >
        <Info size={'2rem'} className='text-gray-400' />

        <div className='text-gray-500'>{text}</div>
      </div>
    </>
  );
}
