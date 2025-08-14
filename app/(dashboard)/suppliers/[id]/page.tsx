'use client';
import BasePageDialog from '@/components/base/page-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { BaseMultipleSelect } from '@/components/base/multiple-select';
import { BaseSelect } from '@/components/base/select';
import TypeSelect from '@/components/sys/type-select';
import FormSelect from '@/components/sys/form-select';
import ProductTypeSelect from '@/components/sys/product-type-select';
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
import { Textarea } from '@/components/ui/textarea';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  type FormData = z.infer<typeof SUPPLIER_SCHEMA>;

  const form = useForm<FormData>({
    resolver: zodResolver(SUPPLIER_SCHEMA),
    defaultValues: {
      preferredCurrency: 'USD',
    },
  });

  const { data: supplier, isFetching } = useQuery({
    queryKey: ['supplier', id],
    queryFn: () => api(`/suppliers/${id}`),
    enabled: id !== 'create',
  });

  const queryClient = useQueryClient();

  const { mutate: create, isPending: createPending } = useMutation({
    mutationKey: ['supplier-create'],
    mutationFn: (data: any) =>
      api('/suppliers', {
        body: {
          ...data,
        },
        method: 'POST',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      goBack();
    },
  });

  const { mutate: update, isPending: updatePending } = useMutation({
    mutationKey: ['supplier-create'],
    mutationFn: (data: any) =>
      api(`/suppliers/${id}`, {
        body: {
          ...data,
        },
        method: 'POST',
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
        title='Supplier Details'
        subtitle='Fill Supplier Data'
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Supplier Name' />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <BasePhoneInput
                        {...field}
                        placeholder='Supplier Phone Number'
                      />
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
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Supplier Address' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='col-span-2 flex items-center justify-end gap-2 mt-4'>
              <Button variant='ghost' onClick={goBack}>
                Cancel
              </Button>
              <Button loading={createPending || updatePending}>Save</Button>
            </div>
          </form>
        </Form>
      </BasePageDialog>
    </>
  );
}
