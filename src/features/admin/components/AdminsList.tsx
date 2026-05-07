'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Admin } from "../types"

interface AdminsListProps {
  admins: Admin[]
  loading: boolean
  onDelete: (admin: Admin) => void
}

export function AdminsList({ admins, loading, onDelete }: AdminsListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admins</CardTitle>
        <CardDescription>List of admin users</CardDescription>
      </CardHeader>
      <CardContent>
        {admins.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No admins found</p>
        ) : (
          <ul className="space-y-2">
            {admins.map((admin) => (
              <li key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                <span>{admin.email}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(admin)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
