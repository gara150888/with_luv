"use server"

import { currentUser } from "@clerk/nextjs/server"

import {
  createMatchSchema,
  updateMatchSchema,
} from "./schemas/match.schema"

import {
  createMatchService,
  updateMatchService,
  deleteMatchService,
  getMatchService,
  getAllMatchesService,
  getMatchByIdService,
  joinMatchService,
} from "./services/match.service"

// helper
const getError = (error: any) => error?.issues?.[0]?.message || "Invalid data"

export async function createMatch(data: unknown) {
  const user = await currentUser()
  if (!user) return { success: false, message: "Unauthorized" }

  const parsed = createMatchSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, message: getError(parsed.error) }
  }

  return createMatchService(user.emailAddresses[0].emailAddress, parsed.data)
}

export async function updateMatch(data: unknown) {
  const user = await currentUser()
  if (!user) return { success: false, message: "Unauthorized" }

  const parsed = updateMatchSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, message: getError(parsed.error) }
  }

  return updateMatchService(
    user.emailAddresses[0].emailAddress,
    parsed.data
  )
}

export async function deleteMatch(id: string) {
  const user = await currentUser()
  if (!user) return { success: false, message: "Unauthorized" }

  return deleteMatchService(
    user.emailAddresses[0].emailAddress,
    id
  )
}

export async function getMatch(gameId: string) {
  return getMatchService(gameId)
}

export async function getAllMatches() {
  return getAllMatchesService()
}

export async function getMatchById(id: string) {
  return getMatchByIdService(id)
}

export async function joinMatch(matchId: string) {
  const user = await currentUser()
  if (!user) return { success: false, message: "Unauthorized" }

  return joinMatchService(user.id, matchId)
}