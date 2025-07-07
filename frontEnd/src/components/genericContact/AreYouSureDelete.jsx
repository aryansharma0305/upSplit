import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ArrowRightLeft, AlarmClock } from "lucide-react"
import { useRef } from "react"

import StateFullButton from "@/components/ui/stateful-button"
import { Trash2 } from "lucide-react";

export function AreYouSureDelete({txn}) {

  const cancelButtonRef = useRef(null);


  const handleContinue = () => {
    return new Promise((resolve) => {
    
      setTimeout(() => {
        resolve();
        cancelButtonRef.current.click(); 
      }, 1000); 
    
    });
  };




  return (
    <AlertDialog>
      
      
      <AlertDialogTrigger asChild>  
        <Button variant={"outline"} className="border-red-600 text-red-600">

        <Trash2 className="w-4 h-4" />
        
        </Button>
      </AlertDialogTrigger>


      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you  sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will DELETE the transaction of <strong>  INR {Math.abs(txn.amount)}</strong>  which is currently pending.
            <br />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelButtonRef} >Cancel</AlertDialogCancel>

         <StateFullButton size="p-10" className=" p-0 hover:-translate-y-1 duration-200 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 mb-0 hover:ring-0 rounded-lg" onClick={handleContinue}>Confirm </StateFullButton>
          
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
