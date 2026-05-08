import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert snake_case to camelCase for Prisma operations
export function toCamelCaseMatch(data: Record<string, any>) {
    const result: Record<string, any> = {}

    if (data.gameId !== undefined) result.gameId = data.gameId

    const posterImg = 'poster_img' in data ? data.poster_img : data.posterImg
    if (posterImg !== undefined) result.posterImg = posterImg

    const joinStatus = 'join_status' in data ? data.join_status : data.joinStatus
    if (joinStatus !== undefined) result.joinStatus = joinStatus

    const joinFee = 'join_fee' in data ? data.join_fee : data.joinFee
    if (joinFee !== undefined) result.joinFee = joinFee

    if (data.rules !== undefined) result.rules = data.rules

    const prizePool = 'prize_pool' in data ? data.prize_pool : data.prizePool
    if (prizePool !== undefined) result.prizePool = prizePool

    const matchType = 'match_type' in data ? data.match_type : data.matchType
    if (matchType !== undefined) result.matchType = matchType

    const maxPlayers = 'max_players' in data ? data.max_players : data.maxPlayers
    if (maxPlayers !== undefined) result.maxPlayers = maxPlayers

    if (data.description !== undefined) result.description = data.description

    if (data.startTime !== undefined) result.startTime = data.startTime
    else if (data.start_time !== undefined) {
        const startTime = data.start_time instanceof Date ? data.start_time : new Date(data.start_time)
        if (!isNaN(startTime.getTime())) result.startTime = startTime
    }

    if (data.endTime !== undefined) result.endTime = data.endTime
    else if (data.end_time !== undefined) {
        const endTime = data.end_time instanceof Date ? data.end_time : new Date(data.end_time)
        if (!isNaN(endTime.getTime())) result.endTime = endTime
    }

    return result
}

// Transform Prisma Game object to snake_case format for client
export function toSnakeCaseGame(game: {
  id: string
  name: string
  description: string
  image: string
  bannerImage: string
  modeType: string
  status: boolean
  createdAt: Date | string
  updatedAt: Date | string
}) {
  return {
    id: game.id,
    game_name: game.name,
    game_description: game.description,
    game_image: game.image,
    game_banner_image: game.bannerImage,
    game_mode_type: game.modeType,
    game_status: game.status,
    createdAt: game.createdAt instanceof Date ? game.createdAt.toISOString() : game.createdAt,
    updatedAt: game.updatedAt instanceof Date ? game.updatedAt.toISOString() : game.updatedAt,
  }
}

// Transform Prisma Match object to snake_case format for client
export function toSnakeCaseMatch(match: {
  id: string
  gameId: string
  posterImg: string
  joinStatus: boolean
  joinFee: number
  rules: string
  prizePool: number
  matchType: string
  maxPlayers: number
  description: string
  startTime: Date | string
  endTime: Date | string
  createdAt: Date | string
  updatedAt: Date | string
  game?: {
    id: string
    name: string
    modeType: string
  } | null
}) {
  return {
    id: match.id,
    gameId: match.gameId,
    poster_img: match.posterImg,
    join_status: match.joinStatus,
    join_fee: match.joinFee,
    rules: match.rules,
    prize_pool: match.prizePool,
    match_type: match.matchType,
    max_players: match.maxPlayers,
    description: match.description,
    start_time: match.startTime instanceof Date ? match.startTime.toISOString() : match.startTime,
    end_time: match.endTime instanceof Date ? match.endTime.toISOString() : match.endTime,
    createdAt: match.createdAt instanceof Date ? match.createdAt.toISOString() : match.createdAt,
    updatedAt: match.updatedAt instanceof Date ? match.updatedAt.toISOString() : match.updatedAt,
    game: match.game
      ? {
          id: match.game.id,
          game_name: match.game.name,
          game_mode_type: match.game.modeType,
        }
      : undefined,
  }
}
