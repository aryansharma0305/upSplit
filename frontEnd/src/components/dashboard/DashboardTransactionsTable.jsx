import React from 'react'

import {
  Table,
  TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    } from "@/components/ui/table"

const DashboardTransactionsTable = () => {
  return (
      <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Jun 16</TableCell>
                <TableCell>You paid Rohan</TableCell>
                <TableCell className="text-right text-destructive">₹250</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jun 15</TableCell>
                <TableCell>Riya paid You</TableCell>
                <TableCell className="text-right text-emerald-600">₹1,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jun 14</TableCell>
                <TableCell>You paid Netflix Group</TableCell>
                <TableCell className="text-right text-destructive">₹200</TableCell>
              </TableRow>
            
              <TableRow>
                <TableCell>Jun 13</TableCell>
                <TableCell>You paid Rohan</TableCell>
                <TableCell className="text-right text-destructive">₹250</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jun 12</TableCell>
                <TableCell>Riya paid You</TableCell>
                <TableCell className="text-right  text-emerald-600">₹1,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jun 11</TableCell>
                <TableCell>You paid Netflix Group</TableCell>
                <TableCell className="text-right text-destructive">₹200</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
  )
}

export default DashboardTransactionsTable