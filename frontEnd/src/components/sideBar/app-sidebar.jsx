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

import { NavMain } from "@/components/sideBar/nav-main"
import { NavDefault } from "@/components/sideBar/nav-default"
import { NavUser } from "@/components/sideBar/nav-user"
import { TeamSwitcher } from "@/components/sideBar/team-switcher"
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
      url: "#",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Group1",
          url: "#",
        },
        {
          title: "Group2",
          url: "#",
        },
        {
          title: "Group3",
          url: "#",
        },
      ],
    },
    {
      title: "Contacts",
      url: "#",
      icon: User,
      items: [
        {
          title: "JainDoe0034",
          url: "#",
        },
        {
          title: "RohitKumar03",
          url: "#",
        },
        {
          title: "SindgManish",
          url: "#",
        },
      ],
    } 
  ],
  
    default: [
    {
      name: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
    },
    {
      name: "Spend Analysis",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Transactions",
      url: "#",
      icon: Landmark,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="mb-5 flex mt-2 pl-1">
        <Logo className='h-10' />
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
