"use client";

import React, { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
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
  DollarSign,
  Trash2,
  ArrowRightLeft,
  AlarmClock,
  CalendarDays,
  BadgePercent,
  Info,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

// Sample group data
const groupData = {
  id: "group456",
  name: "Weekend Trip",
  members: [
    { id: "user1", name: "Tanish Patel", profilePic: "https://randomuser.me/api/portraits/men/30.jpg" },
    { id: "user2", name: "Rohan Sharma", profilePic: "https://randomuser.me/api/portraits/men/31.jpg" },
    { id: "user3", name: "Priya Desai", profilePic: "https://randomuser.me/api/portraits/women/30.jpg" },
  ],
  notes: "Group for our annual weekend getaway. Split expenses evenly.",
  recentTransactions: [
    {
      id: "txn1",
      description: "Hotel booking",
      date: "2025-06-10",
      amount: 4500,
      paidBy: "Tanish Patel",
      split: "even",
      settled: false,
      direction: "To Receive",
      party: "Group",
      sector: "Travel",
      due: "2025-06-17",
    },
    {
      id: "txn2",
      description: "Dinner at Zest",
      date: "2025-06-09",
      amount: 1800,
      paidBy: "Rohan Sharma",
      split: "even",
      settled: false,
      direction: "To Pay",
      party: "Group",
      sector: "Food",
      due: "2025-06-16",
    },
    {
      id: "txn3",
      description: "Cab fare",
      date: "2025-06-08",
      amount: 600,
      paidBy: "Priya Desai",
      split: "even",
      settled: true,
      direction: "To Pay",
      party: "Group",
      sector: "Travel",
      due: "2025-06-15",
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
      party: "Group",
      sector: "Entertainment",
      due: "2025-06-14",
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
      party: "Group",
      sector: "Food",
      due: "2025-06-13",
    },
  ],
};

const currentUser = "Tanish Patel"; // Assuming current user is Tanish Patel

const calculateBalances = (transactions, currentUser, members) => {
  const balances = {};
  members.forEach(member => {
    if (member.name !== currentUser) {
      balances[member.name] = 0;
    }
  });
  transactions.forEach(txn => {
    if (txn.settled) return; // Skip settled transactions
    const share = txn.amount / members.length;
    if (txn.paidBy === currentUser) {
      members.forEach(member => {
        if (member.name !== currentUser) {
          balances[member.name] += share;
        }
      });
    } else if (members.some(m => m.name === txn.paidBy)) {
      balances[txn.paidBy] -= share;
    }
  });
  return balances;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.15,
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
  const { name, members, recentTransactions } = groupData;
  const [filterText, setFilterText] = useState("");
  const [filterDirection, setFilterDirection] = useState("All");
  const [filterSector, setFilterSector] = useState("All");
  const [expandedRows, setExpandedRows] = useState([]);

  const balances = useMemo(() => calculateBalances(recentTransactions, currentUser, members), [recentTransactions, members]);
  const myReceive = Object.values(balances).filter(b => b > 0).reduce((sum, b) => sum + b, 0);
  const myOwe = Object.values(balances).filter(b => b < 0).reduce((sum, b) => sum + -b, 0);

  const resetFilters = () => {
    setFilterText("");
    setFilterDirection("All");
    setFilterSector("All");
  };

  const filteredTransactions = recentTransactions.filter((txn) => {
    const matchesText = txn.description.toLowerCase().includes(filterText.toLowerCase());
    const matchesDirection = filterDirection !== "All" ? txn.direction === filterDirection : true;
    const matchesSector = filterSector !== "All" ? txn.sector === filterSector : true;
    return matchesText && matchesDirection && matchesSector;
  });

  const handleDeleteGroup = () => {
    console.log(`Delete group ${name} with ID ${groupData.id}`);
    // Replace with actual delete logic (e.g., API call)
  };

  const handleDeleteTransaction = (txnId) => {
    console.log(`Delete transaction ${txnId} for group ${name}`);
    // Replace with actual delete logic (e.g., API call)
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

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
                <AvatarImage src="https://randomuser.me/api/portraits/lego/3.jpg" />
                <AvatarFallback className="bg-emerald-50 text-emerald-600">{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">{name}</h1>
                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" /> {members.length} Members
                  </p>
                  <p className="text-sm text-gray-500">{groupData.notes}</p>
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-2 gap-4 w-full xl:w-auto">
              <Card className="border-red-100 px-10 bg-white">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-red-600 uppercase font-medium">To Pay</p>
                  <p className="text-xl font-bold text-red-600 mt-1">₹{myOwe.toFixed(2)}</p>
                </CardContent>
              </Card>
              <Card className="border-green-100 px-10 bg-white">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-green-600 uppercase font-medium">To Receive</p>
                  <p className="text-xl font-bold text-green-600 mt-1">₹{myReceive.toFixed(2)}</p>
                </CardContent>
              </Card>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 items-center">
              {/* <GroupSettings /> */}
              {/* <AddGroupExpense /> */}
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={handleDeleteGroup}
                aria-label={`Delete group ${name}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.header>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* MY OUTSTANDING TRANSACTIONS */}
        <motion.section variants={cardVariants} className="xl:col-span-2">
          <Card className="bg-white shadow-lg border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-emerald-600">My Outstanding Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 pb-3 items-end">
                <div className="space-y-1 w-full text-sm">
                  <Label htmlFor="search">Search by Description</Label>
                  <Input
                    id="search"
                    placeholder="e.g. Hotel booking"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                </div>
                <div className="flex flex-row gap-4 w-full md:w-auto">
                  <div className="space-y-1 text-sm">
                    <Label htmlFor="direction">Direction</Label>
                    <Select value={filterDirection} onValueChange={setFilterDirection}>
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end pt-1">
                    <Button variant="secondary" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </div>

              <TooltipProvider>
                <motion.div
                  className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredTransactions.length ? (
                    filteredTransactions
                      .filter((txn) => !txn.settled)
                      .map((txn) => {
                        const share = (txn.amount / members.length).toFixed(2);
                        const isPayer = txn.paidBy === currentUser;
                        const descriptionText = isPayer
                          ? `You paid ₹${txn.amount} for ${txn.description}, each member owes you ₹${share}`
                          : `${txn.paidBy} paid ₹${txn.amount} for ${txn.description}, you owe ${txn.paidBy} ₹${share}`;
                        return (
                          <motion.div
                            key={txn.id}
                            variants={cardVariants}
                            className="relative rounded-lg border p-4 shadow-lg bg-white text-sm space-y-3 flex flex-col justify-between"
                          >
                            <div className="absolute top-3 right-4 text-xs text-muted-foreground underline cursor-pointer">
                              View details
                            </div>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src="/group-placeholder.jpg" />
                                <AvatarFallback>{txn.party.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="font-semibold text-base flex items-center gap-2 max-w-full pr-20 overflow-hidden">
                                <span className="truncate whitespace-nowrap overflow-hidden">{txn.description}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center">
                              <span
                                className={
                                  txn.direction === "To Pay"
                                    ? "bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium"
                                    : "bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium"
                                }
                              >
                                ₹{isPayer ? (share * (members.length - 1)).toFixed(2) : share}
                              </span>
                              <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
                                {txn.sector}
                              </span>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="text-xs text-muted-foreground truncate flex items-center gap-1 cursor-default">
                                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="truncate">{descriptionText}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{descriptionText}</p>
                              </TooltipContent>
                            </Tooltip>
                            <div className="grid gap-1">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <CalendarDays className="w-4 h-4" />
                                <span className="text-xs">
                                  Created: <strong className="text-foreground">{txn.date}</strong>
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <BadgePercent className="w-4 h-4" />
                                <span className="text-xs">
                                  Due: <strong className="text-foreground">{txn.due}</strong>
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-500"
                                onClick={() => handleDeleteTransaction(txn.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })
                  ) : (
                    <div className="col-span-full text-center text-muted-foreground text-sm">
                      No outstanding transactions.
                    </div>
                  )}
                </motion.div>
              </TooltipProvider>
            </CardContent>
          </Card>
        </motion.section>

        {/* MEMBERS PAY VS RECEIVE AND ANALYTICS */}
        <div className="xl:col-span-1 space-y-8 h-full">
          {/* MEMBERS PAY VS RECEIVE */}
          <motion.section variants={cardVariants}>
            <Card className="bg-white shadow-lg border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Member Balances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-600">Member</TableHead>
                      <TableHead className="text-gray-600">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => {
                      if (member.name === currentUser) return null;
                      const balance = balances[member.name];
                      return (
                        <motion.tr
                          key={member.id}
                          variants={rowVariants}
                          className="hover:bg-gray-100"
                        >
                          <TableCell className="font-medium text-gray-800 flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={member.profilePic} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {member.name}
                          </TableCell>
                          <TableCell
                            className={`font-medium ${balance >= 0 ? "text-green-600" : "text-red-500"}`}
                          >
                            {balance >= 0 ? `${member.name} owes you ₹${balance.toFixed(2)}` : `You owe ${member.name} ₹${(-balance).toFixed(2)}`}
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.section>

          {/* ANALYTICS */}
          {/* <motion.section variants={cardVariants}>
            <Card className="bg-white shadow-lg border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Spending Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <CharBarChart data={analytics} className="w-full" /> */}
              {/* </CardContent>
            </Card>
          </motion.section> */} 
        </div>
      </div>

      {/* ALL TRANSACTIONS */}
      <motion.section variants={cardVariants} className="mt-8">
        <Card className="bg-white shadow-lg border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">All Group Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead className="text-gray-600">Description</TableHead>
                    <TableHead className="text-gray-600">Date</TableHead>
                    <TableHead className="text-gray-600">Amount</TableHead>
                    <TableHead className="text-gray-600">Paid By</TableHead>
                    <TableHead className="text-gray-600">Split Type</TableHead>
                    <TableHead className="text-gray-600">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((txn) => (
                    <React.Fragment key={txn.id}>
                      <motion.tr variants={rowVariants} className="hover:bg-gray-100">
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => toggleRow(txn.id)}>
                            {expandedRows.includes(txn.id) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium text-gray-800 truncate max-w-xs">
                          {txn.description}
                        </TableCell>
                        <TableCell className="text-gray-500">{txn.date}</TableCell>
                        <TableCell className="font-medium text-emerald-600">
                          ₹{txn.amount}
                        </TableCell>
                        <TableCell className="text-gray-500">{txn.paidBy}</TableCell>
                        <TableCell className="text-gray-500">{txn.split}</TableCell>
                        <TableCell className="px-2">
                          {txn.settled ? (
                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs font-medium">
                              Settled
                            </span>
                          ) : (
                            <div className="flex gap-2 justify-between">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => console.log(`Action: Settle transaction ${txn.id}`)}
                              >
                                Settle Up <ArrowRightLeft className="w-4 h-4 ml-1" />
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
                      {expandedRows.includes(txn.id) && (
                        <tr>
                          <td colSpan={7}>
                            <div className="p-4 bg-gray-50">
                              <h4 className="font-semibold text-gray-800">Transaction Details</h4>
                              <p><strong>Paid By:</strong> {txn.paidBy} (₹{txn.amount})</p>
                              <p><strong>Split Type:</strong> {txn.split}</p>
                              <h5 className="font-semibold mt-2 text-gray-800">Member Shares:</h5>
                              <ul className="list-disc pl-5">
                                {members.map((member) => (
                                  <li key={member.id}>
                                    {member.name}: ₹{(txn.amount / members.length).toFixed(2)}
                                  </li>
                                ))}
                              </ul>
                              <h5 className="font-semibold mt-2 text-gray-800">Owed Amounts:</h5>
                              <ul className="list-disc pl-5">
                                {members
                                  .filter((member) => member.name !== txn.paidBy)
                                  .map((member) => (
                                    <li key={member.id}>
                                      {member.name} owes {txn.paidBy} ₹{(txn.amount / members.length).toFixed(2)}
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
            </motion.div>
          </CardContent>
          <CardFooter className="flex justify-end pt-4">
            {/* <GroupHistory group={name} /> */}
          </CardFooter>
        </Card>
      </motion.section>
    </motion.div>
  );
}