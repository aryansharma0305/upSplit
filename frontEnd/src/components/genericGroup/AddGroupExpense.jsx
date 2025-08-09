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
import confetti from "canvas-confetti";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import StatefulButton from "@/components/ui/stateful-button";
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
import { CalendarIcon, Plus, RefreshCw } from "lucide-react";
import { format, addWeeks } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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

export default function AddGroupExpense({ memberList, onExpenseAdded, currentUser, groupId }) {
  const [splitType, setSplitType] = useState("absolute");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(addWeeks(new Date(), 1));
  const [sector, setSector] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [memberShares, setMemberShares] = useState(
    memberList.reduce((acc, member) => ({
      ...acc,
      [member.id]: { amount: "", paid: false },
    }), {})
  );
  const [errors, setErrors] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Map currentUser name to user ID
  const currentUserId = memberList.find((member) => member.name === currentUser)?.id || "";

  // Update memberShares.paid when paidBy changes
  useEffect(() => {
    setMemberShares((prev) =>
      Object.keys(prev).reduce((acc, id) => ({
        ...acc,
        [id]: { ...prev[id], paid: id === paidBy },
      }), {})
    );
  }, [paidBy]);

  // Calculate total shares and remaining balance
  const totalShare = Object.values(memberShares).reduce(
    (sum, share) => sum + (parseFloat(share.amount) || 0),
    0
  ).toFixed(2);
  const totalAmount = parseFloat(amount) || 0;
  const remainingBalance = splitType === "percentage"
    ? (100 - totalShare).toFixed(2)
    : (totalAmount - totalShare).toFixed(2);
  const isShareValid = splitType === "percentage"
    ? Math.abs(totalShare - 100) < 0.01
    : Math.abs(totalShare - totalAmount) <= 1;

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!sector) newErrors.sector = "Sector is required";
    if (!paidBy) newErrors.paidBy = "Payer is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";

    if (!isShareValid) {
      newErrors.memberShares = splitType === "percentage"
        ? "Total member percentages must equal 100%"
        : "Total member shares must be within ₹1 of the expense amount";
    }

    Object.keys(memberShares).forEach((id) => {
      const share = memberShares[id].amount;
      const memberName = memberList.find((m) => m.id === id)?.name || id;
      if (!share || parseFloat(share) < 0) {
        newErrors[`share_${id}`] = `Share for ${memberName} must be non-negative`;
      } else if (splitType === "percentage" && parseFloat(share) > 100) {
        newErrors[`share_${id}`] = `Percentage for ${memberName} cannot exceed 100`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSplitEqually = () => {
    const numMembers = memberList.length;
    if (!amount || parseFloat(amount) <= 0) return;

    if (splitType === "percentage") {
      const equalShare = (100 / numMembers).toFixed(2);
      setMemberShares(
        memberList.reduce((acc, member) => ({
          ...acc,
          [member.id]: { amount: equalShare, paid: member.id === paidBy },
        }), {})
      );
    } else {
      const equalShare = (parseFloat(amount) / numMembers).toFixed(2);
      setMemberShares(
        memberList.reduce((acc, member) => ({
          ...acc,
          [member.id]: { amount: equalShare, paid: member.id === paidBy },
        }), {})
      );
    }
  };

  const handleResetShares = () => {
    setMemberShares(
      memberList.reduce((acc, member) => ({
        ...acc,
        [member.id]: { amount: "", paid: member.id === paidBy },
      }), {})
    );
  };

  const handleDistributeRemaining = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const lastMember = memberList[memberList.length - 1].id;
    const currentShares = { ...memberShares };
    const currentTotal = parseFloat(totalShare);

    if (splitType === "percentage") {
      const newShare = (parseFloat(currentShares[lastMember].amount) || 0) + parseFloat(remainingBalance);
      currentShares[lastMember].amount = newShare.toFixed(2);
    } else {
      const newShare = (parseFloat(currentShares[lastMember].amount) || 0) + parseFloat(remainingBalance);
      currentShares[lastMember].amount = newShare.toFixed(2);
    }

    setMemberShares(currentShares);
  };

  const handleShareChange = (id, value) => {
    const sanitizedValue = value && !isNaN(value) && parseFloat(value) >= 0 ? parseFloat(value).toFixed(2) : "";
    setMemberShares((prev) => ({
      ...prev,
      [id]: { ...prev[id], amount: sanitizedValue },
    }));
  };

  const handleShareKeyPress = (e, id) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleDistributeRemaining();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Map memberShares to use IDs for API, prepare name-based version for GenericGroup
    const apiMemberShares = { ...memberShares };
    const displayMemberShares = {};
    memberList.forEach((member) => {
      displayMemberShares[member.name] = apiMemberShares[member.id] || { amount: "0.00", paid: false };
    });

    const paidByName = memberList.find((m) => m.id === paidBy)?.name;
    if (!paidByName) {
      setErrors({ paidBy: "Invalid payer selected" });
      return;
    }

    const formData = {
      groupId,
      title,
      amount: parseFloat(amount).toFixed(2),
      description,
      split: splitType,
      paidBy,
      sector,
      due: dueDate.toISOString(),
      memberShares: apiMemberShares,
      direction: paidBy === currentUserId ? "To Receive" : "To Pay",
      party: memberList.map((m) => m.name).join(", "),
    };

    try {

      console.log("Submitting form data:", formData);
      const response = await fetch("/api/groups/addExpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create expense");
      }

      const data = await response.json();
      console.log("Expense created successfully:", data);

      // Notify parent component with name-based memberShares
      onExpenseAdded({
        id: data._id || `txn${Date.now()}`,
        description: title,
        date: data.date || new Date().toISOString(),
        amount: parseFloat(formData.amount),
        paidBy: paidByName,
        split: splitType,
        settled: data.settled || false,
        direction: formData.direction,
        party: formData.party,
        sector,
        due: formData.due,
        memberShares: displayMemberShares,
      });

      // Trigger confetti and close dialog
      return new Promise((resolve) => {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.85 },
            colors: ["#34D399", "#10B981", "#059669"],
          });
          setTimeout(() => {
            setIsDialogOpen(false);
            resolve();
          }, 500);
        }, 1000);
      });
    } catch (error) {
      console.error("Error creating expense:", error.message);
      setErrors({ submit: error.message || "Failed to create expense. Please try again." });
    }
  };

  const CloseButtonRef = React.useRef(null);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            Add Expense <Plus className="w-4 h-4 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[93vw] sm:max-w-[600px] bg-white rounded-lg shadow-xl border p-1 py-7 border-gray-100">
          <div className="overflow-y-scroll mt-4 px-4 max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                <div className="flex flex-wrap">
                  <h1 className="text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Add an Expense
                  </h1>
                </div>
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Fill in the details and split the expense among group members. Press Enter in a share field to distribute the remaining balance.
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
                    {memberList.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
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
                    handleResetShares();
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
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSplitEqually}
                      disabled={!amount || parseFloat(amount) <= 0}
                      className="cursor-pointer"
                    >
                      Split Equally
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDistributeRemaining}
                      disabled={!amount || parseFloat(amount) <= 0 || isShareValid}
                      className="cursor-pointer"
                    >
                      Distribute Remaining
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleResetShares}
                      className="cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
                {memberList.map((member) => (
                  <div key={member.id} className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`share_${member.id}`} className="text-sm text-gray-600">
                        {member.name}
                      </Label>
                      {memberShares[member.id].amount && !errors[`share_${member.id}`] && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      )}
                    </div>
                    <Input
                      id={`share_${member.id}`}
                      name={`share_${member.id}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={memberShares[member.id].amount}
                      onChange={(e) => handleShareChange(member.id, e.target.value)}
                      onKeyPress={(e) => handleShareKeyPress(e, member.id)}
                      placeholder={splitType === "percentage" ? `e.g., ${(100 / memberList.length).toFixed(2)}` : `e.g., ${(totalAmount / memberList.length).toFixed(2)}`}
                      className={cn(
                        "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 w-full",
                        errors[`share_${member.id}`] && "border-red-500"
                      )}
                    />
                    {errors[`share_${member.id}`] && (
                      <p className="text-sm text-red-500">{errors[`share_${member.id}`]}</p>
                    )}
                  </div>
                ))}
                {errors.memberShares && (
                  <p className="text-sm text-red-500">{errors.memberShares}</p>
                )}
              </div>

              <Card className="border-gray-200">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Total {splitType === "percentage" ? "Percentage" : "Amount"}:
                    </span>
                    <span className={cn(
                      "text-sm font-medium",
                      isShareValid ? "text-emerald-600" : "text-red-500"
                    )}>
                      {totalShare} {splitType === "percentage" ? "%" : "₹"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium text-gray-700">
                      Remaining {splitType === "percentage" ? "Percentage" : "Amount"}:
                    </span>
                    <span className={cn(
                      "text-sm font-medium",
                      isShareValid || Math.abs(remainingBalance) <= 1 ? "text-gray-700" : "text-red-500"
                    )}>
                      {remainingBalance} {splitType === "percentage" ? "%" : "₹"}
                    </span>
                  </div>
                  {!isShareValid && Math.abs(remainingBalance) > 1 && (
                    <div className="flex items-center mt-2 text-red-500">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {splitType === "percentage"
                          ? "Percentages must sum to 100%"
                          : "Shares must be within ₹1 of the total amount"}
                      </span>
                    </div>
                  )}
                  {Math.abs(remainingBalance) <= 1 && !isShareValid && splitType !== "percentage" && (
                    <div className="flex items-center mt-2 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        Remaining amount is within ₹1, which is acceptable
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

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

              {errors.submit && (
                <p className="text-sm text-red-500 text-center">{errors.submit}</p>
              )}

              <DialogFooter className="flex justify-end gap-2 pt-4">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    ref={CloseButtonRef}
                    className="cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-100 hover:-translate-y-1 duration-200"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <StatefulButton
                  onClick={handleSubmit}
                  disabled={!isShareValid && Math.abs(remainingBalance) > 1}
                  className="cursor-pointer bg-gradient-to-r from-emerald-600 p-1 px-3 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:bg-gradient-to-r hover:-translate-y-1 duration-200 text-white hover:ring-0 rounded-lg"
                >
                  Add Expense
                </StatefulButton>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </motion.form>
    </Dialog>
  );
}