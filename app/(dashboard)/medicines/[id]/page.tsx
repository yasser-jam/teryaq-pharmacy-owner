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

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  type FormData = z.infer<typeof MEDICINE_SCHEMA>;

  const form = useForm<FormData>({
    resolver: zodResolver(MEDICINE_SCHEMA),
    defaultValues: {
      barcodes: [],
      requiresPrescription: false
    },
  });

  const { data: product } = useQuery({
    queryKey: ["medicine", id],
    queryFn: () => api(`pharmacy_products/multi-lang/${id}`),
    enabled: id !== "create",
  });

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
      successToast('Medicine created successfully');
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
      successToast('Medicine updated successfully');
      goBack();
    },
  });

  useEffect(() => {
    if (product) {
      form.reset(product);
    }
  }, [product, form]);

  const goBack = () => {
    router.replace("/medicines");
  };

  const onSubmit = (data: FormData) => {
    id === "create" ? create(data) : update(data);
  };

  return (
    <>
      <BasePageDialog
        title="Medicine Details"
        subtitle="Fill Medicine Data"
        onOpenChange={goBack}
      >
        <SysInfo
          color="blue"
          text="Please consider that the medicine you add from this list will be available only for your pharmacy and you can NOT add medicine that already exists in the system medicines"
          className="mb-4 bg-muted/50"
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 max-h-[325px] overflow-auto">
              <FormField
                control={form.control}
                name="tradeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trade Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Trade Name" />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tradeNameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم التجاري</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="الاسم التجاري" />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scientificName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scientific Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Scientific Name" />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scientificNameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم العلمي</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="الاسم العلمي" />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="concentration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concentration</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Concentration" />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Size" />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Tax" />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <ManufacturerSelect
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="typeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <TypeSelect
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="formId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form</FormLabel>
                    <FormControl>
                      <FormSelect
                        value={field.value}
                        onChange={field.onChange}
                        className="w-full"
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <CategoriesMultiSelect
                        value={field.value || []}
                        onChange={field.onChange}
                        className="w-full"
                      />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barcodes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Notes" rows={3} />
                    </FormControl>
                    {/* <FormMessage /> */}
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
                        title="Requires Prescription"
                        subtitle="You should see verified prescription before selling this item"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-2 flex items-center justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={goBack} type="button">
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
