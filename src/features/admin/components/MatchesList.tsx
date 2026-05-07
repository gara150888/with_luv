'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Trophy, Calendar } from "lucide-react"
import { Match } from "../types"
import { getMatchTypeBadgeVariant } from "@/features/matches/utils"

interface MatchesListProps {
  matches: Match[]
  loading: boolean
  onEdit: (match: Match) => void
  onDelete: (match: Match) => void
}

export function MatchesList({ matches, loading, onEdit, onDelete }: MatchesListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-muted rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No matches found</p>
          <p className="text-sm text-muted-foreground/70">Schedule your first match to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <Card key={match.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">
                  {match.game?.game_name || "Unknown Game"}
                </CardTitle>
                <CardDescription>
                  {match.match_type} • {match.max_players} players • {match.join_fee} coins entry
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(match)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(match)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant={getMatchTypeBadgeVariant(match.match_type)}>
                  {match.match_type}
                </Badge>
                <Badge variant={match.join_status ? "default" : "secondary"}>
                  {match.join_status ? "Open" : "Closed"}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Trophy className="w-4 h-4 text-amber-500" />
                Prize: {match.prize_pool} coins
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Starts: {new Date(match.start_time).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
