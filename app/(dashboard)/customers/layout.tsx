"use client";
import BaseHeader from "@/components/base/base-header";
import BaseNotFound from "@/components/base/base-not-found";
import BaseSkeleton from "@/components/base/base-skeleton";
import CustomerCard from "@/components/customer/customer-card";
import DebtFilters from "@/components/debt/debt-filters";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { api } from "@/lib/api";
import { successToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Customer } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const queryClient = useQueryClient();

  const account = queryClient.getQueryData(["me"]);

  const {
    data: customers,
    isFetching,
    refetch,
  } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: () => api("/customers"),
  });

  const { mutate: filterWithDebts, isPending } = useMutation({
    mutationFn: () => api("/customers/all-with-debts"),
    onSuccess: (data: Customer[]) => {
      setFilteredCustomers(data);
    },
  });

  
  const { mutate: filterWithOverDebts } = useMutation({
    mutationFn: () => api("/customers/with-overdue-debts"),
    onSuccess: (data: Customer[]) => {
      setFilteredCustomers(data);
    },
  });

  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setFilteredCustomers(customers || []);
  }, [customers]);

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

  const filterCustomers = async (value: string) => {
    if (value == 'all') {
      setFilteredCustomers(customers || [])
    }

    else if (value == 'debts') {
      filterWithDebts()
    }

    else  {
      filterWithOverDebts()
    }
  }

  // const isLoading = activeLoading || debtsLoading;

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
        <ToggleGroup type="single" defaultValue="all" className="mx-auto" variant={'outline'} onValueChange={filterCustomers}>
          <ToggleGroupItem value="debts" className={cn("w-[100px] checked:bg-primary")} aria-label="With Debts">
            With Debts
          </ToggleGroupItem>
{/*           
          <ToggleGroupItem value="over" className="w-[100px] checked:bg-primary" aria-label="Overdo">
            With Overdue
          </ToggleGroupItem> */}

          <ToggleGroupItem
            value="all"
            className="w-[100px]"
            aria-label="All"
          >
            All
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {isFetching || isPending ? (
        <BaseSkeleton type="grid" />
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
