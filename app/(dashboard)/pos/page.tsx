"use client";

import BaseHeader from "@/components/base/base-header";
import BaseNotFound from "@/components/base/base-not-found";
import BaseSkeleton from "@/components/base/base-skeleton";
import POSCard from "@/components/pos/pos-card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { SaleInvoice } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page({ children }: { children: React.ReactNode }) {
  const { data, isFetching } = useQuery<SaleInvoice[]>({
    queryKey: ["list-pos"],
    queryFn: () => api("/sales"),
  });

  const router = useRouter();

  return (
    <>
      <BaseHeader
        title="POS"
        subtitle="POS page for adding the POS to handle sales operations"
      >
        <Button onClick={() => router.push("/pos/create")}>
          <Plus />
          Add Sale
        </Button>
      </BaseHeader>

      {isFetching ? (
        <BaseSkeleton />
      ) : data?.length ? (
        <div className="mt-4 grid gap-4 max-h-[500px] overflow-auto">
          {data?.map((el) => (
            <POSCard key={el.id} invoice={el}></POSCard>
          ))}
        </div>
      ) : (
        <BaseNotFound item="Sale" />
      )}

      {children}
    </>
  );
}
