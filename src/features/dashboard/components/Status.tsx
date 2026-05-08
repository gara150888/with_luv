import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Gamepad2, Target, TrendingUp, Users } from "lucide-react";
import { Game } from "../types";

export const Status = ({ games }: { games: Game[] }) => {
    const stats = [
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
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="px-4">
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {stat.description}
                        </p>
                        {stat.trend && (
                            <div className="mt-2 flex items-center text-xs text-green-600">
                                <TrendingUp className="mr-1 h-3 w-3" />
                                {stat.trend}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}