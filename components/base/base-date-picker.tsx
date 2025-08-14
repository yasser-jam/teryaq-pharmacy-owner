'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ArrowRight, Calendar as CalendarIcon, Xmark } from 'iconoir-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

dayjs.extend(customParseFormat)

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

// Shared button wrapper component
const DatePickerButton = ({
  value,
  variant = 'default',
  size = 'default',
  className,
  children
}: {
  value?: any
  variant?: 'default' | 'inverse'
  size?: 'default' | 'filter'
  className?: string
  children: React.ReactNode
}) => (
  <PopoverTrigger asChild>
    <Button
      className={cn(
        'w-full text-foreground justify-between text-start font-normal',
        !value && 'text-muted-foreground',
        variant === 'inverse'
          ? 'bg-surface hover:bg-surface/70'
          : 'bg-background hover:bg-background/70',
        size === 'default' ? 'h-11 px-3 py-2 rounded-md' : 'h-8 p-1 rounded-sm',
        className
      )}
    >
      {children}
      <CalendarIcon className="ms-auto size-4" />
    </Button>
  </PopoverTrigger>
)

// Time selector component
const TimeSelector = ({
  selectedHour,
  selectedMinute,
  handleTimeChange
}: {
  selectedHour: number | null
  selectedMinute: number | null
  handleTimeChange: (type: 'hour' | 'minute', val: string) => void
}) => (
  <div className="sm:flex sm:h-[327px] divide-y sm:divide-y-0 sm:divide-x">
    <ScrollArea className="w-64 sm:w-auto border-border sm:border-s border-t">
      <div className="flex sm:flex-col gap-2 p-2 min-w-max">
        {hours.reverse().map(hour => (
          <Button
            key={hour}
            size="icon"
            variant={selectedHour === hour ? 'default' : 'outline'}
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
      <div className="flex sm:flex-col gap-2 p-2 min-w-max">
        {minutes.map(min => (
          <Button
            key={min}
            size="icon"
            variant={selectedMinute === min ? 'default' : 'outline'}
            className="sm:w-full shrink-0 aspect-square"
            onClick={() => handleTimeChange('minute', min.toString())}
          >
            {min.toString().padStart(2, '0')}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="sm:hidden" />
    </ScrollArea>
  </div>
)

// Base Date Picker
export function BaseDatePicker({
  value,
  mode = 'default',
  placeholder = 'Pick a date',
  variant = 'default',
  size = 'default',
  className,
  onChange
}: {
  value?: any
  mode?: 'default' | 'range'
  placeholder?: string
  variant?: 'default' | 'inverse'
  size?: 'default' | 'filter'
  className?: string
  onChange: (val: any) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const RangeDisplay = ({ value }: { value: any }) => (
    <div className="w-full h-full flex items-center gap-4">
      <div className="grow h-full flex items-center justify-center bg-surface text-foreground rounded-sm">
        {value?.from ? dayjs(value.from).format('YYYY-MM-DD') : '----/--/--'}
      </div>
      <ArrowRight className="size-3 text-text-secondary" />
      <div className="grow h-full flex items-center justify-center bg-surface text-foreground rounded-sm">
        {value?.to ? dayjs(value.to).format('YYYY-MM-DD') : '----/--/--'}
      </div>
    </div>
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <DatePickerButton
        value={value}
        variant={variant}
        size={size}
        className={className}
      >
        {mode === 'range' ? (
          <RangeDisplay value={value} />
        ) : value ? (
          dayjs(value).format('YYYY-MM-DD')
        ) : (
          placeholder
        )}
      </DatePickerButton>

      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 flex flex-col gap-3">
          <Calendar
            className="p-0"
            mode={mode === 'range' ? 'range' : 'single'}
            numberOfMonths={1}
            selected={value}
            defaultMonth={mode === 'range' ? value.from : value}
            onSelect={onChange}
            initialFocus
          />

          <Button
            size="sm"
            variant="outline"
            className="hidden sm:flex"
            onClick={() =>
              onChange(mode === 'range' ? { from: null, to: null } : '')
            }
          >
            Clear <Xmark className="size-5 text-destructive/50" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Base Time Picker
export function BaseTimePicker({
  value,
  placeholder = 'Pick a time',
  variant = 'default',
  size = 'default',
  className,
  onChange
}: {
  value?: string
  placeholder?: string
  variant?: 'default' | 'inverse'
  size?: 'default' | 'filter'
  className?: string
  onChange: (val: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null)

  useEffect(() => {
    if (value && dayjs(value, 'HH:mm', true).isValid()) {
      const time = dayjs(value, 'HH:mm')
      setSelectedHour(time.hour())
      setSelectedMinute(time.minute())
    }
  }, [value])

  const handleTimeChange = (type: 'hour' | 'minute', val: string) => {
    const parsedVal = parseInt(val)

    if (type === 'hour') {
      setSelectedHour(parsedVal)
    } else {
      setSelectedMinute(parsedVal)
    }

    if (
      selectedHour !== null &&
      (type === 'minute' || selectedMinute !== null)
    ) {
      const hour = type === 'hour' ? parsedVal : selectedHour
      const minute = type === 'minute' ? parsedVal : selectedMinute ?? 0
      onChange(
        `${hour.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`
      )
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <DatePickerButton
        value={value}
        variant={variant}
        size={size}
        className={className}
      >
        {value || placeholder}
      </DatePickerButton>

      <PopoverContent className="w-auto p-0" align="start">
        <TimeSelector
          selectedHour={selectedHour}
          selectedMinute={selectedMinute}
          handleTimeChange={handleTimeChange}
        />
        <div className="block sm:hidden p-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onChange('')
              setSelectedHour(null)
              setSelectedMinute(null)
            }}
          >
            Clear <Xmark className="size-5 text-destructive/50" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Base DateTime Picker
export function BaseDateTimePicker({
  value,
  placeholder = 'Pick date and time',
  variant = 'default',
  size = 'default',
  className,
  onChange
}: {
  value?: string | null
  placeholder?: string
  variant?: 'default' | 'inverse'
  size?: 'default' | 'filter'
  className?: string
  onChange: (val: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [selectedMinute, setSelectedMinute] = useState<number | null>(null)

  useEffect(() => {
    if (value && dayjs(value, 'YYYY-MM-DD HH:mm').isValid()) {
      const dateTime = dayjs(value)
      setSelectedHour(dateTime.hour())
      setSelectedMinute(dateTime.minute())
    }
  }, [value])

  const handleDateSelect = (date: any) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD')
    const timeStr =
      selectedHour !== null && selectedMinute !== null
        ? `${selectedHour.toString().padStart(2, '0')}:${selectedMinute
            .toString()
            .padStart(2, '0')}`
        : '00:00'

    onChange(`${dateStr} ${timeStr}`)
  }

  const handleTimeChange = (type: 'hour' | 'minute', val: string) => {
    const parsedVal = parseInt(val)
    const currentDateTime = value ? dayjs(value) : dayjs()

    if (type === 'hour') {
      setSelectedHour(parsedVal)
    } else {
      setSelectedMinute(parsedVal)
    }

    if (
      selectedHour !== null &&
      (type === 'minute' || selectedMinute !== null)
    ) {
      const hour = type === 'hour' ? parsedVal : selectedHour
      const minute = type === 'minute' ? parsedVal : selectedMinute ?? 0
      onChange(
        currentDateTime.hour(hour).minute(minute).format('YYYY-MM-DD HH:mm')
      )
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <DatePickerButton
        value={value}
        variant={variant}
        size={size}
        className={className}
      >
        {value ? dayjs(value).format('YYYY-MM-DD HH:mm') : placeholder}
      </DatePickerButton>

      <PopoverContent className="sm:flex w-auto p-0" align="start">
        <div className="p-3 flex flex-col gap-3">
          <Calendar
            className="p-0"
            mode="single"
            numberOfMonths={1}
            selected={value ? new Date(value) : undefined}
            defaultMonth={value ? new Date(value) : undefined}
            onSelect={handleDateSelect}
            initialFocus
          />
        </div>

        <TimeSelector
          selectedHour={selectedHour}
          selectedMinute={selectedMinute}
          handleTimeChange={handleTimeChange}
        />
      </PopoverContent>
    </Popover>
  )
}
