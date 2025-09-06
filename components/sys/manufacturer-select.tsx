import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { BaseSelect } from '../base/select';
import { useEffect } from 'react';

interface ManufacturerSelectProps {
  value: any;
  onChange: (val: any) => void;
  className?: string;
}

export default function ManufacturerSelect({
  onChange,
  className,
  ...props
}: ManufacturerSelectProps) {
  const { data: items } = useQuery({
    queryKey: ['manufacturers-list'],
    queryFn: () => api('/manufacturers'),
  });


  useEffect(() => {
    if (props.value) onChange(props.value);
  }, [items, props.value]);

  return (
    <BaseSelect
      items={items}
      label="Manufacturer"
      onChange={onChange}
      fullWidth
      className={className}
      value={props.value || ''}
      placeholder='Select Manufacturer'
    />
  );
}
