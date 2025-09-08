import { Customer, Debt } from '@/types';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { successToast } from '@/lib/toast';
import PaymentMethodSelect from '../sys/payment-method-select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useTranslations } from 'next-intl';

interface CustomerCardDebtsDialogProps {
  customer: Customer;
}

export default function CustomerCardDebtsDialog({
  customer,
}: CustomerCardDebtsDialogProps) {
  const [paymentAmount, setPaymentAmount] = useState<Record<number, number>>(
    {}
  );
  const [autoPayAmount, setAutoPayAmount] = useState<number | ''>(0);
  const [autoPayMethod, setAutoPayMethod] = useState<'CASH' | 'BANK_ACCOUNT'>(
    'CASH'
  );
  const [currentDebtPaymentMethod, setCurrentDebtPaymentMethod] = useState<
    Record<number, 'CASH' | 'BANK_ACCOUNT'>
  >({});

  const queryClient = useQueryClient();

  const { mutate: payDebt, isPending: payDebtPending } = useMutation({
    mutationFn: ({
      debtId,
      paymentAmount,
      paymentMethod,
    }: {
      debtId: number;
      paymentAmount: number;
      paymentMethod: 'CASH' | 'BANK_ACCOUNT';
    }) =>
      api(`/customer-debts/pay`, {
        body: {
          debtId,
          paymentAmount,
          paymentMethod,
        },
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      successToast('Debt payment successful');
    },
  });

  const handleSendPayment = (debtId: number, debtRemainingAmount: number) => {
    const amountToPay = paymentAmount[debtId] || 0;
    const paymentMethod = currentDebtPaymentMethod[debtId] || 'CASH';

    if (amountToPay > 0 && amountToPay <= debtRemainingAmount) {
      payDebt({ debtId, paymentAmount: amountToPay, paymentMethod });
      setPaymentAmount((prev) => {
        const newState = { ...prev };
        delete newState[debtId];
        return newState;
      });
    }
  };

  const { mutate: autoPay, isPending: autoPayPending } = useMutation({
    mutationFn: () =>
      api(`/customer-debts/${customer?.id}/autoPay`, {
        body: {
          totalPaymentAmount: autoPayAmount,
          paymentMethod: autoPayMethod,
        },
        method: 'POST',
      }),
    onSuccess: () => {
      successToast('Auto pay successful');
      setAutoPayAmount(0);

      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const totalRemainingDebt =
    customer?.debts?.reduce(
      (sum, debt) => sum + ((debt.amount || 0) - (debt.paidAmount || 0)),
      0
    ) || 0;

  const t = useTranslations('CustomerDebtsDialog')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='link' className='px-0 pt-4'>
          {t('showAllDebts')}
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[600px] max-h-[500px] bg-white overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('debtsFor', { name: customer?.name })}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue='debts' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='debts'>{t('debtsTab')}</TabsTrigger>
            <TabsTrigger value='auto-pay'>{t('autoPayTab')}</TabsTrigger>
          </TabsList>

          <TabsContent value='debts'>
            <div className='grid gap-4 py-4'>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>
                  {t('debtsListDesc')}
                </p>
              </div>

              <div className='grid gap-2'>
                {customer.debts?.map((debt) => {
                  const remainingAmount =
                    (debt.amount || 0) - (debt.paidAmount || 0);

                  return (
                    <div
                      key={debt.id}
                      className='flex items-center justify-between py-2 border-b last:border-b-0'
                    >
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium'>
                          {t('dueDate')}
                          {debt.dueDate}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {t('remaining', { remaining: remainingAmount.toFixed(2) })}
                        </span>
                      </div>

                      <div className='flex items-center space-x-2'>
                        <span className='text-sm text-gray-700'>
                          {debt.paidAmount?.toFixed(2) || '0.00'} /{' '}
                          {debt.amount?.toFixed(2) || '0.00'}
                        </span>
                        {remainingAmount > 0 && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant='outline' loading={payDebtPending} size='sm'>
                                {t('pay')}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-72'>
                              <div className='grid gap-4'>
                                <div className='space-y-2'>
                                  <h4 className='font-medium leading-none'>
                                    {t('payDebtTitle')}
                                  </h4>
                                  <p className='text-sm text-muted-foreground'>
                                    {t('payDebtDesc')}
                                  </p>
                                </div>
                                <div className='grid gap-2'>
                                  <Input
                                    type='number'
                                    placeholder='Amount'
                                    value={paymentAmount[debt.id!] || ''}
                                    onChange={(e) =>
                                      setPaymentAmount((prev) => ({
                                        ...prev,
                                        [debt.id!]: Number(e),
                                      }))
                                    }
                                    min={0}
                                    max={remainingAmount}
                                  />
                                  <PaymentMethodSelect
                                    value={
                                      currentDebtPaymentMethod[debt.id!] ||
                                      'CASH'
                                    }
                                    onChange={(value) =>
                                      setCurrentDebtPaymentMethod((prev) => ({
                                        ...prev,
                                        [debt.id!]: value,
                                      }))
                                    }
                                  />
                                  <Button
                                    size='sm'
                                    onClick={() =>
                                      handleSendPayment(
                                        debt.id!,
                                        remainingAmount
                                      )
                                    }
                                    disabled={
                                      !paymentAmount[debt.id!] ||
                                      paymentAmount[debt.id!] <= 0 ||
                                      paymentAmount[debt.id!] >
                                      remainingAmount ||
                                      payDebtPending
                                    }
                                  >
                                    {t('send')}
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          <TabsContent value='auto-pay'>
            <div className='grid gap-4 py-4'>
              <div className='space-y-2'>
                <p className='text-sm text-muted-foreground'>
                  {t('autoPayDesc')}
                  {t('amount')}: {totalRemainingDebt.toFixed(2)}
                </p>
              </div>
              <div className='grid gap-2'>
                <Input
                  type='number'
                  placeholder={t('autoPayAmountPlaceholder')}
                  value={autoPayAmount === '' ? '' : autoPayAmount}
                  onChange={(e) => setAutoPayAmount(Number(e))}
                  min={0}
                  max={totalRemainingDebt}
                />
                <PaymentMethodSelect
                  value={autoPayMethod}
                  onChange={setAutoPayMethod}
                />
                <Button
                  loading={autoPayPending}
                  onClick={() => autoPay()}
                  disabled={
                    !autoPayAmount ||
                    autoPayAmount <= 0 ||
                    autoPayAmount > totalRemainingDebt
                  }
                >
                  {t('pay')}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
