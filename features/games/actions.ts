'use server'

import db from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { toSnakeCaseGame } from "@/lib/utils"

type CreateGameInput = {
  game_name: string
  game_description: string
  game_image: string
  game_banner_image: string
  game_mode_type: "BR" | "LW" | "CS"
  game_status: boolean
}

type UpdateGameInput = Partial<CreateGameInput> & { id: string }

export async function createGame(data: CreateGameInput) {
  try {
    const user = await currentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    const email = user.emailAddresses[0]?.emailAddress
    const admin = await db.admin.findUnique({ where: { email } })
    if (!admin) return { success: false, message: "Admin access required" }
    if (!data.game_name || !data.game_description || !data.game_image || !data.game_banner_image || !data.game_mode_type) return { success: false, message: "All required fields must be filled" }

    const game = await db.game.create({
      data: {
        name: data.game_name,
        description: data.game_description,
        image: data.game_image,
        bannerImage: data.game_banner_image,
        modeType: data.game_mode_type,
        status: data.game_status,
      },
    })

    return { success: true, message: "Game created successfully", game: toSnakeCaseGame(game) }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to create game: ${message}` }
  }
}

export async function updateGame(data: UpdateGameInput) {
  try {
    const user = await currentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    const email = user.emailAddresses[0]?.emailAddress
    const admin = await db.admin.findUnique({ where: { email } })
    if (!admin) return { success: false, message: "Admin access required" }

    const { id, ...updateData } = data
    if (Object.keys(updateData).length === 0) return { success: false, message: "No data to update" }

    const updatePayload: Record<string, unknown> = {}

    if (updateData.game_name !== undefined) updatePayload.name = updateData.game_name
    if (updateData.game_description !== undefined) updatePayload.description = updateData.game_description
    if (updateData.game_image !== undefined) updatePayload.image = updateData.game_image
    if (updateData.game_banner_image !== undefined) updatePayload.bannerImage = updateData.game_banner_image
    if (updateData.game_mode_type !== undefined) updatePayload.modeType = updateData.game_mode_type
    if (updateData.game_status !== undefined) updatePayload.status = updateData.game_status

    const game = await db.game.update({
      where: { id },
      data: updatePayload,
    })

    return { success: true, message: "Game updated successfully", game: toSnakeCaseGame(game) }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to update game: ${message}` }
  }
}

export async function deleteGame(id: string) {
  try {
    const user = await currentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    const email = user.emailAddresses[0]?.emailAddress
    const admin = await db.admin.findUnique({ where: { email } })
    if (!admin) return { success: false, message: "Admin access required" }

    await db.game.delete({
      where: { id },
    })

    return { success: true, message: "Game deleted successfully" }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to delete game: ${message}` }
  }
}

export async function getGames() {
  try {
    const games = await db.game.findMany({
      orderBy: { createdAt: 'desc' }
    })
    const snakeGames = games.map(g => toSnakeCaseGame(g))
    return { success: true, games: snakeGames }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message }
  }
}

export async function getGame(id: string) {
  try {
    const game = await db.game.findUnique({
      where: { id }
    })
    if (!game) return { success: false, message: "Game not found" }
    return { success: true, game: toSnakeCaseGame(game) }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message }
  }
}
