"use client"

import Link from "next/link"
import { LayoutDashboardIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

type Project = {
  name: string
  url: string
  icon: string
}

export function NavProjectsAdminClient({
  projects,
}: {
  projects: Project[]
}) {
  if (!projects.length) return null

  const iconMap = {
    dashboard: LayoutDashboardIcon,
  }
  const path = usePathname();

  return (<SidebarGroup>
    <SidebarGroupLabel>Admin</SidebarGroupLabel>

    <SidebarMenu>
      {projects.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap]

        return (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton isActive={path.startsWith(item.url)} key={item.name} asChild tooltip={item.name}>
              <Link prefetch={false} href={item.url}>
                {Icon && <Icon />}
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  </SidebarGroup>

  )
}
