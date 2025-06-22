"use client"

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { TrendingUp } from 'lucide-react'
import {  ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, CartesianGrid, XAxis, Bar } from 'recharts'

export const description = "CharBar: Monthly Debit vs Credit Analysis"

const data = [
  { month: 'Jan', debit: 120, credit: 80 },
  { month: 'Feb', debit: 200, credit: 150 },
  { month: 'Mar', debit: 170, credit: 130 },
  { month: 'Apr', debit: 90, credit: 110 },
  { month: 'May', debit: 210, credit: 160 },
  { month: 'Jun', debit: 180, credit: 140 },
]

const config = {
  debit: { label: 'Debit', color: 'var(--chart-1)' },
  credit: { label: 'Credit', color: 'var(--chart-2)' },
} 
const CharBar = () => {
  return (
    <Card className="border-none shadow-none bg-white w-full" >
      <CardHeader>
        <CardTitle>Monthly Breakdown</CardTitle>
        <CardDescription>Last 6 Months Breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div  className='w-full mt-10'>
          <ChartContainer className="w-full" config={config}>
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="debit" fill="var(--chart-1)" radius={4} />
              <Bar dataKey="credit" fill="var(--chart-2)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      {/* <CardFooter className="flex flex-col items-start gap-1 text-sm">
        <div className="flex gap-2 items-center font-medium">
          Yearly Trend <TrendingUp className="w-4 h-4" />
        </div>
        <div className="text-muted-foreground">
          Data reflects total debit and credit per month
        </div>
      </CardFooter> */}
    </Card>
  )
}

export default CharBar
