"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import TransactionCard from "@/components/transaction/transaction-card";
import { MoneyBox, Transaction, TransactionType } from "@/types";
import MoneyBoxCard from "@/components/money-box/money-box-card";
import TransactionFilter from "@/components/transaction/transaction-filter";
import { useEffect, useState } from "react";
import MoneyBoxActionsCard from "@/components/money-box/money-box-actions-card";

export default function Dashboard() {
  const router = useRouter();

  const { mutate: openBox, isPending: openLoading } = useMutation({
    mutationFn: () =>
      api("/moneybox", {
        method: "POST",
        body: {
          initialBalance: 0,
          currency: "SYP",
        },
      }),
    onSuccess: () => {
      refetchBox();
      refetchTransactions();
    },
  });

  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    transactionType: null,
  });


  useEffect(() => {
    refetchTransactions();
  }, [filters]);

  const {
    data: transactions,
    isFetching,
    refetch: refetchTransactions,
  } = useQuery<{ content: Transaction[] }>({
    queryKey: ["transactions"],
    queryFn: () =>
      api("moneybox/transactions", {
        params: {
          ...filters,
        },
      }),
  });

  const {
    data: box,
    isFetching: totalFetching,
    refetch: refetchBox,
  } = useQuery<MoneyBox>({
    queryKey: ["money-box"],
    queryFn: () => api("moneybox"),
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Money Box Summary Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Current Balance */}
        <MoneyBoxCard box={box} loading={totalFetching} />

        {/* Open Box for Today */}
        <MoneyBoxActionsCard box={box} />

        {/* Quick Make a Sale */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-base">Make a Sale</CardTitle>
            <CardDescription>Start a new POS order</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full h-24 text-lg"
              onClick={() => router.push("/pos/create")}
            >
              Make a Sale
            </Button>
          </CardContent>
        </Card> */}
      </div>

      {/* Transactions Section */}
      <Card>
        <CardHeader className="flex justify-between items-center border-b">
          <CardTitle>Last Transactions</CardTitle>
          {/* <TransactionFilter
            onApply={(data: any) => {
              setFilters(data);
            }}
          /> */}
        </CardHeader>
        <CardContent className="p-0">
          {transactions?.content?.length && (
            <div className="divide-y">
              {transactions?.content?.map((el) => (
                <TransactionCard item={el} key={el.id} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
