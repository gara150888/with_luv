'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Gamepad2, Trophy, Users, Calendar } from "lucide-react"
import { Match } from "../types"
import { MatchCard } from "./MatchCard"
import { JoinMatchPopup } from "./JoinMatchPopup"
import { LoadingState } from "@/components/shared/LoadingState"

interface DashboardPageProps {
  data: { success: true, matches: Match[] } | { success: false, message: string }
}

export default function DashboardPage({ data }: DashboardPageProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [showJoinPopup, setShowJoinPopup] = useState(false)
  const [isLoading, _setIsLoading] = useState(false)

  const handleJoinClick = (match: Match) => {
    setSelectedMatch(match)
    setShowJoinPopup(true)
  }

  const handleJoinSuccess = () => {
    console.log('Joined successfully')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 lg:p-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <LoadingState />
      </div>
    )
  }

  if (!data?.success || data?.matches?.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-lg font-medium text-muted-foreground">
            No matches found
          </p>
          <p className="text-sm text-muted-foreground/70">
            There are no matches available right now.
          </p>
        </div>
      </div>
    )
  }

  const matches = data?.matches ?? [];
  const gameName = matches[0]?.game?.game_name || "Game"
  const totalPrizePool = matches.reduce((sum: number, match: Match) => sum + match.prize_pool, 0)

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 lg:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-primary" />
                <h1 className="text-2xl font-semibold tracking-tight">{gameName}</h1>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  ₹{totalPrizePool.toLocaleString()} prize pool
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {matches.length} matches
                </span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Schedule Match
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} onJoin={handleJoinClick} />
            ))}
          </div>
        </div>

        {showJoinPopup && selectedMatch && (
          <JoinMatchPopup
            match={selectedMatch}
            onClose={() => setShowJoinPopup(false)}
            onSuccess={handleJoinSuccess}
          />
        )}
      </div>
    </TooltipProvider>
  )
}
