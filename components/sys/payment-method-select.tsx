import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { BaseSelect } from '../base/select';

interface PaymentMethodSelectProps {
  value: 'CASH' | 'BANK_ACCOUNT';
  onChange: (val: 'CASH' | 'BANK_ACCOUNT') => void;
  className?: string;
}

export default function PaymentMethodSelect({
  onChange,
  className,
  ...props
}: PaymentMethodSelectProps) {
  const items = [
    { value: 'CASH', name: 'Cash' },
    { value: 'BANK_ACCOUNT', name: 'Bank Account' },
  ];

  return (
    <BaseSelect
      items={items}
      label='Payment Method'
      itemText='name'
      itemValue='value'
      onChange={onChange}
      fullWidth
      className={className}
      value={props.value || ''}
      placeholder='Select Payment Method'
    />
  );
}
