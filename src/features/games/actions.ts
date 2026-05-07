'use server'

import { currentUser } from "@clerk/nextjs/server"
import db from "@/lib/db"
import {
  createGame as createGameService,
  updateGame as updateGameService,
  deleteGame as deleteGameService,
  getGames as getGamesService,
  getGame as getGameService
} from "./services/games.service"

import {
  createGameSchema,
  updateGameSchema
} from "./schemas/game.schema"

async function requireAdmin() {
  const user = await currentUser()
  if (!user) throw new Error("Unauthorized")

  const email = user.emailAddresses[0]?.emailAddress
  const admin = await db.admin.findUnique({ where: { email } })

  if (!admin) throw new Error("Admin access required")
}

/* ---------------- CREATE ---------------- */
export async function createGame(data: unknown) {
  try {
    await requireAdmin()

    const parsed = createGameSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues?.[0]?.message || "Invalid data"
      }
    }

    return await createGameService(parsed.data)

  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong"
    }
  }
}

/* ---------------- UPDATE ---------------- */
export async function updateGame(data: unknown) {
  try {
    await requireAdmin()

    const parsed = updateGameSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues?.[0]?.message || "Invalid data"
      }
    }

    return await updateGameService(parsed.data)

  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong"
    }
  }
}

/* ---------------- DELETE ---------------- */
export async function deleteGame(id: string) {
  try {
    await requireAdmin()
    return await deleteGameService(id)

  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong"
    }
  }
}

/* ---------------- GET ALL ---------------- */
export async function getGames() {
  try {
    return await getGamesService()

  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong"
    }
  }
}

/* ---------------- GET ONE ---------------- */
export async function getGame(id: string) {
  try {
    return await getGameService(id)

  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong"
    }
  }
}
