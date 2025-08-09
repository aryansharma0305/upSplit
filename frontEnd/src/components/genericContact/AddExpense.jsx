"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import StateFullButton from "@/components/ui/stateful-button"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Plus } from "lucide-react"
import { format, addWeeks, isBefore, startOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"
import { toast } from "sonner"
import { th } from "date-fns/locale"

// DatePicker Component
const DatePicker = ({ value, onChange, disabled }) => {
  const [open, setOpen] = useState(false)

  const handleDateSelect = (date) => {
    const today = startOfDay(new Date())
    if (date && isBefore(date, today)) {
      toast.error("Due date cannot be in the past", {
        description: "Please select a date on or after today.",
        duration: 4000,
      })
      return
    }
    onChange(date)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between font-normal border-gray-300 focus:ring-emerald-500 focus:border-emerald-500",
            !value && "text-muted-foreground",
            disabled && "bg-gray-100 text-gray-400"
          )}
          disabled={disabled}
        >
          {value ? format(value, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="ml-2 h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleDateSelect}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

const AddExpense = ({contactData}) => {
  const [splitType, setSplitType] = useState("absolute")
  const [splitValue, setSplitValue] = useState("")
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [sector, setSector] = useState("")
  const [dueDate, setDueDate] = useState(addWeeks(new Date(), 1))
  const [errors, setErrors] = useState({})
  const closeButtonRef = useRef(null)

  const validateForm = () => {
    const newErrors = {}
    if (!title.trim()) newErrors.title = "Title is required"
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = "Amount must be greater than 0"
    if (!splitValue || parseFloat(splitValue) < 0) newErrors.splitAmount = "Split amount must be non-negative"
    if (splitType === "percentage") {
      if (parseFloat(splitValue) > 100) newErrors.splitAmount = "Percentage cannot exceed 100"
    } else if (splitType === "absolute" && parseFloat(splitValue) > parseFloat(amount)) {
      newErrors.splitAmount = "Split amount cannot exceed total amount"
    }
    if (!dueDate) newErrors.dueDate = "Due date is required"
    if (!sector) newErrors.sector = "Please select a sector"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handle50Split = () => {
    if (splitType === "percentage") {
      setSplitValue("50")
    } else if (amount && parseFloat(amount) > 0) {
      setSplitValue((parseFloat(amount) / 2).toFixed(2))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const theirShare =
      splitType === "percentage"
        ? (parseFloat(amount) * (100 - parseFloat(splitValue))) / 100
        : parseFloat(amount) - parseFloat(splitValue)

    const formData = {
      title,
      amount: parseFloat(amount),
      description,
      sector,
      splitType,
      yourShare: parseFloat(splitValue),
      theirShare: parseFloat(theirShare.toFixed(2)),
      dueDate: dueDate.toLocaleDateString(),
    }
    console.log(formData)
    // Add logic to save expense (e.g., fetch('/api/expenses', { method: 'POST', body: JSON.stringify(formData) }))
  }

  const theirShare =
    amount && splitValue && !isNaN(parseFloat(amount)) && !isNaN(parseFloat(splitValue))
      ? splitType === "percentage"
        ? ((parseFloat(amount) * (100 - parseFloat(splitValue))) / 100).toFixed(2)
        : (parseFloat(amount) - parseFloat(splitValue)).toFixed(2)
      : "0.00"

  const myshare =
    amount && splitValue && !isNaN(parseFloat(amount)) && !isNaN(parseFloat(splitValue))
      ? splitType === "percentage"
        ? ((parseFloat(amount) * parseFloat(splitValue)) / 100).toFixed(2)
        : parseFloat(splitValue).toFixed(2)
      : "0.00"  

  const handleAddExpenseButtonClick = async() => {
    
    
    fetch(`/api/contacts/addTransaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_other: contactData._id,
        amount: parseFloat(amount),
        dueDate: dueDate.toISOString(),
        description,
        sector,
        share_creator: parseFloat(myshare),
        share_other: parseFloat(theirShare)
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add expense");
      }
      return response.json();
    })
    .then((data) => {
     
      return new Promise((resolve) => {
        setTimeout(() => {
          toast.success("Expense added successfully!")
          confetti({
              particleCount: 100,
              spread: 100,
              origin: { y: 0.85 },
              colors: ['#4ade80', '#22c55e', '#16a34a'],
          });

          setTimeout(() => {
            closeButtonRef.current.click() // Close the dialog
            window.location.reload() // Reload the page to reflect changes
          }, 1000) // Close dialog after 1 second
          
          resolve(true)
        }, 1000) // Simulate a 2-second delay
      })
    })
    .catch((error) => {
      console.error("Error adding expense:", error)
      toast.error("Failed to add expense. Please try again.")
    }
  )
  }

  return (
    <Dialog>
      <motion.form
        onSubmit={handleSubmit}
        variants={dialogVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <DialogTrigger asChild>
          <Button
            variant="default"
            size=""
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            Add Expense <Plus className="w-4 h-4 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] sm:max-w-[480px] bg-white rounded-xl shadow-xl border border-gray-100">
          <div className="overflow-y-scroll mt-4 px-2 max-h-[80vh]">
            <DialogTitle className="text-xl font-semibold text-gray-800">Add New Expense</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Fill in the details and share the expense with the contact.
            </DialogDescription>
            <div className="grid gap-4 pt-2 flex-col">
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="e.g., Shared dinner with friends"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 w-full"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sector" className="text-sm font-medium text-gray-700">
                  Sector
                </Label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger className={cn(
                    "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 w-full",
                    errors.sector && "border-red-500"
                  )}>
                    <SelectValue placeholder="Select a sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sector && <p className="text-sm text-red-500">{errors.sector}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  Amount (₹)
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g., 1200"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={cn(
                    "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 w-full",
                    errors.amount && "border-red-500"
                  )}
                />
                {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-700">Splitting Type</Label>
                <RadioGroup
                  value={splitType}
                  onValueChange={(value) => {
                    setSplitType(value)
                    setSplitValue("")
                  }}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="absolute" id="absolute" />
                    <Label htmlFor="absolute" className="text-sm text-gray-700">
                      Absolute (₹)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percentage" />
                    <Label htmlFor="percentage" className="text-sm text-gray-700">
                      Percentage (%)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="splitAmount" className="text-sm font-medium text-gray-700">
                    You Pay ({splitType === "percentage" ? "%" : "₹"})
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handle50Split}
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    Split 50-50
                  </Button>
                </div>
                <Input
                  id="splitAmount"
                  name="splitAmount"
                  type="number"
                  min="0"
                  max={splitType === "percentage" ? "100" : ""}
                  step={splitType === "percentage" ? "1" : "0.01"}
                  value={splitValue}
                  onChange={(e) => setSplitValue(e.target.value)}
                  placeholder={splitType === "percentage" ? "e.g., 60" : "e.g., 700"}
                  className={cn(
                    "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 w-full",
                    errors.splitAmount && "border-red-500"
                  )}
                />
                {errors.splitAmount && <p className="text-sm text-red-500">{errors.splitAmount}</p>}
                <p className="text-sm text-gray-600">
                  They Pay: ₹{theirShare} <br />
                  You Pay: ₹{myshare}
                </p>
              </div>

              <div className="grid gap-2 mb-5">
                <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                  Due Date
                </Label>
                <DatePicker
                  value={dueDate}
                  onChange={setDueDate}
                  disabled={false}
                />
                {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate}</p>}
              </div>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  ref={closeButtonRef}
                >
                  Cancel
                </Button>
              </DialogClose>
              <StateFullButton 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 mb-5 hover:ring-0 rounded-lg" 
                onClick={handleAddExpenseButtonClick}
              >
                Add Expense
              </StateFullButton>
            </div>
          </div>
        </DialogContent>
      </motion.form>
    </Dialog>
  )
}

export default AddExpense

