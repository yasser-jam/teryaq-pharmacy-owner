import { SaleInvoice } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

interface POSInvoiceSummaryProps {
  invoice: SaleInvoice;
  loading?: boolean;
  onProcessSale: () => void;
}

export default function POSInvoiceSummary({ invoice, loading, onProcessSale }: POSInvoiceSummaryProps) {
  const t = useTranslations('Sale');

  const getPrice = (item: any) => {
    return invoice.currency == 'USD' ? item.sellingPriceUSD : item.sellingPrice;
  };
  const subtotal = invoice.items.reduce(
    (sum: number, item: any) => sum + item.quantity * getPrice(item),
    0
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('invoiceSummary')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>{t('subtotal')}:</span>
            <span>
              {subtotal?.toFixed(2)} {invoice.currency}
            </span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>{t('discount')}:</span>
            <span>
              -{invoice.discount?.toFixed(2) || 0} {invoice.currency}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>{t('total')}:</span>
            <span>
              {subtotal?.toFixed(2)} {invoice.currency}
            </span>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={invoice.items.length === 0}
            loading={loading}
            onClick={() => {
              onProcessSale();
            }}
          >
            {t('processSale')}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
