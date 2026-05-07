import { z } from "zod"

export const updateProfileSchema = z.object({
    username: z.string().min(3).max(20).optional().nullable(),
    bio: z.string().max(160).optional().nullable(),
    avatar_img: z.string().url().optional().nullable(),
    banner_img: z.string().url().optional().nullable(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>