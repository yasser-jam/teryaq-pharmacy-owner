import React, { useState, useEffect } from 'react';
import { BaseDatePicker } from './date-picker';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon } from 'iconoir-react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BaseDateRangeFilterProps {
  startDate: string | undefined;
  endDate: string | undefined;
  loading?: boolean
  hideSearch?: boolean
  onDateChange?: (
    startDate: string | undefined,
    endDate: string | undefined
  ) => void;
  onSearch: (
    startDate: string | undefined,
    endDate: string | undefined
  ) => void;
}

const BaseDateRangeFilter: React.FC<BaseDateRangeFilterProps> = ({
  startDate: propStartDate,
  endDate: propEndDate,
  loading,
  hideSearch = false,
  onDateChange,
  onSearch,
}) => {
  const t = useTranslations('DateRangeFilter');
  const [startDate, setStartDate] = useState(propStartDate);
  const [endDate, setEndDate] = useState(propEndDate);
  const [selectedRange, setSelectedRange] = useState<
    'day' | 'month' | 'year' | null
  >(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the current startDate and endDate match any of the predefined ranges
    const today = dayjs();
    const startOfDay = today.format('YYYY-MM-DD');
    const endOfDay = today.format('YYYY-MM-DD');
    const startOfMonth = today.startOf('month').format('YYYY-MM-DD');
    const endOfMonth = today.endOf('month').format('YYYY-MM-DD');
    const startOfYear = today.startOf('year').format('YYYY-MM-DD');
    const endOfYear = today.endOf('year').format('YYYY-MM-DD');

    if (startDate === startOfDay && endDate === endOfDay) {
      setSelectedRange('day');
    } else if (startDate === startOfMonth && endDate === endOfMonth) {
      setSelectedRange('month');
    } else if (startDate === startOfYear && endDate === endOfYear) {
      setSelectedRange('year');
    } else {
      setSelectedRange(null);
    }
  }, [startDate, endDate]);

  const handleRangeChange = (range: 'day' | 'month' | 'year') => {
    setSelectedRange(range);
    const today = dayjs();
    let newStartDate: dayjs.Dayjs | undefined = undefined;
    let newEndDate: dayjs.Dayjs | undefined = undefined;

    if (range === 'day') {
      newStartDate = today;
      newEndDate = today;
    } else if (range === 'month') {
      newStartDate = today.startOf('month');
      newEndDate = today.endOf('month');
    } else if (range === 'year') {
      newStartDate = today.startOf('year');
      newEndDate = today.endOf('year');
    }
    onDateChange?.(
      newStartDate ? newStartDate.format('YYYY-MM-DD') : undefined,
      newEndDate ? newEndDate.format('YYYY-MM-DD') : undefined
    );
    setStartDate(newStartDate ? newStartDate.format('YYYY-MM-DD') : undefined);
    setEndDate(newEndDate ? newEndDate.format('YYYY-MM-DD') : undefined);
  };

  return (
    <div className='flex flex-col gap-2'>
      <Button
        variant='outline'
        className='w-fit'
        onClick={() => setIsVisible(!isVisible)}
      >
        <CalendarIcon className='mr-2 h-4 w-4' />
        {t('dateRange')}
      </Button>

      {isVisible && (
        <div className='flex flex-col gap-2 border-2 border-dashed p-2 rounded-md'>
          <div className='grid grid-cols-3 gap-2'>
            <BaseDatePicker
              value={startDate}
              onChange={(dateString) => {
                setStartDate(dateString);
                onDateChange?.(dateString, endDate);
              }}
              placeholder={t('startDate')}
            />
            <BaseDatePicker
              value={endDate}
              onChange={(dateString) => {
                setEndDate(dateString);
                onDateChange?.(startDate, dateString);
              }}
              placeholder={t('endDate')}
            />

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className={cn(
                  selectedRange === 'day' &&
                  'bg-primary text-primary-foreground'
                )}
                onClick={() => handleRangeChange('day')}
              >
                {t('day')}
              </Button>
              <Button
                variant='outline'
                className={cn(
                  selectedRange === 'month' &&
                  'bg-primary text-primary-foreground'
                )}
                onClick={() => handleRangeChange('month')}
              >
                {t('month')}
              </Button>
              <Button
                variant='outline'
                className={cn(
                  selectedRange === 'year' &&
                  'bg-primary text-primary-foreground'
                )}
                onClick={() => handleRangeChange('year')}
              >
                {t('year')}
              </Button>

              {
                !hideSearch &&
                <Button className='grow' loading={loading} onClick={() => onSearch(startDate, endDate)}>
                  <Search></Search>
                  {t('search')}
                </Button>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseDateRangeFilter;
