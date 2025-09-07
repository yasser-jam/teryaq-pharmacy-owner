import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, CheckCircle, TrendingUp } from "lucide-react"

interface FinancialData {
  averageAmount: number
  date: string | null
  totalAmount: number
  totalInvoices: number
  totalPaid: number
}

interface FinancialDataCardProps {
  data: FinancialData
}

function formatCurrency(amount: number): string {
  if (amount >= 1e12) {
    return `${(amount / 1e12)?.toFixed(1)}T`
  } else if (amount >= 1e9) {
    return `${(amount / 1e9)?.toFixed(1)}B`
  } else if (amount >= 1e6) {
    return `${(amount / 1e6)?.toFixed(1)}M`
  } else if (amount >= 1e3) {
    return `${(amount / 1e3)?.toFixed(1)}K`
  }
  return `${amount?.toFixed(2)}`
}

export function FinancePurchaseDailyCard({ data }: FinancialDataCardProps) {
  const { averageAmount, totalAmount, totalInvoices, totalPaid } = data

  const metrics = [
    {
      title: "Total Amount",
      value: formatCurrency(totalAmount) || 'Unknown',
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Total Paid",
      value: formatCurrency(totalPaid),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "Average Amount",
      value: formatCurrency(averageAmount),
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Total Invoices",
      value: totalInvoices.toLocaleString(),
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
  ]

  return (
        <div className="grid grid-cols-1 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            console.log(metric);
            
            return (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4 shadow-sm  transition-all duration-200 "
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value == 'undefined' ? 'Unkown' : metric.value}</p>
                  </div>
                  <div className={`rounded-full p-3 ${metric.bgColor}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group- transition-transform duration-1000" />
              </div>
            )
          })}
        </div>
  )
}
