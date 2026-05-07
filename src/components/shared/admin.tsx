"use client"

import { useUser } from "@clerk/nextjs"
import { NavProjectsAdminClient } from "./admin-client"
import { getAdmin } from "@/features/admin/actions"
import { useEffect, useState } from "react"

export function NavProjectsAdmin() {
  const { user, isLoaded } = useUser()
  const [projects, setProjects] = useState([])

  useEffect(() => {
    if (!user) return

    const email = user.primaryEmailAddress?.emailAddress
    if (!email) return

    getAdmin().then((admin) => {
      if (admin) {
        setProjects([{
          name: "Admin Dashboard",
          url: "/admin",
          icon: "dashboard"
        }] as any)
      }
    })
  }, [user])

  if (!isLoaded) return null

  return <NavProjectsAdminClient projects={projects} />
}
