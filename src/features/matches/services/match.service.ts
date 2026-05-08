import {
    createMatchRepo,
    updateMatchRepo,
    deleteMatchRepo,
    findMatchByIdRepo,
    findMatchesByGameRepo,
    findAllMatchesRepo,
    findAdminByEmail,
    findUserWithCoins,
} from "./match.repo"

import { toSnakeCaseMatch } from "@/lib/utils"
import { UpdateMatchInput, CreateMatchInput } from "../schemas/match.schema"
import db from "@/lib/db"

// helper
async function isAdmin(email: string) {
    const admin = await findAdminByEmail(email)
    return !!admin
}

export async function createMatchService(email: string, data: CreateMatchInput) {
    const admin = await isAdmin(email)
    if (!admin) return { success: false, message: "Admin access required" }

    const match = await createMatchRepo(data)

    return {
        success: true,
        message: "Match created successfully",
        match: toSnakeCaseMatch(match),
    }
}

export async function updateMatchService(email: string, data: UpdateMatchInput) {
    const admin = await isAdmin(email)
    if (!admin) return { success: false, message: "Admin access required" }

    const { id, ...rest } = data

    const match = await updateMatchRepo(id, rest)

    return {
        success: true,
        message: "Match updated successfully",
        match: toSnakeCaseMatch(match),
    }
}

export async function deleteMatchService(email: string, id: string) {
    const admin = await isAdmin(email)
    if (!admin) return { success: false, message: "Admin access required" }

    await deleteMatchRepo(id)

    return { success: true, message: "Match deleted successfully" }
}

export async function getMatchService(gameId: string) {
    const matches = await findMatchesByGameRepo(gameId)
    return { success: true, matches: matches.map(toSnakeCaseMatch) }
}

export async function getAllMatchesService() {
    const matches = await findAllMatchesRepo()
    return { success: true, matches: matches.map(toSnakeCaseMatch) }
}

export async function getMatchByIdService(id: string) {
    const match = await findMatchByIdRepo(id)
    if (!match) return { success: false, message: "Match not found" }

    return { success: true, match: toSnakeCaseMatch(match) }
}

export async function joinMatchService(clerkId: string, matchId: string) {
    const dbUser = await findUserWithCoins(clerkId)
    if (!dbUser) return { success: false, message: "User not found" }

    const match = await findMatchByIdRepo(matchId)
    if (!match) return { success: false, message: "Match not found" }

    if (!match.joinStatus) {
        return { success: false, message: "Joining closed" }
    }

    try {
        await db.$transaction(async (tx) => {
            const alreadyJoined = await tx.matchPlayer.findUnique({
                where: {
                    userId_matchId: {
                        userId: dbUser.id,
                        matchId,
                    },
                },
            })

            if (alreadyJoined) throw new Error("Already joined")

            const count = await tx.matchPlayer.count({ where: { matchId } })

            if (count >= match.maxPlayers) throw new Error("Match full")

            if (match.joinFee > 0) {
                if (!dbUser.coins || dbUser.coins.balance < match.joinFee) {
                    throw new Error("Insufficient balance")
                }

                await tx.coins.update({
                    where: { id: dbUser.coins.id },
                    data: {
                        balance: { decrement: match.joinFee },
                    },
                })

                await tx.coinTransaction.create({
                    data: {
                        userId: dbUser.id,
                        coinsId: dbUser.coins.id,
                        amount: -match.joinFee,
                        reason: `Joined match ${match.id}`,
                    },
                })
            }

            await tx.matchPlayer.create({
                data: {
                    userId: dbUser.id,
                    matchId,
                },
            })
        })

        return { success: true }
    } catch (err: any) {
        return { success: false, message: err.message }
    }
}