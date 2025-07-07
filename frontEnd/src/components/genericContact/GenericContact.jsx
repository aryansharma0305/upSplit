"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AlarmClock, ArrowRightLeft, Mail, Phone, Trash2 } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CharBar from "@/components/genericContact/CharBar";
import AddExpense from "./AddExpense";
import Settings from "./Settings";
import { History } from "./History";
import { Separator } from "@/components/ui/separator";
import { AreYouSureSendReminder } from "./AreYouSureSendReminder";
import { SettleUp } from "./SettleUp";
import { AreYouSureDelete } from "./AreYouSureDelete";



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
    {
      id: "txn1",
      description: "Paid ₹500 for dinner",
      date: "2025-06-08",
      dueDate: "2025-07-08",
      amount: -500,
      type: "debit",
      settled: false,
      sector: "Food",
    },
    {
      id: "txn2",
      description: "Received ₹1000 for groceries",
      date: "2025-06-05",
      dueDate: "2025-07-05",
      amount: 1000,
      type: "credit",
      settled: false,
      sector: "Groceries",
    },
    {
      id: "txn3",
      description: "Paid ₹250 for Netflix",
      date: "2025-06-03",
      dueDate: "2025-07-03",
      amount: -250,
      type: "debit",
      settled: false,
      sector: "Entertainment",
    },
    {
      id: "txn4",
      description: "Received ₹700 from Rohan",
      date: "2025-06-01",
      dueDate: "2025-07-01",
      amount: 700,
      type: "credit",
      settled: true,
      sector: "Miscellaneous",
    },
    {
      id: "txn5",
      description: "Paid ₹400 for cab",
      date: "2025-05-30",
      dueDate: "2025-06-30",
      amount: -400,
      type: "debit",
      settled: true,
      sector: "Travel",
    },
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
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
};

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
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function GenericContact() {
  const {
    name,
    email,
    phone,
    profilePic,
    recentTransactions,
    summary,
    analytics,
  } = contactData;

  const handleDelete = () => {
    console.log(`Delete contact ${name} with ID ${contactData.id}`);
    // Replace with actual delete logic (e.g., API call)
  };

  const handleDeleteTransaction = (txnId) => {
    console.log(`Delete transaction ${txnId} for contact ${name}`);
    // Replace with actual delete logic (e.g., API call)
  };

  return (
    <motion.div
      className="w-full min-h-screen  pt-4 sm:p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* HEADER */}





      <motion.header variants={cardVariants}>
    <div className="p-[1.5px] rounded-[12px] bg-gradient-to-br from-gray-600 to-slate-500 mb-6 shadow-lg">
      <Card className="bg-white dark:bg-gray-800 rounded-lg p-6 border-none">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 flex-wrap">

          {/* PROFILE */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 ring-2 ring-emerald-600">
              <AvatarImage src={profilePic} />
              <AvatarFallback className="bg-emerald-50 text-emerald-600">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{name}</h1>
              <div className="flex flex-col gap-1 mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" /> {email}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> {phone}
                </p>
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-4 w-full xl:w-auto">
            <div className="p-[1.5px] rounded-[12px] bg-gradient-to-r from-pink-400 via-pink-600 to-red-600">
              <Card className="border-none shadow-none rounded-lg bg-white dark:bg-gray-800 w-full min-w-36">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-red-600 uppercase font-medium">To Pay</p>
                  <p className="text-xl font-bold text-red-600 mt-1">₹{summary.owe}</p>
                </CardContent>
              </Card>
            </div>
            <div className="p-[1.5px] rounded-[12px] bg-gradient-to-r from-green-500 via-teal-600 to-emerald-700">
              <Card className="border-none shadow-none rounded-lg bg-white dark:bg-gray-800 w-full min-w-36">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-emerald-600 uppercase font-medium">To Receive</p>
                  <p className="text-xl font-bold text-emerald-600 mt-1">₹{summary.toReceive}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2 items-center justify-center xl:justify-end w-full xl:w-auto">
            <Settings />
            <AddExpense />
          </div>
        </div>
      </Card>
    </div>
  </motion.header>




      {/* MAIN CONTENT */}
      <div className=" px-0">
        {/* TRANSACTIONS TABS */}
        <motion.section variants={cardVariants}>
          <Card className="bg-white px-0 shadow-none border-none">
            <CardHeader className={"px-0 mb-2 sm:px-4"}> 
              <CardTitle className="text-xl  px-0 font-semibold text-emerald-600 mb">
                <div className="flex flex-wrap text-center"><h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Recent Transactions</h1></div>
           
              </CardTitle>
            </CardHeader>
            <Tabs defaultValue="all" className="w-full px-0 ">
              <TabsList className="flex justify-start gap-2 bg-gray-50 p-2 shadow-lg rounded-lg sm:mx-3">
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
                <TabsContent key={key} value={key} className="sm:px-4 px-0  ">
                  <CardContent className="px-0 overflow-hidden border-1  shadow-lg mt-3  rounded-lg">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Table className={"rounded-none shadow-lg  "}>
                        <TableHeader className={"bg-gray-50 hover:bg-gray-100  "}>
                          <TableRow>
                            <TableHead className="text-gray-600">Description</TableHead>
                            <TableHead className="text-gray-600">Date Created</TableHead>
                            <TableHead className="text-gray-600">Due Date</TableHead>
                            <TableHead className="text-gray-600">Amount</TableHead>
                            <TableHead className="text-gray-600">Sector</TableHead>
                            <TableHead className="text-gray-600">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className={"rounded-xl"}>
                          {recentTransactions
                            .filter((txn) => key === 'all' || txn.type === key)
                            .map((txn) => (
                              <motion.tr
                                key={txn.id}
                                variants={rowVariants}
                                className="hover:bg-gray-100"
                              >
                                <TableCell className="font-medium text-gray-800 truncate max-w-xs">
                                  {txn.description}
                                </TableCell>
                                <TableCell className="text-gray-500">{txn.date}</TableCell>
                                <TableCell className="text-gray-500">{txn.dueDate}</TableCell>
                                <TableCell className={`font-medium ${txn.amount < 0 ? "text-red-500" : "text-green-600"}`}>
                                  ₹{Math.abs(txn.amount)}
                                </TableCell>
                                <TableCell className="text-gray-500">{txn.sector}</TableCell>
                                <TableCell className="px-2">
                                   <div className="flex items-center gap-2 justify-between pr-10">
                                        {txn.type=="debit" ? (
                                            <SettleUp txn={txn}/>
                                            ):(
                                            <AreYouSureSendReminder txn={txn} />)
                                        }

                                      {/* <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-red-300 text-red-600 hover:bg-red-50"
                                        onClick={() => handleDeleteTransaction(txn.id)}
                                        aria-label={`Delete transaction ${txn.description}`}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button> */}
                                      <AreYouSureDelete txn={txn} />
                                    </div>
                                
                                </TableCell>
                              </motion.tr>
                            ))}
                        </TableBody>
                      </Table>
                    </motion.div>
                     <CardFooter className="flex justify-start gap-2 pb-2 px-1">
                    
                    <History user="Rohan" />
                  </CardFooter>
                  </CardContent>
                 
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </motion.section>

        {/* ANALYTICS */}
        <motion.section variants={cardVariants} className="mt-6 mb-24 pb-2">
          <Card className="bg-white sm:mx-4 p-0 border-none  shadow-none">
            <CardHeader className="px-2 mb-3">
              <CardTitle className="text-xl font-semibold text-emerald-600">
                <div className="flex flex-wrap text-center"><h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Monthly Analytics</h1></div>
           
              </CardTitle>
             
            </CardHeader>
            <CardContent className={"p-0"}>
              <CharBar data={analytics} className="w-full" />
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </motion.div>
  );
}