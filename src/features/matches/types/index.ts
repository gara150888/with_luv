export type Match = {
    id: string
    gameId: string
    poster_img: string
    join_status: boolean
    join_fee: number
    rules: string
    prize_pool: number
    match_type: "SOLO" | "DUO" | "SQUAD"
    max_players: number
    description: string
    start_time: string
    end_time: string
    createdAt: string
    updatedAt: string
    game?: {
        id: string
        game_name: string
        game_mode_type: string
    }
}

export type ClientPageProps = {
    data: {
        success: boolean
        match: Match[]
    }
}

export type UpdateMatchInput = Partial<Omit<CreateMatchInput, 'gameId'>> & { id: string }

export type CreateMatchInput = {
    gameId: string
    poster_img?: string
    join_status: boolean
    join_fee: number
    rules?: string
    prize_pool: number
    match_type: "SOLO" | "DUO" | "SQUAD"
    max_players: number
    description?: string
    start_time: string
    end_time: string
}