"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import { usePathname } from "next/navigation"
import React from "react"

export default function Layout({ children }: { children: React.ReactNode }) {

    const path = usePathname();
    const paths = path.split('/').filter(item => item);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Tournament4All
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {paths.map((p, i) => (
                                    <React.Fragment key={i}>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="capitalize">
                                                {p}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-1">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
