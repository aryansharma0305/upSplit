"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", Recieve: 186, Pay: 160 },
  { month: "February", Recieve: 185, Pay: 170 },
  { month: "March", Recieve: 207, Pay: 180 },
  { month: "April", Recieve: 173, Pay: 160 },
  { month: "May", Recieve: 60, Pay: 90 },
  { month: "June", Recieve: 174, Pay: 204 },
]

const chartConfig = {
  Recieve: {
    label: "Recieve",
    color: "var(--chart-1)",
  },
  Pay: {
    label: "Pay",
    color: "var(--chart-2)",
  },
}

const DashboardRadarChart = () => {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full w-full max-h-[250px]"
    >
      <RadarChart data={chartData}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <PolarAngleAxis dataKey="month" />
        <PolarGrid radialLines={false} />
        <Radar
          dataKey="Recieve"
          stroke="var(--chart-1)"
          fill="var(--chart-1)"
          fillOpacity={0}
          strokeWidth={2}
        />
        <Radar
          dataKey="Pay"
          stroke="var(--chart-2)"
          fill="var(--chart-2)"
          fillOpacity={0}
          strokeWidth={2}
        />
      </RadarChart>
    </ChartContainer>
  )
}

export default DashboardRadarChart
