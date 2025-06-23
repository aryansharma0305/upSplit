import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import logo from "/logo.png"




export const handleExportPDF = (filtered) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Add logo
    doc.addImage(logo, "PNG", pageWidth - 40, 10, 25, 10)


    // Report title
    doc.setFontSize(20)
    doc.setTextColor(6, 156, 108) // emerald-600
    doc.text("Transaction History", 14, 30)

    // User name
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text("Prepared for: Tanish Sharma", 14, 40)

    // Date and time
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    const time = new Date()
    doc.text(`Generated on: ${time} `, 14, 48)



    // Table
    const tableData = filtered.map((item) => [
      item.party,
      item.direction,
      item.amount,
      item.sector,
      item.description,
      item.settled,
      item.dateCreated || "N/A",
      item.dueDate || "N/A",
      item.settledDate,
    ])

    autoTable(doc, {
      head: [["Party", "Direction", "Amount", "Sector", "Description", "Settled As", "Date Created", "Due Date", "Date Settled"]],
      body: tableData,
      startY: 55,
      styles: { fontSize: 8, cellPadding: 1, overflow: "linebreak" },
      headStyles: { fillColor: [6, 156, 108], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 90, left: 14, right: 14 },
      columnStyles: {
        2: { cellWidth: 20 }, // Fixed width for Amount column to prevent uneven spacing
        4: { cellWidth: 40 }, // Wider Description column for better text wrapping
      },
      didDrawPage: (data) => {
        // Footer
        doc.setFontSize(8)
        doc.setTextColor(100, 100, 100)
        const pageCount = doc.internal.getNumberOfPages()
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth - 30, pageHeight - 10)
        doc.text("UpSplit - Confidential", 14, pageHeight - 10)
      },
    })

    doc.save("transaction-history.pdf")
  }
