"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { BaseSelect } from "../base/select";

export default function CustomerSelect({
  customerId,
  setCustomerId,
}: {
  customerId: number;
  setCustomerId: (customerId: number) => void;
}) {
  const { data, isFetching } = useQuery({
    queryKey: ["customers"],
    queryFn: () => api("/customers"),
  });

  return (
    <>
      <BaseSelect
        items={data}
        label="Customer"
        itemText="name"
        itemValue="id"
        placeholder="Select Customer"
        onChange={setCustomerId}
        fullWidth
      />
    </>
  );
}
