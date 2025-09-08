"use client";
import BasePageDialog from "@/components/base/page-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoriesMultiSelect from "@/components/sys/categories-multi-select";
import TypeSelect from "@/components/sys/type-select";
import FormSelect from "@/components/sys/form-select";
import ManufacturerSelect from "@/components/sys/manufacturer-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MEDICINE_SCHEMA } from "@/lib/schema";
import { BarcodeInput } from "@/components/sys/barcode-input";
import { BaseSwitch } from "@/components/base/base-switch";
import SysInfo from "@/components/sys/sys-info";
import { successToast } from "@/lib/toast";
import { useTranslations } from "next-intl";
import { useRole } from "@/components/providers/role-provider";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const t = useTranslations('Medicines.details');
  const tGeneral = useTranslations('General');

  type FormData = z.infer<typeof MEDICINE_SCHEMA>;

  const form = useForm<FormData>({
    resolver: zodResolver(MEDICINE_SCHEMA),
    defaultValues: {
      barcodes: [],
      categoryIds: [],
      requiresPrescription: false
    },
  });

  const { data: product } = useQuery({
    queryKey: ["medicine", id],
    queryFn: () => api(`pharmacy_products/multi-lang-with-ids/${id}`),
    enabled: id !== "create",
  });

  useEffect(() => {
    if (product?.id) {

      form.reset({
        ...product,
        formId: product.formId?.toString() || undefined,
        manufacturerId: product.manufacturerId?.toString() || undefined,
        typeId: product.typeId?.toString() || undefined,
        scientificName: product.scientificNameEn || '',
        tradeName: product.tradeNameEn || '',
        categoryIds: product.categoryIds || []
      })
    }
  }, [product]);

  const queryClient = useQueryClient();

  const { mutate: create, isPending: createPending } = useMutation({
    mutationKey: ["medicine-create"],
    mutationFn: (data: FormData) =>
      api("pharmacy_products", {
        body: {
          ...data,
          manufacturerId: Number(data.manufacturerId),
          typeId: Number(data.typeId),
          formId: Number(data.formId),
          tradeNameAr: undefined,
          scientificNameAr: undefined,
          translations: [
            {
              tradeName: data.tradeNameAr,
              scientificName: data.scientificNameAr,
              lang: "ar",
            },
          ],
        },
        method: "POST",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["medicines-list"] });
      successToast(t('createSuccess'));
      goBack();
    },
  });

  const { mutate: update, isPending: updatePending } = useMutation({
    mutationKey: ["medicine-update"],
    mutationFn: (data: FormData) =>
      api(`pharmacy_products/${id}`, {
        body: {
          ...data,
          manufacturerId: Number(data.manufacturerId),
          typeId: Number(data.typeId),
          formId: Number(data.formId),
          tradeNameAr: undefined,
          scientificNameAr: undefined,
          translations: [
            {
              tradeName: data.tradeNameAr,
              scientificName: data.scientificNameAr,
              lang: "ar",
            },
          ],
        },
        method: "PUT",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["medicines-list"] });
      successToast(t('updateSuccess'));
      goBack();
    },
  });

  // useEffect(() => {
  //   if (product) {
  //     form.reset(product);
  //   }
  // }, [product, form]);

  const goBack = () => {
    router.replace("/medicines");
  };

  const onSubmit = (data: FormData) => {
    id === "create" ? create(data) : update(data);
  };

  const { role } = useRole()

  return (
    <>
      <BasePageDialog
        title={t('title')}
        subtitle={t('subtitle')}
        onOpenChange={goBack}
        fullHeight
      >
        {/* <SysInfo
          color="blue"
          text={t('prescriptionHint')}
          className="mb-4 bg-muted/50"
        /> */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 overflow-auto">
              <FormField
                control={form.control}
                name="tradeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tradeName')} (en)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('tradeName')} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tradeNameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tradeName')} (ar)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('tradeName')} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scientificName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('scientificName')} (en)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('scientificName')} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scientificNameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('scientificName')} (ar)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('scientificName')} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="concentration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('concentration')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('concentration')} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('size')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('size')} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tax')}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder={t('tax')} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('manufacturer')}</FormLabel>
                    <FormControl>
                      <ManufacturerSelect
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="typeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('type')}</FormLabel>
                    <FormControl>
                      <TypeSelect
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="formId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('form')}</FormLabel>
                    <FormControl>
                      <FormSelect
                        {...field}
                        value={field.value}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t('categories')}</FormLabel>
                    <FormControl>
                      <CategoriesMultiSelect
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {

                role == 'PHARMACY_MANAGER' &&
                <FormField
                  control={form.control}
                  name="barcodes"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>{t('barcodes')}</FormLabel>
                      <FormControl>
                        <BarcodeInput
                          {...field}
                          className="w-full"
                          barcodes={field.value}
                          onBarcodesChange={(val) => {
                            form.setValue("barcodes", val)
                            form.trigger("barcodes")
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              }

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t('notes')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder={t('notes')} rows={3} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requiresPrescription"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <BaseSwitch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        title={t('requiresPrescription')}
                        subtitle={t('prescriptionHint')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2 flex items-center justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={goBack} type="button">
                {t('cancel')}
              </Button>
              <Button loading={createPending || updatePending}>
                {t('save')}
              </Button>
            </div>
          </form>
        </Form>
      </BasePageDialog>
    </>
  );
}
