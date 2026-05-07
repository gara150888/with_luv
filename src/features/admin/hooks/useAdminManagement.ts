'use client'

import { useEffect, useCallback, useState } from 'react'
import { toast } from "sonner"
import { Admin } from "../types"
import { getAdmins, deleteAdmin } from "@/features/admin/actions"

export function useAdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteAdminDialogOpen, setDeleteAdminDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchAdmins = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getAdmins()
      // getAdmins returns Admin[] directly, not wrapped
      setAdmins(Array.isArray(result) ? result : [])
    } catch {
      toast.error("Failed to fetch admins")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  const handleDeleteAdmin = useCallback(async () => {
    if (!selectedAdmin) return
    setIsSubmitting(true)
    try {
      await deleteAdmin(selectedAdmin.id)
      toast.success("Admin deleted successfully")
      setDeleteAdminDialogOpen(false)
      setAdmins(prev => prev.filter(a => a.id !== selectedAdmin.id))
    } catch {
      toast.error("Failed to delete admin")
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedAdmin])

  return {
    admins,
    loading,
    deleteAdminDialogOpen,
    setDeleteAdminDialogOpen,
    selectedAdmin,
    setSelectedAdmin,
    handleDeleteAdmin,
    isSubmitting
  }
}
