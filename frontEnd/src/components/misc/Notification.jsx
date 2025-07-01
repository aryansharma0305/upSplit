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


const notifications = [
  {
    id: 1,
    title: "New Message",
    description: "You received a new message from Riya.",
    content: "“Hey! Are you joining the meeting today at 4?”",
    time: "2 minutes ago",
    new: true,
    pfp: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    title: "System Alert",
    description: "Your password will expire in 3 days.",
    content: "Please update your password to maintain account security.",
    time: "1 hour ago",
    new: true,
    pfp: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    title: "Task Reminder",
    description: "You have a deadline tomorrow.",
    content: "Finish and submit your UI Design Review by 5 PM.",
    time: "8 hours ago",
    new: false,
    pfp: "https://randomuser.me/api/portraits/men/3.jpg"
  }
]

const Notification = (props) => {
  return (
    <Sheet className={props.className} >
      <SheetTrigger asChild>
        <div className='p-2 rounded-lg hover:bg-gray-100 shadow-md  mx-5 md:mx-10'>
          <Bell strokeWidth={1.4} absoluteStrokeWidth />
        </div>
      </SheetTrigger>
      <SheetContent >
        <SheetHeader>
          <SheetTitle className='font-bold text-2xl text-emerald-600 flex items-center gap-2'>
            <Bell strokeWidth={2.4} size={25} absoluteStrokeWidth /> Notifications
          </SheetTitle>
          
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-4 px-3 mt-4 h-full pb-7 overflow-y-auto">
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.new?"shadow-lg border border-emerald-600" :"shadow-lg border border-gray-300 "}>
              <CardHeader className="flex flex-row items-center gap-3">
                  <img
                    src={notification.pfp}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-base">{notification.title}</CardTitle>
                    <CardDescription className="text-sm">{notification.description}</CardDescription>
                  </div>
              </CardHeader>

              <CardContent className="text-sm py-2 text-muted-foreground">
                {notification.content}
              </CardContent>
             
              <CardFooter className="text-xs text-muted-foreground">
                {notification.time}
              </CardFooter>
            </Card>
          ))}
        </div>

        <SheetFooter className="mt-6">

            <Button variant="outline">View All</Button>
          <SheetClose asChild>

            <Button variant="default">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default Notification
