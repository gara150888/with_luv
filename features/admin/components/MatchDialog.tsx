'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Match, MatchForm } from "../types"

interface MatchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedMatch: Match | null
  form: MatchForm
  availableGames: { id: string, game_name: string }[]
  onSubmit: (e: React.FormEvent) => void
  onFormChange: (form: MatchForm) => void
  isSubmitting: boolean
}

export function MatchDialog({
  open,
  onOpenChange,
  selectedMatch,
  form,
  availableGames,
  onSubmit,
  onFormChange,
  isSubmitting
}: MatchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{selectedMatch ? "Edit Match" : "Create New Match"}</DialogTitle>
            <DialogDescription>
              {selectedMatch ? "Update match details" : "Schedule a new match"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="gameId">Game</Label>
              <Select
                value={form.gameId}
                onValueChange={(value) => onFormChange({ ...form, gameId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a game" />
                </SelectTrigger>
                <SelectContent>
                  {availableGames.map((game) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.game_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="poster_img">Poster Image URL</Label>
              <Input
                id="poster_img"
                type="url"
                value={form.poster_img}
                onChange={(e) => onFormChange({ ...form, poster_img: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="join_fee">Entry Fee (coins)</Label>
                <Input
                  id="join_fee"
                  type="number"
                  min="0"
                  value={form.join_fee}
                  onChange={(e) => onFormChange({ ...form, join_fee: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prize_pool">Prize Pool (coins)</Label>
                <Input
                  id="prize_pool"
                  type="number"
                  min="0"
                  value={form.prize_pool}
                  onChange={(e) => onFormChange({ ...form, prize_pool: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="match_type">Match Type</Label>
                <Select
                  value={form.match_type}
                  onValueChange={(value: "SOLO" | "DUO" | "SQUAD") =>
                    onFormChange({ ...form, match_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOLO">Solo</SelectItem>
                    <SelectItem value="DUO">Duo</SelectItem>
                    <SelectItem value="SQUAD">Squad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_players">Max Players</Label>
                <Input
                  id="max_players"
                  type="number"
                  min="1"
                  value={form.max_players}
                  onChange={(e) => onFormChange({ ...form, max_players: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={form.start_time}
                  onChange={(e) => onFormChange({ ...form, start_time: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">End Time</Label>
                <Input
                  id="end_time"
                  type="datetime-local"
                  value={form.end_time}
                  onChange={(e) => onFormChange({ ...form, end_time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => onFormChange({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rules">Rules</Label>
              <Textarea
                id="rules"
                value={form.rules}
                onChange={(e) => onFormChange({ ...form, rules: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="join_status"
                type="checkbox"
                checked={form.join_status}
                onChange={(e) => onFormChange({ ...form, join_status: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="join_status">Open for Joining</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (selectedMatch ? "Update" : "Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
