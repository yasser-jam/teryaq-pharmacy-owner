import { MoneyBox } from '@/types';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DialogTrigger } from '../ui/dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { successToast } from '@/lib/toast';

interface MoneyBoxActionsCardProps {
  box?: MoneyBox;
}

export default function MoneyBoxActionsCard({ box }: MoneyBoxActionsCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    'deposit' | 'withdraw' | null
  >(null);
  const [amount, setAmount] = useState<number | undefined>(undefined);
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
    onSuccess: () => {
      setIsDialogOpen(false);
      setAmount(undefined);
      setDescription('');

      successToast('Deposite Added Successfully!');

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const { mutate: withdraw, isPending: withdrawPending } = useMutation({
    mutationFn: () =>
      api('/moneybox/transactions', {
        method: 'POST',
        body: {
          amount: Number(amount) * -1,
          description: description,
        },
      }),
    onSuccess: () => {
      setIsDialogOpen(false);
      setAmount(undefined);
      setDescription('');

      successToast('Deposite Added Successfully!');

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const handleAction = () =>
    currentAction === 'deposit' ? deposite() : withdraw();

  const loading = withdrawPending || depositePending;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Mnoey Box Operations</CardTitle>
            <div className='flex flex-row gap-2 pt-4'>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  className='border-dashed border-teal-500 text-teal-500 text-lg h-16 flex-1'
                  onClick={() => {
                    setIsDialogOpen(true);
                    setCurrentAction('deposit');
                  }}
                >
                  Deposit
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button
                  variant='outline'
                  className='border-dashed border-destructive text-destructive text-lg h-16 flex-1'
                  onClick={() => {
                    setIsDialogOpen(true);
                    setCurrentAction('withdraw');
                  }}
                >
                  Withdraw
                </Button>
              </DialogTrigger>
            </div>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>
              {currentAction === 'deposit' ? 'Deposit' : 'Withdraw'} Amount
            </DialogTitle>
            <DialogDescription>
              Enter the amount and description for this transaction.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
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
              disabled={!amount || !description || loading}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </>
    </Dialog>
  );
}
