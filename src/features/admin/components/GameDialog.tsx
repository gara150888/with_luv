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
import { Game } from "../types"
import { GameForm } from "../types"

interface GameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedGame: Game | null
  form: GameForm
  onSubmit: (e: React.FormEvent) => void
  onFormChange: (form: GameForm) => void
  isSubmitting: boolean
}

export function GameDialog({
  open,
  onOpenChange,
  selectedGame,
  form,
  onSubmit,
  onFormChange,
  isSubmitting
}: GameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{selectedGame ? "Edit Game" : "Create New Game"}</DialogTitle>
            <DialogDescription>
              {selectedGame ? "Update game details" : "Add a new game to the platform"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="game_name">Game Name</Label>
              <Input
                id="game_name"
                value={form.game_name}
                onChange={(e) => onFormChange({ ...form, game_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="game_description">Description</Label>
              <Textarea
                id="game_description"
                value={form.game_description}
                onChange={(e) => onFormChange({ ...form, game_description: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="game_image">Image URL</Label>
              <Input
                id="game_image"
                type="url"
                value={form.game_image}
                onChange={(e) => onFormChange({ ...form, game_image: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="game_banner_image">Banner Image URL</Label>
              <Input
                id="game_banner_image"
                type="url"
                value={form.game_banner_image}
                onChange={(e) => onFormChange({ ...form, game_banner_image: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="game_mode_type">Mode</Label>
                <Select
                  value={form.game_mode_type}
                  onValueChange={(value: "BR" | "LW" | "CS") =>
                    onFormChange({ ...form, game_mode_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BR">BR</SelectItem>
                    <SelectItem value="LW">LW</SelectItem>
                    <SelectItem value="CS">CS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="game_status">Status</Label>
                <Select
                  value={form.game_status ? "true" : "false"}
                  onValueChange={(value) =>
                    onFormChange({ ...form, game_status: value === "true" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (selectedGame ? "Update" : "Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
