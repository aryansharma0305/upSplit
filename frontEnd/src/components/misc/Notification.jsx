import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

import { Bell } from "lucide-react"
import { SidebarSeparator } from '../ui/sidebar'

const Notification = () => {
  return (
   <>
    <Sheet>
      <SheetTrigger asChild>
        {/* <Button variant="outline">Open</Button> */}
        {/* <h1>hell</h1> */}
        <div className='p-2 rounded-lg hover:bg-gray-100 shadow-md'> 
        <Bell strokeWidth={1.4} absoluteStrokeWidth />
        </div>

      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          
          <SheetTitle className='font-bold text-2xl text-emerald-600 flex items-center gap-2' > <Bell strokeWidth={2.4} size={25} absoluteStrokeWidth /> Notifications</SheetTitle>
          <SheetDescription className='text-sm text-gray-500 px-2 mt-2'> <hr></hr></SheetDescription>

        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          
        {/* Make Cards Here!! */}

        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="default">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
   </>
  )
}

export default Notification