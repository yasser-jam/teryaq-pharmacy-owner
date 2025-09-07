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

interface ChartProps {
    date: string
    className?: string
}

export default function ChartDailyProfit({ date, className }: ChartProps) {


    const { data: chartDataRes, isFetching, refetch } = useQuery({
        queryKey: ['daily-profit'],
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


    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]

    const chartConfig = {
        totalAmount: {
            label: "Amount",
            color: "hsl(217, 91%, 60%)", // Blue color
        },
        totalInvoices: {
            label: "Invoices",
            color: "#432DD7", // Lighter blue color
        },
        totalPaid: {
            label: "Paid",
            color: "#D74343", // Red color
        }
    } satisfies ChartConfig

    return <>


        {
            <div className={className}>
                {
                    isFetching ? <BaseSkeleton className="mt-0" /> :
                        data?.length ?
                            <Card>
                                <CardContent>
                                    <ChartContainer className="h-[300px] w-full" config={chartConfig}>
                                        <LineChart
                                            accessibilityLayer
                                            data={data}
                                            margin={{
                                                top: 20,
                                                left: 12,
                                                right: 12,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="date"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickFormatter={(value) => value.slice(0, 3)}
                                            />
                                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                                            <Line
                                                dataKey="totalAmount"
                                                type="natural"
                                                stroke="hsl(217, 91%, 60%)"
                                                strokeWidth={2}
                                                dot={{
                                                    fill: "primary",
                                                }}
                                            >
                                                <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                                            </Line>

                                            <Line
                                                dataKey="totalInvoices"
                                                type="natural"
                                                stroke="hsl(257, 91%, 60%)"
                                                strokeWidth={2}
                                                dot={{
                                                    fill: "primary",
                                                }}
                                            >
                                                <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                                            </Line>

                                            <Line
                                                dataKey="averageAmount"
                                                type="natural"
                                                stroke="hsl(137, 91%, 60%)"
                                                strokeWidth={2}
                                                dot={{
                                                    fill: "primary",
                                                }}
                                            >
                                                <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                                            </Line>
                                        </LineChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card> : <BaseNotFound item="Purchase" />

                }
            </div>
        }

    </>
}
