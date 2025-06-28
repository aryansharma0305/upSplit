"use client"

import { Pie, LabelList,PieChart } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
    

} from "@/components/ui/chart"

const chartData = [

  { category: "Entertainment", amount: 250, fill: "var(--chart-4)" },
  { category: "Food", amount: 450, fill: "var(--chart-2)" },
  { category: "Shopping", amount: 200, fill: "var(--chart-5)" },
  { category: "Utilities", amount: 150, fill: "var(--chart-6)" },
  { category: "Others", amount: 100, fill: "var(--chart-7)" },
  { category: "Travel", amount: 300, fill: "var(--chart-8)" },
]

const chartConfig = {
  amount: {
    label: "Amount",
  },

  Entertainment: { label: "Entertainment", color: "var(--chart-4)" },
  Food: { label: "Food", color: "var(--chart-2)" },
  Shopping: { label: "Shopping", color: "var(--chart-5)" },
  Utilities: { label: "Utilities", color: "var(--chart-6)" },
  Others: { label: "Others", color: "var(--chart-7)" },
   Travel: { label: "Travel", color: "var(--chart-8)" },
}

const DashboardSectorChart = () => {
  return (
    
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full w-full border-none max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              label
            />
            <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="none"
                fontSize={300}
                formatter={(value) =>
                  chartConfig[value]?.label
                }
              />
          </PieChart>
        </ChartContainer>
     
  )
}

export default DashboardSectorChart
