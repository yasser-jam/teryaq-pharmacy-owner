'use client'
import { api } from '@/lib/api';
import { BaseMultipleSelect } from '../base/multiple-select';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

interface CategoriesMultiSelectProps {
  onChange?: (items: any) => void;
  value: any;
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

  // Prevent infinite loop: only call onChange when categories are loaded for the first time and value is present
  const didCallOnChange = useRef(false);
  useEffect(() => {
    if (!didCallOnChange.current && props.value && categories?.length) {
      console.log('change value');
      console.log(props.value);
      
      onChange?.(props.value);
      didCallOnChange.current = true;
    }
    // Reset flag if value or categories change (e.g., on navigation or reload)
    if (!props.value || !categories?.length) {
      didCallOnChange.current = false;
    }
  }, [props.value, categories, onChange]);

  return (
    <BaseMultipleSelect
      className={className}
      options={categories?.map((category: any) => ({
        value: category.id,
        label: category.name,
      }))}
      value={props.value}
      onValueChange={onChange}
      loading={isFetching}
      placeholder='Select categories'
      maxCount={3}
    />
  );
}
