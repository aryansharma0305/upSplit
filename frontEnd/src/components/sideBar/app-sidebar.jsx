import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  LayoutDashboard,
  GalleryVerticalEnd,
  Map,
  Landmark,
  Users,
  User,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import { NavMain } from "@/components/sideBar/nav-main"
import { NavDefault } from "@/components/sideBar/nav-default"
import { NavUser } from "@/components/sideBar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Logo from "../logo"

// This is sample data.
const data = {
  user: {
    name: "Aryan Sharma",
    email: "aryansharma0305@examdsksdljflple.com",
    avatar: "https://avatars.githubusercontent.com/u/37801977?v=4",
  },
  
  navMain: [
    {
      title: "Groups",
      url: "/dashboard/group",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Group1",
          url: "/dashboard/group/1",
        },
        {
          title: "Group2",
          url: "/dashboard/group/2",
        },
        {
          title: "Group3",
          url: "/dashboard/group/3",
        },
      ],
    },
    {
      title: "Contacts",
      url: "/dashboard/contact",
      icon: User,
      items: [
        {
          title: "JainDoe0034",
          url: `/dashboard/contact/1`,
        },
        {
          title: "RohitKumar03",
          url: "/dashboard/contact/2",
        },
        {
          title: "SindgManish",
          url: "/dashboard/contact/3",
        },
      ],
    } 
  ],
  
    default: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Pending Payments",
      url: "/dashboard/pending-payments",
      icon: PieChart,
    },
    {
      name: "Transaction History",
      url: "/dashboard/transaction-history",
      icon: Landmark,
    },
  ],
}

export function AppSidebar({
  ...props
}) {

  const Navigate=useNavigate()


  return (
    // collapsible="icon"
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={"pt-0"}>
        <div className="mb-0 flex mt-0 pl-1 cursor-pointer" onClick={()=>Navigate("/dashboard")}>
        <Logo height="70px" width="150px"  />
        </div>
      </SidebarHeader>
      <SidebarContent>

        <NavDefault default={data.default} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
