"use client";
import SupplierInlineCard from "@/components/supplier/supplier-inline-card";
import PurchaseOrderInlineCard from "@/components/purchase-order/purchase-order-inline-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Medicine, PurchaseItem, PurchaseOrder, Supplier } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { errorToast, successToast } from "@/lib/toast";
import BasePageDialog from "@/components/base/page-dialog";
import PurchaseOrderHeader from "@/components/purchase-order/purchase-order-header";
import { Input } from "@/components/ui/input";
import { getProductType, isMasterProduct } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('PurchaseOrders');
  const router = useRouter();
  const { id } = use(params);

  const isEditMode = id !== "create";
  const orderId = isEditMode ? parseInt(id) : null;

  // Fetch order details in edit mode
  const { data: order, isLoading } = useQuery<PurchaseOrder>({
    queryKey: ["purchase-order", orderId],
    queryFn: () => api(`purchase-orders/${orderId}`),
    enabled: isEditMode && !!orderId,
  });

  // Fetch all medicines for the form
  const { data: medicines } = useQuery<{
    content: Medicine[];
  }>({
    queryKey: ["medicines-orders-list"],
    queryFn: () => api("search/all-products"),
  });

  // Fetch all suppliers for the form
  const { data: suppliers } = useQuery<
    Supplier[]
  >({
    queryKey: ["suppliers-orders-list"],
    queryFn: () => api("suppliers"),
  });

  // Local state
  const [currency, setCurrency] = useState<"USD" | "SYP">("USD");
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [supplierId, setSupplierId] = useState<number>(0);

  const [search, setSearch] = useState("");
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>(medicines?.content || []);

  useEffect(() => {
    setFilteredMedicines(medicines?.content || [])
  }, [medicines])

  // Initialize form with order data when loaded
  useEffect(() => {
    if (order) {
      setCurrency(order.currency as "USD" | "SYP");
      setItems(order.items);
      setSupplierId(order.supplierId);
    }
  }, [order]);

  useEffect(() => {
    if (search) {
      if (medicines?.content)
        setFilteredMedicines(medicines?.content?.filter((el) =>
          el.tradeName.toLowerCase().includes(search.toLowerCase())
        ));
    } else {
      setFilteredMedicines(medicines?.content || []);
    }
  }, [search]);

  // Handle navigation back
  const goBack = () => router.replace("/purchase-orders");

  // Handle item selection
  const selectMedicine = (med: Medicine) => {
    if (items.find((el) => el.productId === med.id && getProductType(el.productType) == getProductType(med.productTypeName))) {
      setItems((prev) => prev.filter((el) => el.productId !== med.id));
      return;
    }

    // Add new item with all required PurchaseItem fields
    const newItem: PurchaseItem = {
      productId: med.id,
      productName: med.tradeName || "",
      quantity: 1,
      barcode: med.barcodes?.[0] || "",
      price: med.refSellingPrice || 0,
      productType: med.productTypeName,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const queryClient = useQueryClient()

  // Create or update order mutation
  const { mutate: saveOrder, isPending } = useMutation({
    mutationFn: () => {
      const payload = {
        items: items.map((el) => ({
          ...el,
          medicine: undefined,
          productName: undefined,
          productType: getProductType(el.productType)
        })),
        supplierId,
        currency,
      };

      return isEditMode && orderId
        ? api(`purchase-orders/${orderId}`, {
          method: "PUT",
          body: payload,
        })
        : api("purchase-orders", {
          method: "POST",
          body: payload,
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      successToast(
        isEditMode
          ? "Purchase Order Updated Successfully"
          : "Purchase Order Created Successfully"
      );
      goBack();
    },
    onError: (error) => {
      errorToast(
        `Failed to ${isEditMode ? "update" : "create"} purchase order`
      );
    },
  });

  // Handle form submission
  const handleSubmit = () => {
    if (!supplierId) {
      errorToast("Please select a supplier");
      return;
    }
    if (items.length === 0) {
      errorToast("Please add at least one item");
      return;
    }
    saveOrder();
  };

  if (isLoading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary"></div>
        <span className="mr-2">{t('loading')}</span>
      </div>
    );
  }

  if (isEditMode && !order) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>{t('notFound')}</p>
      </div>
    );
  }

  return (
    <BasePageDialog
      title={isEditMode && order ? t('editTitle', { id: order.id }) : t('createTitle')}
      subtitle={isEditMode ? t('editSubtitle') : t('createSubtitle')}
      className="w-full h-full"
      fullHeight
      onOpenChange={goBack}
      headerChildren={
        <Button
          loading={isPending}
          onClick={handleSubmit}
          disabled={!supplierId || items.length === 0}
        >
          {isEditMode ? t('updateButton') : t('createButton')}
        </Button>
      }
    >
      <div className="grid grid-cols-3 gap-4">
        {/* Medicines List */}
        <Card className="col-span-2">
          <CardContent>
            <CardTitle className="mb-4">{t('medicines')}</CardTitle>
            <Input
              placeholder={t('searchPlaceholder')}
              className="my-2"
              value={search}
              onChange={(e) => setSearch(String(e))}
            />
            <div className="grid gap-2 max-h-[400px] overflow-auto">
              {filteredMedicines?.map((medicine, index) => {

                const isSelected = () => items.some(
                  (item) => item.productId === medicine.id
                );
                return (
                  <div
                    key={index}
                    className={`p-2 rounded cursor-pointer border-dashed border-2 ${isSelected()
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                      }`}
                    onClick={() => selectMedicine(medicine)}
                  >
                    <div className="font-medium">{medicine.tradeName}</div>
                    <div className="text-sm text-gray-500">
                      {medicine.barcodes?.[0]} • {medicine.productTypeName}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Suppliers List */}
        <Card className="col-span-1 bg-muted/10">
          <CardContent>
            <CardTitle className="mb-4">{t('supplier')}</CardTitle>
            <div className="max-h-[400px] grid gap-4 overflow-auto">
              {suppliers?.map((supplier) => (
                <SupplierInlineCard
                  key={supplier.id}
                  supplier={supplier}
                  selected={supplierId === supplier.id}
                  onSelect={() => setSupplierId(supplier.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Order Items */}
        <Card className="col-span-2">
          <CardContent>
            <CardTitle className="mb-4">{t('orderItems')}</CardTitle>
            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <PurchaseOrderInlineCard
                    key={`${item.productId}-${item.productType}-${index}`}
                    purchaseItem={item}
                    currency={currency}
                    onItemChange={(updatedItem) => {
                      setItems((prev) =>
                        prev.map((i, idx) => (idx === index ? updatedItem : i))
                      );
                    }}
                    onRemove={() => {
                      setItems((prev) =>
                        prev.filter((_, idx) => idx !== index)
                      );
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                {t('noItems')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        {items.length > 0 && (
          <div className="col-span-1">
            <PurchaseOrderHeader items={items} currency={currency} />
          </div>
        )}
      </div>
    </BasePageDialog>
  );
}
