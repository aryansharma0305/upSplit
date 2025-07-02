"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

export function NavMain({ items }) {
  const [openKey, setOpenKey] = useState(null)

  const handleToggle = (title) => {
    setOpenKey((prev) => (prev === title ? null : title))
  }

  //useSidebar
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Groups and Contacts</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            open={openKey === item.title}
            onOpenChange={() => handleToggle(item.title)}
            asChild
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight
                    className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild className={``} > 
                        <Link onClick={()=>{toggleSidebar();console.log("Hello")}} to={subItem.url} >
                          <span>{subItem.title}</span>
                        </Link>
                        {/* <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a> */}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                  <SidebarMenuSubItem className="border-t py-2 ">
                      <SidebarMenuSubButton asChild className="text-muted-foreground font-semibold text-sm hover:text-primary">
                        <Link onClick={()=>{toggleSidebar();console.log("Hello")}} to={item.url} >
                          <span>See All</span>
                        </Link>
                      </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
