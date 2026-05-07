'use client'

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createGame } from "@/features/games/actions"

import { useRouter } from "next/navigation";

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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { ChevronLeft } from "lucide-react"

// Validation schema
const formSchema = z.object({
  game_name: z.string().min(1, "Game name is required").max(255),
  game_description: z.string().min(1, "Game description is required"),
  game_image: z.string().url("Must be a valid URL").min(1, "Game image URL is required"),
  game_banner_image: z.string().url("Must be a valid URL").min(1, "Game banner image URL is required"),
  game_mode_type: z.enum(["BR", "LW", "CS"] as const),
  game_status: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateGameForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      game_name: "",
      game_description: "",
      game_image: "",
      game_banner_image: "",
      game_mode_type: "BR",
      game_status: true,
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    const result = await createGame(values)

    if (result.success) {
      toast.success("Game created successfully!")
      form.reset()
    } else {
      toast.error(result.message || "Failed to create game")
    }

    setIsSubmitting(false)
  }

  const router = useRouter();

  return (
    <div className="flex items-center justify-center flex-1 flex-col p-4">
      <div className="my-2 flex flex-start w-full max-w-2xl">
        <Button variant="outline" size={'icon'} onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
      </div>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Game</CardTitle>
          <CardDescription>
            Add a new game to the platform. Fill in all required fields below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-4 space-y-4">

              <div className="space-y-1.5">
                <Label htmlFor="game_name">Game Name</Label>
                <Input
                  id="game_name"
                  placeholder="e.g., Battle Royale"
                  {...form.register("game_name")}
                />
                {form.formState.errors.game_name && (
                  <p className="text-sm text-destructive">{form.formState.errors.game_name.message}</p>
                )}
              </div>


              <div className="space-y-1.5">
                <Label htmlFor="game_description">Description</Label>
                <Textarea
                  id="game_description"
                  placeholder="Describe the game mode, rules, and objectives..."
                  className="min-h-[120px]"
                  {...form.register("game_description")}
                />
                {form.formState.errors.game_description && (
                  <p className="text-sm text-destructive">{form.formState.errors.game_description.message}</p>
                )}
              </div>


              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="game_image">Game Image URL</Label>
                  <Input
                    id="game_image"
                    placeholder="https://..."
                    {...form.register("game_image")}
                  />
                  <p className="text-xs text-muted-foreground">Square image for game icon</p>
                  {form.formState.errors.game_image && (
                    <p className="text-sm text-destructive">{form.formState.errors.game_image.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="game_banner_image">Banner Image URL</Label>
                  <Input
                    id="game_banner_image"
                    placeholder="https://..."
                    {...form.register("game_banner_image")}
                  />
                  <p className="text-xs text-muted-foreground">Wide banner for game header</p>
                  {form.formState.errors.game_banner_image && (
                    <p className="text-sm text-destructive">{form.formState.errors.game_banner_image.message}</p>
                  )}
                </div>
              </div>


              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="space-y-1.5">
                  <Label htmlFor="game_mode_type">Game Mode</Label>
                  <Controller
                    control={form.control}
                    name="game_mode_type"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full" id="game_mode_type">
                          <SelectValue className="w-full" placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="BR">Battle Royale (BR)</SelectItem>
                          <SelectItem value="LW">Last Stand (LW)</SelectItem>
                          <SelectItem value="CS">Custom Squad (CS)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.game_mode_type && (
                    <p className="text-sm text-destructive">{form.formState.errors.game_mode_type.message}</p>
                  )}
                </div>

                {/* Game Status */}
                <div className="flex items-end space-x-2 pb-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="game_status"
                      checked={form.watch("game_status")}
                      onChange={(e) => form.setValue("game_status", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="game_status" className="text-sm font-normal">
                      Active (visible to players)
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-end mt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Game"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
