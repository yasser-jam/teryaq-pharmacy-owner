"use client";
import BaseHeader from "@/components/base/base-header";
import BaseNotFound from "@/components/base/base-not-found";
import { MedicineInlineCard } from "@/components/medicine/medicine-inline-card";
import SupplierInlineCard from "@/components/supplier/supplier-inline-card";
import PurchaseOrderInlineCard from "@/components/purchase-order/purchase-order-inline-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Medicine, PurchaseItem, Supplier } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { errorToast, successToast } from "@/lib/toast";
import BasePageDialog from "@/components/base/page-dialog";

export default function Page() {
  const router = useRouter();

  const { data: medicines, isFetching: medicinesLoading } = useQuery<
    Medicine[]
  >({
    queryKey: ["medicines-orders-list"],
    queryFn: () => api("search/all-products"),
  });

  const { data: suppliers, isFetching: suppliersLoading } = useQuery<
    Supplier[]
  >({
    queryKey: ["suppliers-orders-list"],
    queryFn: () => api("suppliers"),
  });

  const [currency, setCurrency] = useState<"USD" | "SYP">("USD");
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [supplierId, setSupplierId] = useState<number>(0);

  const goBack = () => router.replace("/purchase-orders");

  const selectMedicine = (med: Medicine) => {
    // remove if already exists
    if (items.find((el) => el.productId === med.id)) {
      setItems((prev) => prev.filter((el) => el.productId !== med.id));
      return;
    }

    // add new item with default quantity 1 and price from medicine if available
    setItems((prev) => [
      ...prev,
      {
        productId: med.id,
        quantity: 1,
        barcode: med.barcodes[0],
        price: med.refSellingPrice || 0,
        productType: med.productTypeName || "MASTER",
        medicine: med, // Include the full medicine object
      },
    ]);
  };


  const { mutate, isPending } = useMutation({
    mutationFn: () => api("purchase-orders", {
      method: "POST",
      body: {
        items: items.map(el => ({
          ...el,
          medicine: undefined,
          productType: el.productType == 'مركزي' || el.productType == 'MASTER' ? 'MASTER' : 'PHARMACY'
        })),
        supplierId,
        currency,
      },
    }),
    onSuccess: () => {
      successToast("Purchase Order Created Successfully");
      goBack();
    },
  })

  const create = () => {
    if (!supplierId || !items.length) {
      errorToast("Please select a supplier and add at least one item");
      return;
    }

    mutate();
  };

  return (
    <>
      <BasePageDialog
        title="Purchase Order"
        subtitle="Fill the details for the Purchase Order"
        className="w-full h-full"
        onOpenChange={goBack}
        headerChildren={<Button loading={isPending} onClick={() => create()}>Send Order</Button>}
      >
        <div className="grid grid-cols-3 gap-4">
          <Card className="col-span-2">
            <CardContent>
              <CardTitle className="mb-4">Medicines</CardTitle>
              <div className="grid gap-2 max-h-[200px] overflow-auto">
                {medicines?.map((el) => (
                  <MedicineInlineCard
                    key={el.id}
                    medicine={el}
                    onSelect={() => selectMedicine(el)}
                  ></MedicineInlineCard>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 bg-muted/10">
            <CardContent>
              <CardTitle className="mb-4">Suppliers</CardTitle>
              <div className="max-h-[200px] overflow-auto">
                {suppliers?.map((el) => (
                  <SupplierInlineCard
                    key={el.id}
                    supplier={el}
                    selected={supplierId == el.id}
                    onSelect={() => setSupplierId(el.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardContent>
              <CardTitle className="mb-4">Current Order</CardTitle>
              {items?.length ? (
                <div className="space-y-2">
                  {items.map((item) => (
                    <PurchaseOrderInlineCard
                      key={`${item.productId}-${item.productType}`}
                      purchaseItem={item}
                      currency={currency}
                      onItemChange={(updatedItem) => {
                        setItems((prev) =>
                          prev.map((i) =>
                            i.productId === updatedItem.productId &&
                            i.productType === updatedItem.productType
                              ? updatedItem
                              : i
                          )
                        );
                      }}
                      onRemove={() => {
                        setItems((prev) =>
                          prev.filter(
                            (i) =>
                              !(
                                i.productId === item.productId &&
                                i.productType === item.productType
                              )
                          )
                        );
                      }}
                    />
                  ))}
                </div>
              ) : (
                <BaseNotFound item="Selected Medicine" />
              )}
              {/* <div className='max-h-[200px] overflow-auto'>
                {medicines?.map((el) => (
                    <div></div>
                ))}
              </div> */}
            </CardContent>
          </Card>
        </div>
      </BasePageDialog>
    </>
  );
}
