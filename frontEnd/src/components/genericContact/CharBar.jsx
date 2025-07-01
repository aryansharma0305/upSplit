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
    <Card className=" shadow-lg bg-white px-0 " >
      <CardContent className={"p-0"}>
        <div  className=' mt-3'>
          <ChartContainer className="h-[200px] w-full" config={config}>
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
    </Card>
  )
}

export default CharBar
