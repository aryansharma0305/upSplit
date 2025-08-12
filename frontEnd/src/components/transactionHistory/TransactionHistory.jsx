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

import React, { useState, useEffect } from "react"
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

export default function TransactionHistoryTable() {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterText, setFilterText] = useState("")
  const [filterDirection, setFilterDirection] = useState("All")
  const [filterSector, setFilterSector] = useState("All")

  useEffect(() => {
    setCurrentPage(1)
  }, [filterText, filterDirection, filterSector])

  useEffect(() => {
    const fetchData = async () => {
      const dir = filterDirection === "All" ? "" : filterDirection
      const sec = filterSector === "All" ? "" : filterSector
      const response = await fetch(
        `/api/transactions/getTransactionHistory?page=${currentPage}&search=${encodeURIComponent(filterText)}&direction=${dir}&sector=${sec}`
      )
      if (response.ok) {
        const json = await response.json()
        setData(json.transactions)
        setTotalPages(json.totalPages)
      } else {
        console.error("Failed to fetch transaction history")
      }
    }
    fetchData()
  }, [currentPage, filterText, filterDirection, filterSector])

  const resetFilters = () => {
    setFilterText("")
    setFilterDirection("All")
    setFilterSector("All")
  }

  const handleExport = async () => {
    const dir = filterDirection === "All" ? "" : filterDirection
    const sec = filterSector === "All" ? "" : filterSector
    const response = await fetch(
      `/api/transactions/getTransactionHistory?page=1&limit=0&search=${encodeURIComponent(filterText)}&direction=${dir}&sector=${sec}`
    )
    if (response.ok) {
      const json = await response.json()
      handleExportPDF(json.transactions)
    } else {
      console.error("Failed to fetch all transactions for export")
    }
  }

  return (
    <div className="w-full p-0 pt-4 sm:p-4">
      <div className="flex flex-wrap justify-between">
        <h1 className="mb-5 text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Transaction History
        </h1>
      </div>
      <motion.div
        className="flex flex-col lg:flex-row gap-4 pb-3 items-end"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.2 }}
      >
          <div className="flex items-end pt-3">
            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              Export PDF <Download className="w-4 h-4" />
            </Button>
        </div>
      </motion.div>

      <motion.div
        className="rounded-md border overflow-x-auto"
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
            {data.length ? (
              data.map((item) => (
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

      <Pagination className="mt-10">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) setCurrentPage(currentPage - 1)
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage(p)
                }}
                isActive={currentPage === p}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) setCurrentPage(currentPage + 1)
              }}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}