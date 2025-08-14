import { cn } from '@/lib/utils';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function BasePageDialog({
  open = true,
  onOpenChange,
  loading,
  className,
  title,
  subtitle,
  footer,
  children,
  classTitle,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
  className?: string;
  title?: string;
  subtitle?: string
  children?: React.ReactNode;
  footer?: React.ReactNode;
  classTitle?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn('!min-w-none !max-w-none', className)}
      >
        <div className='relative'>
          {loading &&
            // Todo: add loader
            ''
            // <div className="animate-pulse absolute z-20 w-full h-full inset-0 bg-black/25 rounded-lg" />
          }

          {title && (
            <DialogHeader className={cn(classTitle, 'text-slate-800 mb-6')}>
              <DialogTitle className={cn(classTitle, 'text-xl')}>{title}</DialogTitle>
              { subtitle && <div className="text-slate-500 text-sm -mt-1">{ subtitle }</div> }
            </DialogHeader>
          )}

          <div className='max-h-[450px] overflow-auto'>{children}</div>

          {footer && (
            <DialogFooter >{footer}</DialogFooter>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
