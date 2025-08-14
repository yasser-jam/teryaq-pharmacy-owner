'use client'

import { useState } from 'react'
import { Search, Xmark } from 'iconoir-react'

import { Input } from '@/components/ui/input'

interface BaseSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function BaseSearch({
  value,
  onChange,
  placeholder = 'Search',
  disabled = false,
  className
}: BaseSearchProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  const onXClick = () => {
    setSearchOpen(false)
    onChange('')
  }

  const onInputChange = (e: any) => {
    onChange(e.target.value.trimStart())
  }

  return (
    <div
      onClick={() => (!searchOpen && !disabled ? setSearchOpen(true) : null)}
      className={`group transition-[width] ${
        !searchOpen ? 'w-10' : 'w-52'
      } ${className}`}
      data-collapsible={!searchOpen && 'icon'}
    >
      <Input
        disabled={disabled}
        value={value}
        onChange={onInputChange}
        prefix={<Search className="size-5" />}
        suffix={
          <Xmark
            onClick={onXClick}
            className="size-4 text-text-secondary hover:text-foreground cursor-pointer"
          />
        }
        className="h-10"
        placeholder={placeholder}
      />
    </div>
  )
}
