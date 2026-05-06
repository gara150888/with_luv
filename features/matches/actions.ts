'use server'

import db from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { Match, CreateMatchInput, UpdateMatchInput } from "./types"
import { toSnakeCaseMatch } from "@/lib/utils"

async function getDbUserFromAuth() {
  const user = await currentUser()
  if (!user) return null
  return db.user.findUnique({ where: { clerkId: user.id } })
}

export async function createMatch(data: CreateMatchInput) {
  try {
    const user = await currentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    const email = user.emailAddresses[0]?.emailAddress
    const admin = await db.admin.findUnique({ where: { email } })
    if (!admin) return { success: false, message: "Admin access required" }

    const startTime = new Date(data.start_time)
    const endTime = new Date(data.end_time)

    const match = await db.match.create({
      data: {
        gameId: data.gameId,
        posterImg: data.poster_img,
        joinStatus: data.join_status,
        joinFee: data.join_fee,
        rules: data.rules || "",
        prizePool: data.prize_pool,
        matchType: data.match_type,
        maxPlayers: data.max_players,
        description: data.description || "",
        startTime: startTime,
        endTime: endTime,
      },
    })

    return { success: true, message: "Match created successfully", match: toSnakeCaseMatch(match) }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to create match: ${message}` }
  }
}

export async function updateMatch(data: UpdateMatchInput) {
  try {
    const user = await currentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    const email = user.emailAddresses[0]?.emailAddress
    const admin = await db.admin.findUnique({ where: { email } })
    if (!admin) return { success: false, message: "Admin access required" }

    const { id, ...updateData } = data
    if (Object.keys(updateData).length === 0) {
      return { success: false, message: "No data to update" }
    }

    const updatePayload: Record<string, unknown> = {}

    if (updateData.poster_img !== undefined) updatePayload.posterImg = updateData.poster_img
    if (updateData.join_status !== undefined) updatePayload.joinStatus = updateData.join_status
    if (updateData.join_fee !== undefined) updatePayload.joinFee = updateData.join_fee
    if (updateData.rules !== undefined) updatePayload.rules = updateData.rules
    if (updateData.prize_pool !== undefined) updatePayload.prizePool = updateData.prize_pool
    if (updateData.match_type !== undefined) updatePayload.matchType = updateData.match_type
    if (updateData.max_players !== undefined) updatePayload.maxPlayers = updateData.max_players
    if (updateData.description !== undefined) updatePayload.description = updateData.description
    if (updateData.start_time) updatePayload.startTime = new Date(updateData.start_time)
    if (updateData.end_time) updatePayload.endTime = new Date(updateData.end_time)

    const match = await db.match.update({
      where: { id },
      data: updatePayload,
    })

    return { success: true, message: "Match updated successfully", match: toSnakeCaseMatch(match) }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to update match: ${message}` }
  }
}

export async function deleteMatch(id: string) {
  try {
    const user = await currentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    const email = user.emailAddresses[0]?.emailAddress
    const admin = await db.admin.findUnique({ where: { email } })
    if (!admin) return { success: false, message: "Admin access required" }

    await db.match.delete({ where: { id } })

    return { success: true, message: "Match deleted successfully" }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to delete match: ${message}` }
  }
}

export async function getMatch(gameId: string): Promise<{ success: true; match: Match[] } | { success: false; message: string }> {
  try {
    const matches = await db.match.findMany({
      where: { gameId },
      include: { game: true },
      orderBy: { createdAt: 'desc' }
    })
    const snakeMatches = matches.map(m => toSnakeCaseMatch(m))
    return { success: true, match: snakeMatches }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message }
  }
}

export async function getAllMatches() {
  try {
    const matches = await db.match.findMany({
      include: { game: true },
      orderBy: { createdAt: 'desc' }
    })
    const snakeMatches = matches.map(m => toSnakeCaseMatch(m))
    return { success: true, matches: snakeMatches }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message }
  }
}

export async function getMatchById(id: string) {
  try {
    const match = await db.match.findUnique({
      where: { id },
      include: { game: true }
    })
    if (!match) return { success: false, message: "Match not found" }
    return { success: true, match: toSnakeCaseMatch(match) }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message: `Failed to fetch match: ${message}` }
  }
}

export async function getMyJoinedMatches() {
  try {
    const dbUser = await getDbUserFromAuth()
    if (!dbUser) return { success: false, message: "Unauthorized" }

    const matchPlayers = await db.matchPlayer.findMany({
      where: { userId: dbUser.id },
      include: { 
        match: { 
          include: { game: true } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    })

    const matches = matchPlayers.map(mp => toSnakeCaseMatch(mp.match))

    return { success: true, matches }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message }
  }
}

export async function joinMatch(matchId: string) {
  try {
    const user = await currentUser()
    if (!user) return { success: false, message: "Unauthorized" }

    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
      include: { coins: true }
    })

    if (!dbUser) return { success: false, message: "User not found" }

    const match = await db.match.findUnique({
      where: { id: matchId }
    })

    if (!match) return { success: false, message: "Match not found" }

    if (!match.joinStatus) return { success: false, message: "Joining closed" }

    await db.$transaction(async (tx) => {

      const alreadyJoined = await tx.matchPlayer.findUnique({
        where: { userId_matchId: { userId: dbUser.id, matchId } }
      })

      if (alreadyJoined) throw new Error("Already joined")

      const playerCount = await tx.matchPlayer.count({ where: { matchId } })

      if (playerCount >= match.maxPlayers) throw new Error("Match full")

      if (match.joinFee > 0) {

        if (!dbUser.coins || dbUser.coins.balance < match.joinFee) throw new Error("Insufficient balance")

        await tx.coins.update({
          where: { id: dbUser.coins.id },
          data: { balance: { decrement: match.joinFee } }
        })

        await tx.coinTransaction.create({
          data: {
            userId: dbUser.id,
            coinsId: dbUser.coins.id,
            amount: -match.joinFee,
            reason: `Joined match ${match.id}`
          }
        })
      }

      await tx.matchPlayer.create({
        data: { userId: dbUser.id, matchId }
      })
    })

    return { success: true }
  } catch (err: any) {
    return {
      success: false,
      error: err.message
    }
  }
}
