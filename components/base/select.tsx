import { SelectProps } from '@/types'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../ui/select'
import { useEffect, useState } from 'react'

type PropsInterface =
  SelectProps & {
    items: any[]
    itemText?: string
    itemValue?: string
    loading?: boolean
    label: string
    value?: any
    onChange: (val: any) => void
  }

export function BaseSelect({
  items,
  itemText = 'name',
  itemValue = 'id',
  loading,
  onChange,
  label,
  value,
  ...props
}: PropsInterface) {

  const [valueName, setValueName] = useState('')

  useEffect(() => {
    setValueName(items?.find(item => item[itemValue] == value)?.[itemText] || '')
    console.log(valueName, value);
  }, [value])

  return (
    <>
      <Select {...props} onValueChange={onChange} value={value}>
        <SelectTrigger
          size={props.size}
          className={
            props.className + ' ' + (props.fullWidth ? 'w-full' : 'w-48')
          }
        >
          <SelectValue placeholder={props.placeholder} ></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items?.length ? (
              items.map(item => (
                <SelectItem key={item[itemValue]} value={item[itemValue].toString()}>
                  {item[itemText]}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value="empty">
                No {label} Fetched
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  )
}
