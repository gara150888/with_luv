import { z } from "zod"

const gameModeEnum = z.enum(["BR", "LW", "CS"])

export const createGameSchema = z.object({
  game_name: z.string().min(1, "Game name is required"),
  game_description: z.string().min(1, "Game description is required"),
  game_image: z.string().min(1, "Game image is required"),
  game_banner_image: z.string().min(1, "Game banner image is required"),
  game_mode_type: gameModeEnum,
  game_status: z.boolean(),
})

export const updateGameSchema = createGameSchema.partial().extend({
  id: z.string().uuid("Invalid game ID"),
})

export type CreateGameInput = z.infer<typeof createGameSchema>
export type UpdateGameInput = z.infer<typeof updateGameSchema>