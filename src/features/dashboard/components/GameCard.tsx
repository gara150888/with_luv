import Link from "next/link"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Game } from "@/features/admin/types"

import { Eye, Calendar, Clock, Shield, Target, Zap } from "lucide-react"

const getStatusVariant = (status: boolean) => status ? "default" : "secondary"

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
})

const modeConfig = {
    BR: { label: "Battle Royale", icon: Target, color: "destructive" },
    LW: { label: "Last Warrior", icon: Shield, color: "default" },
    CS: { label: "Capture & Strike", icon: Zap, color: "secondary" }
} as const

export default function GameCard({ game }: { game: Game }) {
    const ModeIcon = modeConfig[game.game_mode_type].icon
    return (
        <Card key={game.id} className="overflow-hidden gap-0 group py-0 w-full md:w-[49%] lg:w-[32.25806451612903%]">

            <div className="relative mb-3 h-46 w-full overflow-hidden bg-muted">
                <img
                    src={game.game_banner_image}
                    alt={game.game_name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                <div className="absolute bottom-2 left-2 select-none">
                    <Badge className={game.game_status
                        ? "bg-emerald-400/80 hover:bg-emerald-400/80 text-white" :
                        "bg-rose-400/80 hover:bg-rose-400/80 text-white"}
                        variant={getStatusVariant(game.game_status)}>
                        {game.game_status ? "Active" : "Inactive"}
                    </Badge>
                </div>

                <div className="absolute top-2 right-2">
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge variant={modeConfig[game.game_mode_type].color}>
                                <ModeIcon className="mr-1 h-3 w-3" />
                                {modeConfig[game.game_mode_type].label}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Game Mode</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="absolute bottom-0 right-0 p-2">
                    <Tooltip>
                        <Link prefetch={false} href={`/dashboard/${game.id}`}>
                            <TooltipTrigger asChild>
                                <Button className="w-full cursor-pointer" variant="default" size="sm">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>View game details</p>
                            </TooltipContent>
                        </Link>
                    </Tooltip>
                </div>
            </div>

            <CardHeader className="px-2 mb-3">
                <CardTitle className="line-clamp-1">
                    {game.game_name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                    {game.game_description}
                </CardDescription>
            </CardHeader>

            <CardContent className="px-2 mb-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(game.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(game.updatedAt)}
                    </div>
                </div>
            </CardContent>

            {/* <CardFooter className="flex justify-end p-1">
                <Tooltip>
                    <Link prefetch={false} href={`/dashboard/${game.id}`}>
                        <TooltipTrigger asChild>
                            <Button className="w-full cursor-pointer" variant="ghost" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>View game details</p>
                        </TooltipContent>
                    </Link>
                </Tooltip>
            </CardFooter> */}
        </Card>
    )
}