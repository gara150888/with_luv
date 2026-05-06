'use server'
import db from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { ProfileData } from "./type"

export async function fetchProfile(): Promise<ProfileData | null> {
    try {

        const user = await currentUser()

        if (!user) return null

        const dbUser = await db.user.findUnique({
            where: { clerkId: user.id },
            include: { profile: true }
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
        }

    } catch (error: unknown) {

        const message = error instanceof Error ? error.message : 'Unknown error'

        console.error("Error fetching profile:", message)

        return null
    }
}

type UpdateProfileInput = {
    username?: string | null
    bio?: string | null
    avatar_img?: string | null
    banner_img?: string | null
}

function normalizeProfileData(data: UpdateProfileInput) {
    return {
        username: data.username !== undefined ? (data.username?.trim() || null) : undefined,
        bio: data.bio !== undefined ? (data.bio?.trim() || null) : undefined,
        avatar_img: data.avatar_img !== undefined ? (data.avatar_img?.trim() || null) : undefined,
        banner_img: data.banner_img !== undefined ? (data.banner_img?.trim() || null) : undefined,
    }
}


export async function updateProfile(profileData: UpdateProfileInput) {
    try {
        const user = await currentUser()
        if (!user) return { success: false, message: "Unauthorized" }

        const dbUser = await db.user.findUnique({
            where: { clerkId: user.id }
        })

        if (!dbUser) return { success: false, message: "User not found" }

        const data = normalizeProfileData(profileData)
        const updatedProfile = await db.profile.upsert({
            where: { userId: dbUser.id },
            create: {
                userId: dbUser.id,
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

        return { success: true, message: "Profile updated successfully", profile: updatedProfile }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error("Error updating profile:", message)
        return { success: false, message: `Failed to update profile: ${message}` }
    }
}


export async function fetchProfileByUsername(username: string) {
    try {
        const user = await currentUser();
        if (!user) return { success: false, message: "Unauthorized" };

        const userfound = await db.profile.findUnique({
            where: { username: username },
            include: { user: true }
        })

        if (!userfound) return { success: false, message: "User not found" };

        const profileData: ProfileData = {
            id: userfound.userId,
            email: userfound.user.email,
            name: userfound.user?.name,
            image: userfound.user?.image,
            username: userfound.username || null,
            bio: userfound.bio || null,
            avatar_img: userfound.avatar_img || null,
            banner_img: userfound.banner_img || null,
            createdAt: userfound.createdAt?.toISOString() || null,
        };
        return { success: true, message: "Email updated successfully", profile: profileData };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Error updating email:", message);
        return { success: false, message: `Failed to update email: ${message}` };
    }
}
