"use client";

import React, { useState, useEffect } from "react";
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
import { AlarmClock, ArrowRightLeft, Delete, Mail, Phone, Trash2 } from "lucide-react";
import { DeleteContact } from "./DeleteContact";
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const mockData = {
  _id: "...",
  name: "...",
  email: "...",
  phone: "...",
  upiID: "Not Set",
  profilePic: "/default-avatar.png",
  sharedGroups: ["Weekend Dinners", "Movie Nights", "Gym Buddies"],
  notes: "Always pays on time. Prefers digital payments. Met at the annual trip in March.",
  recentTransactions: [],
  summary: {
    owe: 0,
    toReceive: 0,
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
  const [contactData, setContactData] = useState(mockData);
  const Navigate = useNavigate();

  useEffect(() => {
    const ID = window.location.pathname.split("/").pop();

    const isContact = async (ID_con) => {
      try {
        const response = await fetch(`/api/contacts/isContact?q=${ID_con}`);
        if (!response.ok) {
          console.error("Failed to check contact status:", response.statusText);
          Navigate("/dashboard/404");
          return;
        }
        const data = await response.json();
        if (!data.isContact) {
          console.log("User is not a contact");
          Navigate("/dashboard/404");
        }
      } catch (error) {
        console.error("Error checking contact:", error);
        Navigate("/dashboard/404");
      }
    };

    const fetchContactData = async () => {
      try {
        const response = await fetch(`/api/users/getuser/${ID}`);
        if (!response.ok) {
          Navigate("/dashboard/404");
          return;
        }
        const data = await response.json();
        setContactData((prev) => ({
          ...prev,
          _id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phoneNumber || "...",
          upiID: data.upi || "Not Set",
          profilePic: data.photoURL || "/default-avatar.png",
        }));
        await isContact(data._id);

     
        const transactionsResponse = await fetch(`/api/contacts/getTransactionWithUser?q=${data._id}`);
        if (!transactionsResponse.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const transactions = await transactionsResponse.json();
        console.log("Fetched transactions:", transactions); 

        
        const mappedTransactions = transactions.map((txn) => {
          const isContactCreator = txn.id_creator.toString() === data._id;
          return {
            id: txn._id,
            description: txn.description,
            date: new Date(txn.dateCreated).toLocaleDateString("en-IN"),
            dueDate: new Date(txn.dueDate).toLocaleDateString("en-IN"),
            totalAmount: parseFloat(txn.amount || 0),
            oweStatus: isContactCreator
              ? `You owe them ₹${parseFloat(txn.share_other || 0).toFixed(2)}`
              : `They owe you ₹${parseFloat(txn.share_other || 0).toFixed(2)}`,
            type: isContactCreator ? "credit" : "debit",
            settled: txn.status === "settled",
            sector: txn.sector,
          };
        });

        const summary = transactions.reduce(
          (acc, txn) => {
            if (txn.status !== "settled") {
              if (txn.id_creator.toString() === data._id) {
               
                acc.owe += parseFloat(txn.share_other || 0);
              } else {
               
                acc.toReceive += parseFloat(txn.share_other || 0);
              }
            }
            return acc;
          },
          { owe: 0, toReceive: 0 }
        );
        console.log("Calculated summary:", summary); 

        setContactData((prev) => ({
          ...prev,
          recentTransactions: mappedTransactions,
          summary,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load contact data. Please try again.");
      }
    };

    fetchContactData();
  }, [Navigate]);

  const handleAddTransaction = (newTransaction, theirShare) => {
    const theirShareValue = parseFloat(theirShare);
    const myShareValue = parseFloat(newTransaction.amount);
    const isContactCreator = newTransaction.type === "credit"; 
    console.log("New transaction:", { newTransaction, theirShareValue, myShareValue, isContactCreator });

    setContactData((prev) => ({
      ...prev,
      recentTransactions: [{
        ...newTransaction,
        totalAmount: theirShareValue + myShareValue,
        oweStatus: isContactCreator
          ? `You owe them ₹${theirShareValue.toFixed(2)}`
          : `They owe you ₹${theirShareValue.toFixed(2)}`,
      }, ...prev.recentTransactions],
      summary: {
        owe: newTransaction.type === "credit"
          ? prev.summary.owe + theirShareValue
          : prev.summary.owe,
        toReceive: newTransaction.type === "debit"
          ? prev.summary.toReceive + theirShareValue
          : prev.summary.toReceive,
      },
    }));
  };

  const { name, email, phone, profilePic, recentTransactions, summary, analytics, upiID } = contactData;

  return (
    <motion.div
      className="w-full min-h-screen pt-4 sm:p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={cardVariants}>
        <div className="p-[1.5px] rounded-[12px] bg-gradient-to-br from-gray-600 to-slate-500 mb-6 shadow-lg">
          <Card className="bg-white dark:bg-gray-800 rounded-lg p-6 border-none">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 flex-wrap">
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
              <div className="grid grid-cols-2 gap-4 w-full xl:w-auto">
                <div className="p-[1.5px] rounded-[12px] bg-gradient-to-r from-pink-400 via-pink-600 to-red-600">
                  <Card className="border-none shadow-none rounded-lg bg-white dark:bg-gray-800 w-full min-w-36">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-red-600 uppercase font-medium">To Pay</p>
                      <p className="text-xl font-bold text-red-600 mt-1">₹{summary.owe.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="p-[1.5px] rounded-[12px] bg-gradient-to-r from-green-500 via-teal-600 to-emerald-700">
                  <Card className="border-none shadow-none rounded-lg bg-white dark:bg-gray-800 w-full min-w-36">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-emerald-600 uppercase font-medium">To Receive</p>
                      <p className="text-xl font-bold text-emerald-600 mt-1">₹{summary.toReceive.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex gap-2 items-center justify-center xl:justify-end w-full xl:w-auto">
                <DeleteContact contactID={contactData._id} />
                <Settings />
                <AddExpense contactData={contactData} onAddTransaction={handleAddTransaction} />
              </div>
            </div>
          </Card>
        </div>
      </motion.header>

      <div className="px-0">
        <motion.section variants={cardVariants}>
          <Card className="bg-white px-0 shadow-none border-none">
            <CardHeader className="px-0 mb-2 sm:px-4">
              <CardTitle className="text-xl px-0 font-semibold text-emerald-600 mb">
                <div className="flex flex-wrap text-center">
                  <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Pending Transactions</h1>
                </div>
              </CardTitle>
            </CardHeader>
            <Tabs defaultValue="all" className="w-full px-0">
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
                <TabsContent key={key} value={key} className="sm:px-4 px-0">
                  <CardContent className="px-0 overflow-hidden border-1 shadow-lg mt-3 rounded-lg">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                      <Table className="rounded-none shadow-lg">
                        <TableHeader className="bg-gray-50 hover:bg-gray-100">
                          <TableRow>
                            <TableHead className="text-gray-600">Description</TableHead>
                            <TableHead className="text-gray-600">Date Created</TableHead>
                            <TableHead className="text-gray-600">Due Date</TableHead>
                            <TableHead className="text-gray-600">Total Amount</TableHead>
                            <TableHead className="text-gray-600">You Owe/They Owe</TableHead>
                            <TableHead className="text-gray-600">Sector</TableHead>
                            <TableHead className="text-gray-600">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="rounded-xl">
                          {recentTransactions
                            .filter((txn) => key === 'all' || txn.type === key)
                            .length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                                  No pending transactions
                                </TableCell>
                              </TableRow>
                            ) : (
                              recentTransactions
                                .filter((txn) => key === 'all' || txn.type === key)
                                .map((txn) => (
                                  <motion.tr
                                    key={txn.id}
                                    variants={rowVariants}
                                    className="hover:bg-gray-100"
                                  >
                                    <TableCell className="font-medium text-gray-800 truncate max-w-[200px]">
                                      {txn.description}
                                    </TableCell>
                                    <TableCell className="text-gray-500">{txn.date}</TableCell>
                                    <TableCell className="text-gray-500">{txn.dueDate}</TableCell>
                                    <TableCell className="font-medium text-gray-800">
                                      ₹{txn.totalAmount.toFixed(2)}
                                    </TableCell>
                                    <TableCell className={`font-medium ${txn.type === "debit" ? "text-green-600" : "text-red-500"}`}>
                                      {txn.oweStatus}
                                    </TableCell>
                                    <TableCell className="text-gray-500">{txn.sector}</TableCell>
                                    <TableCell className="px-2">
                                      <div className="flex items-center gap-2 justify-between pr-10">
                                        {txn.type === "credit" ? (
                                          <SettleUp txn={txn} upiID={contactData.upiID} />
                                        ) : (
                                          <AreYouSureSendReminder txn={txn} />
                                        )}
                                        <AreYouSureDelete txn={txn} />
                                      </div>
                                    </TableCell>
                                  </motion.tr>
                                ))
                            )}
                        </TableBody>
                      </Table>
                    </motion.div>
                    <CardFooter className="flex justify-start gap-2 pb-2 px-1">
                      <History user={name} contactId={contactData._id} />
                    </CardFooter>
                  </CardContent>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </motion.section>

        {/* <motion.section variants={cardVariants} className="mt-6 mb-24 pb-2">
          <Card className="bg-white sm:mx-4 p-0 border-none shadow-none">
            <CardHeader className="px-2 mb-3">
              <CardTitle className="text-xl font-semibold text-emerald-600">
                <div className="flex flex-wrap text-center">
                  <h1 className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Monthly Analytics</h1>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <CharBar data={analytics} className="w-full" />
            </CardContent>
          </Card>
        </motion.section> */}
      </div>
    </motion.div>
  );
}