'use server'
import db from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import type { ProfileData } from "./types"
import { findProfileByClerkId, findProfileByUsername, upsertProfile } from "./services/profile.service"

export async function fetchProfile(): Promise<ProfileData | null> {
    try {
        const user = await currentUser()
        if (!user) return null

        return await findProfileByClerkId(user.id)
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
        const updatedProfile = await upsertProfile(dbUser.id, data)

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

        const profileData = await findProfileByUsername(username)

        if (!profileData) return { success: false, message: "User not found" };

        return { success: true, message: "Profile fetched successfully", profile: profileData };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching profile:", message);
        return { success: false, message: `Failed to fetch profile: ${message}` };
    }
}