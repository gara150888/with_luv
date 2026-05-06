'use client'

import { useState } from 'react'
import { Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GamesList } from "@/features/admin/components/GamesList"
import { MatchesList } from "@/features/admin/components/MatchesList"
import { AdminsList } from "@/features/admin/components/AdminsList"
import { GameDialog } from "@/features/admin/components/GameDialog"
import { MatchDialog } from "@/features/admin/components/MatchDialog"
import { DeleteDialog } from "@/features/admin/components/DeleteDialog"
import { useGameManagement } from "@/features/admin/hooks/useGameManagement"
import { useMatchManagement } from "@/features/admin/hooks/useMatchManagement"
import { useAdminManagement } from "@/features/admin/hooks/useAdminManagement"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'games' | 'matches' | 'admins'>('games')

  const gameMgmt = useGameManagement()
  const matchMgmt = useMatchManagement()
  const adminMgmt = useAdminManagement()

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Manage games and matches
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'games' ? (
            <Button onClick={() => gameMgmt.handleOpenGameDialog()} className="gap-2">
              Add Game
            </Button>
          ) : (
            <Button onClick={() => matchMgmt.handleOpenMatchDialog()} className="gap-2">
              Add Match
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('games')}
          className={`pb-3 px-1 font-medium transition-colors ${activeTab === 'games'
            ? 'border-b-2 border-primary text-primary'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Games
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`pb-3 px-1 font-medium transition-colors ${activeTab === 'matches'
            ? 'border-b-2 border-primary text-primary'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Matches
        </button>
        <button
          onClick={() => setActiveTab('admins')}
          className={`pb-3 px-1 font-medium transition-colors ${activeTab === 'admins'
            ? 'border-b-2 border-primary text-primary'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Admins
        </button>
      </div>

      {activeTab === 'games' && (
        <GamesList
          games={gameMgmt.games}
          loading={gameMgmt.loading}
          onEdit={gameMgmt.handleOpenGameDialog}
          onDelete={(game) => {
            gameMgmt.setSelectedGame(game)
            gameMgmt.setDeleteGameDialogOpen(true)
          }}
        />
      )}

      {activeTab === 'matches' && (
        <MatchesList
          matches={matchMgmt.matches}
          loading={matchMgmt.loading}
          onEdit={matchMgmt.handleOpenMatchDialog}
          onDelete={(match) => {
            matchMgmt.setSelectedMatch(match)
            matchMgmt.setDeleteMatchDialogOpen(true)
          }}
        />
      )}

      {activeTab === 'admins' && (
        <AdminsList
          admins={adminMgmt.admins}
          loading={adminMgmt.loading}
          onDelete={(admin) => {
            adminMgmt.setSelectedAdmin(admin)
            adminMgmt.setDeleteAdminDialogOpen(true)
          }}
        />
      )}

      <GameDialog
        open={gameMgmt.gameDialogOpen}
        onOpenChange={gameMgmt.setGameDialogOpen}
        selectedGame={gameMgmt.selectedGame}
        form={gameMgmt.gameForm}
        onSubmit={gameMgmt.handleGameSubmit}
        onFormChange={gameMgmt.setGameForm}
        isSubmitting={gameMgmt.isSubmitting}
      />

      <MatchDialog
        open={matchMgmt.matchDialogOpen}
        onOpenChange={matchMgmt.setMatchDialogOpen}
        selectedMatch={matchMgmt.selectedMatch}
        form={matchMgmt.matchForm}
        availableGames={matchMgmt.availableGames}
        onSubmit={matchMgmt.handleMatchSubmit}
        onFormChange={matchMgmt.setMatchForm}
        isSubmitting={matchMgmt.isSubmitting}
      />

      <DeleteDialog
        open={gameMgmt.deleteGameDialogOpen}
        onOpenChange={gameMgmt.setDeleteGameDialogOpen}
        title="Delete Game"
        description={`Are you sure you want to delete "${gameMgmt.selectedGame?.game_name}"? This will also delete all associated matches.`}
        onConfirm={gameMgmt.handleDeleteGame}
      />

      <DeleteDialog
        open={matchMgmt.deleteMatchDialogOpen}
        onOpenChange={matchMgmt.setDeleteMatchDialogOpen}
        title="Delete Match"
        description="Are you sure you want to delete this match? This action cannot be undone."
        onConfirm={matchMgmt.handleDeleteMatch}
      />

      <DeleteDialog
        open={adminMgmt.deleteAdminDialogOpen}
        onOpenChange={adminMgmt.setDeleteAdminDialogOpen}
        title="Delete Admin"
        description={`Are you sure you want to remove "${adminMgmt.selectedAdmin?.email}" from admin access? This action cannot be undone.`}
        onConfirm={adminMgmt.handleDeleteAdmin}
      />
    </div>
  )
}
