import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface POSCurrencyToggleProps {
    currency: 'SYP' | 'USD';
    setCurrency: (currency: 'SYP' | 'USD') => void;
}

export default function POSCurrencyToggle({ currency, setCurrency }: POSCurrencyToggleProps) {
  return (
    <Tabs
      value={currency}
      onValueChange={(value: string) =>
        setCurrency(value as 'SYP' | 'USD')
      }
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="SYP">SYP</TabsTrigger>
        <TabsTrigger value="USD">USD</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
