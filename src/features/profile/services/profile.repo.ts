import db from "@/lib/db"

export function findUserByClerkId(clerkId: string) {
    return db.user.findUnique({
        where: { clerkId }
    })
}

export function findProfileByClerkIdRepo(clerkId: string) {
    return db.user.findUnique({
        where: { clerkId },
        include: {
            profile: true,
            coins: true
        }
    })
}

export function findProfileByUsernameRepo(username: string) {
    return db.profile.findUnique({
        where: { username },
        include: {
            user: {
                include: { coins: true }
            }
        }
    })
}

export function upsertProfileRepo(userId: string, data: {
    username?: string | null
    bio?: string | null
    avatar_img?: string | null
    banner_img?: string | null
}) {
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
