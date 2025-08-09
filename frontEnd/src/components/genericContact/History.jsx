// "use client"

// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
// import { Info, Download } from "lucide-react"
// import React, { useState } from "react"
// import jsPDF from "jspdf"
// import autoTable from "jspdf-autotable"
// import logo from "/logo.png"









// // Transaction data with added dateCreated and dateDue
// const data = [
//   { id: "1", party: "Rohan", direction: "Received", amount: 1000, sector: "Food", settled: "Received", settledDate: "2024-06-22", dateCreated: "2024-06-20", dateDue: "2024-06-25", description: "Dinner at restaurant with friends. Everyone split except Riya." },
//   { id: "2", party: "Rohan", direction: "Paid", amount: 250, sector: "Entertainment", settled: "Paid", settledDate: "2024-06-20", dateCreated: "2024-06-18", dateDue: "2024-06-22", description: "Monthly Netflix subscription share for June." },
//   { id: "3", party: "Rohan", direction: "Paid", amount: 500000, sector: "Travel", settled: "Paid", settledDate: "2024-06-19", dateCreated: "2024-06-17", dateDue: "2024-06-20", description: "Cab ride back from airport. Paid entirely by Rohan." },
//   { id: "4", party: "Rohan", direction: "Received", amount: 600, sector: "Food", settled: "Received", settledDate: "2024-06-25", dateCreated: "2024-06-23", dateDue: "2024-06-26", description: "Home delivery for group dinner. Aryan paid the full amount." },
//   { id: "5", party: "Rohan", direction: "Paid", amount: 750, sector: "Shopping", settled: "Paid", settledDate: "2024-06-18", dateCreated: "2024-06-16", dateDue: "2024-06-19", description: "Group gift purchase at mall." },
//   { id: "6", party: "Rohan", direction: "Received", amount: 300, sector: "Utilities", settled: "Received", settledDate: "2024-06-15", dateCreated: "2024-06-13", dateDue: "2024-06-16", description: "Electricity bill split for June." },
//   { id: "7", party: "Rohan", direction: "Paid", amount: 450, sector: "Food", settled: "Paid", settledDate: "2024-06-17", dateCreated: "2024-06-15", dateDue: "2024-06-18", description: "Corporate lunch bill shared." },
//   { id: "8", party: "Rohan", direction: "Received", amount: 1200, sector: "Health", settled: "Received", settledDate: "2024-06-21", dateCreated: "2024-06-19", dateDue: "2024-06-22", description: "Monthly gym membership split." },
//   { id: "9", party: "Rohan", direction: "Paid", amount: 200, sector: "Entertainment", settled: "Paid", settledDate: "2024-06-16", dateCreated: "2024-06-14", dateDue: "2024-06-17", description: "Monthly book club membership fee." },
//   { id: "10", party: "Rohan", direction: "Received", amount: 900, sector: "Travel", settled: "Received", settledDate: "2024-06-23", dateCreated: "2024-06-21", dateDue: "2024-06-24", description: "Fuel and toll expenses for group road trip." },
//   { id: "11", party: "Rohan", direction: "Paid", amount: 400, sector: "Travel", settled: "Paid", settledDate: "2024-06-24", dateCreated: "2024-06-22", dateDue: "2024-06-25", description: "Taxi fare for airport pickup." },
//   { id: "12", party: "Rohan", direction: "Received", amount: 800, sector: "Food", settled: "Received", settledDate: "2024-06-26", dateCreated: "2024-06-24", dateDue: "2024-06-27", description: "Group dinner at restaurant." },
//   { id: "13", party: "Rohan", direction: "Paid", amount: 600, sector: "Utilities", settled: "Paid", settledDate: "2024-06-28", dateCreated: "2024-06-26", dateDue: "2024-06-29", description: "Internet bill for June." },
//   { id: "14", party: "Rohan", direction: "Received", amount: 1000, sector: "Shopping", settled: "Received", settledDate: "2024-06-30", dateCreated: "2024-06-28", dateDue: "2024-07-01", description: "Refund for returned item." },
//   { id: "15", party: "Rohan", direction: "Paid", amount: 300, sector: "Entertainment", settled: "Paid", settledDate: "2024-07-02", dateCreated: "2024-06-30", dateDue: "2024-07-03", description: "Movie tickets for weekend." },
//   { id: "16", party: "Rohan", direction: "Received", amount: 500, sector: "Health", settled: "Received", settledDate: "2024-07-04", dateCreated: "2024-07-02", dateDue: "2024-07-05", description: "Health insurance claim reimbursement." },
// ]

// export function History({ user }) {
//   const [searchText, setSearchText] = useState("")
//   const [filterDirection, setFilterDirection] = useState("All")
//   const [filterSector, setFilterSector] = useState("All")

//   // Get unique sectors for filter
//   const uniqueSectors = [...new Set(data.map(item => item.sector))]

//   // Reset filters and search
//   const resetFilters = () => {
//     setSearchText("")
//     setFilterDirection("All")
//     setFilterSector("All")
//   }

//   // Filter transactions for the specified user and apply search/filters
//   const filteredTransactions = data
//     .filter(item => item.party === user)
//     .filter(item => {
//       const matchSearch = item.description.toLowerCase().includes(searchText.toLowerCase())
//       const matchDirection = filterDirection === "All" || item.direction === filterDirection
//       const matchSector = filterSector === "All" || item.sector === filterSector
//       return matchSearch && matchDirection && matchSector
//     })

//   const handleExportPDF = () => {
//     const doc = new jsPDF()
//     doc.setFontSize(16)
//     doc.text(`Transaction History for ${user}`, 14, 20)

//     const pageWidth = doc.internal.pageSize.getWidth()
//     doc.addImage(logo, "PNG", pageWidth - 40, 10, 25, 10)
    
    
//     const tableData = filteredTransactions.map((item) => [
//       item.direction,
//       `₹${item.amount.toLocaleString("en-IN")}`,
//       item.sector,
//       item.description,
//       item.settled,
//       item.dateCreated,
//       item.dateDue,
//       item.settledDate,
//     ])

//     autoTable(doc, {
//       head: [["Direction", "Amount", "Sector", "Description", "Settled As", "Date Created", "Date Due", "Date Settled"]],
//       body: tableData,
//       startY: 30,
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [6, 156, 108] },
//     })

//     doc.save(`transaction-history-${user.toLowerCase()}.pdf`)
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="link" className="px-2 underline hover:cursor-pointer hover:-translate-y-0.5 duration-75 hover:text-emerald-700">Past Transactions</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[900px] px-3">
//         <div className="overflow-y-scroll max-h-[80vh] flex flex-col gap-4 mt-6 px-4">
//           <DialogTitle>Transaction History for {user}</DialogTitle>
//           <DialogDescription>
//             View all transactions associated with {user}.
//           </DialogDescription>
//           <div className="flex flex-col md:flex-row gap-4 items-end">
//             <div className="space-y-1 w-full text-sm">
//               <Label htmlFor="search">Search by Description</Label>
//               <Input
//                 id="search"
//                 placeholder="e.g. Dinner"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
//               />
//             </div>
//             <div className="flex flex-wrap sm:flex-nowrap flex-row gap-4 w-full md:w-auto">
//               <div className="space-y-1 text-sm">
//                 <Label htmlFor="direction">Direction</Label>
//                 <Select value={filterDirection} onValueChange={setFilterDirection}>
//                   <SelectTrigger id="direction" className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500">
//                     <SelectValue placeholder="All Directions" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="All">All</SelectItem>
//                     <SelectItem value="Paid">Paid</SelectItem>
//                     <SelectItem value="Received">Received</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-1 text-sm">
//                 <Label htmlFor="sector">Sector</Label>
//                 <Select value={filterSector} onValueChange={setFilterSector}>
//                   <SelectTrigger id="sector" className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500">
//                     <SelectValue placeholder="All Sectors" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="All">All</SelectItem>
//                     {uniqueSectors.map(sector => (
//                       <SelectItem key={sector} value={sector}>{sector}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-end pt-1">
//                 <Button
//                   variant="outline"
//                   onClick={resetFilters}
//                   className="border-gray-300 text-gray-700 hover:bg-gray-100"
//                 >
//                   Reset Filters
//                 </Button>
//               </div>
//             </div>
//           </div>
//           <div className="grid gap-4">
//             <div className="rounded-md border overflow-x-auto">
//               <Table className="min-w-[800px]">
//                 <TableHeader className="bg-gray-100 dark:bg-gray-800">
//                   <TableRow>
//                     <TableHead className="w-24">Direction</TableHead>
//                     <TableHead className="w-24">Amount</TableHead>
//                     <TableHead className="w-32">Sector</TableHead>
//                     <TableHead className="w-48">Description</TableHead>
//                     <TableHead className="w-32">Settled As</TableHead>
//                     <TableHead className="w-32">Date Created</TableHead>
//                     <TableHead className="w-32">Date Due</TableHead>
//                     <TableHead className="w-32">Date Settled</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredTransactions.length ? (
//                     filteredTransactions.map((item) => (
//                       <TableRow key={item.id}>
//                         <TableCell>{item.direction}</TableCell>
//                         <TableCell>₹{item.amount.toLocaleString("en-IN")}</TableCell>
//                         <TableCell>{item.sector}</TableCell>
//                         <TableCell>
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <div className="truncate max-w-[150px] text-xs text-muted-foreground flex items-center gap-1">
//                                 <Info className="w-4 h-4" />
//                                 {item.description}
//                               </div>
//                             </TooltipTrigger>
//                             <TooltipContent>
//                               <p>{item.description}</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </TableCell>
//                         <TableCell>{item.settled}</TableCell>
//                         <TableCell>{item.dateCreated}</TableCell>
//                         <TableCell>{item.dateDue}</TableCell>
//                         <TableCell>{item.settledDate}</TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
//                         No transactions found for {user}.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>

//               <Pagination>
//         <PaginationContent>
//           <PaginationItem>
//             <PaginationPrevious href="#" />
//           </PaginationItem>
//           <PaginationItem>
//             <PaginationLink href="#">1</PaginationLink>
//           </PaginationItem>
//           <PaginationItem>
//             <PaginationLink href="#" isActive>
//               2
//             </PaginationLink>
//           </PaginationItem>
//           <PaginationItem>
//             <PaginationLink href="#">3</PaginationLink>
//           </PaginationItem>
//           <PaginationItem>
//             <PaginationEllipsis />
//           </PaginationItem>
//           <PaginationItem>
//             <PaginationNext href="#" />
//           </PaginationItem>
//         </PaginationContent>
//       </Pagination>


//           </div>
            
//           <div className="flex justify-end gap-2">
//             <DialogClose asChild>
//               <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
//                 Close
//               </Button>
//             </DialogClose>
//             <Button
//               variant="outline"
//               onClick={handleExportPDF}
//               className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1"
//             >
//               <Download className="w-4 h-4" />
//               Export PDF
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }











"use client";

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Download } from "lucide-react";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "/logo.png";

export function History({ user, contactId }) {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterDirection, setFilterDirection] = useState("All");
  const [filterSector, setFilterSector] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/contacts/getAllTransactionsWithUser?q=${contactId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        console.log("Fetched all transactions:", data); // Debug log
        setTransactions(
          data.map((txn) => ({
            id: txn._id,
            party: user,
            direction: txn.id_creator.toString() === contactId ? "Received" : "Paid",
            amount: parseFloat(txn.amount || 0),
            sector: txn.sector,
            settled: txn.status.charAt(0).toUpperCase() + txn.status.slice(1), // Capitalize status
            settledDate: txn.dateSettled ? new Date(txn.dateSettled).toLocaleDateString("en-IN") : "-",
            dateCreated: new Date(txn.dateCreated).toLocaleDateString("en-IN"),
            dateDue: new Date(txn.dueDate).toLocaleDateString("en-IN"),
            description: txn.description,
          }))
        );
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [contactId, user]);

  // Get unique sectors for filter
  const uniqueSectors = [...new Set(transactions.map((item) => item.sector))];

  // Reset filters and search
  const resetFilters = () => {
    setSearchText("");
    setFilterDirection("All");
    setFilterSector("All");
    setCurrentPage(1);
  };

  // Filter transactions
  const filteredTransactions = transactions
    .filter((item) => item.party === user)
    .filter((item) => {
      const matchSearch = item.description.toLowerCase().includes(searchText.toLowerCase());
      const matchDirection = filterDirection === "All" || item.direction === filterDirection;
      const matchSector = filterSector === "All" || item.sector === filterSector;
      return matchSearch && matchDirection && matchSector;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Transaction History for ${user}`, 14, 20);

    const pageWidth = doc.internal.pageSize.getWidth();
    doc.addImage(logo, "PNG", pageWidth - 40, 10, 25, 10);

    const tableData = filteredTransactions.map((item) => [
      item.direction,
      `₹${item.amount.toLocaleString("en-IN")}`,
      item.sector,
      item.description,
      item.settled,
      item.dateCreated,
      item.dateDue,
      item.settledDate,
    ]);

    autoTable(doc, {
      head: [["Direction", "Amount", "Sector", "Description", "Settled As", "Date Created", "Date Due", "Date Settled"]],
      body: tableData,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [6, 156, 108] },
    });

    doc.save(`transaction-history-${user.toLowerCase()}.pdf`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="px-2 underline hover:cursor-pointer hover:-translate-y-0.5 duration-75 hover:text-emerald-700"
        >
          Past Transactions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] px-3">
        <div className="overflow-y-scroll max-h-[80vh] flex flex-col gap-4 mt-6 px-4">
          <DialogTitle>Transaction History for {user}</DialogTitle>
          <DialogDescription>
            View all transactions associated with {user}.
          </DialogDescription>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-1 w-full text-sm">
              <Label htmlFor="search">Search by Description</Label>
              <Input
                id="search"
                placeholder="e.g. Dinner"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-wrap sm:flex-nowrap flex-row gap-4 w-full md:w-auto">
              <div className="space-y-1 text-sm">
                <Label htmlFor="direction">Direction</Label>
                <Select value={filterDirection} onValueChange={setFilterDirection}>
                  <SelectTrigger
                    id="direction"
                    className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                  >
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
                  <SelectTrigger
                    id="sector"
                    className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {uniqueSectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end pt-1">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-gray-100 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="w-24">Direction</TableHead>
                    <TableHead className="w-24">Amount</TableHead>
                    <TableHead className="w-32">Sector</TableHead>
                    <TableHead className="w-48">Description</TableHead>
                    <TableHead className="w-32">Settled As</TableHead>
                    <TableHead className="w-32">Date Created</TableHead>
                    <TableHead className="w-32">Date Due</TableHead>
                    <TableHead className="w-32">Date Settled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.length ? (
                    paginatedTransactions.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.direction}</TableCell>
                        <TableCell>₹{item.amount.toLocaleString("en-IN")}</TableCell>
                        <TableCell>{item.sector}</TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="truncate max-w-[150px] text-xs text-muted-foreground flex items-center gap-1">
                               
                                {item.description}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{item.settled}</TableCell>
                        <TableCell>{item.dateCreated}</TableCell>
                        <TableCell>{item.dateDue}</TableCell>
                        <TableCell>{item.settledDate}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="py-6 text-center text-muted-foreground">
                        No transactions found for {user}.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index + 1}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {totalPages > 5 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                Close
              </Button>
            </DialogClose>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}