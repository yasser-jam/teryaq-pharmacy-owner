'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Wallet, Minus, HandCoins } from "lucide-react";
import { useTranslations } from 'next-intl';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import TransactionCard from '@/components/transaction/transaction-card';
import { MoneyBox, Pagination, Transaction, TransactionType } from '@/types';
import MoneyBoxCard from '@/components/money-box/money-box-card';
import TransactionFilter from '@/components/transaction/transaction-filter';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { successToast } from '@/lib/toast';
import { initPagination } from '@/lib/init';
import BasePagination from '@/components/base/pagination';
import ExchangeRateCard from '@/components/money-box/exchange-rate-card';
import BaseSkeleton from '@/components/base/base-skeleton';
import BaseNotFound from '@/components/base/base-not-found';
import ChartMonthlyPurchase from '@/components/chart/chart-monthly-puchase';
import BaseDateRangeFilter from '@/components/base/base-date-range-filter';
import dayjs from 'dayjs';
import { getCurrentMonthRange, getNextMonthFromNow } from '@/lib/utils';
import ChartDailyProfit from '@/components/chart/chart-daily-profit';
import { Calendar } from '@/components/ui/calendar';
import { ChartMostSold } from '@/components/chart/chart-most-sold';
import { ChartMostSoldType } from '@/components/chart/chart-most-sold-type';
import ChartDailyPurchase from '@/components/chart/chart-daily-purchase';
import ChartMonthlyProfit from '@/components/chart/chart-monthly-profit';

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    'deposit' | 'withdraw' | 'reconcile' | null
  >(null);
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [actualCashAmount, setActualCashAmount] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState<string>('');

  const queryClient = useQueryClient();

  const { mutate: deposite, isPending: depositePending } = useMutation({
    mutationFn: () =>
      api('/moneybox/transactions', {
        method: 'POST',
        params: {
          amount: amount,
          description: description,
        },
      }),
    onSettled: () => {

      setIsDialogOpen(false);
      setAmount(undefined);
      setDescription('');
    },
    onSuccess: () => {

      successToast('Deposite Added Successfully!');

      refetchBox()
      refetchTransactions();
    },
  });

  const { mutate: withdraw, isPending: withdrawPending } = useMutation({
    mutationFn: () =>
      api('/moneybox/transactions', {
        method: 'POST',
        params: {
          amount: Number(amount) * -1,
          description: description,
        },
      }),
    onSettled: () => {

      setIsDialogOpen(false);
      setAmount(undefined);
      setDescription('');
    },
    onSuccess: () => {

      successToast('Withdraww Added Successfully!');

      refetchBox();
      refetchTransactions();
    },
  });

  const { mutate: reconcile, isPending: reconcilePending } = useMutation({
    mutationFn: () =>
      api('/moneybox/reconcile', {
        method: 'POST',
        params: {
          // amount: Number(amount),
          actualCashCount: Number(actualCashAmount),
          notes: description,
        },
      }),
    onSettled: () => {
      setIsDialogOpen(false);
      setAmount(undefined);
      setActualCashAmount(undefined);
      setDescription('');
    },
    onSuccess: () => {

      successToast('Money Box Reconciled Successfully!');

      refetchTransactions();
      refetchBox();
    },
  });

  const [filters, setFilters] = useState<any>({
    startDate: null,
    endDate: null,
    transactionType: '',
  });



  const [pagination, setPagination] = useState<Pagination>(initPagination());

  const {
    data: transactions,
    isFetching,
    refetch: refetchTransactions,
  } = useQuery<{
    content: Transaction[];
    page: number;
    size: number;
    totalElements: number;
  }>({
    queryKey: ['transactions', pagination.page],
    queryFn: () =>
      api('moneybox/transactions', {
        params: {
          ...pagination,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          transactionType: filters.transactionType || undefined,
        },
      })
  });

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      totalElements: transactions?.totalElements || 10
    }))
  }, [transactions])

  const {
    data: box,
    isFetching: totalFetching,
    refetch: refetchBox,
  } = useQuery<MoneyBox>({
    queryKey: ['money-box'],
    queryFn: () => api('moneybox'),
  });

  const [startDate, setStartDate] = useState<string>(getCurrentMonthRange().start)
  const [endDate, setEndDate] = useState<string>(getCurrentMonthRange().end)
  const [selectedDay, setSelectedDay] = useState<string>(dayjs().format('YYYY-MM-DD'))
  const [selectedDayProfit, setSelectedDayProfit] = useState<string>(dayjs().format('YYYY-MM-DD'))

  const handleAction = () =>
    currentAction === 'deposit'
      ? deposite()
      : currentAction === 'withdraw'
        ? withdraw()
        : reconcile();


  useEffect(() => {
    console.log(filters);

    refetchTransactions();
  }, [filters]);

  const loading = isFetching || withdrawPending || depositePending || reconcilePending;

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">{t('header')}</h2>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className='flex-1 space-y-6 p-6'>
          {/* Money Box Summary Row */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-12'>
            {/* Current Balance */}
            <MoneyBoxCard box={box} loading={loading} />
            <ExchangeRateCard exchangeRate={Number(box?.currentUSDToSYPRate)} loading={loading} />
          </div>

          {/* Money Box Actions Row */}
          <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-3'>
            <Card className='relative flex-1 bg-teal-100 dark:bg-teal-950'>
              <div className="absolute top-4 end-4 h-10 w-10 rounded-full bg-teal-200 dark:bg-teal-800 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-teal-700 dark:text-teal-300" />
              </div>
              <CardHeader>
                <CardTitle className='text-base'>{t('depositTitle')}</CardTitle>
                <CardDescription>{t('depositDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    className='border-dashed border-teal-500 text-teal-500 text-lg h-16 w-full'
                    onClick={() => {
                      setIsDialogOpen(true);
                      setCurrentAction('deposit');
                    }}
                  >
                    {t('depositBtn')}
                  </Button>
                </DialogTrigger>
              </CardContent>
            </Card>
            <Card className='relative flex-1 bg-red-100 dark:bg-red-950'>
              <div className="absolute top-4 end-4 h-10 w-10 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center">
                <Minus className="h-5 w-5 text-red-700 dark:text-red-300" />
              </div>
              <CardHeader>
                <CardTitle className='text-base'>{t('withdrawTitle')}</CardTitle>
                <CardDescription>{t('withdrawDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    className='border-dashed border-destructive text-destructive text-lg h-16 w-full'
                    onClick={() => {
                      setIsDialogOpen(true);
                      setCurrentAction('withdraw');
                    }}
                  >
                    {t('withdrawBtn')}
                  </Button>
                </DialogTrigger>
              </CardContent>
            </Card>
            <Card className='relative flex-1 bg-blue-100 dark:bg-blue-950'>
              <div className="absolute top-4 end-4 h-10 w-10 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                <HandCoins className="h-5 w-5 text-blue-700 dark:text-blue-300" />
              </div>
              <CardHeader>
                <CardTitle className='text-base'>{t('reconcileTitle')}</CardTitle>
                <CardDescription>{t('reconcileDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    className='border-dashed border-blue-500 text-blue-500 text-lg h-16 w-full'
                    onClick={() => {
                      setIsDialogOpen(true);
                      setCurrentAction('reconcile');
                    }}
                  >
                    {t('reconcileBtn')}
                  </Button>
                </DialogTrigger>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Section */}
          <Card className='border-0'>
            <CardContent className='p-0'>
              <div className='flex items-center justify-between mb-4'>
                <div className='text-2xl font-semibold mb-4'>{t('transactionsTitle')}</div>
                <TransactionFilter
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  transactionType={filters.transactionType}
                  onApply={(data) => setFilters(data)}
                />
              </div>
              {
                isFetching ? <BaseSkeleton /> :
                  transactions?.content?.length ? (
                    <div className='divide-y'>
                      {transactions?.content?.map((el) => (
                        <TransactionCard item={el} key={el.id} />
                      ))}
                    </div>
                  ) : <BaseNotFound item={t('noTransactions')} />
              }
            </CardContent>
          </Card>
          <BasePagination
            pagination={pagination}
            onPaginationChange={setPagination}
          ></BasePagination>

          {/* Charts */}
          <div>
            <BaseDateRangeFilter hideSearch startDate={startDate} endDate={endDate} onDateChange={(start: any, end: any) => {
              setStartDate(start); setEndDate(end);
            }} onSearch={() => { }} />
            <ChartMonthlyPurchase startDate={startDate} endDate={endDate} />

            <div className='grid grid-cols-3 gap-4'>
              <div className='col-span-2 min-h-[300px]'>
                <ChartMostSold startDate={startDate} endDate={endDate} />
              </div>
              <ChartMostSoldType startDate={startDate} endDate={endDate} />
            </div>

            <div className='grid grid-cols-3 gap-4 my-6'>
              <Calendar
                mode="single"
                required
                selected={new Date(selectedDay)}
                onSelect={(val: Date) => setSelectedDay(dayjs(val).format('YYYY-MM-DD'))}
                className="rounded-md border shadow-sm col-span-1 w-full"
                captionLayout="dropdown"
              />
              <ChartDailyPurchase date={selectedDay} className='col-span-2' />
            </div>

            <ChartMonthlyProfit startDate={startDate} endDate={endDate} />

            <div className='grid grid-cols-3 gap-4 my-6'>
              <Calendar
                mode="single"
                required
                selected={new Date(selectedDay)}
                onSelect={(val: Date) => setSelectedDay(dayjs(val).format('YYYY-MM-DD'))}
                className="rounded-md border shadow-sm col-span-1 w-full"
                captionLayout="dropdown"
              />
              <ChartDailyProfit date={selectedDayProfit} className='col-span-2' />
            </div>
          </div>

          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>
                {currentAction === 'deposit'
                  ? t('depositBtn')
                  : currentAction === 'withdraw'
                    ? t('withdrawBtn')
                    : t('reconcileBtn')} {currentAction === 'reconcile' ? t('reconcileDialogTitle') : t('transactionDialogTitle')}
              </DialogTitle>
              <DialogDescription>
                {t('dialogDesc', { type: currentAction === 'reconcile' ? t('reconcileDialogTitle') : t('transactionDialogTitle') })}
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                {currentAction != 'reconcile' &&
                  <>
                    <Label htmlFor='amount' className='grid-cols-1'>
                      {t('amount')}
                    </Label>
                    <Input
                      id='amount'
                      type='number'
                      value={amount}
                      placeholder={t('amountPlaceholder')}
                      onChange={(e) => setAmount(parseFloat(String(e)))}
                      className='col-span-3'
                    />
                  </>
                }
              </div>
              {currentAction === 'reconcile' && (
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='actualCashAmount' className='text-right'>
                    {t('actualCash')}
                  </Label>
                  <Input
                    id='actualCashAmount'
                    type='number'
                    value={actualCashAmount}
                    placeholder={t('actualCashPlaceholder')}
                    onChange={(e) => setActualCashAmount(parseFloat(String(e)))}
                    className='col-span-3'
                  />
                </div>
              )}
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='description' className='text-right'>
                  {t('description')}
                </Label>
                <Input
                  id='description'
                  value={description}
                  placeholder={t('descriptionPlaceholder')}
                  onChange={(e) => setDescription(String(e))}
                  className='col-span-3'
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type='submit'
                onClick={handleAction}
                loading={loading}
                disabled={loading || (currentAction === 'reconcile' ? !actualCashAmount :  !amount || !description)}
              >
                {t('sendBtn')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
