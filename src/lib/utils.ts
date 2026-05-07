import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
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
    createdAt: match.createdAt,
    updatedAt: match.updatedAt,
    game: match.game
      ? {
          id: match.game.id,
          game_name: match.game.name,
          game_mode_type: match.game.modeType,
        }
      : undefined,
  }
}
