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
import { Trash2Icon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from 'sonner'

export function DeleteContact({contactID}) {
    


    const Navigate = useNavigate();

    const handleDelete = () => {
        fetch('/api/users/removeContact', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id:contactID }) // Replace with actual contact ID
        })
        .then(response => {
            if (response.ok) {
                console.log('Contact deleted successfully');
                toast.success('Contact deleted successfully');
                Navigate('/dashboard/contact'); // Redirect to contacts page or update state

            } else {
                console.error('Failed to delete contact');
            }
        })
        .catch(error => {
            console.error('Error deleting contact:', error);
        });
    } 







  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2Icon className="h-5 w-5 mr-2 text-red-500 hover:text-red-700 cursor-pointer" />
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
          <AlertDialogAction onClick={handleDelete} > Continue </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
