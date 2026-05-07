"use client"

import * as React from "react"

import { NavProjects } from "@/components/shared/nav-projects"
import { NavUser } from "@/components/shared/nav-user"
import { Brand } from "@/components/shared/brand"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, CheckCircle2, Trophy, BadgePlus, CircleUser } from "lucide-react"
import { NavProjectsAdmin } from "./admin"
import { Separator } from "@/components/ui/separator"

const data = {
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: (<LayoutDashboardIcon />),
    },
    {
      name: "Joined Matches",
      url: "/joined",
      icon: (<CheckCircle2 />),
    },
    {
      name: "Create Challenge",
      url: "/challenges/create",
      icon: (<Trophy />),
    },
    {
      name: "Deposit Coins",
      url: "/deposit",
      icon: (<BadgePlus />),
    },
    {
      name: "Profile",
      url: "/profile",
      icon: (<CircleUser />),
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Brand />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavProjectsAdmin />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
