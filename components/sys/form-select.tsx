import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { BaseSelect } from '../base/select'

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

  console.log(props.value);
  

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


