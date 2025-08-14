import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeGroupProps {
  items: string[];
  maxVisible?: number;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  emptyText?: string;
  badgeClassName?: string;
}

export function BadgeGroup({
  items,
  maxVisible = 2,
  variant = 'outline',
  className,
  emptyText = 'No items',
  badgeClassName,
}: BadgeGroupProps) {
  if (!items || items.length === 0) {
    return <span className="text-muted-foreground">{emptyText}</span>;
  }

  const visibleItems = items.slice(0, maxVisible);
  const remainingCount = items.length - maxVisible;

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {visibleItems.map((item, index) => (
        <Badge 
          key={index} 
          variant={variant} 
          className={cn('text-xs', badgeClassName)}
        >
          {item}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge 
          variant="outline" 
          className={cn('text-xs bg-muted', badgeClassName)}
        >
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
} 