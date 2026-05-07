import db from "@/lib/db"

export async function createUser(clerkId: string, email: string, name: string | null) {
    return db.user.create({
        data: {
            clerkId,
            email,
            name,
        }
    })
}

export async function deleteUser(clerkId: string) {
    return db.user.delete({
        where: { clerkId }
    })
}
