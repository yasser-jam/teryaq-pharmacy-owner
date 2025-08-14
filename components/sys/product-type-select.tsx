import { BaseSelect } from '../base/select'

interface ProductTypeSelectProps {
  value: 'MASTER' | 'PHARMACY' | ''
  onChange: (val: any) => void
  className?: string
}

const PRODUCT_TYPES = [
  { id: 'MASTER', name: 'MASTER' },
  { id: 'PHARMACY', name: 'PHARMACY' }
]

export default function ProductTypeSelect({ onChange, className, ...props }: ProductTypeSelectProps) {
  return (
    <BaseSelect
      items={PRODUCT_TYPES}
      label='Product Type'
      itemText='name'
      itemValue='id'
      onChange={onChange}
      fullWidth
      className={className}
      value={props.value || ''}
      placeholder='Select Product Type'
    />
  )
}


