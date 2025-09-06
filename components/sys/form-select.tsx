import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { BaseSelect } from '../base/select'
import { useEffect } from 'react'

interface FormSelectProps {
  value: any
  onChange: (val: any) => void
  className?: string
}

export default function FormSelect({ onChange, className, ...props }: FormSelectProps) {
  const { data: items } = useQuery({
    queryKey: ['forms-list'],
    queryFn: () => api('/Forms')
  })

  useEffect(() => {

    console.log('hello test', props.value);

    if (props.value) onChange(props.value)
  }, [items, props.value])


  return (
    <BaseSelect
      items={items}
      label='Form'
      itemText='name'
      itemValue='id'
      onChange={onChange}
      fullWidth
      className={className}
      value={props.value || ''}
      placeholder='Select Form'
    />
  )
}


