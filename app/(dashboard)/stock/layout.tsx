"use client";
import BaseHeader from "@/components/base/base-header";
import BaseNotFound from "@/components/base/base-not-found";
import BaseSearch from "@/components/base/base-search";
import BaseSkeleton from "@/components/base/base-skeleton";
import { StockCard } from "@/components/stock/stock-card";
import { StockMiniCard } from "@/components/stock/stock-mini-card";
import SysInfo from "@/components/sys/sys-info";
import { Select } from "@/components/ui/select";
import { api } from "@/lib/api";
import { StockItem } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: stockItems, isFetching, refetch } = useQuery<StockItem[]>({
    queryKey: ["stock-items"],
    queryFn: () => api("/stock/search", {
      params: {
        lang: 'en',
        keyword: search
      }
    }),
  });

  const [selectedLang, setSelectedLang] = useState<'en' | 'ar'>('en')
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    refetch()
  }, [selectedLang, search])


  return (
    <>
      <BaseHeader
        title="Stock Management"
        subtitle="Manage and track your stock items"
      ></BaseHeader>

      <div>
        <BaseSearch value={search} onChange={setSearch} className="my-4 w-full" />
        {/* <Select
          value={selectedLang}
          onValueChange={(value) => setSelectedLang(value as 'en' | 'ar')} ></Select> */}
      </div>

      <SysInfo
        className="mt-4"
        text="Products in stock may appear multiple times if they belong to different shipments or batches. Each entry represents a specific batch of the same product, which may differ in details such as expiry date, purchase price, or quantity."
      />

      {isFetching ? (
        <BaseSkeleton type="grid" />
      ) : stockItems?.length ? (
        <div className="grid grid-cols-3 gap-8 mt-12">
          {stockItems?.map((el) => (
            <Link key={el.id} href={`/stock/${el.productId}-${el.productType}`}>
              <StockMiniCard stockItem={el} />
            </Link>
            // <StockCard key={el.id} stockItem={el} />
          ))}
        </div>
      ) : (
        <BaseNotFound item="Stock Item" />
      )}

      {children}
    </>
  );
}
