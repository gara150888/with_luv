import { toSnakeCaseGame } from "@/lib/utils"
import { findGameById, findGames, insertGame, modifyGame, removeGame } from "./game.repo"
import type { CreateGameInput, UpdateGameInput } from "../schemas/game.schema"

export async function createGame(data: CreateGameInput) {
  const game = await insertGame({
    name: data.game_name,
    description: data.game_description,
    image: data.game_image,
    bannerImage: data.game_banner_image,
    modeType: data.game_mode_type,
    status: data.game_status,
  })

  return { success: true, message: "Game created successfully", game: toSnakeCaseGame(game) }
}

export async function updateGame(data: UpdateGameInput) {
  const { id, ...updateData } = data
  if (Object.keys(updateData).length === 0) return { success: false, message: "No data to update" }

  const updatePayload: Record<string, unknown> = {}

  if (updateData.game_name !== undefined) updatePayload.name = updateData.game_name
  if (updateData.game_description !== undefined) updatePayload.description = updateData.game_description
  if (updateData.game_image !== undefined) updatePayload.image = updateData.game_image
  if (updateData.game_banner_image !== undefined) updatePayload.bannerImage = updateData.game_banner_image
  if (updateData.game_mode_type !== undefined) updatePayload.modeType = updateData.game_mode_type
  if (updateData.game_status !== undefined) updatePayload.status = updateData.game_status

  const game = await modifyGame(id, updatePayload)

  return { success: true, message: "Game updated successfully", game: toSnakeCaseGame(game) }
}

export async function deleteGame(id: string) {
  await removeGame(id)

  return { success: true, message: "Game deleted successfully" }
}

export async function getGames() {
  const games = await findGames()
  const snakeGames = games.map((g) => toSnakeCaseGame(g))
  return { success: true, games: snakeGames }
}

export async function getGame(id: string) {
  const game = await findGameById(id)
  if (!game) return { success: false, message: "Game not found" }
  return { success: true, game: toSnakeCaseGame(game) }
}