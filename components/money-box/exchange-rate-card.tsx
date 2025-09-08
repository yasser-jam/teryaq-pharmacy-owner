import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { useTranslations } from 'next-intl';

interface ExchangeRateCardProps {
  exchangeRate: number;
  loading?: boolean
}

export default function ExchangeRateCard({ exchangeRate, loading }: ExchangeRateCardProps) {
  const t = useTranslations('MoneyBox');
  const [sypAmount, setSypAmount] = useState<number | "">("");
  const [usdAmount, setUsdAmount] = useState<number | "">("");

  const handleSypChange = (value: string) => {
    setSypAmount(value === "" ? "" : Number(value));
    if (value !== "") {
      setUsdAmount(Number(value) / exchangeRate);
    } else {
      setUsdAmount("");
    }
  };

  return (
    <>
      {
        loading ? <Skeleton className="rounded-lg w-full h-60 col-span-6" /> :
          <Card className="col-span-6 text-white bg-secondary h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-bold">{t('exchangeRateTitle')}</CardTitle>
              <ArrowLeftRight className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white text-opacity-80">{t('exchangeRateDesc')}</CardDescription>
              <p className="text-3xl font-extrabold mt-2">
                {t('usdToSyp', { rate: exchangeRate })}
              </p>
              <div className="grid w-full items-center gap-1.5 mt-4">
                <label htmlFor="syp-input" className="text-white text-sm opacity-90">{t('sypToUsdLabel')}</label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    id="syp-input"
                    placeholder={t('sypAmountPlaceholder')}
                    value={sypAmount}
                    onChange={e => handleSypChange(String(e))}
                    className="text-black font-semibold"
                  />
                  <Input
                    type="number"
                    id="usd-output"
                    placeholder={t('usdAmountPlaceholder')}
                    value={usdAmount}
                    readOnly
                    className="text-black font-semibold"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
      }
    </>
  );
}
