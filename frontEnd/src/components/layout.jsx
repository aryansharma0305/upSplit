"use client"

import React, { use, useLayoutEffect } from "react"
import { Outlet, useLocation, Link } from "react-router-dom"
import Notification from "./misc/Notification"
import { AppSidebar } from "@/components/sideBar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Logo from "./logo"
import { useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { set } from "date-fns"
import { useState } from "react"

const DashboardLayout = () => {
  const location = useLocation()

  const segments = location.pathname.split("/").filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/")
    
    const label = segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    return { label, path }
  })

  const Navigate= useNavigate()
  const [user, setUser] = useState({name: "Guest", email: "guest", photoURL: ""})
  useLayoutEffect(() => {
    try{
      axios.get("/api/auth/checkIfAuthorized")
      .then((response) => {
        if (response.status === 200) {
          console.log("User is authorized")
        }
        const userData= response.data.user? response.data.user : null
        if(!userData){
          console.log("User data not found, redirecting to login")
          Navigate("/logout")
        }
        localStorage.setItem("userDetails", JSON.stringify(userData))
        setUser(userData)
      })
      .catch((error) => {
        
          console.log("User is not authorized or there is a problem with api connection, redirecting to login")
          Navigate("/logout")          
      })

    }
    catch{

    }
  },[])


  return (
    <SidebarProvider>
      <AppSidebar user = {user} />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-16  justify-between items-center gap-2 shadow-md    ">
          <div className="flex items-center gap-2 px-4" >
            <SidebarTrigger className="md:hidden -ml-1 custom-class-aryan" />
            <Separator
              orientation="vertical"
              className="mr-2"
            />
            
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList>
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={crumb.path}>
                    <BreadcrumbItem>
                      {idx !== breadcrumbs.length - 1 ? (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.path}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {idx !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>


          </div>
          
          

          {window.innerWidth<768?<Logo   height="100px" width="100px" />:<div></div>}
          <Notification className="w-12 md:w-auto " />
          

        </header>

        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout