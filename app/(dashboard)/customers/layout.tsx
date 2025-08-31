"use client";
import BaseHeader from "@/components/base/base-header";
import BaseNotFound from "@/components/base/base-not-found";
import BaseSkeleton from "@/components/base/base-skeleton";
import CustomerCard from "@/components/customer/customer-card";
import DebtFilters from "@/components/debt/debt-filters";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { successToast } from "@/lib/toast";
import { Customer } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const queryClient = useQueryClient()

  const account = queryClient.getQueryData(["me"])
  
  const {
    data: customers,
    isFetching,
    refetch,
  } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: () => api("/customers"),
  });

  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])

  useEffect(() => {

    setFilteredCustomers(customers || [])

  }, [customers])

  
  const { mutate: getActiveDebts, isPending: activeLoading } = useMutation({
    mutationFn: () => api(`/customers/pharmacy/1/debt-range/with-active-debts`, {
      params: {
        pharmacyId: 1,
        minDebt: 1,
        maxDebt: 1
      }
    }),
    onSuccess: (data: Customer[]) => {
      setFilteredCustomers(data)
    }
  })

  const { mutate: getDebts, isPending: debtsLoading } = useMutation({
    mutationFn: () => api(`/customers/pharmacy/1/debt-range`, {
      params: {
        pharmacyId: 1,
        minDebt: 1,
        maxDebt: 1
      }
    }),
    onSuccess: (data: Customer[]) => {
      setFilteredCustomers(data)
    }
  })

  const { mutate: removeCustomer } = useMutation({
    mutationFn: (id: number) =>
      api(`/customers/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      refetch();

      successToast("Customer Deleted Successfully");
    },
  });

  const isLoading = activeLoading || debtsLoading

  return (
    <>
      <BaseHeader
        title="Customers"
        subtitle="Customers page for adding the customers to handle sales operations"
      >
        <Button onClick={() => router.push("/customers/create")}>
          <Plus />
          Add Customer
        </Button>
      </BaseHeader>

      <div className="my-4">
        {/* <DebtFilters onFilterChange={(minDebt, maxDebt, active) => {
          console.log(minDebt, maxDebt, active);
          if (active) getActiveDebts()
            

        }} /> */}
      </div>

      {isFetching ? (
        <BaseSkeleton />
      ) : filteredCustomers?.length ? (
        <div className="grid grid-cols-3 gap-8 mt-12">
          {filteredCustomers?.map((el) => (
            <CustomerCard
              key={el.id}
              customer={el}
              onEdit={() => router.replace(`/customers/${el.id}`)}
              onDelete={() => removeCustomer(el.id)}
            ></CustomerCard>
          ))}
        </div>
      ) : (
        <BaseNotFound item="Customer" />
      )}

      {children}
    </>
  );
}
