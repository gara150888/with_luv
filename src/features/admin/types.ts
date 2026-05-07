import { Match as MatchType } from "@/features/matches/types"

export type Game = {
  id: string
  game_name: string
  game_description: string
  game_image: string
  game_banner_image: string
  game_mode_type: "BR" | "LW" | "CS"
  game_status: boolean
  createdAt: string
  updatedAt: string
}

export type Admin = {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export type ForClientProps = {
  admins: Admin[]
}

export type GameForm = {
  game_name: string
  game_description: string
  game_image: string
  game_banner_image: string
  game_mode_type: "BR" | "LW" | "CS"
  game_status: boolean
}

export type MatchForm = {
  gameId: string
  poster_img: string
  join_status: boolean
  join_fee: number
  rules: string
  prize_pool: number
  match_type: "SOLO" | "DUO" | "SQUAD"
  max_players: number
  description: string
  start_time: string
  end_time: string
}

// Re-export Match from matches/types to avoid duplication
export type Match = MatchType
