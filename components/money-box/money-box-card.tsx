
import { MoneyBox } from "@/types";
import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import BaseSkeleton from "../base/base-skeleton";
import { Skeleton } from "../ui/skeleton";
import { getCookie } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MoneyBoxProps {
  loading?: boolean
  box?: MoneyBox
}

export default function MoneyBoxCard({ loading, box }: MoneyBoxProps) {
  const [currency, setCurrency] = useState<'syp' | 'usd'>("syp");

  useEffect(() => {
    // Read cookie, default to 'syp'
    const cookieCurrency = getCookie("mao.currency")?.toLowerCase();
    if (cookieCurrency === "usd" || cookieCurrency === "syp") {
      setCurrency(cookieCurrency);
    } else {
      setCurrency("syp");
    }
  }, []);

  // Decide which balance and label to show
  let displayBalance = 0;
  let displayCurrency = "SYP";
  if (currency === "usd") {
    displayBalance = box?.totalBalanceInUSD ?? 0;
    displayCurrency = "USD";
  } else {
    displayBalance = box?.totalBalanceInSYP ?? 0;
    displayCurrency = "SYP";
  }

  return (
    <>
      {loading ? (
        <Skeleton className="rounded-lg w-full h-60 col-span-6" />
      ) : (
        <Card className="col-span-6 text-white bg-gradient-to-tr from-primary to-blue-500  h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Current Balance</CardTitle>
            <DollarSign className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <CardDescription className="text-white text-opacity-80">Money box balance right now</CardDescription>
            <div className="text-4xl font-extrabold mt-4">
              {displayCurrency === "USD" ? "$" : "S.P"} {displayBalance.toLocaleString()} - {displayCurrency}
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              {/* Optionally, add more info here */}
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
