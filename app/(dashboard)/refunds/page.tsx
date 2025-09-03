"use client";

import BaseHeader from "@/components/base/base-header";
import BaseNotFound from "@/components/base/base-not-found";
import BaseSkeleton from "@/components/base/base-skeleton";
import POSCard from "@/components/pos/pos-card";
import { RefundCard } from "@/components/refund/refund-card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Refund, SaleInvoice } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Page({ children }: { children: React.ReactNode }) {
  const { data, isFetching } = useQuery<Refund[]>({
    queryKey: ["list-refunds"],
    queryFn: () => api("/sales/refunds"),
  });

  const router = useRouter();

  return (
    <>
      <BaseHeader
        title="Refunds"
        subtitle="Refund Operations"
      >
      </BaseHeader>

      {isFetching ? (
        <BaseSkeleton />
      ) : data?.length ? (
        <div className="mt-4 grid gap-4 max-h-[500px] overflow-auto">
          {data?.map((el) => (
            <RefundCard key={el.refundId} refund={el} />
          ))}
        </div>
      ) : (
        <BaseNotFound item="Sale" />
      )}

      {children}
    </>
  );
}
