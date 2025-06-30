import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-2 text-xl text-muted-foreground">Page Not Found</p>
      <p className="mt-1 max-w-md text-muted-foreground">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Button onClick={() => navigate("/dashboard")} className="mt-6 bg-gradient-to-r from-emerald-600  to-teal-600  hover:bg-gradient-to-r hover:from-emerald-700 hover:to-teal-700 text-white hover:-translate-y-1">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go to dashboard
      </Button>
    </div>
  )
}

export default NotFoundPage
