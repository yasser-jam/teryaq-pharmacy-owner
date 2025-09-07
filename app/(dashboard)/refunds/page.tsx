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
import React, { useEffect, useState } from "react";
import BaseDateRangeFilter from "@/components/base/base-date-range-filter";
import dayjs from "dayjs";

export default function Page({ children }: { children: React.ReactNode }) {
  const [startDate, setStartDate] = useState<string | undefined>(
    dayjs().format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState<string | undefined>(
    dayjs().format("YYYY-MM-DD")
  );

  const { data, isFetching, refetch } = useQuery<Refund[]>({
    queryKey: ["list-refunds", startDate, endDate],
    queryFn: () =>
      api("/sales/refunds/date-range", {
        params: {
          startDate,
          endDate,
        },
      }),
  });

  useEffect(() => {
    refetch();
  }, [startDate, endDate, refetch]);

  const router = useRouter();

  const handleDateChange = (
    start: string | undefined,
    end: string | undefined
  ) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <>
      <BaseHeader
        title="Refunds"
        subtitle="Refund Operations"
      >
        <BaseDateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          onSearch={() => refetch()}
        />
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
