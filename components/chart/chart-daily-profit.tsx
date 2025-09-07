"use client"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function ChartDailyProfit() {

    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(217, 91%, 60%)", // Blue color
        },
        mobile: {
            label: "Mobile",
            color: "hsl(217, 91%, 75%)", // Lighter blue color
        },
    } satisfies ChartConfig

    return <>

        <Card>
            <CardHeader>
                <CardTitle>Line Chart - Label</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 20,
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Line
                            dataKey="desktop"
                            type="natural"
                            stroke="hsl(217, 91%, 60%)"
                            strokeWidth={2}
                            dot={{
                                fill: "hsl(217, 91%, 60%)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        >
                            <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                        </Line>
                        <Line
                            dataKey="mobile"
                            type="natural"
                            stroke="hsl(217, 91%, 75%)"
                            strokeWidth={2}
                            dot={{
                                fill: "hsl(217, 91%, 75%)",
                            }}
                            activeDot={{
                                r: 6,
                            }}
                        >
                            <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
                        </Line>
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>

    </>
}
