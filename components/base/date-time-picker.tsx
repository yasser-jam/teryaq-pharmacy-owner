'use client'
import { Calendar as CalendarIcon, Xmark } from 'iconoir-react'

import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useState } from 'react'

interface PropsInterface {
  value?: string
  onChange: (date: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  showClearButton?: boolean
  minutesSpan?: 1 | 5 | 10 | 15 | 20 | 30
}

export function BaseDateTimePicker({
  value,
  onChange,
  placeholder = 'MM/DD/YYYY hh:mm',
  disabled = false,
  className,
  showClearButton = true,
  minutesSpan = 5
}: PropsInterface) {
  const [isOpen, setIsOpen] = useState(false)

  // Parse string value to Date object for internal use
  const dateValue = value ? new Date(value) : undefined

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // If we have an existing time, preserve it
      if (dateValue) {
        const newDate = new Date(selectedDate)
        newDate.setHours(dateValue!.getHours())
        newDate.setMinutes(dateValue!.getMinutes())
        onChange(newDate.toISOString())
      } else {
        // Set default time to current time if no previous value
        const now = new Date()
        selectedDate.setHours(now.getHours())
        selectedDate.setMinutes(now.getMinutes())
        onChange(selectedDate.toISOString())
      }
    }
  }

  const handleTimeChange = (type: 'hour' | 'minute', timeValue: string) => {
    // If no date is selected, use today's date
    const newDate = dateValue ? new Date(dateValue) : new Date()

    if (type === 'hour') {
      newDate.setHours(Number.parseInt(timeValue))
    } else if (type === 'minute') {
      newDate.setMinutes(Number.parseInt(timeValue))
    }
    onChange(newDate.toISOString())
  }

  const handleClear = () => {
    onChange(undefined)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          disabled={disabled}
          className={cn(
            'px-3 w-full justify-start',
            !dateValue && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {dateValue ? (
            format(dateValue!, 'MM/dd/yyyy hh:mm')
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex flex-col">
          {/* Clear button header */}
          {showClearButton && dateValue && (
            <div className="flex justify-end p-2 border-b">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled}
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <Xmark className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          )}

          {/* Main content */}
          <div className="sm:flex">
            <Calendar
              mode="single"
              selected={dateValue || undefined}
              onSelect={handleDateSelect}
              initialFocus
              disabled={disabled}
              defaultMonth={dateValue || undefined}
            />

            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {hours.reverse().map(hour => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={
                        dateValue && dateValue!.getHours() === hour
                          ? 'default'
                          : 'ghost'
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange('hour', hour.toString())}
                      disabled={disabled}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {/* create the minutes array to fill the whole hour no matter what span is selected */}
                  {Array.from(
                    { length: 60 / minutesSpan },
                    (_, i) => i * minutesSpan
                  ).map(minute => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={
                        dateValue && dateValue!.getMinutes() === minute
                          ? 'default'
                          : 'ghost'
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() =>
                        handleTimeChange('minute', minute.toString())
                      }
                      disabled={disabled}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
