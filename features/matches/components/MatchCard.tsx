'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, Coins, Trophy, Timer } from "lucide-react"
import { Match } from "../types"
import { formatDateTime, formatTimeRemaining } from "../utils"

interface MatchCardProps {
    match: Match
    onJoin: (match: Match) => void
}

const getFillPercentage = (id: string): number => {
    let hash = 0
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash) + id.charCodeAt(i)
        hash |= 0
    }
    return ((Math.abs(hash) % 30) + 50)
}

export function MatchCard({ match, onJoin }: MatchCardProps) {
    const startDateTime = formatDateTime(match.start_time)
    const isActive = match.join_status
    const timeRemaining = formatTimeRemaining(match.start_time)
    const fillPercentage = getFillPercentage(match.id)

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow p-0">
            <div className="relative h-48 w-full overflow-hidden bg-muted">
                <img
                    src={match.poster_img}
                    alt="Match poster"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/800x200?text=No+Image"
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-black/70 text-white border-0 text-xs">
                        {match.match_type}
                    </Badge>
                    <Badge variant="secondary" className={`${isActive ? 'bg-emerald-600' : 'bg-rose-600'} text-white border-0 text-xs`}>
                        {isActive ? "Open" : "Closed"}
                    </Badge>
                </div>
                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-black/70 text-white border-0 gap-1 text-xs">
                        <Timer className="w-3 h-3" />
                        {timeRemaining}
                    </Badge>
                </div>
                {match.game && (
                    <div className="absolute bottom-3 left-3">
                        <h3 className="text-white font-semibold text-base">
                            {match.game.game_name}
                        </h3>
                        <p className="text-white/70 text-xs">
                            {match.game.game_mode_type}
                        </p>
                    </div>
                )}
            </div>

            <CardHeader className="">
                <div className="flex justify-between items-center">
                    <CardDescription className="flex items-center gap-1 text-xs">
                        <Calendar className="w-3 h-3" />
                        {startDateTime}
                    </CardDescription>
                    <Badge variant="outline" className="text-xs font-normal">
                        <Users className="w-3 h-3 mr-1" />
                        {fillPercentage}%
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 px-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-primary/5">
                            <Coins className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="px-2">
                            <p className="text-[10px] text-muted-foreground">Entry Fee</p>
                            <p className="text-sm font-semibold">{match.join_fee} coins</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-amber-500/5">
                            <Trophy className="w-3.5 h-3.5 text-amber-600" />
                        </div>
                        <div className="px-2">
                            <p className="text-[10px] text-muted-foreground">Prize Pool</p>
                            <p className="text-sm font-semibold text-amber-600">{match.prize_pool} coins</p>
                        </div>
                    </div>
                </div>

                <Progress value={fillPercentage} className="h-1.5" />

                {match.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {match.description}
                    </p>
                )}
            </CardContent>

            <CardFooter className="p-3">
                <Button
                    variant="default"
                    size="sm"
                    disabled={!isActive}
                    className="w-full gap-2 text-sm"
                    onClick={() => onJoin(match)}
                >
                    <Coins className="w-3.5 h-3.5" />
                    Join Match
                </Button>
            </CardFooter>
        </Card>
    )
}
