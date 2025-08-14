import { Info } from "lucide-react";

export default function BaseInfo({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <Info className='w-16 h-16 text-primary mb-3' />
      <h1 className='text-xl font-semibold text-gray-700 mb-6'>{children}</h1>
    </div>
  );
}