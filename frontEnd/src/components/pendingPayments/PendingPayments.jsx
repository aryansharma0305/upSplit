"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
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
  BadgePercent,
  CalendarDays,
  Landmark,
  ArrowRightLeft,
  AlarmCheck,
  Info,
  Trash2,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

const data = [
  {
    id: "1",
    party: "Riya",
    direction: "To Receive",
    amount: 1000,
    created: "2024-06-16",
    due: "2024-06-22",
    sector: "Food",
    description: "Dinner at restaurant with friends. Everyone split except Riya.",
  },
  {
    id: "2",
    party: "Netflix Group",
    direction: "To Pay",
    amount: 250,
    created: "2024-06-14",
    due: "2024-06-20",
    sector: "Entertainment",
    description: "Monthly Netflix subscription share for June.",
  },
  {
    id: "3",
    party: "Rohan",
    direction: "To Pay",
    amount: 500,
    created: "2024-06-13",
    due: "2024-06-19",
    sector: "Travel",
    description: "Cab ride back from airport. Paid entirely by Rohan.",
  },
  {
    id: "4",
    party: "Dinner Split",
    direction: "To Receive",
    amount: 600,
    created: "2024-06-10",
    due: "2024-06-25",
    sector: "Food",
    description: "Home delivery for group dinner. Aryan paid the full amount.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration:0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function PaymentCardList() {
  const [filterText, setFilterText] = useState("")
  const [filterDirection, setFilterDirection] = useState("All")
  const [filterSector, setFilterSector] = useState("All")

  const resetFilters = () => {
    setFilterText("")
    setFilterDirection("All")
    setFilterSector("All")
  }

  const filteredData = data.filter((row) => {
    const matchesText = row.party.toLowerCase().includes(filterText.toLowerCase())
    const matchesDirection = filterDirection !== "All" ? row.direction === filterDirection : true
    const matchesSector = filterSector !== "All" ? row.sector === filterSector : true
    return matchesText && matchesDirection && matchesSector
  })

  return (
    <div className="w-full px-4 p-4">

          <h1 className="mb-5 text-xl font-semibold text-emerald-600">Pending Payments</h1>

      <div className="flex flex-col md:flex-row gap-4 pb-3 items-end">
        <div className="space-y-1 w-full text-sm">
          <Label htmlFor="search">Search by Name</Label>
          <Input
            id="search"
            placeholder="e.g. Riya"
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
          {filteredData.length ? (
            filteredData.map((item) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className="relative rounded-lg border p-4 shadow-lg bg-white text-sm space-y-3 flex flex-col justify-between"
              >
                <div className="absolute top-3 right-4 text-xs text-muted-foreground underline cursor-pointer">
                  View details
                </div>

                <div className="font-semibold text-base flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-muted-foreground" />
                  {item.party}
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <span
                    className={
                      item.direction === "To Pay"
                        ? "bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium"
                        : "bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium"
                    }
                  >
                    ₹{item.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="bg-muted px-2 py-0.5 rounded-full text-xs font-medium">
                    {item.sector}
                  </span>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs text-muted-foreground truncate flex items-center gap-1 cursor-default">
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="truncate">{item.description}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.description}</p>
                  </TooltipContent>
                </Tooltip>

                <div className="grid gap-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />
                    <span className="text-xs">
                      Created: <strong className="text-foreground">{item.created}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BadgePercent className="w-4 h-4" />
                    <span className="text-xs">
                      Due: <strong className="text-foreground">{item.due}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <Button size="sm" className="w-fit">
                    {item.direction === "To Pay" ? (
                      <>
                        Settle Up <ArrowRightLeft className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Send Reminder <AlarmCheck className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>

                  <Button size="icon" variant="ghost" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground text-sm">
              No results found.
            </div>
          )}
        </motion.div>
      </TooltipProvider>
    </div>
  )
}