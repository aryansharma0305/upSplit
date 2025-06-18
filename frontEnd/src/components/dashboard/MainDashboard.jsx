import React from 'react'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card"

import { Link } from 'react-router-dom'
import { PlusCircle, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import CountUp from 'react-countup'
import DashboardTransactionsTable from './DashboardTransactionsTable'
import DashboardPieChart from './DashboardPieChart'
import UpcomingPaymentsCard from './UpcomingPaymentsCard'
import DashboardSectorChart from './DashboardsSectorChart'
import { motion } from 'framer-motion'

const MotionCard = motion(Card)

const MainDashboard = () => {
  return (
    <>
      <div className="w-full px-6 pt-2 flex  sm:justify-end flex-wrap gap-3 items-center">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 hover:-translate-y-1 transition-all duration-200">
          <PlusCircle className="w-4 h-4" />
          Add Contact
        </Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 hover:-translate-y-1 transition-all duration-200">
          <Users className="w-4 h-4" />
          Create Group
        </Button>
      </div>

      <div className="grid  sm:grid-cols-6 lg:grid-cols-12 gap-4 p-6">
        <MotionCard className="col-span-6 lg:col-span-4 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <CardHeader>
            <CardDescription className="text-emerald-600 font-bold">Money yet to <strong>Receive</strong></CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              <CountUp end={1250} duration={1} prefix="$" separator="," />
            </CardTitle>
          </CardHeader>
        </MotionCard>

        <MotionCard className="col-span-6 lg:col-span-4 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <CardHeader>
            <CardDescription className="text-emerald-600 font-bold">Money yet to <strong>Pay</strong></CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              <CountUp end={250} duration={1} prefix="$" separator="," />
            </CardTitle>
          </CardHeader>
        </MotionCard>

        <MotionCard className="hidden md:block col-span-6 lg:col-span-4 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <CardHeader>
            <CardDescription className="text-emerald-600 font-bold">Net after all transactions</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              <CountUp end={1000} duration={1} prefix="+$" separator="," />
            </CardTitle>
          </CardHeader>
        </MotionCard>

        <MotionCard className="col-span-6 lg:col-span-8 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <CardHeader>
            <CardDescription className="text-emerald-600 font-bold">Recent Transactions</CardDescription>
          </CardHeader>
          <div className="flex flex-col justify-between h-full">
            <CardContent>
              <DashboardTransactionsTable />
            </CardContent>
            <CardFooter className="flex-col items-start py-1 text-sm">
              <Link to='/transactions' className="font-medium text-gray-500 hover:text-gray-700">
                View all transactions
              </Link>
            </CardFooter>
          </div>
        </MotionCard>

        <MotionCard className="col-span-6 lg:col-span-4 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
          <CardHeader>
            <CardDescription className="text-emerald-600 font-bold">Past 6 months summary</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full">
            <DashboardPieChart className="h-48" />
          </CardContent>
        </MotionCard>

        <MotionCard className="col-span-6 lg:col-span-8 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
          <CardHeader>
            <CardDescription className="text-emerald-600 font-bold">Pending Payments</CardDescription>
          </CardHeader>
          <div className="flex flex-col justify-between h-full">
            <CardContent>
              <UpcomingPaymentsCard />
            </CardContent>
            <CardFooter className="flex-col items-start py-1 text-sm">
              <Link to='/transactions' className="font-medium text-gray-500 hover:text-gray-700">
                View all pending payments
              </Link>
            </CardFooter>
          </div>
        </MotionCard>

        <MotionCard className="col-span-6 lg:col-span-4 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
          <CardHeader>
            <CardDescription className="text-emerald-600 font-bold">Sector Split this month</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full">
            <DashboardSectorChart className="h-full" />
          </CardContent>
        </MotionCard>
      </div>
    </>
  )
}

export default MainDashboard