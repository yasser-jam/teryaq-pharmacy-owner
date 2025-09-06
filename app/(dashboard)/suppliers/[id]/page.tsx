'use client';
import { useTranslations } from 'next-intl';
import BasePageDialog from '@/components/base/page-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, use } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SUPPLIER_SCHEMA } from '@/lib/schema';
import { BasePhoneInput } from '@/components/base/phone-input';
import { successToast } from '@/lib/toast';
import { Phone } from 'lucide-react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('SupplierDetails');
  const { id } = use(params);
  const router = useRouter();

  type FormData = z.infer<typeof SUPPLIER_SCHEMA>;

  const form = useForm<FormData>({
    resolver: zodResolver(SUPPLIER_SCHEMA),
  });

  const { data: supplier } = useQuery({
    queryKey: ['supplier', id],
    queryFn: () => api(`/suppliers/${id}`),
    enabled: id !== 'create',
  });

  const queryClient = useQueryClient();

  const { mutate: create, isPending: createPending } = useMutation({
    mutationKey: ['supplier-create'],
    mutationFn: (data: FormData) =>
      api('/suppliers', {
        body: {
          ...data,
          preferredCurrency: 'USD'
        },
        method: 'POST',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      successToast(t('createSuccess'));
      goBack();
    },
  });

  const { mutate: update, isPending: updatePending } = useMutation({
    mutationKey: ['supplier-update'],
    mutationFn: (data: FormData) =>
      api(`/suppliers/${id}`, {
        body: {
          ...data,
          preferredCurrency: 'USD'
        },
        method: 'PUT',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      goBack();
    },
  });

  // Select data now handled in sys components

  useEffect(() => {
    if (supplier) {
      form.reset(supplier);
    }
  }, [supplier, form]);

  const goBack = () => {
    router.replace('/suppliers');
  };

  const onSubmit = (data: FormData) => {
    id == 'create' ? create(data) : update(data);
  };

  return (
    <>
      <BasePageDialog
        title={t('title')}
        subtitle={t('subtitle')}
        className='w-[800px]'
        onOpenChange={goBack}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-1 gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name.label')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('name.placeholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('phone.label')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('phone.placeholder')} prefix={<Phone />} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('address.label')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('address.placeholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='col-span-2 flex items-center justify-end gap-2 mt-4'>
              <Button variant='ghost' onClick={goBack}>
                {t('cancel')}
              </Button>
              <Button loading={createPending || updatePending}>{t('save')}</Button>
            </div>
          </form>
        </Form>
      </BasePageDialog>
    </>
  );
}
