'use client'

import { useEffect, useCallback, useState } from 'react'
import { toast } from "sonner"
import { Match, MatchForm } from "../types"
import { getAllMatches, createMatch, updateMatch, deleteMatch } from "@/features/matches/actions"
import { getGames } from "@/features/games/actions"

export function useMatchManagement() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [matchDialogOpen, setMatchDialogOpen] = useState(false)
  const [deleteMatchDialogOpen, setDeleteMatchDialogOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [matchForm, setMatchForm] = useState<MatchForm>({
    gameId: '',
    poster_img: '',
    join_status: true,
    join_fee: 0,
    rules: '',
    prize_pool: 0,
    match_type: 'SOLO',
    max_players: 0,
    description: '',
    start_time: '',
    end_time: ''
  })
  const [availableGames, setAvailableGames] = useState<{ id: string, game_name: string }[]>([])

  const fetchMatches = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getAllMatches()
      if (result.success) {
        setMatches(result.matches)
      } else {
        toast.error(result.message || "Failed to fetch matches")
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAvailableGames = useCallback(async () => {
    const res = await getGames()
    if (res.success && res.games) {
      setAvailableGames(res.games.map((g: { id: string, game_name: string }) => ({ id: g.id, game_name: g.game_name })))
    }
  }, [])

  useEffect(() => {
    fetchMatches()
  }, [fetchMatches])

  const handleOpenMatchDialog = useCallback(async (match?: Match) => {
    if (match) {
      setSelectedMatch(match)
      setMatchForm({
        gameId: match.gameId,
        poster_img: match.poster_img,
        join_status: match.join_status,
        join_fee: match.join_fee,
        rules: match.rules,
        prize_pool: match.prize_pool,
        match_type: match.match_type,
        max_players: match.max_players,
        description: match.description,
        start_time: match.start_time.slice(0, 16),
        end_time: match.end_time.slice(0, 16)
      })
    } else {
      setSelectedMatch(null)
      setMatchForm({
        gameId: '',
        poster_img: '',
        join_status: true,
        join_fee: 0,
        rules: '',
        prize_pool: 0,
        match_type: 'SOLO',
        max_players: 0,
        description: '',
        start_time: '',
        end_time: ''
      })
    }
    await fetchAvailableGames()
    setMatchDialogOpen(true)
  }, [fetchAvailableGames])

  const handleMatchSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = selectedMatch
        ? { ...matchForm, id: selectedMatch.id }
        : matchForm

      const result = selectedMatch
        ? await updateMatch(payload)
        : await createMatch(payload)

      if (result.success) {
        toast.success(selectedMatch ? "Match updated successfully" : "Match created successfully")
        setMatchDialogOpen(false)
        fetchMatches()
      } else {
        toast.error(result.message || "Operation failed")
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedMatch, matchForm, fetchMatches])

  const handleDeleteMatch = useCallback(async () => {
    if (!selectedMatch) return
    setIsSubmitting(true)
    try {
      const result = await deleteMatch(selectedMatch.id)
      if (result.success) {
        toast.success("Match deleted successfully")
        setDeleteMatchDialogOpen(false)
        fetchMatches()
      } else {
        toast.error(result.message || "Failed to delete match")
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedMatch, fetchMatches])

  return {
    matches,
    loading,
    matchDialogOpen,
    setMatchDialogOpen,
    deleteMatchDialogOpen,
    setDeleteMatchDialogOpen,
    selectedMatch,
    setSelectedMatch,
    matchForm,
    setMatchForm,
    availableGames,
    handleOpenMatchDialog,
    handleMatchSubmit,
    handleDeleteMatch,
    isSubmitting
  }
}
