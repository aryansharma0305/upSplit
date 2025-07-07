"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Trash2,
  AlarmCheck,
  ArrowRightLeft,
  ArrowDownCircle,
  ArrowUpCircle,
  Check,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddGroupExpense from "./AddGroupExpense";
import  GroupSettings  from "./GroupSettings";
import { GlowingEffect } from "../ui/glowing-effect";
import { AreYouSureSendReminderGroup } from "./AreYouSureSendReminderGroup";
import { SettleUPDialog } from "./SettleUpDialog";

// Sample group data with payment status for each member
const groupData = {
  id: "group456",
  name: "Weekend Trip",
  members: [
    {
      id: "user1",
      name: "Tanish Patel",
      profilePic: "https://randomuser.me/api/portraits/men/30.jpg",
    },
    {
      id: "user2",
      name: "Rohan Sharma",
      profilePic: "https://randomuser.me/api/portraits/men/31.jpg",
    },
    {
      id: "user3",
      name: "Priya Desai",
      profilePic: "https://randomuser.me/api/portraits/women/30.jpg",
    },
  ],
  notes: "Group for our annual weekend getaway. Split expenses evenly.",
  transactions: [
    {
      id: "txn1",
      description: "Beach booking",
      date: "2025-06-10",
      amount: 4500,
      paidBy: "Tanish Patel",
      split: "even",
      settled: false,
      direction: "To Receive",
      party: "Party",
      sector: "Travel",
      due: "2025-07-17",
      memberShares: {
        "Tanish Patel": { amount: 1500, paid: true },
        "Rohan Sharma": { amount: 1500, paid: true },
        "Priya Desai": { amount: 1500, paid: false },
      },
    },
    {
      id: "txn2",
      description: "Dinner at Zest",
      date: "2025-06-15",
      amount: 1200,
      paidBy: "Rohan Sharma",
      split: "even",
      settled: false,
      direction: "To Pay",
      party: "Food",
      sector: "Food",
      due: "2025-07-16",
      memberShares: {
        "Tanish Patel": { amount: 3000, paid: false },
        "Rohan Sharma": { amount: 300, paid: true },
        "Priya Desai": { amount: 300, paid: true },
      },
    },
    {
      id: "txn3",
      description: "Cab fare",
      date: "2025-06-08",
      amount: 6000,
      paidBy: "Priya Desai",
      split: "even",
      settled: true,
      direction: "Paid",
      party: "Travel",
      sector: "Travel",
      due: "2025-07-15",
      memberShares: {
        "Tanish Patel": { amount: 2000, paid: false },
        "Rohan Sharma": { amount: 2000, paid: false },
        "Priya Desai": { amount: 2000, paid: true },
      },
    },
    {
      id: "txn4",
      description: "Activity tickets",
      date: "2025-06-07",
      amount: 2400,
      paidBy: "Tanish Patel",
      split: "even",
      settled: false,
      direction: "To Receive",
      party: "Entertainment",
      sector: "Entertainment",
      due: "2025-07-14",
      memberShares: {
        "Tanish Patel": { amount: 800, paid: true },
        "Rohan Sharma": { amount: 800, paid: false },
        "Priya Desai": { amount: 800, paid: false },
      },
    },
    {
      id: "txn5",
      description: "Grocery shopping",
      date: "2025-06-06",
      amount: 900,
      paidBy: "Rohan Sharma",
      split: "even",
      settled: true,
      direction: "To Pay",
      party: "Food",
      sector: "Food",
      due: "2025-07-13",
      memberShares: {
        "Tanish Patel": { amount: 300, paid: true },
        "Rohan Sharma": { amount: 300, paid: true },
        "Priya Desai": { amount: 300, paid: true },
      },
    },
  ],
};

const currentUser = "Tanish Patel"; // Assuming current user is Tanish Patel


const calculateBalances = (transactions, currentUser, members) => {
  const balances = {};
  members.forEach((member) => {
    if (member.name !== currentUser) {
      balances[member.name] = {
        iOwe: 0, // Amount current user owes to member
        iOwed: 0, // Amount member owes to current user
        net: 0, // Net balance
      };
    }
  });

  transactions.forEach((txn) => {
    if (txn.settled) return; // Skip settled transactions

    // If current user paid, others may owe them
    if (txn.paidBy === currentUser) {
      members.forEach((member) => {
        if (member.name !== currentUser && !txn.memberShares[member.name].paid) {
          balances[member.name].iOwed += txn.memberShares[member.name].amount;
        }
      });
    }
    // If another member paid and current user hasn't paid their share
    else if (members.some((m) => m.name === txn.paidBy) && !txn.memberShares[currentUser].paid) {
      balances[txn.paidBy].iOwe += txn.memberShares[currentUser].amount;
    }
  });

  // Calculate net balance for each member
  Object.keys(balances).forEach((memberName) => {
    balances[memberName].net = balances[memberName].iOwed - balances[memberName].iOwe;
  });

  return balances;
};




const containerVariants = {
  hidden: { opacity: 0 ,y:20},
  visible: {
    opacity: 1,
    y:0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};









export default function GenericGroup() {
  const { name, members, transactions } = groupData;
  const [filterText, setFilterText] = useState("");
  const [filterDirection, setFilterDirection] = useState("All");
  const [filterSector, setFilterSector] = useState("All");
  const [expandedRows, setExpandedRows] = useState([]);

  const balances = useMemo(
    () => calculateBalances(transactions, currentUser, members),
    [transactions, members]
  );
  const myReceive = Object.values(balances)
    .map((b) => b.net)
    .filter((b) => b > 0)
    .reduce((sum, b) => sum + b, 0);
  const myOwe = Object.values(balances)
    .map((b) => b.net)
    .filter((b) => b < 0)
    .reduce((sum, b) => sum + -b, 0);

  const resetFilters = () => {
    setFilterText("");
    setFilterDirection("All");
    setFilterSector("All");
  };

  const filteredTransactions = transactions.filter((txn) => {
    const matchesText = txn.description
      .toLowerCase()
      .includes(filterText.toLowerCase());
    const matchesDirection =
      filterDirection !== "All" ? txn.direction === filterDirection : true;
    const matchesSector =
      filterSector !== "All" ? txn.sector === filterSector : true;
    return matchesText && matchesDirection && matchesSector;
  });

  const handleDeleteGroup = () => {
    console.log(`Delete group ${name} with ID ${groupData.id}`);
  };

  const handleDeleteTransaction = (txnId) => {
    console.log(`Delete transaction ${txnId} for group ${name}`);
  };

  const handleSettle = (memberName) => {
    console.log(`Settle balance with ${memberName}`);
  };

  const handleReminder = (memberName) => {
    console.log(`Send reminder to ${memberName}`);
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full  p-0 pt-4 sm:p-4">
    <motion.div
      className="  min-h-screen "
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* HEADER */}
     
    <motion.header variants={cardVariants}>
  <div className="p-[1.5px] rounded-[12px] bg-gradient-to-br from-gray-600 to-slate-500 mb-6 shadow-lg">
    <Card className="bg-white dark:bg-gray-800 rounded-lg p-6 border-none">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 flex-wrap">
        {/* GROUP PROFILE */}
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 ring-2 ring-emerald-600">
            <AvatarImage src={groupData.image || "https://randomuser.me/api/portraits/lego/3.jpg"} />
            <AvatarFallback className="bg-emerald-50 text-emerald-600">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{name}</h1>
            <div className="flex flex-col gap-1 mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" /> {members.length} Members
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
                <p className="text-xl font-bold text-red-600 mt-1">₹{myOwe.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>
          <div className="p-[1.5px] rounded-[12px] bg-gradient-to-r from-green-500 via-teal-600 to-emerald-700">
            <Card className="border-none shadow-none rounded-lg bg-white dark:bg-gray-800 w-full min-w-36">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-emerald-600 uppercase font-medium">To Receive</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">₹{myReceive.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 items-center justify-center xl:justify-end w-full xl:w-auto">
          <GroupSettings />
          <AddGroupExpense />
        </div>
      </div>
    </Card>
  </div>
</motion.header>



      {/* MAIN CONTENT */}
      <div className="space-y-6 sm:px-4">
        {/* GROUP MEMBERS BALANCES */}
        <motion.section variants={cardVariants}>

          <Card className="bg-white dark:bg-gray-800 shadow-none border-none px-0">
            <CardHeader className={"px-0"}>
              <CardTitle className="text-xl mb-3 px-0 font-semibold  text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <div className="flex flex-wrap text-center"><h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Group Members</h1></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-0 px-0">
               
              <motion.div
                className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
           
                {members
                  .filter((member) => member.name !== currentUser)
                  .map((member) => {
                    const balance = balances[member.name];
                    const isOwed = balance.net > 0;
                    return (
                      
                        <motion.div
                        key={member.id}
                        variants={cardVariants}
                        className="relative rounded-md border p-4 shadow-lg bg-white dark:bg-gray-800 text-sm duration-200 hover:-translate-y-1">
                        
                        <GlowingEffect variant={""} blur={0.5} borderWidth={1.5} spread={150} glow={true} disabled={false} proximity={4} inactiveZone={0.1}/>
                      
                        <div className="flex items-center gap-3 ">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={member.profilePic} />
                            <AvatarFallback>
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium text-base truncate">
                            {member.name}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-500 dark:text-gray-400">
                            You owe: ₹{balance.iOwe.toFixed(2)}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">
                            They owe: ₹{balance.iOwed.toFixed(2)}
                          </p>
                          <p
                            className={
                              balance.net >= 0
                                ? "text-emerald-600 font-semibold"
                                : "text-red-600 font-semibold"
                            }
                          >
                            Net: ₹{Math.abs(balance.net).toFixed(2)}{" "}
                            {balance.net >= 0 ? "(They owe you)" : "(You owe them)"}
                          </p>
                        </div>
                        <div className="flex justify-end gap-2 mt-5">
                          {isOwed ? (
                            <AreYouSureSendReminderGroup txn={balance}/>
                          ) : (
                            <SettleUPDialog txn={balance} />
                          )}
                        </div>
                      </motion.div>
                      
                    );
                  })}
              </motion.div>
            </CardContent>
          </Card>
        </motion.section>

        <Separator className="my-4" />


{/* ============================================================================================================= */}



        {/* ALL TRANSACTIONS */}
        <motion.section variants={cardVariants}>
          <Card className="bg-white dark:bg-gray-800 shadow-none border-none mb-20">
            <CardHeader className="px-0">
              <CardTitle className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                <div className="flex flex-wrap text-center"><h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Group Transactions</h1></div>
              
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
             <div className="flex flex-row justify-between pb-4 px-0 w-full align-middle gap-3 content-center flex-wrap" > 

                  

                {/*<div className="space-y-2 flex-col justify-between flex w-full md:w-3/4">
                  <Label htmlFor="search">Search by Description</Label>
                  <Input
                    id="search"
                    placeholder="e.g. Hotel booking"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="w-full "
                  />
                </div>
                
                <div className="w-full md:w-1/4 flex gap-4">

                  <div className="space-y-2 flex-col justify-between flex">
                    <Label htmlFor="direction">Direction</Label>
                    <Select
                      value={filterDirection}
                      onValueChange={setFilterDirection}
                      // className="w-180"
                    >
                      <SelectTrigger id="direction">
                        <SelectValue placeholder="All Directions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="To Pay">To Pay</SelectItem>
                        <SelectItem value="To Receive">To Receive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 flex-col justify-between flex">
                    <Label htmlFor="sector">Sector</Label>
                    <Select
                      value={filterSector}
                      onValueChange={setFilterSector}
                    >
                      <SelectTrigger id="sector">
                        <SelectValue placeholder="All Sectors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" onClick={resetFilters}>
                      Reset
                    </Button>
                  </div>
                </div> */}

                <motion.div
        className="flex flex-col w-full lg:flex-row gap-4 pb-3 items-end "
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 ,duration: 0.2}}
      >
        <div className="space-y-1 w-full text-sm">
          <Label htmlFor="search">Search by Name</Label>
          <Input
            id="search"
            placeholder="e.g. Riya"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap flex-row gap-4 w-full lg:w-auto">
          <div className="space-y-1 text-sm">
            <Label htmlFor="direction">Direction</Label>
            <Select value={filterDirection} onValueChange={setFilterDirection}>
              <SelectTrigger id="direction">
                <SelectValue placeholder="All Directions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 text-sm">
            <Label htmlFor="sector">Sector</Label>
            <Select value={filterSector} onValueChange={setFilterSector}>
              <SelectTrigger id="sector">
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end pt-3">
            <Button variant="secondary" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
          
        </div>
      </motion.div>



              </div>
              <div className="overflow-x-auto border-1 shadow-lg rounded-lg">
                <Table className={""}>
                  <TableHeader className={"bg-gray-100 dark:bg-gray-700"}>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-300 min-w-[150px]">
                        Description
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-300 min-w-[100px]">
                        Date
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-300 min-w-[100px]">
                        Amount
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-300 min-w-[100px]">
                        Paid By
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-300 min-w-[80px]">
                        Split
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-300 min-w-[80px]">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((txn) => (
                      <React.Fragment key={txn.id}>
                        <motion.tr
                          variants={rowVariants}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRow(txn.id)}
                            >
                              {expandedRows.includes(txn.id) ? (
                                <ArrowUpCircle className="w-4 h-4" />
                              ) : (
                                <ArrowDownCircle className="w-4 h-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium text-gray-800 dark:text-gray-100">
                            {txn.description}
                          </TableCell>
                          <TableCell className="text-gray-500 dark:text-gray-400">
                            {txn.date}
                          </TableCell>
                          <TableCell className="font-medium text-emerald-600">
                            ₹{txn.amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-gray-500 dark:text-gray-400">
                            {txn.paidBy}
                          </TableCell>
                          <TableCell className="text-gray-500 dark:text-gray-400">
                            {txn.split}
                          </TableCell>
                          <TableCell className="px-2">
                            <span className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs font-medium">
                              {txn.settled ? "Settled" : "Pending"}
                            </span>
                          </TableCell>
                        </motion.tr>
                        {expandedRows.includes(txn.id) && (
                          <tr>
                            <td colSpan={7} className="p-0">
                              <div className="p-4 bg-gray-50 dark:bg-gray-900">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                                  Transaction Details
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300">
                                  <strong>Paid By:</strong> {txn.paidBy} (₹
                                  {txn.amount.toFixed(2)})
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  <strong>Split Type:</strong> {txn.split}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  <strong>Date:</strong> {txn.date}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  <strong>Due Date:</strong> {txn.due}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  <strong>Sector:</strong> {txn.sector}
                                </p>
                                <h5 className="font-semibold mt-2 text-gray-800 dark:text-gray-100">
                                  Transaction Description:
                                </h5>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {txn.paidBy} paid ₹{txn.amount.toFixed(2)} for {txn.description} on {txn.date}
                                </p>
                                <h5 className="font-semibold mt-2 text-gray-800 dark:text-gray-100">
                                  Member Shares:
                                </h5>
                                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                                  {members.map((member) => (
                                    <li key={member.id}>
                                      {member.name}: ₹{txn.memberShares[member.name].amount.toFixed(2)}
                                      {txn.memberShares[member.name].paid ? (
                                        <span className="ml-2 text-emerald-600">
                                          Paid <Check className="w-4 h-4 inline" />
                                        </span>
                                      ) : (
                                        <span className="ml-2 text-red-600">Not paid</span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </motion.div>
    </div>
  );
}








