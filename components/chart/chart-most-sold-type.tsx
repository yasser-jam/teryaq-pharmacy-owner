// "use client"

// import { TrendingUp } from "lucide-react"
// import { LabelList, Pie, PieChart } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"

// export const description = "A pie chart with a label list"

// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//   { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ]

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "Chrome",
//     color: "var(--chart-1)",
//   },
//   safari: {
//     label: "Safari",
//     color: "var(--chart-2)",
//   },
//   firefox: {
//     label: "Firefox",
//     color: "var(--chart-3)",
//   },
//   edge: {
//     label: "Edge",
//     color: "var(--chart-4)",
//   },
//   other: {
//     label: "Other",
//     color: "var(--chart-5)",
//   },
// } satisfies ChartConfig

// export function ChartPieLabelList() {
//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Pie Chart - Label List</CardTitle>
//         <CardDescription>January - June 2024</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <ChartContainer
//           config={chartConfig}
//           className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
//         >
//           <PieChart>
//             <ChartTooltip
//               content={<ChartTooltipContent nameKey="visitors" hideLabel />}
//             />
//             <Pie data={chartData} dataKey="visitors">
//               <LabelList
//                 dataKey="browser"
//                 className="fill-background"
//                 stroke="none"
//                 fontSize={12}
//                 formatter={(value: keyof typeof chartConfig) =>
//                   chartConfig[value]?.label
//                 }
//               />
//             </Pie>
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">
//         <div className="flex items-center gap-2 leading-none font-medium">
//           Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="text-muted-foreground leading-none">
//           Showing total visitors for the last 6 months
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }



"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, Pie, PieChart, Rectangle, XAxis } from "recharts"

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

export function ChartMostSoldType({ startDate, endDate }: ChartMostSoldProps) {

  const queryClient = useQueryClient();

  const account = queryClient.getQueryData(['me'])
  const { data: chartDataRes, isFetching, refetch } = useQuery({
    queryKey: ['most-sold-categoriess'],
    queryFn: () => api('/reports/categories/most-sold', {
      params: {
        startDate,
        endDate
      }
    }),
  })

  useEffect(() => {
    refetch()
  }, [startDate, endDate, account])

  // Assume response: [{ name: string, value: number }, ...]
  const data = Array.isArray(chartDataRes?.categories) ? chartDataRes.categories?.map((item: any, idx: number) => ({
    ...item,
  })) : []

  
  
  const chartConfig = {} as any

  data?.forEach((el: any, index: number) => chartConfig[el.categoryName] = {
    label: el.categoryName,
    color: `hsl(${index + 15}, 70%, 50%)`
  }) 

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

                <ChartContainer
                  config={chartConfig}
                >
                  <PieChart>
                    <ChartTooltip
                      content={<ChartTooltipContent nameKey="totalRevenue" hideLabel />}
                    />
                    <Pie data={data} dataKey="totalRevenue">
                      <LabelList
                        dataKey="categoryName"
                        className="fill-background"
                        stroke="none"
                        fontSize={12}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </>
            : <BaseNotFound className="!min-h-[200px]" item="Most Sold" />
      }

    </>
  )
}