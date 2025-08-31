import { BaseRangeDatePicker } from "../base/range-date-picker";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Props {
  onFilterChange: (minDebt: string, maxDebt: string, active: boolean) => void;
}

export default function DebtFilters({ onFilterChange }: Props) {
  const [minDebtRange, setMinDebtRange] = useState("");
  const [maxDebtRange, setMaxDebtRange] = useState("");
  const [activeDebts, setActiveDebts] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4 py-2 px-4 border-dashed border-2">
        <Input
          placeholder="Min Debt"
          value={minDebtRange}
          onChange={(e) => setMinDebtRange(String(e))}
        />

        <Input
          placeholder="Max Debt"
          value={maxDebtRange}
          onChange={(e) => setMaxDebtRange(String(e))}
        />

        <Button
          onClick={() => setActiveDebts(!activeDebts)}
          variant={activeDebts ? "default" : "outline"}
        >
          Active Debts
        </Button>
        <Button
          onClick={() => onFilterChange(minDebtRange, maxDebtRange, activeDebts)}
          variant={"outline"} 
        >
          Filter
        </Button>
      </div>
    </>
  );
}
