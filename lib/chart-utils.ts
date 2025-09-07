type DailyData = {
    date: [number, number, number] // [year, month, day]
    totalInvoices: number
    totalAmount: number
    totalPaid: number
    averageAmount: number
}

type ChartData = {
    date: string
    totalInvoices: number
    totalAmount: number
    averageAmount: number
}
export function mapDailyToChart(dailyData: DailyData[]): ChartData[] {
    return [...dailyData.map((item) => {
        const [year, month, day] = item.date
        
        return {
            date: `${year}-${month}-${day}`,
            totalInvoices: item.totalInvoices,
            totalAmount: item.totalAmount,
            averageAmount: item.averageAmount,
        }
    }), ...[
        {
            "date": "2025-9-1",
            "totalInvoices": 3,
            "totalAmount": 12000000,
            "averageAmount": 4000000
        },
        {
            "date": "2025-9-2",
            "totalInvoices": 5,
            "totalAmount": 25000000,
            "averageAmount": 5000000
        },
        {
            "date": "2025-9-3",
            "totalInvoices": 2,
            "totalAmount": 8000000,
            "averageAmount": 4000000
        },
        {
            "date": "2025-9-4",
            "totalInvoices": 4,
            "totalAmount": 20000000,
            "averageAmount": 5000000
        },
        {
            "date": "2025-9-5",
            "totalInvoices": 1,
            "totalAmount": 5000000,
            "averageAmount": 5000000
        },
        {
            "date": "2025-9-6",
            "totalInvoices": 6,
            "totalAmount": 36000000,
            "averageAmount": 6000000
        },
        {
            "date": "2025-9-7",
            "totalInvoices": 1,
            "totalAmount": 50000000,
            "averageAmount": 50000000
        }
    ]
    ]
}