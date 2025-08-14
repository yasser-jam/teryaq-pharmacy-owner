import { api } from '@/lib/api';
import { BaseMultipleSelect } from '../base/multiple-select';
import { useQuery } from '@tanstack/react-query';

interface CategoriesMultiSelectProps {
  onChange?: (items: any) => void;
  value: any[];
  className?: string;
}

export default function CategoriesMultiSelect({
  onChange,
  value,
  className,
  ...props
}: CategoriesMultiSelectProps) {
  const { data: categories, isFetching } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api('/categories'),
  });

  return (
    <BaseMultipleSelect
      {...props}
      className={className}
      options={categories?.map((category: any) => ({
        value: category.id,
        label: category.name,
      }))}
      value={value}
      onValueChange={onChange}
      loading={isFetching}
      placeholder='Select categories'
      maxCount={3}
    />
  );
}
