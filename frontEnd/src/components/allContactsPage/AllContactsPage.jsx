"use client"

import React, { use, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  User,
  Mail,
  MoreVertical,
  Trash2,
  Edit,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { GlowingEffect } from "../ui/glowing-effect"
import { Nav } from "react-day-picker"

const contactData = [
  {
    id: "1",
    name: "Riya Sharma",
    email: "riya.sharma@example.com",
    phone: "+91 98765 43210",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
    owe: 1500,
    toReceive: 500,
    notes: "Friend from college, shares travel expenses",
  },
  {
    id: "2",
    name: "Aryan Patel",
    email: "aryan.patel@example.com",
    phone: "+91 87654 32109",
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
    owe: 0,
    toReceive: 600,
    notes: "Roommate, handles utility bills",
  },
  {
    id: "3",
    name: "Saanvi Kiran",
    email: "saanvi.kiran@example.com",
    phone: "+91 76543 21098",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
    owe: 250,
    toReceive: 0,
    notes: "Colleague, part of Netflix group",
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
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.06,
    },
  },
}

export default function AllContactsPage() {

  const Navigate = useNavigate()

  const [filterText, setFilterText] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  const resetFilters = () => {
    setFilterText("")
    setFilterStatus("All")
  }

  const filteredData = contactData.filter((contact) => {
    const matchesText = contact.name.toLowerCase().includes(filterText.toLowerCase())
    const matchesStatus = filterStatus !== "All" 
      ? filterStatus === "Owe" 
        ? contact.owe > 0 
        : contact.toReceive > 0 
      : true
    return matchesText && matchesStatus
  })

  return (
    <div className="w-full p-0 pt-4 sm:p-4">
      <div className="flex mb-5 flex-wrap">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          All Contacts
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 pb-3 items-end">
        <div className="space-y-1 w-full text-sm">
          <Label htmlFor="search">Search by Name</Label>
          <Input
            id="search"
            placeholder="e.g. Riya Sharma"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-4 w-full lg:w-auto">
          <div className="space-y-1 text-sm">
            <Label htmlFor="status">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Owe">Owe Money</SelectItem>
                <SelectItem value="To Receive">To Receive</SelectItem>
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
            filteredData.map((contact) => (
              <motion.div
                key={contact.id}
                variants={cardVariants}
                className="relative rounded-lg border p-4 shadow-lg gap-3 bg-white dark:bg-gray-800 text-sm flex flex-col justify-between hover:-translate-y-1 duration-200"
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

                <div className="absolute top-3 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white dark:bg-gray-800">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Contact
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Contact
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={contact.profilePic}
                    alt={contact.name}
                    className="w-8 h-8 rounded-full border"
                  />
                  <div className="font-semibold text-base flex items-center gap-2 max-w-full pr-20 overflow-hidden">
                    <span className="truncate whitespace-nowrap overflow-hidden">{contact.name}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    To Pay: ₹{contact.owe.toLocaleString("en-IN")}
                  </span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    To Receive: ₹{contact.toReceive.toLocaleString("en-IN")}
                  </span>
                </div>
         
                <div className="text-xs text-muted-foreground truncate flex items-center gap-1 cursor-default">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="truncate">{contact.email}</span>
                </div>
                 

                <div className="grid gap-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="text-xs">
                      Phone: <strong className="text-foreground">{contact.phone}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <Button
                    size="sm"
                    className="w-fit bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    onClick={() => {Navigate(`/dashboard/contact/${contact.id}`)}}
                  >
                    View Contact
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground text-sm">
              No contacts found.
            </div>
          )}
        </motion.div>
      </TooltipProvider>
    </div>
  )
}