import * as React from 'react'

import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'

const inputVariants = cva(
  'w-full flex border border-input bg-background py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'h-11 group-data-[collapsible=icon]:h-10 rounded-md px-3 placeholder:text-text-secondary',
        outline:
          'h-11 group-data-[collapsible=icon]:h-10 rounded-md px-3 placeholder:text-text-secondary bg-white dark:bg-input/30',
        filter: 'placeholder:text-text-secondary h-8 px-2 rounded-md'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  onClear?: () => void
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  variant?: 'default' | 'filter' | 'outline'
  dir?: 'ltr' | 'rtl'
  error?: {
    message?: string
  }
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, prefix, suffix, variant, dir, onClear, ...props },
    ref
  ) => {
    const handleOnChange = (event: any) => {
      // @ts-ignore
      type == 'number' ? props.onChange?.(Number(event.target.value)) : props.onChange?.(event.target.value)
      if (!event.target.value) onClear?.()
    }

    return (
      <div
        className={cn(
          'relative flex items-center group-data-[collapsible=icon]:hover:[&_input]:bg-background/60 group-data-[collapsible=icon]:cursor-pointer base-input',
          !prefix && !suffix && 'w-full',
          className
        )}
      >
        {prefix && (
          <div
            className={cn(
              'absolute inset-y-0 left-0 flex items-center text-muted-foreground group-data-[collapsible=icon]:cursor-pointer',
              variant == 'filter' ? 'pl-2' : 'pl-2.5'
            )}
          >
            {prefix}
          </div>
        )}
        <input
          type={type}
          dir={dir}
          className={cn(
            inputVariants({ variant }),
            prefix &&
              (variant == 'filter'
                ? 'pl-8 group-data-[collapsible=icon]:pl-[22px]'
                : 'pl-[38px]'),
            suffix &&
              (variant == 'filter'
                ? 'pr-8 group-data-[collapsible=icon]:pr-0'
                : 'pr-12 group-data-[collapsible=icon]:pr-0'),
            dir === 'rtl' && 'text-right'
          )}
          ref={ref}
          {...props}
          value={props.value || ''}
          onChange={handleOnChange}
        />
        {suffix && (
          <div className="transition-opacity group-data-[collapsible=icon]:pr-1 group-data-[collapsible=icon]:opacity-0 absolute inset-y-0 right-0 flex items-center pr-2 text-muted-foreground">
            {suffix}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
