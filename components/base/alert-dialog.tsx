'use client'

import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Restart } from 'iconoir-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
const iconVariants = cva('mx-auto size-16', {
  variants: {
    variant: {
      default: '',
      destructive: 'text-destructive',
      secondary: 'text-secondary',
      primary: 'text-primary',
      tertiary: 'text-tertiary'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export default function AlertDialog({
  children,
  Icon,
  open = false,
  loading,
  title,
  subtitle,
  action = 'Continue',
  variant = 'default',
  onAction,
  onOpenChange
}: {
  children?: React.ReactNode
  Icon: any
  open?: boolean
  loading?: boolean
  title?: string
  subtitle?: string
  action?: string
  variant?: 'default' | 'destructive' | 'primary' | 'secondary' | 'tertiary'
  onAction?: () => any
  onOpenChange?: (open: boolean) => any
}) {
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-96!">
        <DialogHeader>
          <Icon className={cn(iconVariants({ variant }))} />
          {title ? (
            <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          ) : null}
          {subtitle ? (
            <DialogDescription className="text-center">
              {subtitle}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter className="justify-center!">
          <Button
            onClick={() => (onOpenChange ? onOpenChange(false) : false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={() => (onAction ? onAction() : null)}
            variant={
              (['default', 'destructive', 'secondary'].includes(variant)
                ? variant
                : 'default') as any
            }
            loading={loading}
          >
            {action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
