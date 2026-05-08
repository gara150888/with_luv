import { z } from "zod"

export const createMatchSchema = z.object({
    gameId: z.string().uuid(),
    poster_img: z.string().url().optional(),
    join_status: z.boolean(),
    join_fee: z.number().int().min(0),
    rules: z.string().optional(),
    prize_pool: z.number().int().min(0),
    match_type: z.enum(["SOLO", "DUO", "SQUAD"]),
    max_players: z.number().int().min(1),
    description: z.string().optional(),
    start_time: z.string(),
    end_time: z.string(),
})

export const updateMatchSchema = z.object({
    id: z.string().uuid(),
    poster_img: z.string().url().optional(),
    join_status: z.boolean().optional(),
    join_fee: z.number().int().optional(),
    rules: z.string().optional(),
    prize_pool: z.number().int().min(0).optional(),
    match_type: z.enum(["SOLO", "DUO", "SQUAD"]).optional(),
    max_players: z.number().int().min(1).optional(),
    description: z.string().optional(),
    start_time: z.string().optional(),
    end_time: z.string().optional(),
})

export type CreateMatchInput = z.infer<typeof createMatchSchema>
export type UpdateMatchInput = z.infer<typeof updateMatchSchema>