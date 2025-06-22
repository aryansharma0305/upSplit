
"use client"

import React from "react"
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 justify-between items-center gap-2 shadow transition-[width,height] ease-linear pr-5 md:pr-10 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 ">
            <SidebarTrigger className="md:hidden -ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
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

           

          <div className=" mr-4 flex">
            
            <Logo className='ml-3 md:hidden h-8'/>
          </div>

           <Notification className=''/>
          
        </header>

        <div className="flex flex-1  flex-col p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
