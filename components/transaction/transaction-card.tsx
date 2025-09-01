import { getTime } from "@/lib/utils";
import { Transaction } from "@/types";


interface TransactionCardProps {
  item: Transaction;
}

export default function TransactionCard({ item }: TransactionCardProps) {
  return (
    <>
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="font-medium">{ item.transactionType }</p>
          <p className="text-muted-foreground text-sm">{getTime(item.createdAt).default}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-emerald-600">${ item.amount } {item.convertedCurrency}</p>
          <p className="text-muted-foreground text-xs">{ item.createdByUserEmail }</p>
        </div>
      </div>
    </>
  );
}
