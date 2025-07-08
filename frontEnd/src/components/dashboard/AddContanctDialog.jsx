"use client"

import { useState, useEffect, useRef } from "react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, UserPlus } from "lucide-react"
import StatefulButton from "@/components/ui/stateful-button"
import confetti from "canvas-confetti"
import { useNavigate } from "react-router-dom"

export function AddContactDialog() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const closeButtonRef = useRef(null)

  const mockUsers = [
  {
    id: 1,
    name: "Tanu Mehra",
    email: "tanu@example.com",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Rishi Patel",
    email: "rishi@example.com",
    profilePic: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: 3,
    name: "Megha Jain",
    email: "megha@example.com",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 4,
    name: "Aryan Sharma",
    email: "aryan.sharma@example.com",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 5,
    name: "Saanvi Kiran",
    email: "saanvi.kiran@example.com",
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: 6,
    name: "Dev Rajput",
    email: "dev.rajput@example.com",
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: 7,
    name: "Isha Kapoor",
    email: "isha.kapoor@example.com",
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: 8,
    name: "Karan Verma",
    email: "karan.verma@example.com",
    profilePic: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    id: 9,
    name: "Neha Das",
    email: "neha.das@example.com",
    profilePic: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    id: 10,
    name: "Yash Malhotra",
    email: "yash.malhotra@example.com",
    profilePic: "https://randomuser.me/api/portraits/men/10.jpg",
  },
]


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filtered = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
    }, 200)
    return () => clearTimeout(delayDebounce)
  }, [query])


  const Navigate=useNavigate();

    const [loadingUserId, setLoadingUserId] = useState(null)

  const handleAdd = (userId) => {
  setLoadingUserId(userId)
  return new Promise((resolve) => {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.85 },
        colors: ['#34D399', '#10B981', '#059669'],
      })
      setTimeout(() => {
        closeButtonRef.current?.click()
        Navigate(`/dashboard/contact/${userId}`)
      }, 500)
      setLoadingUserId(null)
      resolve()
    }, 1000)
  })
}


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2 hover:-translate-y-0.5 transition-all duration-200">
          <PlusCircle className="w-4 h-4" />
          Add Contact
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a new contact</DialogTitle>
          <DialogDescription>
            Search for users by name or email to add them to your contact list.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-1">
            <Label htmlFor="search">Search Users</Label>
            <Input
              id="search"
              placeholder="e.g. Aryan or aryan@upsplit.com"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>




<div className="max-h-64 overflow-y-auto rounded-md border p-2 space-y-2">
  {results.length > 0 ? (
    results.map((user) => (
      <div
        key={user.id}
        className="flex items-center justify-between gap-4 p-2 rounded-md hover:bg-muted transition"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-8 h-8 rounded-full border"
          />
          <div className="truncate">
            <p className="font-medium truncate max-w-[200px]">{user.name}</p>
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">{user.email}</p>
          </div>
        </div>

        <div className="shrink-0">
 <Button
  disabled={loadingUserId === user.id}
  onClick={() => handleAdd(user.id)}
  className="whitespace-nowrap min-w-[90px] px-3 py-1 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm transition-all duration-200"
>
  {loadingUserId === user.id ? "Adding..." : "Add"}
</Button>


        </div>
      </div>
    ))
  ) : (
    <p className="text-sm text-muted-foreground">No users found.</p>
  )}
</div>








        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button ref={closeButtonRef} variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
