'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Wallet, Minus, HandCoins } from "lucide-react";
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

export default function Dashboard() {
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

  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    transactionType: null,
  });

  useEffect(() => {
    refetchTransactions();
  }, [filters]);

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
    queryKey: ['transactions'],
    queryFn: () =>
      api('moneybox/transactions', {
        params: {
          ...pagination,
          ...filters,
        },
      })
  });

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      totalElements: transactions?.totalElements || 10
    }))
  }, [transactions])

  useEffect(() => {
    refetchTransactions();
  }, [pagination]);

  const {
    data: box,
    isFetching: totalFetching,
    refetch: refetchBox,
  } = useQuery<MoneyBox>({
    queryKey: ['money-box'],
    queryFn: () => api('moneybox'),
  });

  const handleAction = () =>
    currentAction === 'deposit'
      ? deposite()
      : currentAction === 'withdraw'
        ? withdraw()
        : reconcile();

  const loading = isFetching || withdrawPending || depositePending || reconcilePending;

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className='flex-1 space-y-6 p-6'>
          {/* Money Box Summary Row */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-12'>
            {/* Current Balance */}
            <MoneyBoxCard box={box} loading={loading} />
            <ExchangeRateCard exchangeRate={Number(box?.currentUSDToSYPRate)} loading={loading} />
          </div>

          {/* <MoneyBoxCurrency currentCurrency="syp" exchangeRate={10000} value={100} /> */}

          {/* <Card>
          <CardHeader>
            <CardTitle className="text-base">Make a Sale</CardTitle>
            <CardDescription>Start a new POS order</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full h-24 text-lg"
              onClick={() => router.push("/pos/create")}
            >
              Make a Sale
            </Button>
          </CardContent>
        </Card> */}

          {/* Money Box Actions Row */}
          <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-3'>
            <Card className='relative flex-1 bg-teal-100 dark:bg-teal-950'>
              <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-teal-200 dark:bg-teal-800 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-teal-700 dark:text-teal-300" />
              </div>
              <CardHeader>
                <CardTitle className='text-base'>Deposit Operations</CardTitle>
                <CardDescription>Add money to the money box</CardDescription>
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
                    Deposit
                  </Button>
                </DialogTrigger>
              </CardContent>
            </Card>
            <Card className='relative flex-1 bg-red-100 dark:bg-red-950'>
              <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-red-200 dark:bg-red-800 flex items-center justify-center">
                <Minus className="h-5 w-5 text-red-700 dark:text-red-300" />
              </div>
              <CardHeader>
                <CardTitle className='text-base'>Withdraw Operations</CardTitle>
                <CardDescription>Withdraw money from the money box</CardDescription>
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
                    Withdraw
                  </Button>
                </DialogTrigger>
              </CardContent>
            </Card>
            <Card className='relative flex-1 bg-blue-100 dark:bg-blue-950'>
              <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                <HandCoins className="h-5 w-5 text-blue-700 dark:text-blue-300" />
              </div>
              <CardHeader>
                <CardTitle className='text-base'>Reconcile Operations</CardTitle>
                <CardDescription>Reconcile the money box</CardDescription>
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
                    Reconcile
                  </Button>
                </DialogTrigger>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Section */}
          <Card className='border-0'>
            <CardContent className='p-0'>

              <div className='text-2xl font-semibold mb-4'>Transactions</div>

              {
                isFetching ? <BaseSkeleton /> :
                  transactions?.content?.length ? (
                    <div className='divide-y'>
                      {transactions?.content?.map((el) => (
                        <TransactionCard item={el} key={el.id} />
                      ))}
                    </div>
                  ) : <BaseNotFound item="Transaction" />

              }

            </CardContent>
          </Card>
          <BasePagination
            pagination={pagination}
            onPaginationChange={setPagination}
          ></BasePagination>

          <DialogContent className='sm:max-w-[500px]'>
            <DialogHeader>
              <DialogTitle>
                {currentAction === 'deposit'
                  ? 'Deposit'
                  : currentAction === 'withdraw'
                    ? 'Withdraw'
                    : 'Reconcile'} {currentAction === 'reconcile' ? ' reconciliation.' : ' transaction.'}
              </DialogTitle>
              <DialogDescription>
                Enter the amount and description for this
                {currentAction === 'reconcile' ? ' reconciliation.' : ' transaction.'}
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>

                {currentAction != 'reconcile' &&


                  <div>
                    <Label htmlFor='amount' className='text-right'>
                      Amount
                    </Label>
                    <Input
                      id='amount'
                      type='number'
                      value={amount}
                      placeholder='Add the Amount'
                      onChange={(e) => setAmount(parseFloat(String(e)))}
                      className='col-span-3'
                    />

                  </div>

                }
              </div>
              {currentAction === 'reconcile' && (
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='actualCashAmount' className='text-right'>
                    Actual Cash
                  </Label>
                  <Input
                    id='actualCashAmount'
                    type='number'
                    value={actualCashAmount}
                    placeholder='Add the Actual Cash Amount'
                    onChange={(e) => setActualCashAmount(parseFloat(String(e)))}
                    className='col-span-3'
                  />
                </div>
              )}
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='description' className='text-right'>
                  Description
                </Label>
                <Input
                  id='description'
                  value={description}
                  placeholder='Add the Reason for this operation'
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
                disabled={!amount || !description || loading || (currentAction === 'reconcile' && !actualCashAmount)}
              >
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
