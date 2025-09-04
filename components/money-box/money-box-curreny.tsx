import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MoneyBoxCurrencyProps {
  currentCurrency: "syp" | "usd";
  exchangeRate: number;
  value: number;
}

export default function MoneyBoxCurrency({
  currentCurrency,
  exchangeRate,
  value,
}: MoneyBoxCurrencyProps) {
  const isUSD = currentCurrency === "usd";
  const displayValue = isUSD ? value.toFixed(2) : Math.round(value);
  const displayExchangeRate = isUSD
    ? `1 USD = ${exchangeRate} SYP`
    : `1 SYP = ${(1 / exchangeRate).toFixed(4)} USD`;

  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-center p-4 h-32 text-white",
        isUSD ? "bg-teal-700" : "bg-blue-700"
      )}
    >
      <div className="text-5xl font-bold">{displayValue} SYP</div>
      <div className="text-sm text-gray-200">{displayExchangeRate}</div>
    </Card>
  );
}
