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
import { MoneyBox, Transaction } from "@/types";
import MoneyBoxCard from "@/components/money-box/money-box-card";

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
  });

  const { data: transactions, isFetching } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: () => api("moneybox/transactions"),
  });

  const { data: box, isFetching: totalFetching } = useQuery<MoneyBox>({
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today's Box</CardTitle>
            <CardDescription>Open the cash box for today</CardDescription>
            <CardAction>
              <Button size="sm" loading={openLoading} disabled={box?.status != 'CLOSED'} onClick={() => openBox()}>
                Open Today's Box
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              You can open and start tracking today&apos;s transactions.
            </p>
          </CardContent>
        </Card>

        {/* Quick Make a Sale */}
        <Card>
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
        </Card>
      </div>

      {/* Transactions Section */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Demo data for now</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {transactions?.length && (
            <div className="divide-y">
              {transactions.map((el) => (
                <TransactionCard item={el} key={el.id} />
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t justify-end">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
