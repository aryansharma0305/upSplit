import React from "react"
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
    description: "Message from Riya",
    content: "“Hey! Are you joining the meeting today at 4?”",
    time: "2 minutes ago",
  },
  {
    id: 2,
    title: "System Alert",
    description: "Password Expiry",
    content: "Your password will expire in 3 days. Please update it.",
    time: "1 hour ago",
  },
  {
    id: 3,
    title: "Task Reminder",
    description: "UI Design Review",
    content: "Finish and submit your UI Design Review by 5 PM.",
    time: "8 hours ago",
  },
]

const NotificationPage = () => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-emerald-600" size={28} strokeWidth={2} />
        <h1 className="text-3xl font-semibold text-emerald-700">All Notifications</h1>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => (
          <Card key={n.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{n.title}</CardTitle>
                  <CardDescription>{n.description}</CardDescription>
                </div>
                <span className="text-xs text-gray-500">{n.time}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p>{n.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default NotificationPage
