'use client'

import { useEffect, useCallback, useState } from 'react'
import { toast } from "sonner"
import { Game, GameForm } from "../types"
import { createGame, updateGame, deleteGame, getGames } from "@/features/games/actions"

export function useGameManagement() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [gameDialogOpen, setGameDialogOpen] = useState(false)
  const [deleteGameDialogOpen, setDeleteGameDialogOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gameForm, setGameForm] = useState<GameForm>({
    game_name: '',
    game_description: '',
    game_image: '',
    game_banner_image: '',
    game_mode_type: 'BR',
    game_status: true
  })

  const fetchGames = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getGames()
      if (result.success) {
        setGames(result.games)
      } else {
        toast.error(result.message || "Failed to fetch games")
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  const handleOpenGameDialog = useCallback((game?: Game) => {
    if (game) {
      setSelectedGame(game)
      setGameForm({
        game_name: game.game_name,
        game_description: game.game_description,
        game_image: game.game_image,
        game_banner_image: game.game_banner_image,
        game_mode_type: game.game_mode_type,
        game_status: game.game_status
      })
    } else {
      setSelectedGame(null)
      setGameForm({
        game_name: '',
        game_description: '',
        game_image: '',
        game_banner_image: '',
        game_mode_type: 'BR',
        game_status: true
      })
    }
    setGameDialogOpen(true)
  }, [])

  const handleGameSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    setIsSubmitting(true)
    try {
      const payload = selectedGame
        ? { ...gameForm, id: selectedGame.id }
        : gameForm

      const result = selectedGame
        ? await updateGame(payload)
        : await createGame(payload)

      if (result.success) {
        toast.success(selectedGame ? "Game updated successfully" : "Game created successfully")
        setGameDialogOpen(false)
        fetchGames()
      } else {
        toast.error(result.message || "Operation failed")
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedGame, gameForm, fetchGames])

  const handleDeleteGame = useCallback(async () => {
    if (!selectedGame) return
    setIsSubmitting(true)
    try {
      const result = await deleteGame(selectedGame.id)
      if (result.success) {
        toast.success("Game deleted successfully")
        setDeleteGameDialogOpen(false)
        fetchGames()
      } else {
        toast.error(result.message || "Failed to delete game")
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedGame, fetchGames])

  return {
    games,
    loading,
    gameDialogOpen,
    setGameDialogOpen,
    deleteGameDialogOpen,
    setDeleteGameDialogOpen,
    selectedGame,
    setSelectedGame,
    gameForm,
    setGameForm,
    handleOpenGameDialog,
    handleGameSubmit,
    handleDeleteGame,
    isSubmitting
  }
}
