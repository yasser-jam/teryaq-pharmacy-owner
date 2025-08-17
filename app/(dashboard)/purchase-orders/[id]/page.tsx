"use client";
import BaseHeader from "@/components/base/base-header";
import BaseNotFound from "@/components/base/base-not-found";
import { MedicineInlineCard } from "@/components/medicine/medicine-inline-card";
import SupplierInlineCard from "@/components/supplier/supplier-inline-card";
import PurchaseOrderInlineCard from "@/components/purchase-order/purchase-order-inline-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Medicine, PurchaseItem, PurchaseOrder, Supplier } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { errorToast, successToast } from "@/lib/toast";
import BasePageDialog from "@/components/base/page-dialog";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
    const { id } = use(params)
  
  const isEditMode = id !== 'create';
  const orderId = isEditMode ? parseInt(id) : null;

  // Fetch order details in edit mode
  const { data: order, isLoading } = useQuery<PurchaseOrder>({
    queryKey: ["purchase-order", orderId],
    queryFn: () => api(`purchase-orders/${orderId}`),
    enabled: isEditMode && !!orderId,
  });

  // Fetch all medicines for the form
  const { data: medicines, isFetching: medicinesLoading } = useQuery<{ content: Medicine[] }>({
    queryKey: ["medicines-orders-list"],
    queryFn: () => api("search/all-products"),
  });

  // Fetch all suppliers for the form
  const { data: suppliers, isFetching: suppliersLoading } = useQuery<Supplier[]>({
    queryKey: ["suppliers-orders-list"],
    queryFn: () => api("suppliers"),
  });

  // Local state
  const [currency, setCurrency] = useState<"USD" | "SYP">("USD");
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [supplierId, setSupplierId] = useState<number>(0);

  // Initialize form with order data when loaded
  useEffect(() => {
    if (order) {
      setCurrency(order.currency as "USD" | "SYP");
      setItems(order.items);
      setSupplierId(order.supplierId);
    }
  }, [order]);

  // Handle navigation back
  const goBack = () => router.replace("/purchase-orders");

  // Handle item selection
  const selectMedicine = (med: Medicine) => {
    // Toggle item selection
    if (items.find((el) => el.productId === med.id)) {
      setItems((prev) => prev.filter((el) => el.productId !== med.id));
      return;
    }

    // Add new item with all required PurchaseItem fields
    const newItem: PurchaseItem = {
      id: 0, // Temporary ID, will be replaced by the server
      productId: med.id,
      productName: med.tradeName || "",
      quantity: 1,
      barcode: med.barcodes?.[0] || "",
      price: med.refSellingPrice || 0,
      productType: (med.productTypeName === "MASTER" || med.productTypeName === "PHARMACY") ? med.productTypeName : "MASTER",
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Create or update order mutation
  const { mutate: saveOrder, isPending } = useMutation({
    mutationFn: () => {
      const payload = {
        items: items.map((el) => ({
          ...el,
          medicine: undefined,
          productType: (el.productType === "MASTER" || el.productType === "PHARMACY") 
            ? el.productType 
            : "MASTER",
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
      successToast(
        isEditMode 
          ? "Purchase Order Updated Successfully"
          : "Purchase Order Created Successfully"
      );
      goBack();
    },
    onError: (error) => {
      errorToast(
        `Failed to ${isEditMode ? 'update' : 'create'} purchase order`
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
      </div>
    );
  }

  if (isEditMode && !order) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <BasePageDialog
      title={
        isEditMode && order
          ? `Edit Purchase Order #${order.id}`
          : "Create New Purchase Order"
      }
      subtitle={
        isEditMode
          ? "Update the purchase order details"
          : "Fill in the details for the new purchase order"
      }
      className="w-full h-full"
      onOpenChange={goBack}
      headerChildren={
        <Button loading={isPending} onClick={handleSubmit}>
          {isEditMode ? "Update" : "Create"} Order
        </Button>
      }
    >
      <div className="grid grid-cols-3 gap-4">
        {/* Medicines List */}
        <Card className="col-span-2">
          <CardContent>
            <CardTitle className="mb-4">Medicines</CardTitle>
            <div className="grid gap-2 max-h-[200px] overflow-auto">
              {medicines?.content?.map((medicine) => {
                const isSelected = items.some(
                  (item) => item.productId === medicine.id
                );
                return (
                  <div
                    key={medicine.id}
                    className={`p-2 rounded cursor-pointer ${
                      isSelected ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
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
            <CardTitle className="mb-4">Supplier</CardTitle>
            <div className="max-h-[200px] overflow-auto">
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
        <Card className="col-span-3">
          <CardContent>
            <CardTitle className="mb-4">Order Items</CardTitle>
            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <PurchaseOrderInlineCard
                    key={`${item.productId}-${item.productType}-${index}`}
                    purchaseItem={item}
                    currency={currency}
                    onItemChange={(updatedItem) => {
                      setItems((prev) =>
                        prev.map((i, idx) =>
                          idx === index ? updatedItem : i
                        )
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
                No items added to this order
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </BasePageDialog>
  );
}
