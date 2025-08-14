'use client'

import { Calendar as CalendarIcon, Xmark } from 'iconoir-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useEffect } from 'react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

interface PropsInterface {
  size?: 'sm' | 'default'
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  onClear?: () => void
  useDefault?: boolean
  placeholder?: string
}

export function BaseRangeDatePicker({
  size = 'default',
  value,
  onChange,
  onClear,
  useDefault,
  placeholder = 'Pick a Date Range'
}: PropsInterface) {
  // Set default to today's date for both from and to if useDefault is true
  useEffect(() => {
    if (useDefault && (!value?.from || !value?.to)) {
      const today = new Date()
      onChange?.({ from: today, to: today })
    }
  }, [useDefault, value, onChange])

  const formattedValue =
    value?.from && value?.to
      ? `${format(value.from, 'MM/dd/yyyy')} - ${format(
          value.to,
          'MM/dd/yyyy'
        )}`
      : ''

  const clearInput = () => {
    onChange?.({ from: undefined, to: undefined })
    onClear?.()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          size={size}
          className={cn(
            'w-full justify-start text-left font-normal',
            !formattedValue && 'text-text-secondary'
          )}
        >
          <CalendarIcon className="size-4" />
          {formattedValue || <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="relative w-auto p-0" align="start">
        <Calendar
          mode="range"
          //   Todo: enhance typing
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
          initialFocus
        />
        <Button
          onClick={clearInput}
          size="icon"
          variant="outline"
          className="size-7 absolute top-3 end-14 text-destructive"
        >
          <Xmark />
        </Button>
      </PopoverContent>
    </Popover>
  )
}
