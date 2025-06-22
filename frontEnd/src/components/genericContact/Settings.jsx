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
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { format, parse } from "date-fns"
import { cn } from "@/lib/utils"
import { Settings2 } from "lucide-react"

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

// TimePicker Component
const TimePicker = ({ value, onChange, disabled }) => {
  const [open, setOpen] = useState(false)

  // Parse current time value or default to 9:00 AM
  const currentTime = value ? parse(value, "h:mm a", new Date()) : new Date(2025, 0, 1, 9, 0)
  const currentHour = format(currentTime, "h")
  const currentMinute = format(currentTime, "mm")
  const currentPeriod = format(currentTime, "a")

  // Generate options
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString())
  const minutes = ["00", "10", "20", "30", "40", "50"]
  const periods = ["AM", "PM"]

  const handleTimeSelect = (part, selectedValue) => {
    let newHour = parseInt(currentHour, 10)
    let newMinute = parseInt(currentMinute, 10)
    let newPeriod = currentPeriod

    if (part === "hour") {
      newHour = parseInt(selectedValue, 10)
    } else if (part === "minute") {
      newMinute = parseInt(selectedValue, 10)
    } else if (part === "period") {
      newPeriod = selectedValue
    }

    // Adjust hour for 12-hour format and AM/PM
    if (newPeriod === "PM" && newHour !== 12) {
      newHour += 12
    } else if (newPeriod === "AM" && newHour === 12) {
      newHour = 0
    } else if (newPeriod === "AM" && newHour !== 12) {
      // No adjustment needed
    } else if (newPeriod === "PM" && newHour === 12) {
      newHour = 12
    }

    const newTime = format(new Date(2025, 0, 1, newHour, newMinute), "h:mm a")
    onChange(newTime)
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
          onClick={() => setOpen(true)}
        >
          {value ? value : <span>Pick a time</span>}
          <ClockIcon className="ml-2 h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="start">
        <div className="flex justify-between gap-2">
          {/* Hours Select */}
          <Select
            value={currentHour}
            onValueChange={(value) => handleTimeSelect("hour", value)}
            disabled={disabled}
          >
            <SelectTrigger className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Minutes Select */}
          <Select
            value={currentMinute}
            onValueChange={(value) => handleTimeSelect("minute", value)}
            disabled={disabled}
          >
            <SelectTrigger className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* AM/PM Select */}
          <Select
            value={currentPeriod}
            onValueChange={(value) => handleTimeSelect("period", value)}
            disabled={disabled}
          >
            <SelectTrigger className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  )
}

const Settings = () => {
  const [notifications, setNotifications] = useState(true)
  const [autoReminders, setAutoReminders] = useState(false)
  const [reminderTime, setReminderTime] = useState("9:00 AM")
  const [reminderFrequency, setReminderFrequency] = useState("Daily")
  const [reminderDate, setReminderDate] = useState(undefined)
  const [notificationType, setNotificationType] = useState("in-app")

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({
      notifications,
      autoReminders,
      reminderTime,
      reminderFrequency,
      reminderDate: reminderDate ? reminderDate.toLocaleDateString() : undefined,
      notificationType,
    })
    // Add logic to save settings (e.g., API call)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
        >
          <Settings2 className="w-4 h-4" />
          Settings
        </Button>
      </DialogTrigger>
      <motion.form
        onSubmit={handleSubmit}
        variants={dialogVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <DialogContent className="sm:max-w-[480px] bg-white rounded-xl shadow-xl border border-gray-100">
            <div className="overflow-y-scroll mt-4 px-2 max-h-[80vh] flex flex-col gap-3">
            <DialogTitle className="text-xl font-semibold text-gray-800">Settings</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Manage preferences for this contact
            </DialogDescription>

          <Card className="border-none bg-white shadow-none ">
            <CardContent className="space-y-8 pt-6">
              {/* Notifications Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Notifications</Label>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                    className="data-[state=checked]:bg-emerald-600"
                    aria-label="Toggle notifications"
                  />
                </div>
                <motion.div
                  className="flex flex-col gap-2 pl-4"
                  animate={{ opacity: notifications ? 1 : 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Label
                    htmlFor="notificationType"
                    className={`text-sm font-medium ${notifications ? "text-gray-700" : "text-gray-400"}`}
                  >
                    Notification Type
                  </Label>
                  <Select
                    value={notificationType}
                    onValueChange={setNotificationType}
                    disabled={!notifications}
                  >
                    <SelectTrigger
                      id="notificationType"
                      className={`border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 ${!notifications ? "bg-gray-100" : ""}`}
                    >
                      <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-app">In-App Only</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="both">In-App + Email</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>

              <Separator className="bg-gray-200" />

              {/* Auto Reminders Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Auto Reminders</Label>
                  <Switch
                    checked={autoReminders}
                    onCheckedChange={setAutoReminders}
                    className="data-[state=checked]:bg-emerald-600"
                    aria-label="Toggle auto reminders"
                  />
                </div>
                <motion.div
                  className="space-y-4 pl-4"
                  animate={{ opacity: autoReminders ? 1 : 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="reminderTime"
                      className={`text-sm font-medium ${autoReminders ? "text-gray-700" : "text-gray-400"}`}
                    >
                      Reminder Time
                    </Label>
                    <TimePicker
                      value={reminderTime}
                      onChange={setReminderTime}
                      disabled={!autoReminders}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="reminderFrequency"
                      className={`text-sm font-medium ${autoReminders ? "text-gray-700" : "text-gray-400"}`}
                    >
                      Reminder Frequency
                    </Label>
                    <Select
                      value={reminderFrequency}
                      onValueChange={setReminderFrequency}
                      disabled={!autoReminders}
                    >
                      <SelectTrigger
                        id="reminderFrequency"
                        className={`border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 ${!autoReminders ? "bg-gray-100" : ""}`}
                      >
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {reminderFrequency === "Custom" && (
                    <motion.div
                      className="flex flex-col gap-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Label
                        htmlFor="reminderDate"
                        className={`text-sm font-medium ${autoReminders ? "text-gray-700" : "text-gray-400"}`}
                      >
                        Custom Reminder Date
                      </Label>
                      <DatePicker
                        value={reminderDate}
                        onChange={setReminderDate}
                        disabled={!autoReminders}
                      />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </CardContent>
          </Card>

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
              Save changes
            </Button>
          </div>
        </DialogContent>
      </motion.form>
    </Dialog>
  )
}

export default Settings