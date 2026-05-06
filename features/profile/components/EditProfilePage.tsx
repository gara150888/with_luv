// features/profile/components/EditProfilePage.tsx 
'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { updateProfile, fetchProfile } from "@/features/profile/actions"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ChevronLeft, Loader2 } from "lucide-react"

const formSchema = z.object({
  username: z.string().max(20).optional().nullable(),
  bio: z.string().max(100).optional().nullable(),
  avatar_img: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  banner_img: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
})

type FormValues = z.infer<typeof formSchema>

export default function EditProfilePage({ profile }: { profile: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile.username,
      bio: profile.bio,
      avatar_img: profile.avatar_img,
      banner_img: profile.banner_img,
    },
  })

  useEffect(() => {
    async function loadProfile() {
      const data = await fetchProfile()
      if (data) {
        form.reset({
          username: data.username || "",
          bio: data.bio || "",
          avatar_img: data.avatar_img || "",
          banner_img: data.banner_img || "",
        })
      }
      setLoading(false)
    }
    loadProfile()
  }, [form])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center h-full w-full">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    const result = await updateProfile(values)
    if (result.success) {
      toast.success("Profile updated successfully!")
      router.push("/profile")
    } else {
      toast.error(result.message || "Failed to update profile")
    }
    setIsSubmitting(false)
  }

  return (
    <div className="flex items-center justify-center flex-1 flex-col p-4">
      <div className="my-2 flex flex-start w-full max-w-2xl">
        <Button variant="outline" size={'icon'} onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
      </div>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your profile information. Fields can be left empty.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <form onSubmit={form.handleSubmit(onSubmit)} >

            <div className="px-4 space-y-4 pb-4">

              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username (max 20 characters)"
                  {...form.register("username")}
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself (max 100 characters)"
                  className="min-h-[100px]"
                  {...form.register("bio")}
                />
                {form.formState.errors.bio && (
                  <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="avatar_img">Avatar Image URL</Label>
                <Input
                  id="avatar_img"
                  placeholder="https://example.com/avatar.jpg"
                  {...form.register("avatar_img")}
                />
                <p className="text-xs text-muted-foreground">URL of your profile picture</p>
                {form.formState.errors.avatar_img && (
                  <p className="text-sm text-destructive">{form.formState.errors.avatar_img.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="banner_img">Banner Image URL</Label>
                <Input
                  id="banner_img"
                  placeholder="https://example.com/banner.jpg"
                  {...form.register("banner_img")}
                />
                <p className="text-xs text-muted-foreground">URL of your profile banner</p>
                {form.formState.errors.avatar_img && (
                  <p className="text-sm text-destructive">{form.formState.errors.avatar_img.message}</p>
                )}
              </div>
            </div>


            <CardFooter className="flex justify-end ">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
