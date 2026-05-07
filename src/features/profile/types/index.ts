export type ProfileData = {
    id: string
    email: string
    name: string | null
    image: string | null
    username: string | null
    bio: string | null
    avatar_img: string | null
    banner_img: string | null
    coins: number
    createdAt: string | null
}

export type UpdateProfileData = {
    username?: string | null
    bio?: string | null
    avatar_img?: string | null
    banner_img?: string | null
}