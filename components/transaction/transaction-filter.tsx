'use client'

import { useMemo, useState } from 'react'
import { Filter } from 'iconoir-react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { BaseDatePicker } from '@/components/base/base-date-picker'
import { BaseSelect } from '@/components/base/select'
import type { TransactionType } from '@/types'

type Filters = {
  startDate?: string | null
  endDate?: string | null
  transactionType?: TransactionType | ''
}

interface TransactionFilterProps {
  startDate?: string | null
  endDate?: string | null
  transactionType?: TransactionType | ''
  onChange?: (filters: Filters) => void
  onApply?: (filters: Filters) => void
  buttonClassName?: string
  title?: string
}

export default function TransactionFilter({
  startDate = null,
  endDate = null,
  transactionType = '',
  onChange,
  onApply,
  buttonClassName,
  title = 'Filter Transactions'
}: TransactionFilterProps) {
  const [open, setOpen] = useState(false)
  const [localStart, setLocalStart] = useState<string | null>(startDate)
  const [localEnd, setLocalEnd] = useState<string | null>(endDate)
  const [localType, setLocalType] = useState<TransactionType | ''>(transactionType)

  const txTypeItems = useMemo(
    () =>
      ([
        'OPENING_BALANCE',
        'CASH_DEPOSIT',
        'CASH_WITHDRAWAL',
        'SALE_PAYMENT',
        'PURCHASE_PAYMENT',
        'INCOME',
        'ADJUSTMENT',
        'CLOSING_BALANCE'
      ] as TransactionType[]).map(v => ({
        id: v,
        name: v.split('_').map(word => 
          word.charAt(0) + word.slice(1).toLowerCase()
        ).join(' ')
      })),
    []
  )

  const handleStartChange = (val: Date | null) => {
    const next = val ? dayjs(val).format('YYYY-MM-DD') : null
    setLocalStart(next)
    onChange?.({ startDate: next, endDate: localEnd, transactionType: localType })
  }

  const handleEndChange = (val: Date | null) => {
    const next = val ? dayjs(val).format('YYYY-MM-DD') : null
    setLocalEnd(next)
    onChange?.({ startDate: localStart, endDate: next, transactionType: localType })
  }

  const handleTypeChange = (val: string) => {
    const next = (val || '') as TransactionType | ''
    setLocalType(next)
    onChange?.({ startDate: localStart, endDate: localEnd, transactionType: next })
  }

  const handleClear = () => {
    const cleared = { startDate: null, endDate: null, transactionType: '' as const }
    setLocalStart(null)
    setLocalEnd(null)
    setLocalType('')
    onChange?.(cleared)
    onApply?.(cleared)
  }

  const handleApply = () => {
    onApply?.({
      startDate: localStart,
      endDate: localEnd,
      transactionType: localType
    })
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={buttonClassName}
          aria-label="Open transaction filters"
        >
          <Filter className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[420px] p-0" align="end">
        <div className="p-4">
          <p className="text-sm font-medium mb-3">{title}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">Start date</label>
              <BaseDatePicker
                value={localStart ? new Date(localStart) : null}
                mode="default"
                placeholder="Start date"
                size="filter"
                variant="default"
                onChange={handleStartChange}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground">End date</label>
              <BaseDatePicker
                value={localEnd ? new Date(localEnd) : null}
                mode="default"
                placeholder="End date"
                size="filter"
                variant="default"
                onChange={handleEndChange}
              />
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            <label className="text-xs text-muted-foreground">Transaction type</label>
            <BaseSelect
              items={txTypeItems}
              itemText="name"
              itemValue="id"
              placeholder="Select type"
              value={localType || ''}
              onChange={handleTypeChange}
              size="sm"
              fullWidth
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}