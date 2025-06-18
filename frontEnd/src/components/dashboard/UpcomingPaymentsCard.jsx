import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const UpcomingPaymentsTable = () => {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Due Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Jun 20</TableCell>
            <TableCell>Netflix Group Bill</TableCell>
            <TableCell className="text-right text-destructive">₹400</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jun 22</TableCell>
            <TableCell>Dinner Split with Riya</TableCell>
            <TableCell className="text-right text-destructive">₹750</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jun 25</TableCell>
            <TableCell>Office Snacks Split</TableCell>
            <TableCell className="text-right text-destructive">₹150</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default UpcomingPaymentsTable
