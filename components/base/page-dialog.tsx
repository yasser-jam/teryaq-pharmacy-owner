import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  headerChildren,
  fullHeight = false
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  loading?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  classTitle?: string;
  headerChildren?: React.ReactNode;
  fullHeight?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("bg-white !min-w-none !max-w-none !px-0", className)}
      >
        <div className="relative">
          {
            loading &&
              // Todo: add loader
              ""
            // <div className="animate-pulse absolute z-20 w-full h-full inset-0 bg-black/25 rounded-lg" />
          }

          {title && (
            <div className="flex items-center justify-between mb-6">
              <DialogHeader className={cn(classTitle, "text-slate-800 px-6")}>
                <DialogTitle
                  className={cn(classTitle, "text-xl font-semibold")}
                >
                  {title}
                </DialogTitle>
                {subtitle && (
                  <div className="text-slate-500 text-sm -mt-1">{subtitle}</div>
                )}
              </DialogHeader>

              <div className="px-6">{headerChildren}</div>
            </div>
          )}

          <div className={cn('overflow-auto px-6', !fullHeight ? 'max-h-[450px]' : 'max-h-[80vh]')}>{children}</div>

          {footer && <DialogFooter>{footer}</DialogFooter>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
