"use client"

import React, { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Settings, Mail, Phone, ArrowLeft, ArrowRight, UserPlus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import CharBar from "@/components/genericContact/CharBar"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

// Mock contact data
const contactData = {
  id: "user123",
  name: "Tanish Sharma",
  email: "tanish@example.com",
  phone: "+91 9876543210",
  profilePic: "https://randomuser.me/api/portraits/men/29.jpg",
  sharedGroups: ["Weekend Dinners", "Movie Nights", "Gym Buddies"],
  notes:
    "Always pays on time. Prefers digital payments. Met at the annual trip in March.",
  recentTransactions: [
    { id: "txn1", description: "Paid ₹500 for dinner", date: "2025-06-08", amount: -500, type: "debit" },
    { id: "txn2", description: "Received ₹1000 for groceries", date: "2025-06-05", amount: 1000, type: "credit" },
    { id: "txn3", description: "Paid ₹250 for Netflix", date: "2025-06-03", amount: -250, type: "debit" },
    { id: "txn4", description: "Received ₹700 from Rohan", date: "2025-06-01", amount: 700, type: "credit" },
    { id: "txn5", description: "Paid ₹400 for cab", date: "2025-05-30", amount: -400, type: "debit" },
  ],
  summary: {
    owe: 1200,
    toReceive: 850,
  },
  analytics: [
    { month: "Jan", owe: 186, receive: 80 },
    { month: "Feb", owe: 305, receive: 200 },
    { month: "Mar", owe: 237, receive: 120 },
    { month: "Apr", owe: 73, receive: 190 },
    { month: "May", owe: 209, receive: 130 },
    { month: "Jun", owe: 214, receive: 140 },
  ],
}

export default function GenericContact() {
  const {
    name,
    email,
    phone,
    profilePic,
    sharedGroups,
    notes,
    recentTransactions,
    summary,
    analytics,
  } = contactData

  const [notificationsOn, setNotificationsOn] = useState(true)
  const [remindersOn, setRemindersOn] = useState(false)

  return (
    <div className="w-full min-h-screen px-8 py-10 space-y-12">
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center p-5 gap-4">
          
          <Avatar className="w-20 h-20">
            <AvatarImage src={profilePic} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-emerald-600">{name}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail size={14} /> {email}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Phone size={14} /> {phone}
            </p>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="flex gap-4">
          <Card className="w-44">
            <CardContent className="text-center py-4">
              <p className="text-xs text-muted-foreground uppercase">I Owe</p>
              <p className="text-2xl font-bold text-red-500">₹{summary.owe}</p>
            </CardContent>
          </Card>
          <Card className="w-44">
            <CardContent className="text-center py-4">
              <p className="text-xs text-muted-foreground uppercase">I Will Receive</p>
              <p className="text-2xl font-bold text-green-600">₹{summary.toReceive}</p>
            </CardContent>
          </Card>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <Button variant="outline" size="lg" className="flex items-center gap-1">
            <Settings className="w-4 h-4" /> Settings
          </Button>
          <Button variant="default" size="lg" className="flex items-center gap-1">
            <UserPlus className="w-4 h-4" /> Add Expense
          </Button>
        </div>
      </header>

      {/* GROUPS & NOTES
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shared Groups</CardTitle>
            <CardDescription className="text-muted-foreground">
              Groups you both participate in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {sharedGroups.map((g) => (
              <p key={g} className="flex items-center gap-2">
                • {g}
              </p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription className="text-muted-foreground">
              Private remarks about this contact
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {notes}
          </CardContent>
        </Card>
      </section> */}

      {/* PREFERENCES */}
      {/* <section>
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Contact-specific settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Notifications</span>
              <Switch checked={notificationsOn} onCheckedChange={setNotificationsOn} />
            </div>
            <div className="flex items-center justify-between">
              <span>Auto Reminders</span>
              <Switch checked={remindersOn} onCheckedChange={setRemindersOn} />
            </div>
          </CardContent>
        </Card>
      </section> */}

      {/* TRANSACTIONS TABS */}
      <section>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="debit">To Pay</TabsTrigger>
            <TabsTrigger value="credit">To Receive</TabsTrigger>
          </TabsList>
          {['all', 'debit', 'credit'].map((key) => (
            <TabsContent key={key} value={key} className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 mt-5">
                  {recentTransactions
                    .filter((txn) => key === 'all' || txn.type === key)
                    .slice(0, 5)
                    .map((txn) => (
                      <div key={txn.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium truncate">{txn.description}</p>
                          <p className="text-xs text-muted-foreground">{txn.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className={txn.amount < 0 ? "text-red-500" : "text-green-600"}>
                            ₹{Math.abs(txn.amount)}
                          </p>
                          <Button size="sm" variant="outline">
                            {txn.type === "debit" ? "Settle Up" : "Reminder"}
                          </Button>
                        </div>
                      </div>
                    ))}
                </CardContent>
                <CardFooter className="flex pt-6 justify-end">
                  <Button variant="link" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>


      {/* ANALYTICS GRAPHS */}
      <section className="grid grid-cols-1 w-full lg:grid-cols-2 gap-6">
        <CharBar data={analytics} />
        {/* <ChartBarMultiple /> */}
      </section>
    </div>
  )
}
