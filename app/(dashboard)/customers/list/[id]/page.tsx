"use client";
import BasePageDialog from '@/components/base/page-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, use } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CUSTOMER_SCHEMA } from '@/lib/schema'
import { Textarea } from '@/components/ui/textarea'
import { BasePhoneInput } from '@/components/base/phone-input'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  type FormData = z.infer<typeof CUSTOMER_SCHEMA>

  const form = useForm<FormData>({
    resolver: zodResolver(CUSTOMER_SCHEMA),
  })

  const { data: customer } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => api(`/customers/${id}`),
    enabled: id !== 'create',
  })

  const queryClient = useQueryClient()

  const { mutate: create, isPending: createPending } = useMutation({
    mutationKey: ['customer-create'],
    mutationFn: (data: any) =>
      api('/customers', {
        body: data,
        method: 'POST',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['customers'] })
      goBack()
    },
  })

  const { mutate: update, isPending: updatePending } = useMutation({
    mutationKey: ['customer-update'],
    mutationFn: (data: any) =>
      api(`/customers/${id}`, {
        body: data,
        method: 'PUT',
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['customers'] })
      goBack()
    },
  })

  useEffect(() => {
    if (customer) {
      form.reset(customer)
    }
  }, [customer, form])

  const goBack = () => {
    router.replace('/customers/list')
  }

  const onSubmit = (data: FormData) => {
    id == 'create' ? create(data) : update(data)
  }

  return (
    <>
      <BasePageDialog
        title='Customer Details'
        subtitle='Fill Customer Data'
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
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Customer Name' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <BasePhoneInput {...field} placeholder='Customer Phone Number' />
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
                      <Input {...field} placeholder='Customer Address' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder='Notes about the customer' />
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
  )
}


