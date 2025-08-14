import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { BaseSelect } from '../base/select'

interface TypeSelectProps {
  value: any
  onChange: (val: any) => void
  className?: string
}

export default function TypeSelect({ onChange, className, ...props }: TypeSelectProps) {
  const { data: items } = useQuery({
    queryKey: ['types-list'],
    queryFn: () => api('/types')
  })

  return (
    <BaseSelect
      items={items}
      label='Type'
      itemText='name'
      itemValue='id'
      onChange={onChange}
      fullWidth
      className={className}
      value={props.value || ''}
      placeholder='Select Type'
    />
  )
}


