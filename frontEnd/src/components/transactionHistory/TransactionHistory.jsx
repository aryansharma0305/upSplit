"use client"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
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
import { Info, Download } from "lucide-react"
import { motion } from "framer-motion"

// import logo from "@/assets/logo.png"

const data = [
  { id: "1", party: "Riya", direction: "Received", amount: 1000, sector: "Food", settled: "Received", settledDate: "2024-06-22", description: "Dinner at restaurant with friends. Everyone split except Riya." },
  { id: "2", party: "Netflix Group", direction: "Paid", amount: 250, sector: "Entertainment", settled: "Paid", settledDate: "2024-06-20", description: "Monthly Netflix subscription share for June." },
  { id: "3", party: "Rohan", direction: "Paid", amount: 500000, sector: "Travel", settled: "Paid", settledDate: "2024-06-19", description: "Cab ride back from airport. Paid entirely by Rohan." },
  { id: "4", party: "Dinner Split", direction: "Received", amount: 600, sector: "Food", settled: "Received", settledDate: "2024-06-25", description: "Home delivery for group dinner. Aryan paid the full amount." },
  { id: "5", party: "Aman", direction: "Paid", amount: 750, sector: "Shopping", settled: "Paid", settledDate: "2024-06-18", description: "Group gift purchase at mall." },
  { id: "6", party: "Priya", direction: "Received", amount: 300, sector: "Utilities", settled: "Received", settledDate: "2024-06-15", description: "Electricity bill split for June." },
  { id: "7", party: "Team Lunch", direction: "Paid", amount: 450, sector: "Food", settled: "Paid", settledDate: "2024-06-17", description: "Corporate lunch bill shared." },
  { id: "8", party: "Gym Subscription", direction: "Received", amount: 1200, sector: "Health", settled: "Received", settledDate: "2024-06-21", description: "Monthly gym membership split." },
  { id: "9", party: "Book Club", direction: "Paid", amount: 200, sector: "Entertainment", settled: "Paid", settledDate: "2024-06-16", description: "Monthly book club membership fee." },
  { id: "10", party: "Road Trip", direction: "Received", amount: 900, sector: "Travel", settled: "Received", settledDate: "2024-06-23", description: "Fuel and toll expenses for group road trip." },
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

  const handleExportPDF = () => {
    // const image = new Image()
    // image.src = logo

    // image.onload = () => {
      const doc = new jsPDF()
    //   doc.addImage(image, "PNG", 170, 15, 25, 10)
      doc.setFontSize(16)
      doc.text("Transaction History", 14, 20)

      const tableData = filtered.map((item) => [
        item.party,
        item.direction,
        `${item.amount.toLocaleString("en-IN")}`,
        item.sector,
        item.description,
        item.settled,
        item.settledDate,
      ])

      autoTable(doc, {
        head: [["Party", "Direction", "Amount", "Sector", "Description", "Settled As", "Date Settled"]],
        body: tableData,
        startY: 30,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [6, 156, 108] },
      })

      doc.save("transaction-history.pdf")
    
  }

  return (
    <motion.div
      className="p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="mb-5 text-xl font-semibold text-emerald-600">Transaction History</h1>

      <motion.div
        className="flex flex-col md:flex-row gap-4 pb-3 items-end"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end pt-1">
            <Button variant="secondary" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
          <div className="flex items-end pt-1">
            <Button variant="secondary" onClick={handleExportPDF}>
              Export <Download />
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="rounded-md border overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Table className="min-w-[800px]">
          <TableHeader className={"bg-gray-100 dark:bg-gray-800"}>
            <TableRow>
              <TableHead className="w-40">Party</TableHead>
              <TableHead className="w-24">Direction</TableHead>
              <TableHead className="w-24">Amount</TableHead>
              <TableHead className="w-32">Sector</TableHead>
              <TableHead className="w-48">Description</TableHead>
              <TableHead className="w-32">Settled As</TableHead>
              <TableHead className="w-32">Date Settled</TableHead>
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
                  <TableCell>{item.settledDate}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-6 text-center text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  )
}