'use client'
// actions or helpers
import { getFilteredGames } from "@/features/dashboard/consts"
import { getGames } from "@/features/games/actions"

// hooks and types
import { Game } from "@/features/admin/types"
import { useEffect, useState } from "react"

// shadcn and lucide components
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { RefreshCw } from "lucide-react"

// custom components
import Filters from "@/features/dashboard/components/Filters"
import { Status } from "@/features/dashboard/components/Status"
import GameCard from "@/features/dashboard/components/GameCard"
import { GameNotFound } from "@/features/dashboard/components/GameNotFound"
import LoadingSkeleton from "@/features/dashboard/components/LoadingSkeleton"

export default function DashboardPage() {
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedMode, setSelectedMode] = useState<string>("all")
    const [selectedStatus, setSelectedStatus] = useState<string>("all")

    useEffect(() => { fetchGames() }, [])

    const fetchGames = async () => {
        setLoading(true)
        const res: any = await getGames()
        if (res.success) setGames(res.games)
        setLoading(false)
    }

    const filteredGames = getFilteredGames(games, searchTerm, selectedMode, selectedStatus)

    if (loading) { return <LoadingSkeleton /> }

    return (
        <div className="flex flex-1 flex-col">
            <TooltipProvider>
                <div className="space-y-6 px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Game Dashboard</h1>
                            <p className="text-muted-foreground"> Manage and monitor your game library </p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={fetchGames}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    <Status games={games} />

                    <Filters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedMode={selectedMode}
                        setSelectedMode={setSelectedMode}
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                    />

                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold tracking-tight">All Games</h2>
                            <p className="text-sm text-muted-foreground">{filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} found</p>
                        </div>

                        {filteredGames.length === 0 ? (
                            <GameNotFound setSearchTerm={setSearchTerm} setSelectedMode={setSelectedMode} setSelectedStatus={setSelectedStatus} />
                        ) : (
                            <div className="gap-4 flex flex-wrap">
                                {filteredGames.map((game) => <GameCard key={game.id} game={game} />)}
                            </div>
                        )}
                    </div>
                </div>
            </TooltipProvider>
        </div>
    )
}