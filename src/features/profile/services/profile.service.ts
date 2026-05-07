import db from "@/lib/db"
import type { ProfileData } from "../types"

export async function findProfileByClerkId(clerkId: string): Promise<ProfileData | null> {
    const dbUser = await db.user.findUnique({
        where: { clerkId },
        include: { profile: true, coins: true }
    })

    if (!dbUser) return null

    const { profile } = dbUser

    return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        image: dbUser.image,
        username: profile?.username || null,
        bio: profile?.bio || null,
        avatar_img: profile?.avatar_img || null,
        banner_img: profile?.banner_img || null,
        createdAt: profile?.createdAt?.toISOString() || null,
        coins: dbUser.coins?.balance || 0
    }
}

export async function findProfileByUsername(username: string): Promise<ProfileData | null> {
    const userfound = await db.profile.findUnique({
        where: { username },
        include: { user: { include: { coins: true } } }
    })

    if (!userfound) return null

    return {
        id: userfound.userId,
        email: userfound.user.email,
        name: userfound.user?.name,
        image: userfound.user?.image,
        username: userfound.username || null,
        bio: userfound.bio || null,
        avatar_img: userfound.avatar_img || null,
        banner_img: userfound.banner_img || null,
        createdAt: userfound.createdAt?.toISOString() || null,
        coins: userfound.user?.coins?.balance || 0
    }
}

export type UpdateProfileData = {
    username?: string | null
    bio?: string | null
    avatar_img?: string | null
    banner_img?: string | null
}

export async function upsertProfile(userId: string, data: UpdateProfileData) {
    return db.profile.upsert({
        where: { userId },
        create: {
            userId,
            username: data.username ?? null,
            bio: data.bio ?? null,
            avatar_img: data.avatar_img ?? null,
            banner_img: data.banner_img ?? null,
        },
        update: {
            ...(data.username !== undefined && { username: data.username }),
            ...(data.bio !== undefined && { bio: data.bio }),
            ...(data.avatar_img !== undefined && { avatar_img: data.avatar_img }),
            ...(data.banner_img !== undefined && { banner_img: data.banner_img }),
        },
    })
}
