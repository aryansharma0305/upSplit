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

export function AreYouSureSendReminder({txn}) {
  return (
    <AlertDialog>
      
      
      <AlertDialogTrigger asChild>  
        <Button
        size="sm"
        variant="outline"
        onClick={() => console.log(`Action: ${txn.type === "debit" ? "Settle Up" : "Send Reminder"} for ${txn.id}`)}
        >
        {txn.type === "debit" ? (
            <>
            Settle Up <ArrowRightLeft className="w-4 h-4" />
            </>
        ) : (
            <>
            Send Reminder <AlarmClock className="w-4 h-4" />
            </>
        )}
        </Button>
      </AlertDialogTrigger>


      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
