import { Game } from "./types"
import { Gamepad2, Users, Target, Activity } from "lucide-react"

export const getFilteredGames = (games: Game[], searchTerm: string, selectedMode: string, selectedStatus: string) => games.filter(game => {
    const matchesSearch = game.game_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.game_description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMode = selectedMode === "all" || game.game_mode_type === selectedMode
    const matchesStatus = selectedStatus === "all" ||
        (selectedStatus === "active" ? game.game_status : !game.game_status)
    return matchesSearch && matchesMode && matchesStatus
})

export const stats = (games: Game[]) => [
    {
        title: "Total Games",
        value: games.length,
        icon: Gamepad2,
        description: "Total games in library",
        trend: "+12% from last month"
    },
    {
        title: "Active Games",
        value: games.filter((g) => g.game_status).length,
        icon: Activity,
        description: "Currently active",
        trend: "+5% from last month"
    },
    {
        title: "Game Modes",
        value: new Set(games.map((g) => g.game_mode_type)).size,
        icon: Target,
        description: "Available modes",
        trend: "Stable"
    },
    {
        title: "Total Players",
        value: "2.4K",
        icon: Users,
        description: "Active players",
        trend: "+18% from last month"
    }
]

export const getStatusVariant = (status: boolean) => {
    return status ? "default" : "secondary"
}

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}
