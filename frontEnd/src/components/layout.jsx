// "use client"

// import React from "react"
// import { Outlet } from "react-router-dom"

// import { AppSidebar } from "@/components/sideBar/app-sidebar"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { Separator } from "@/components/ui/separator"
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar"

// const DashboardLayout = () => {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
//           <div className="flex items-center gap-2 px-4">
//             <SidebarTrigger className="-ml-1" />
//             <Separator
//               orientation="vertical"
//               className="mr-2 data-[orientation=vertical]:h-4"
//             />
//             <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem className="hidden md:block">
//                   <BreadcrumbLink href="#">
//                     Building Your Application
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator className="hidden md:block" />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage className="text-muted-foreground">

//                   </BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//         </header>

//         {/* Render matched child route here */}
//         <div className="flex flex-1 flex-col p-4 pt-0">
//           <Outlet />
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }

// export default DashboardLayout



















































"use client"

import React from "react"
import { Outlet, useLocation, Link } from "react-router-dom"

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
        <header className="flex h-16 shrink-0 justify-between items-center gap-2 shadow transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="md:hidden -ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb >
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
          <div className="md:hidden mr-4">
            <Logo className='h-8'/>
          </div>
        </header>

        <div className="flex flex-1  flex-col p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
