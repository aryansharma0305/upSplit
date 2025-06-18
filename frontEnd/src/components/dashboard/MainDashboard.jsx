import React from 'react'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
  CardContent,
 
} from "@/components/ui/card"
import { Link } from 'react-router-dom'

import { PlusCircle } from 'lucide-react'
import { Users } from 'lucide-react'
import { Repeat } from 'lucide-react'
import { Button } from "@/components/ui/button"



import DashboardTransactionsTable from './DashboardTransactionsTable'
import DashboardPieChart from './DashboardPieChart'




const MainDashboard = () => {
  return (
   <>
    

    <div className="w-full px-6 pt-2 flex  sm:justify-end flex-wrap gap-3 items-center">
      

      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
        <PlusCircle className="w-4 h-4" />
        Add Contact
      </Button>

      <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
        <Users className="w-4 h-4" />
        Create Group
      </Button>
    </div>


    <div className="grid  sm:grid-cols-6 lg:grid-cols-12 gap-4 p-6">

      <Card className="col-span-6 lg:col-span-4 shadow-lg">
        <CardHeader>
          <CardDescription className="text-emerald-600 font-bold">Money yet to <strong>Receive</strong></CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">$1,250.00</CardTitle>
        </CardHeader>
      </Card>

      <Card className="col-span-6 lg:col-span-4 shadow-lg">
        <CardHeader>
          <CardDescription className="text-emerald-600 font-bold">Money yet to <strong>Pay</strong></CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">$250.00</CardTitle>
        </CardHeader>
      </Card>

      <Card className="hidden md:block col-span-6 lg:col-span-4 shadow-lg">
        <CardHeader>
          <CardDescription className="text-emerald-600 font-bold">Net after all transactions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">+$1,000.00</CardTitle>
        </CardHeader>
      </Card>

      <Card className="col-span-6 lg:col-span-8 shadow-lg">
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
      </Card>

      <Card className="col-span-6 lg:col-span-4 shadow-lg">
        <CardHeader>
          <CardDescription className="text-emerald-600 font-bold">Past 6 months summary</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full">
          <DashboardPieChart className="h-48" />
        </CardContent>
      </Card>

    </div>







  </>






  )
}

export default MainDashboard