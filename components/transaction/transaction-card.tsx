import { getTime } from "@/lib/utils";
import { Transaction, TransactionType } from "@/types";
import {
  Wallet,
  MinusCircle,
  PlusCircle,
  ShoppingBag,
  Undo2,
  Receipt,
  PiggyBank,
  Sparkles,
} from "lucide-react";

interface TransactionCardProps {
  item: Transaction;
}

const transactionConfig: Record<
  TransactionType,
  { icon: React.ElementType; color: string; bgColor: string; borderColor: string }
> = {
  OPENING_BALANCE: {
    icon: Wallet,
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
  },
  CASH_DEPOSIT: {
    icon: PlusCircle,
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
    borderColor: "border-emerald-200",
  },
  CASH_WITHDRAWAL: {
    icon: MinusCircle,
    color: "text-red-700",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
  },
  SALE_PAYMENT: {
    icon: ShoppingBag,
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
  },
  SALE_REFUND: {
    icon: Undo2,
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
  },
  PURCHASE_PAYMENT: {
    icon: Receipt,
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-200",
  },
  PURCHASE_REFUND: {
    icon: Undo2,
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
  },
  INCOME: {
    icon: PiggyBank,
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
  },
  ADJUSTMENT: {
    icon: Sparkles,
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
  },
  CLOSING_BALANCE: {
    icon: PiggyBank,
    color: "text-blue-800",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
  },
};

export default function TransactionCard({ item }: TransactionCardProps) {
  const config = transactionConfig[item.transactionType];
  const IconComponent = config.icon;

  return (
    <div className={`flex items-center justify-between px-6 py-4 border-l-4 ${config.borderColor} ${config.bgColor}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bgColor} border ${config.borderColor}`}>
          <IconComponent className={`h-5 w-5 ${config.color}`} />
        </div>
        <div>
          <p className="font-medium">{item.transactionType.replace(/_/g, " ")}</p>
          <p className="text-muted-foreground text-sm">
            {getTime(item.createdAt).default}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-emerald-600">
          ${item.amount} {item.convertedCurrency}
        </p>
        <p className="text-muted-foreground text-xs">
          {item.createdByUserEmail}
        </p>
      </div>
    </div>
  );
}
