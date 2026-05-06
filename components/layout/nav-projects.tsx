"use client"
import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: React.ReactNode
  }[]
}) {

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Actions</SidebarGroupLabel>

      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuButton key={item.name} asChild tooltip={item.name}>
            <Link prefetch={false} href={item.url}>
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </SidebarMenuButton>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
