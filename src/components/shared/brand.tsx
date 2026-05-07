"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function Brand() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton className="hover:bg-sidebar" size="lg">

          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar">
            <img
              src="https://i.ibb.co/ds8wQSj9/logo.png"
              alt="Tournament4All"
              className="w-8 h-8 rounded-full"
            />
          </div>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              Tournament4All
            </span>
          </div>

        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
