"use server"

import db from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"

export async function getAdmin() {
    const user = await currentUser()
    const email = user?.emailAddresses[0]?.emailAddress
    const admin = await db.admin.findUnique({ where: { email } })
    if (!admin) return null
    return {
        id: admin.id,
        email: admin.email,
        createdAt: admin.createdAt.toISOString(),
        updatedAt: admin.updatedAt.toISOString(),
    }
}

export async function getAdmins() {
    const user = await currentUser()
    if (!user) throw new Error("Unauthorized")
    const email = user.emailAddresses[0]?.emailAddress
    const admin = await db.admin.findUnique({ where: { email } })
    if (!admin) throw new Error("Admin access required")
    const admins = await db.admin.findMany()
    return admins.map(admin => ({
        id: admin.id,
        email: admin.email,
        createdAt: admin.createdAt.toISOString(),
        updatedAt: admin.updatedAt.toISOString(),
    }))
}

export const deleteAdmin = async (id: string) => {
    const user = await currentUser()
    if (!user) throw new Error("Unauthorized")
    const email = user.emailAddresses[0]?.emailAddress
    const admin = await db.admin.findUnique({ where: { email } })
    if (!admin) throw new Error("Admin access required")
    const deleted = await db.admin.delete({
        where: { id }
    })
    return {
        id: deleted.id,
        email: deleted.email,
        createdAt: deleted.createdAt.toISOString(),
        updatedAt: deleted.updatedAt.toISOString(),
    }
}

export async function createAdmin(email: string) {
    const admin = await db.admin.findUnique({
        where: { email }
    });

    if (admin) return {
        message: "Admin already exists",
        success: false
    }

    const newAdmin = await db.admin.create({
        data: { email: email.toLowerCase() }
    })

    if (!newAdmin) return {
        message: "Failed to create admin",
        success: false
    }
    return {
        message: "Admin created successfully",
        success: true
    }
}
