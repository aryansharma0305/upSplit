"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { AlarmClock, ArrowRightLeft, Mail, Phone, Trash2 } from "lucide-react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import CharBar from "@/components/genericContact/CharBar"
import AddExpense from "./AddExpense"
import Settings from "./Settings"
import { History } from "./History"

const contactData = {
  id: "user123",
  name: "Tanish Sharma",
  email: "tanish@example.com",
  phone: "+91 9876543210",
  profilePic: "https://randomuser.me/api/portraits/men/29.jpg",
  sharedGroups: ["Weekend Dinners", "Movie Nights", "Gym Buddies"],
  notes:
    "Always pays on time. Prefers digital payments. Met at the annual trip in March.",
  recentTransactions: [
    { id: "txn1", description: "Paid ₹500 for dinner", date: "2025-06-08", amount: -500, type: "debit", settled: false },
    { id: "txn2", description: "Received ₹1000 for groceries", date: "2025-06-05", amount: 1000, type: "credit", settled: false },
    { id: "txn3", description: "Paid ₹250 for Netflix", date: "2025-06-03", amount: -250, type: "debit", settled: false },
    { id: "txn4", description: "Received ₹700 from Rohan", date: "2025-06-01", amount: 700, type: "credit", settled: true },
    { id: "txn5", description: "Paid ₹400 for cab", date: "2025-05-30", amount: -400, type: "debit", settled: true },
  ],
  summary: {
    owe: 1200,
    toReceive: 850,
  },
  analytics: [
    { month: "Jan", owe: 186, receive: 80 },
    { month: "Feb", owe: 305, receive: 200 },
    { month: "Mar", owe: 237, receive: 120 },
    { month: "Apr", owe: 73, receive: 190 },
    { month: "May", owe: 209, receive: 130 },
    { month: "Jun", owe: 214, receive: 140 },
  ],
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function GenericContact() {
  const {
    name,
    email,
    phone,
    profilePic,
    recentTransactions,
    summary,
    analytics,
  } = contactData

  const handleDelete = () => {
    console.log(`Delete contact ${name} with ID ${contactData.id}`)
    // Replace with actual delete logic (e.g., API call)
  }

  const handleDeleteTransaction = (txnId) => {
    console.log(`Delete transaction ${txnId} for contact ${name}`)
    // Replace with actual delete logic (e.g., API call)
  }

  return (
    <motion.div
      className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* HEADER */}
      <motion.header variants={cardVariants}>
        <Card className="bg-white rounded-2xl shadow-lg p-6 mb-8 border">
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 ring-2 ring-emerald-600">
                <AvatarImage src={profilePic} />
                <AvatarFallback className="bg-emerald-50 text-emerald-600">{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">{name}</h1>
                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" /> {email}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" /> {phone}
                  </p>
                </div>
              </div>
            </div>
            
            {/* SUMMARY */}
            <div className="grid grid-cols-2 gap-4 w-full xl:w-auto">
              <Card className=" border-red-100 px-10 bg-white">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-red-600 uppercase font-medium">To Pay</p>
                  <p className="text-xl font-bold text-red-600 mt-1">₹{summary.owe}</p>
                </CardContent>
              </Card>
              <Card className=" border-green-100 ">
                <CardContent className="p-4 text-center bg-white">
                  <p className="text-xs text-green-700 uppercase font-medium">To Receive</p>
                  <p className="text-xl font-bold text-green-700 mt-1">₹{summary.toReceive}</p>
                </CardContent>
              </Card>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 items-center">
              <Settings />
              <AddExpense />
              
            </div>
          </div>
        </Card>
      </motion.header>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* TRANSACTIONS TABS */}
        <motion.section variants={cardVariants} className="xl:col-span-2">
          <Card className="bg-white shadow-lg border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Recent Transactions</CardTitle>
            </CardHeader>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="flex justify-start gap-2 bg-gray-50 p-2 rounded-lg mx-4">
                {['All', 'To Pay', 'To Receive'].map((label, index) => (
                  <TabsTrigger
                    key={label.toLowerCase()}
                    value={['all', 'debit', 'credit'][index]}
                    className="px-4 py-3 text-sm font-medium rounded-md data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {['all', 'debit', 'credit'].map((key) => (
                <TabsContent key={key} value={key} className="px-4">
                  <CardContent className="mt-4 overflow-hidden">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-gray-600">Description</TableHead>
                            <TableHead className="text-gray-600">Date</TableHead>
                            <TableHead className="text-gray-600">Amount</TableHead>
                            <TableHead className="text-gray-600">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="">
                          {recentTransactions
                            .filter((txn) => key === 'all' || txn.type === key)
                            .slice(0, 5)
                            .map((txn) => (
                              <motion.tr
                                key={txn.id}
                                variants={rowVariants}
                                className="hover:bg-gray-100"
                              >
                                <TableCell className="font-medium text-gray-800  truncate  max-w-xs">
                                  {txn.description}
                                </TableCell>
                                <TableCell className="text-gray-500">{txn.date}</TableCell>
                                <TableCell className={`font-medium ${txn.amount < 0 ? "text-red-500" : "text-green-600"}`}>
                                  ₹{Math.abs(txn.amount)}
                                </TableCell>
                                <TableCell className="px-2">
                                  {txn.settled ? (
                                    <Badge variant="secondary" className="py-1 my-0.5" >
                                      Settled
                                    </Badge>
                                  ) : (
                                    <div className="flex gap-2 justify-between">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => console.log(`Action: ${txn.type === "debit" ? "Settle Up" : "Send Reminder"} for ${txn.id}`)}
                                      >
                                        {txn.type === "debit" ? (<>Settle Up <ArrowRightLeft className="w-4 h-4" /></> ) : (<>Send Reminder <AlarmClock className="w-4 h-4" /></>)}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-300 text-red-600 hover:bg-red-50"
                                        onClick={() => handleDeleteTransaction(txn.id)}
                                        aria-label={`Delete transaction ${txn.description}`}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  )}
                                </TableCell>
                              </motion.tr>
                            ))}
                        </TableBody>
                      </Table>
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-4">
                    <History user="Rohan" />
                  </CardFooter>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </motion.section>

        {/* ANALYTICS */}
        <motion.section variants={cardVariants} className="xl:col-span-1">
          <Card className="bg-white shadow-lg border">
            <CardContent>
              <CharBar data={analytics} className="w-full" />
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </motion.div>
  )
}