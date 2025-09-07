"use client"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { mapDailyToChart } from "@/lib/chart-utils"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useEffect, useState } from "react"
import BaseSkeleton from "../base/base-skeleton"
import BaseNotFound from "../base/base-not-found"
import { FinancePurchaseDailyCard } from "./finance-purhcase-dialy-card"

interface ChartProps {
    date: string
    className?: string
}

export default function ChartDailyPurchase({ date, className }: ChartProps) {


    const { data: chartDataRes, isFetching, refetch } = useQuery({
        queryKey: ['daily-purchase'],
        queryFn: () => api('/reports/purchase/daily', {
            params: {
                date
            }
        })
    })

    useEffect(() => {
        refetch()
    }, [date])

    const data = chartDataRes?.dailyData ? mapDailyToChart(chartDataRes?.dailyData as any) : []
    return <>


        {
            <div className={className}>
                {
                    isFetching ? <BaseSkeleton className="mt-0" /> :
                        data ?
                            <Card>
                                <CardHeader className="font-semibold">Daily Purchase </CardHeader>
                                <CardContent>
                                    <FinancePurchaseDailyCard data={chartDataRes?.data as any} />
                                </CardContent>
                            </Card> : <BaseNotFound item="Purchase" />

                }
            </div>
        }

    </>
}
