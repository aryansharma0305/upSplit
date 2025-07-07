"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MovingBorder } from "../ui/moving-border"
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
import { GlowingEffect } from "../ui/glowing-effect"
import { SettleUpPending } from "./SettupUpPending"
import { AreYouSureSendRemind } from "./AreYouSureSendRemind"

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
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "2",
    party: "Netflix Group skjfsd fksdbfkhdskf jsdkbfklsdflsdfkb",
    direction: "To Pay",
    amount: 250,
    created: "2024-06-14",
    due: "2024-06-20",
    sector: "Entertainment",
    description: "Monthly Netflix subscription share for June.",
    profilePic: "https://randomuser.me/api/portraits/lego/3.jpg",
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
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
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
    profilePic: "https://randomuser.me/api/portraits/lego/6.jpg",
  },
]





const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.06,
    },
  },
};









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
    <div className="w-full p-0 pt-4 sm:p-4">
      <div className="flex mb-5 flex-wrap">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Pending Payments
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 pb-3 items-end">
       
        <div className="space-y-1 w-full text-sm">
          <Label htmlFor="search">Search by Name</Label>
          <Input
            id="search"
            placeholder="e.g. Riya"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <div className="flex flex-row gap-4 w-full lg:w-auto">
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
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredData.length ? (
            filteredData.map((item) => (
                <motion.div
                key={item.id}
                variants={cardVariants}
                className="relative rounded-lg border  p-4 shadow-lg gap-3  bg-white text-sm flex flex-col justify-between hover:-translate-y-1 duration-200 "
                >
                
                <GlowingEffect 
                    blur={0.5}
                    borderWidth={1.5}
                    spread={100}
                    glow={true}
                    disabled={false}
                    proximity={20}
                    inactiveZone={0}
                    className="z-0"
                />

                {/* <div className="absolute top-3 right-4 text-xs text-muted-foreground underline cursor-pointer">
                  View details
                </div> */}

                <div className="flex items-center gap-3">
                  <img
                    src={item.profilePic}
                    alt={item.party}
                    className="w-8 h-8 rounded-full border"
                  />
                 <div className="font-semibold text-base flex items-center gap-2 max-w-full pr-20 overflow-hidden">
                  <span className="truncate whitespace-nowrap overflow-hidden ">{item.party}</span>
                </div>
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
                    <div className="text-xs text-muted-foreground truncate flex items-center gap-1 cursor-default ">
                      <Info className="w-3.5 h-3.5 text-muted-foreground " />
                      <span className="truncate">{item.description}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className={"bg-gradient-to-r from-emerald-600  to-teal-600 text-white font-semibold"}>
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
                    {item.direction === "To Pay" ? (
                      <SettleUpPending txn={item}/>
                    ) : (
                      <AreYouSureSendRemind txn={item} />
                    )}
                 
                  <Button size="icon" variant="ghost" className="text-red-500 cursor-pointer">
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
