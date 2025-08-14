import { Search } from "lucide-react";

export default function BaseNotFound({ item = 'Item', children }: { item: string, children?: React.ReactNode }) {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <Search className='w-16 h-16 text-primary mb-3' />
      <h1 className='text-xl font-semibold text-gray-700 mb-6'>No {item} found</h1>

      {children}
    </div>
  );
}