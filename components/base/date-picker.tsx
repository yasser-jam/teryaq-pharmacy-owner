'use client'

import { Calendar as CalendarIcon } from 'iconoir-react'

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

interface PropsInterface {
  value?: string
  onChange: (date: string | undefined) => void
  useDefault?: boolean
  placeholder?: string
}

export function BaseDatePicker({
  value,
  onChange,
  useDefault,
  placeholder = 'Pick a Date'
}: PropsInterface) {

  // set the default value to current date (if useDefault prop is true)
  useEffect(() => {
    if (useDefault)
      onChange(value ? new Date(value).toISOString() : new Date().toISOString())
  })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'default'}
          className={cn(
            'px-3 py-2 w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="size-4" />
          {value ? format(value!, "MM/dd/yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={new Date(String(value))}
          onSelect={(e) => onChange(e?.toISOString())}
          initialFocus
          defaultMonth={value ? new Date(value) : undefined}
        />
      </PopoverContent>
    </Popover>
  )
}
