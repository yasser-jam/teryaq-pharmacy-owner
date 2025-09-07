'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { REGISTER_SCHEMA } from '@/lib/schema';
import { api } from '@/lib/api';
import { successToast } from '@/lib/toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BasePasswordInput from '@/components/base/base-password-input';
import { BasePhoneInput } from '@/components/base/phone-input';
import { setCookie } from '@/lib/utils';
import { Phone } from 'lucide-react';
import SysAreaSelect from '../sys/area-select';

type RegisterFormData = z.infer<typeof REGISTER_SCHEMA>;

export default function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(REGISTER_SCHEMA),
  });

  const submitMutation = useMutation({
    mutationKey: ['complete-registration'],
    mutationFn: (data: RegisterFormData) =>
      api('/pharmacy/complete-registration', {
        method: 'POST',
        params: {
          ...data,
          startTime: undefined,
          endTime: undefined,
          openingHours: `${data.startTime}-${data.endTime}`
        },
      }),
    onSuccess: async () => {
      successToast('Registration completed successfully');
      setCookie('tp.complete-account', 'true');

      // open the moneybox
      await api('/moneybox', {
        method: 'POST',
        body: {
          initialBalance: 0,
          currency: 'SYP'
        }
      })

      router.push('/');
    },
  });

  const onSubmit = (data: RegisterFormData) => submitMutation.mutate(data);

  return (
    <div className='space-y-8'>
      <div className='text-center space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>
          Complete Registration
        </h1>
        <p className='text-muted-foreground text-sm'>
          Enter your pharmacy details
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='managerFirstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager First Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter first name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='managerLastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter last name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='pharmacyEmail'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>Pharmacy Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      {...field}
                      placeholder='example@domain.com'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='pharmacyPhone'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>Pharmacy Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={'09********'} prefix={<Phone />} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='areaId'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>Area</FormLabel>
                  <FormControl>
                    <SysAreaSelect {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>Location (Address)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='City, Country' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='newPassword'
              render={({ field }) => (
                <FormItem className='col-span-2'>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <BasePasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='startTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='endTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type='submit'
            className='w-full'
            loading={submitMutation.isPending}
          >
            Complete Registration
          </Button>
        </form>
      </Form>
    </div>
  );
}
