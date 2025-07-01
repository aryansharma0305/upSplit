
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
    DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus } from "lucide-react";
import { format, addWeeks } from "date-fns";
import { cn } from "@/lib/utils";

// Sample group data (based on GenericGroup structure)
const groupData = {
  id: "group456",
  name: "Weekend Trip",
  members: [
    { id: "user1", name: "TFaisal Siddique", profilePic: "https://randomuser.me/api/portraits/men/30.jpg" },
    { id: "user2", name: "Rohan Sharma", profilePic: "https://randomuser.me/api/portraits/men/31.jpg" },
    { id: "user3", name: "Priya Desai", profilePic: "https://randomuser.me/api/portraits/women/30.jpg" },
  ],
};

// DatePicker Component
const DatePicker = ({ value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);

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
            onChange(date);
            setOpen(false);
          }}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function AddGroupExpense() {
  const [splitType, setSplitType] = useState("absolute");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(addWeeks(new Date(), 1));
  const [sector, setSector] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [memberShares, setMemberShares] = useState(
    groupData.members.reduce((acc, member) => ({
      ...acc,
      [member.name]: { amount: "", paid: false },
    }), {})
  );
  const [errors, setErrors] = useState({});

  // Update memberShares.paid when paidBy changes
  useEffect(() => {
    setMemberShares((prev) =>
      Object.keys(prev).reduce((acc, name) => ({
        ...acc,
        [name]: { ...prev[name], paid: name === paidBy },
      }), {})
    );
  }, [paidBy]);

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!sector) newErrors.sector = "Sector is required";
    if (!paidBy) newErrors.paidBy = "Payer is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";

    const totalShare = Object.values(memberShares).reduce(
      (sum, share) => sum + (parseFloat(share.amount) || 0),
      0
    );
    if (splitType === "absolute" && Math.abs(totalShare - parseFloat(amount)) > 0.01) {
      newErrors.memberShares = "Total member shares must equal the expense amount";
    } else if (splitType === "percentage" && Math.abs(totalShare - 100) > 0.01) {
      newErrors.memberShares = "Total member percentages must equal 100%";
    }

    Object.keys(memberShares).forEach((name) => {
      const share = memberShares[name].amount;
      if (!share || parseFloat(share) < 0) {
        newErrors[`share_${name}`] = `Share for ${name} must be non-negative`;
      } else if (splitType === "percentage" && parseFloat(share) > 100) {
        newErrors[`share_${name}`] = `Percentage for ${name} cannot exceed 100`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSplitEqually = () => {
    const numMembers = groupData.members.length;
    if (splitType === "percentage") {
      const equalShare = (100 / numMembers).toFixed(2);
      setMemberShares(
        groupData.members.reduce((acc, member) => ({
          ...acc,
          [member.name]: { amount: equalShare, paid: member.name === paidBy },
        }), {})
      );
    } else if (amount && parseFloat(amount) > 0) {
      const equalShare = (parseFloat(amount) / numMembers).toFixed(2);
      setMemberShares(
        groupData.members.reduce((acc, member) => ({
          ...acc,
          [member.name]: { amount: equalShare, paid: member.name === paidBy },
        }), {})
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = {
      title,
      amount: parseFloat(amount),
      description,
      splitType,
      paidBy,
      sector,
      dueDate: dueDate.toLocaleDateString(),
      memberShares,
      dateCreated: new Date().toLocaleDateString(),
      settled: false,
      direction: "To Receive",
    };
    console.log(formData);
    // Add logic to save expense (e.g., fetch('/api/group-expenses', { method: 'POST', body: JSON.stringify(formData) }))
  };

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
        <DialogContent className="max-w-[93vw] sm:max-w-[600px] bg-white rounded-lg shadow-xl border p-1 py-7 border-gray-100">
          <div className="overflow-y-scroll mt-4 px-4 max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold ">
                <div className="flex flex-wrap"> 
                   <h1 className=" text-2xl font-semibold  bg-gradient-to-r from-emerald-600  to-teal-600 bg-clip-text text-transparent"> Add an Expense </h1>
                </div>
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Fill in the details and split the expense among group members.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 pt-2 flex-col">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Group Dinner"
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
                  placeholder="e.g., Dinner at Zest with friends"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 w-full"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  Total Amount (₹)
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
                <Label htmlFor="sector" className="text-sm font-medium text-gray-700">
                  Sector
                </Label>
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger
                    id="sector"
                    className={cn(
                      "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 w-full",
                      errors.sector && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select a sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Groceries">Groceries</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
                {errors.sector && <p className="text-sm text-red-500">{errors.sector}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="paidBy" className="text-sm font-medium text-gray-700">
                  Paid By
                </Label>
                <Select value={paidBy} onValueChange={setPaidBy}>
                  <SelectTrigger
                    id="paidBy"
                    className={cn(
                      "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 w-full",
                      errors.paidBy && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select who paid" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupData.members.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paidBy && <p className="text-sm text-red-500">{errors.paidBy}</p>}
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-700">Splitting Type</Label>
                <RadioGroup
                  value={splitType}
                  onValueChange={(value) => {
                    setSplitType(value);
                    setMemberShares(
                      groupData.members.reduce((acc, member) => ({
                        ...acc,
                        [member.name]: { amount: "", paid: member.name === paidBy },
                      }), {})
                    );
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
                  <Label className="text-sm font-medium text-gray-700">
                    Member Shares ({splitType === "percentage" ? "%" : "₹"})
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSplitEqually}
                    className=" "
                  >
                    Split Equally
                  </Button>
                </div>
                {groupData.members.map((member) => (
                  <div key={member.id} className="grid gap-2">
                    <Label htmlFor={`share_${member.name}`} className="text-sm text-gray-600">
                      {member.name}
                    </Label>
                    <Input
                      id={`share_${member.name}`}
                      name={`share_${member.name}`}
                      type="number"
                      min="0"
                      step={splitType === "percentage" ? "1" : "0.01"}
                      value={memberShares[member.name].amount}
                      onChange={(e) =>
                        setMemberShares((prev) => ({
                          ...prev,
                          [member.name]: { ...prev[member.name], amount: e.target.value },
                        }))
                      }
                      placeholder={splitType === "percentage" ? "e.g., 33.33" : "e.g., 400"}
                      className={cn(
                        "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 w-full",
                        errors[`share_${member.name}`] && "border-red-500"
                      )}
                    />
                    {errors[`share_${member.name}`] && (
                      <p className="text-sm text-red-500">{errors[`share_${member.name}`]}</p>
                    )}
                  </div>
                ))}
                {errors.memberShares && (
                  <p className="text-sm text-red-500">{errors.memberShares}</p>
                )}
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

              <DialogFooter className="flex justify-end gap-2 pt-4">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:-translate-y-1 duration-200"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:bg-gradient-to-r hover:-translate-y-1 duration-200 text-white"
                >
                  Add Expense
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </motion.form>
    </Dialog>
  );
}