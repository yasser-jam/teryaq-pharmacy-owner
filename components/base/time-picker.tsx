'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { Calendar as CalendarIcon } from 'iconoir-react'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import { Button } from '@/components/ui/button'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

dayjs.extend(customParseFormat)

export function BaseTimePicker({
  value,
  onChange
}: {
  value?: null | string
  onChange?: (e: any) => any
}) {
  const [time, setTime] = useState<Date | null>(
    value && dayjs(value, 'HH:mm', true).isValid()
      ? dayjs(value, 'HH:mm').toDate()
      : null
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setTime(
      value && dayjs(value, 'HH:mm', true).isValid()
        ? dayjs(value, 'HH:mm').toDate()
        : null
    )
  }, [value])

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
    const newDate = time ? new Date(time) : new Date()
    if (type === 'hour') {
      newDate.setHours(parseInt(value))
    } else if (type === 'minute') {
      newDate.setMinutes(parseInt(value))
    }
    setTime(newDate)

    if (onChange)
      onChange(dayjs(newDate.toString()).format('HH:mm').toString())
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'bg-background text-foreground hover:bg-background h-11 px-3 py-2 w-full justify-between text-start font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          {time ? dayjs(time.toString()).format('HH:mm') : <span>hh:mm</span>}
          <CalendarIcon className="mr-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map(hour => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      time && time.getHours() === hour ? 'default' : 'ghost'
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange('hour', hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map(minute => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      time && time.getMinutes() === minute ? 'default' : 'ghost'
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange('minute', minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
