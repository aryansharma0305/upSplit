import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Bell } from "lucide-react"

// 🔔 Sample notification data
const notifications = [
  {
    id: 1,
    title: "New Message",
    description: "You received a new message from Riya.",
    time: "2 minutes ago",
    new: true, // Example of a new notification
  },
  {
    id: 2,
    title: "System Alert",
    description: "Your password will expire in 3 days.",
    time: "1 hour ago",
    new: false, // Example of a read notification
  },
  {
    id: 3,
    title: "Task Reminder",
    description: "You have a deadline tomorrow.",
    time: "8 hours ago",
    new: false, // Example of a read notification
  },
]

const Notification = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className='p-2 rounded-lg hover:bg-gray-100 shadow-md'>
          <Bell strokeWidth={1.4} absoluteStrokeWidth />
        </div>
      </SheetTrigger>
      <SheetContent >
        <SheetHeader>
          <SheetTitle className='font-bold text-2xl text-emerald-600 flex items-center gap-2'>
            <Bell strokeWidth={2.4} size={25} absoluteStrokeWidth /> Notifications
          </SheetTitle>
          
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-4 px-3 mt-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.new?"shadow-lg border border-emerald-600" :"shadow-lg border border-gray-300 "}>
              <CardHeader>
                <CardTitle>{notification.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm py-2 text-muted-foreground">
                {notification.description}
              </CardContent>
             
              <CardFooter className="text-xs text-muted-foreground">
                {notification.time}
              </CardFooter>
            </Card>
          ))}
        </div>

        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="default">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default Notification
