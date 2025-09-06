'use client'
import { api } from '@/lib/api';
import { BaseMultipleSelect } from '../base/multiple-select';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

interface CategoriesMultiSelectProps {
  onChange?: (items: any) => void;
  value: any[];
  className?: string;
}

export default function CategoriesMultiSelect({
  onChange,
  className,
  ...props
}: CategoriesMultiSelectProps) {
  const { data: categories, isFetching } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api('/categories'),
  });

  useEffect(() => {
    if (props.value) onChange?.(props.value);
  }, [categories, props.value]);

  return (
    <BaseMultipleSelect
      className={className}
      options={categories?.map((category: any) => ({
        value: category.id,
        label: category.name,
      }))}
      value={props.value || []}
      onValueChange={onChange}
      loading={isFetching}
      placeholder='Select categories'
      maxCount={3}
    />
  );
}
