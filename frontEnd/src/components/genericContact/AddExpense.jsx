"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
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
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Plus } from "lucide-react"
import { format, addWeeks } from "date-fns"
import { cn } from "@/lib/utils"

// DatePicker Component
const DatePicker = ({ value, onChange, disabled }) => {
  const [open, setOpen] = useState(false)

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
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
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

const AddExpense = () => {
  const [splitType, setSplitType] = useState("absolute")
  const [splitValue, setSplitValue] = useState("")
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState(addWeeks(new Date(), 1))
  const [errors, setErrors] = useState({})

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
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            Add Expense <Plus className="w-4 h-4 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[90vw] sm:max-w-[480px]   bg-white rounded-xl shadow-xl border border-gray-100">
          <div className="overflow-y-scroll mt-4 px-2 max-h-[80vh] " > 
            <DialogTitle className="text-xl font-semibold text-gray-800">Add New Expense</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
                Fill in the details and share the expense with the contact.
            </DialogDescription>
          <div className="grid gap-4 pt-2 flex-col">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Dinner at Café"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={cn(
                  "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 w-full",
                  errors.title && "border-red-500"
                )}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description (Optional)
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
                They Pay: ₹{theirShare}
              </p>
            </div>

            <div className="grid gap-2">
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
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Add Expense
            </Button>
          </div>
            </div>
         
        </DialogContent>
      </motion.form>
    </Dialog>
  )
}

export default AddExpense