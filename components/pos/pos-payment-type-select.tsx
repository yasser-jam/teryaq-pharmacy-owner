import { Banknote, CreditCard } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { useTranslations } from "next-intl";

interface POSPaymentTypeSelectProps {
  paymentType: 'CASH' | 'CREDIT';
  setPaymentType: (paymentType: 'CASH' | 'CREDIT') => void;
}

export default function POSPaymentTypeSelect({ paymentType, setPaymentType }: POSPaymentTypeSelectProps) {
  const t = useTranslations('Sale');
  return (
    <div>
      <Label className="mb-3 block">{t('paymentType')}</Label>
      <div className="grid grid-cols-2 gap-3">
        <Card
          className={`cursor-pointer transition-all hover:shadow-sm ${
            paymentType === "CASH"
              ? "ring-2 ring-green-500 bg-green-50"
              : "hover:bg-gray-50"
          }`}
          onClick={() =>
            setPaymentType("CASH")
          }
        >
          <CardContent className="flex items-center justify-center p-4">
            <div className="text-center">
              <Banknote className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <span className="text-sm font-medium">{t('cashSale')}</span>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-sm ${
            paymentType === "CREDIT"
              ? "ring-2 ring-orange-500 bg-orange-50"
              : "hover:bg-gray-50"
          }`}
          onClick={() =>
            setPaymentType("CREDIT")
          }
        >
          <CardContent className="flex items-center justify-center p-4">
            <div className="text-center">
              <CreditCard className="h-5 w-5 mx-auto mb-1 text-orange-600" />
              <div className="text-sm font-medium">{t('creditSale')}</div>
              <div className="text-xs text-gray-500">{t('withDebt')}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
