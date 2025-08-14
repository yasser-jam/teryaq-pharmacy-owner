import { Info } from 'lucide-react';

export default function SysInfo({ text }: { text: string }) {
  return (
    <>
      <div className='flex items-center gap-2 bg-amber-50  border-dashed border-2 rounded-lg border-amber-500 py-2 px-4 my-4'>
        <Info size={'2rem'} className='text-gray-400' />

        <div className='text-gray-500'>{text}</div>
      </div>
    </>
  );
}
