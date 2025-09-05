'use client'

import { Calendar as CalendarIcon } from 'iconoir-react'
import dayjs from 'dayjs'

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
      onChange(value ? dayjs(value).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"))
  })

  const handleSelect = (e: any) => {
    console.log('test', e?.toISOString().split('T')[0]);
    
    onChange(dayjs(e).format("YYYY-MM-DD"))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'px-3 w-full justify-start text-left font-normal h-11',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="size-4" />
          {value ? dayjs(value).format("MM/DD/YYYY") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={new Date(String(value))}
          onSelect={(e) => handleSelect(e)}
          initialFocus
          defaultMonth={value ? new Date(value) : undefined}
        />
      </PopoverContent>
    </Popover>
  )
}
