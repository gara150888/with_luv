export type Game = {
    id: string
    game_name: string
    game_description: string
    game_image: string
    game_banner_image: string
    game_mode_type: "BR" | "LW" | "CS"
    game_status: boolean
    createdAt: string
    updatedAt: string
}

export const modeConfig = {
    BR: { label: "Battle Royale" },
    LW: { label: "Last Warrior" },
    CS: { label: "Capture & Strike" }
} as const