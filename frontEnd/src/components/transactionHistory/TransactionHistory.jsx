"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Download, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { handleExportPDF } from "./handleExportPdf"
import { Separator } from "../ui/separator"

// Transaction data (dueDate and dateCreated assumed to be added)
const data = [
  { id: "1", party: "Riya", direction: "Received", amount: 1000, sector: "Food", settled: "Received", settledDate: "2024-06-22", description: "Dinner at restaurant with friends. Everyone split except Riya.", dateCreated: "2024-06-20", dueDate: "2024-06-25" },
  { id: "2", party: "Netflix Group", direction: "Paid", amount: 250, sector: "Entertainment", settled: "Paid", settledDate: "2024-06-20", description: "Monthly Netflix subscription share for June.", dateCreated: "2024-06-18", dueDate: "2024-06-22" },
  { id: "3", party: "Rohan", direction: "Paid", amount: 500000, sector: "Travel", settled: "Paid", settledDate: "2024-06-19", description: "Cab ride back from airport. Paid entirely by Rohan.", dateCreated: "2024-06-17", dueDate: "2024-06-20" },
  { id: "4", party: "Dinner Split", direction: "Received", amount: 600, sector: "Food", settled: "Received", settledDate: "2024-06-25", description: "Home delivery for group dinner. Aryan paid the full amount.", dateCreated: "2024-06-23", dueDate: "2024-06-26" },
  { id: "5", party: "Aman", direction: "Paid", amount: 750, sector: "Shopping", settled: "Paid", settledDate: "2024-06-18", description: "Group gift purchase at mall.", dateCreated: "2024-06-16", dueDate: "2024-06-19" },
  { id: "6", party: "Priya", direction: "Received", amount: 300, sector: "Utilities", settled: "Received", settledDate: "2024-06-15", description: "Electricity bill split for June.", dateCreated: "2024-06-13", dueDate: "2024-06-16" },
  { id: "7", party: "Team Lunch", direction: "Paid", amount: 450, sector: "Food", settled: "Paid", settledDate: "2024-06-17", description: "Corporate lunch bill shared.", dateCreated: "2024-06-15", dueDate: "2024-06-18" },
  { id: "8", party: "Gym Subscription", direction: "Received", amount: 1200, sector: "Health", settled: "Received", settledDate: "2024-06-21", description: "Monthly gym membership split.", dateCreated: "2024-06-19", dueDate: "2024-06-22" },
  { id: "9", party: "Book Club", direction: "Paid", amount: 200, sector: "Entertainment", settled: "Paid", settledDate: "2024-06-16", description: "Monthly book club membership fee.", dateCreated: "2024-06-14", dueDate: "2024-06-17" },
  { id: "10", party: "Road Trip", direction: "Received", amount: 900, sector: "Travel", settled: "Received", settledDate: "2024-06-23", description: "Fuel and toll expenses for group road trip.", dateCreated: "2024-06-21", dueDate: "2024-06-24" },
]

export default function TransactionHistoryTable() {
  const [filterText, setFilterText] = useState("")
  const [filterDirection, setFilterDirection] = useState("All")
  const [filterSector, setFilterSector] = useState("All")

  const resetFilters = () => {
    setFilterText("")
    setFilterDirection("All")
    setFilterSector("All")
  }

   const filtered = data.filter((item) => {
    const matchName = item.party.toLowerCase().includes(filterText.toLowerCase())
    const matchDir = filterDirection === "All" || item.direction === filterDirection
    const matchSec = filterSector === "All" || item.sector === filterSector
    return matchName && matchDir && matchSec
  })



  return (
    <div className="w-full px-4 p-4 ">
    {/* <motion.div
      className="p-4 w-full" 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      
    > */}
      <div className="flex flex-wrap justify-between">
      <h1 className="mb-5 text-2xl font-semibold  bg-gradient-to-r from-emerald-600  to-teal-600 bg-clip-text text-transparent">Transaction History</h1>
      </div>
      <motion.div
        className="flex flex-col md:flex-row gap-4 pb-3 items-end "
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

        <div className="flex flex-wrap sm:flex-nowrap flex-row gap-4 w-full md:w-auto">
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
          <div className="flex items-end pt-3">
            <Button variant="outline" onClick={()=>(handleExportPDF(filtered))} className="flex items-center gap-2">
              Export PDF <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="rounded-md border  overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Table className="w-full min-w-[600px]">
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            <TableRow>
              <TableHead className="w-36">Party</TableHead>
              <TableHead className="w-24">Direction</TableHead>
              <TableHead className="w-24">Amount</TableHead>
              <TableHead className="w-28">Sector</TableHead>
              <TableHead className="w-44">Description</TableHead>
              <TableHead className="w-28">Settled As</TableHead>
              <TableHead className="w-32">Date Created</TableHead>
              <TableHead className="w-28">Due Date</TableHead>
              <TableHead className="w-28">Date Settled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.party}</TableCell>
                  <TableCell>{item.direction}</TableCell>
                  <TableCell>₹{item.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell>{item.sector}</TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="truncate max-w-[150px] text-xs text-muted-foreground flex items-center gap-1">
                          <Info className="w-4 h-4" />
                          {item.description}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{item.settled}</TableCell>
                  <TableCell>{item.dateCreated || "N/A"}</TableCell>
                  <TableCell>{item.dueDate || "N/A"}</TableCell>
                  <TableCell>{item.settledDate}</TableCell>
                 
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="py-6 text-center text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        


          
      </motion.div>
    {/* </motion.div> */}
      

        <Pagination className={'mt-10  '}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" >
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>


    </div>
  )
}