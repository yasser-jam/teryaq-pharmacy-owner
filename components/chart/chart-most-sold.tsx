"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useEffect } from "react"
import BaseSkeleton from "../base/base-skeleton"
import BaseNotFound from "../base/base-not-found"


interface ChartMostSoldProps {
  startDate?: string
  endDate?: string
}

export function ChartMostSold({ startDate, endDate }: ChartMostSoldProps) {

  const queryClient = useQueryClient();

  const account = queryClient.getQueryData(['me'])
  const { data: chartDataRes, isFetching, refetch } = useQuery({
    queryKey: ['most-sold'],
    queryFn: () => api('/reports/products/top-10', {
      params: {
        pharmacyId: (account as any)?.pharmacyId,
        startDate,
        endDate
      }
    }),
  })

  useEffect(() => {
    refetch()
  }, [startDate, endDate, account])

  // Assume response: [{ name: string, value: number }, ...]
  const data = Array.isArray(chartDataRes?.products) ? chartDataRes.products?.map((item: any, idx: number) => ({
    ...item,
    fill: `hsl(${(idx + 1) * (360 / 10)}, 91%, 60%)`,
  })) : []

  console.log('data', data);
  

  // Generate config for ChartContainer
  const chartConfig = {
    value: {
      label: "Sold",
      color: "hsl(217, 91%, 60%)",
    },
  } satisfies ChartConfig

  if (isFetching) return <BaseSkeleton />
  if (!data.length) return <BaseNotFound item="Most Sold" />

  return (
    <>
      {
        isFetching ? <BaseSkeleton className="mt-0" /> :
          data.length ? <>
            <Card className="my-4">
              <CardHeader>
                <CardTitle>Most Sold Items (10 Items)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                  <BarChart accessibilityLayer data={data}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="productName"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Bar
                      dataKey="profit"
                      strokeWidth={2}
                      radius={8}
                      isAnimationActive={false}
                    >
                      {data.map((entry: any, idx: number) => (
                        <Rectangle
                          key={entry.name}
                          x={0}
                          y={0}
                          width={0}
                          height={0}
                          fill={entry.fill}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </>
            : <BaseNotFound className="!min-h-[200px]" item="Most Sold" />
      }

    </>
  )
}