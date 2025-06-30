"use client";
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
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import CountUp from 'react-countup'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import DashboardTransactionsTable from './DashboardTransactionsTable'
import DashboardPieChart from './DashboardPieChart'
import UpcomingPaymentsCard from './UpcomingPaymentsCard'
import DashboardSectorChart from './DashboardsSectorChart'

const MotionCard = motion(Card)
const MotionDiv = motion.div

const MainDashboard = () => {
  return (
    <div className="p-4  ">
      <div className="flex flex-wrap  mb-5 justify-between">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-emerald-600  to-teal-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className='flex gap-2'>
        <Button className="bg-gradient-to-r from-emerald-600  to-teal-600  hover:bg-gradient-to-r hover:from-emerald-700 hover:to-teal-700  text-white gap-2 hover:-translate-y-0.5 transition-all duration-200">
          <PlusCircle className="w-4 h-4" />
          Add Contact
        </Button>
        
        <Button className="bg-gradient-to-r from-emerald-600  to-teal-600  hover:bg-gradient-to-r hover:from-emerald-700 hover:to-teal-700  text-white gap-2 hover:-translate-y-0.5 transition-all duration-200">
          <Users className="w-4 h-4" />
          Create Group
        </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
        {[{
          key: 0,
          span: "col-span-1 sm:col-span-1 lg:col-span-4",
          delay: 0,
          description: "Money yet to <strong>Receive</strong>",
          value: 1250,
          prefix: "$",
          bg: "bg-gradient-to-r text-emerald-600 from-emerald-600 to-teal-600 "
        }, {
          key: 1,
          span: "col-span-1 sm:col-span-1 lg:col-span-4",
          delay: 0.05,
          description: "Money yet to <strong>Pay</strong>",
          value: 250,
          prefix: "$",
          bg: "text-red-600 bg-gradient-to-r from-red-600 to-rose-600"
        }, {
          key: 2,
          span: "col-span-1 sm:col-span-1 lg:col-span-4 lg:block hidden",
          delay: 0.1,
          description: "Net after all transactions",
          value: 1000,
          prefix: "+$",
          bg: "bg-gradient-to-r text-gray-700 from-gray-600  to-slate-600"

        }].map(({ key, span, delay, description, value, prefix,bg }) => (
          // <MotionDiv
          //   key={key}
            // className={`relative ${span} rounded-2xl border duration-200 hover:-translate-y-1 p-[1px] bg-amber-300`}
          //   initial={{ opacity: 0, y: 20 }}
          //   animate={{ opacity: 1, y: 0 }}
          //   transition={{ duration: 0.4, delay }}
          // >
            
            <MotionCard 
              className={`relative ${span} z-10 shadow-lg p-[2px] ${bg} border-none   backdrop-blur-sm h-full rounded-[18px] duration-200 hover:-translate-y-1` }
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.2, delay }}
            >
             
             <div className='relative z-12 bg-white h-full rounded-2xl'>
              <CardHeader className="p-4">
                <CardDescription 
                  className={` font-bold text-sm`} 
                  dangerouslySetInnerHTML={{ __html: description }} 
                />
                <CardTitle className="text-2xl font-semibold tabular-nums ">
                  <CountUp end={value} duration={1} prefix={prefix} separator="," />
                </CardTitle>
              </CardHeader>
            </div>
            
            </MotionCard>


     
      ))}

        <MotionDiv 
          className="relative col-span-1 sm:col-span-2 lg:col-span-8 rounded-2xl border duration-200 hover:-translate-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <GlowingEffect
            blur={0.5}
            borderWidth={2.5}
            spread={100}
            glow={true}
            disabled={false}
            proximity={4}
            inactiveZone={0.01}
            className="z-0"
          />
          <MotionCard 
            className="relative z-10 shadow-lg border-none bg-white/95 backdrop-blur-sm h-full rounded-2xl" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <CardHeader className="p-4">
              <CardDescription className=" font-bold text-sm">
                <h1 className='bg-gradient-to-r from-emerald-600  to-teal-600 bg-clip-text text-transparent'>
                Recent Transactions
                </h1>
              </CardDescription>
            </CardHeader>
            <div className="flex flex-col justify-between h-full">
              <CardContent className="p-4">
                <DashboardTransactionsTable />
              </CardContent>
              <CardFooter className="flex-col items-start py-2 text-sm">
                <Link to='/dashboard/transaction-history' className="font-medium text-gray-500 hover:text-gray-700">
                  View all transactions
                </Link>
              </CardFooter>
            </div>
          </MotionCard>
        </MotionDiv>

        <MotionDiv 
          className="relative col-span-1 sm:col-span-1 lg:col-span-4 rounded-2xl border duration-200 hover:-translate-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <GlowingEffect
            blur={0.5}
            borderWidth={2.5}
            spread={150}
            glow={true}
            disabled={false}
            proximity={4}
            inactiveZone={0.1}
            className="z-0"
          />
          <MotionCard 
            className="relative z-10 shadow-lg border-none bg-white/95 backdrop-blur-sm h-full rounded-2xl " 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <CardHeader className="p-4 border-none">
              <CardDescription className="text-emerald-600 font-bold text-sm">
                Past 6 months summary
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full p-4">
              <DashboardPieChart className="h-48 w-full" />
            </CardContent>
          </MotionCard>
        </MotionDiv>

        <MotionDiv 
          className="relative col-span-1 sm:col-span-2 lg:col-span-8 rounded-2xl border duration-200 hover:-translate-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <GlowingEffect
            blur={0.5}
            borderWidth={2.5}
            spread={150}
            glow={true}
            disabled={false}
            proximity={4}
            inactiveZone={0.1}
            className="z-0"
          />
          <MotionCard 
            className="relative z-10 shadow-lg border-none bg-white/95 backdrop-blur-sm h-full  rounded-2xl" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <CardHeader className="p-4">
              <CardDescription className="text-emerald-600 font-bold text-sm">
                Pending Payments
              </CardDescription>
            </CardHeader>
            <div className="flex flex-col justify-between h-full">
              <CardContent className="p-4">
                <UpcomingPaymentsCard />
              </CardContent>
              <CardFooter className="flex-col items-start py-2 text-sm">
                <Link to='/dashboard/pending-payments' className="font-medium text-gray-500 hover:text-gray-700">
                  View all pending payments
                </Link>
              </CardFooter>
            </div>
          </MotionCard>
        </MotionDiv>

        <MotionDiv 
          className="relative col-span-1 sm:col-span-1 lg:col-span-4 rounded-2xl border duration-200 hover:-translate-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <GlowingEffect
            blur={0.5}
            borderWidth={2.5}
            spread={150}
            glow={true}
            disabled={false}
            proximity={4}
            inactiveZone={0.1}
            className="z-0"
          />
          <MotionCard 
            className="relative z-10 shadow-lg border-none bg-white/95 backdrop-blur-sm h-full rounded-2xl" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <CardHeader className="p-4">
              <CardDescription className="text-emerald-600 font-bold text-sm">
                Sector Split this month
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full p-4">
              <DashboardSectorChart className="h-full w-full" />
            </CardContent>
          </MotionCard>
        </MotionDiv>
      </div>
    </div>
  )
}

export default MainDashboard