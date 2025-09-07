"use client";
import BaseHeader from "@/components/base/base-header";
import BaseSkeleton from "@/components/base/base-skeleton";
import BasePagination from "@/components/base/pagination";
import { MedicineCard } from "@/components/medicine/medicine-card";
import { MedicineInlineCard } from "@/components/medicine/medicine-inline-card";
import { MedicineTable } from "@/components/medicine/medicine-table";
import { SysViewSwitch } from "@/components/sys/view-switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { successToast } from "@/lib/toast";
import { Medicine, Pagination } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const [pagination, setPagination] = useState<Pagination>({
    size: 10,
    page: 0,
    totalElements: 10,
  });

  const {
    data: medicines,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["medicines-list", pagination.page, pagination.size],
    queryFn: () =>
      api("search/products", {
        params: {
          page: pagination.page,
          size: pagination.size,
          keyword: search 

        },
      })
  });

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"cards" | "inline-cards" | "table">("table");

  const router = useRouter();

  useEffect(() => {
    refetch();
    setPagination((prev) => ({ ...prev, page: 0, size: 10 }));
  }, [search]);

  // Update totalElements when new data arrives
  useEffect(() => {
    setPagination(prev => ({ ...prev, totalElements: medicines?.totalElements || 10 }));
  }, [medicines]);

  const { mutate: remove } = useMutation({
    mutationFn: (med: Medicine) =>
      api(`/pharmacy_products/${med.id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      successToast(t("Medicines.deleteSuccess"));
      refetch();
    },
  });

  return (
    <>
      <BaseHeader
        title="Medicines"
        subtitle="Pharmacy and Master Products"
      >
      </BaseHeader>
      <div className="flex items-center gap-4 my-4">
        <Input
          value={search}
          onChange={(val) => setSearch(String(val))}
          prefix={<Search />}
          className="grow"
          placeholder={t("Medicines.searchPlaceholder")}
        />

        {/* <SysViewSwitch mode={mode} onModeChange={setMode} /> */}

        <Button onClick={() => router.push("/medicines/create")}>
          <Plus />
          {t("Medicines.addButton")}
        </Button>
      </div>

      {isFetching ? (
        <BaseSkeleton />
      ) : (
        <>
          {mode == "table" ? (
            <MedicineTable
              search=""
              medicines={medicines?.content || []}
              onDelete={remove}
            />
          ) : mode == "cards" ? (
            <div className="grid grid-cols-3 gap-4 max-h-[800px] overflow-auto mt-4">
              {medicines?.content?.map((el: Medicine) => (
                <MedicineCard key={el.id} medicine={el} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {medicines?.content?.map((el: Medicine) => (
                <MedicineInlineCard
                  key={el.id}
                  medicine={el}
                />
              ))}
            </div>
          )}
          <BasePagination
            pagination={pagination}
            onPaginationChange={setPagination}
          />
        </>
      )}

      {children}
    </>
  );
}
