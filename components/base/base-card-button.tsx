"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export const cardButtonVariants = cva(
  "group cursor-pointer select-none outline-none transition-all focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-60 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "border-input hover:border-foreground/30 hover:shadow-md",
        primary:
          "border-primary/30 hover:border-primary/60 hover:shadow-md",
        secondary:
          "border-teal/30 hover:border-teal/60 hover:shadow-md",
        destructive:
          "border-destructive/30 hover:border-destructive/60 hover:shadow-md",
      },
      size: {
        sm: "py-4",
        md: "py-5",
        lg: "py-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const iconWrapperVariants = cva(
  "inline-flex items-center justify-center rounded-md shrink-0 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground",
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary-foreground",
        destructive: "bg-destructive/10 text-destructive",
      },
      size: {
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

type IconType = React.ComponentType<{ className?: string }>

export interface BaseCardButtonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardButtonVariants> {
  title?: string
  subtitle?: string
  Icon?: IconType
  onChange?: () => void
  disabled?: boolean
}

export default function BaseCardButton({
  title = "Title",
  subtitle,
  Icon,
  variant,
  size,
  className,
  onChange,
  onClick,
  disabled,
  ...props
}: BaseCardButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    onChange?.()
    onClick?.(e)
  }


  return (
    <Card
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={handleClick}
      className={cn(
        "rounded-xl border shadow-sm transform-gpu hover:-translate-y-0.5",
        cardButtonVariants({ variant, size }),
        className
      )}
      {...props}
    >
      <div className="px-6">
        <div className="flex items-center gap-4">
          {Icon ? (
            <span className={cn(iconWrapperVariants({ variant, size }))}>
              <Icon
                className={cn(
                  size === "sm" && "size-4",
                  size === "md" && "size-5",
                  size === "lg" && "size-6"
                )}
              />
            </span>
          ) : null}

          <div className="min-w-0">
            <div className="text-base font-semibold leading-snug truncate">
              {title}
            </div>
            {subtitle ? (
              <div className="text-sm text-muted-foreground line-clamp-2">
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  )
}


