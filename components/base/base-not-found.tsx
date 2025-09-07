import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export default function BaseNotFound({ item = 'Item', children, className }: { item: string, children?: React.ReactNode, className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center h-full', className)}>
      <Search className='w-16 h-16 text-primary mb-3' />
      <h1 className='text-xl font-semibold text-gray-700 mb-6'>No {item} found</h1>

      {children}
    </div>
  );
}